import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { PrismaClient, User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import multer from 'multer'
import fs from 'fs'
import path from 'path'

dotenv.config();
const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // Allow this origin
  credentials: true, // Allow credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));
app.use(express.json());
app.use(cookieParser())
// Middleware to serve static files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

const prisma = new PrismaClient();
const PORT = process.env.PORT;
const SECRET_KEY: string = process.env.SECRET_KEY as string; 
const SALT = bcrypt.genSaltSync(10)
const uploadMiddleware = multer({ dest: 'uploads/' });


app.get('/', (req: Request, res: Response) => {
  res.send('Test');
});


async function deleteAllUsers() {
  try {
    const result = await prisma.user.deleteMany({});
    console.log(`Deleted ${result.count} users`);
  } catch (error) {
    console.error('Error deleting users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function createUser(username: string, password: string) {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT)
    const user = await prisma.user.create({
      data: {
        name: username,
        password: hashedPassword,
      },
    });
    console.log('User created:', user);
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

app.post('/signin', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const userDoc = await prisma.user.findUnique({
      where: {
        name: username,
      },
    });

    if (!userDoc) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!userDoc.password) {
      return res.status(500).json({ error: 'Password not available' });
    }

    // Check password
    const passwordMatch = bcrypt.compareSync(password,userDoc.password);
    if (passwordMatch) {
      jwt.sign({
        name : username,
        id   : userDoc.id 
    },SECRET_KEY, {},  (error,token) => {
        if(error) {
          throw error;
        }
        // Store signed JWT token inside HTTP cookie
        res.cookie('token', token).json({name :username , id : userDoc.id});
    })

    }else if(!passwordMatch) {
      return res.status(401).json({ error: 'Password invalid' });
    }
  } catch (error) {
    console.error('Failed to signin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.post('/signup', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await createUser(username, password);
    res.status(200).json(user)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/profile',(req: Request, res: Response) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, SECRET_KEY, (error: any, info: any) => {
    if (error) {
      throw error;
    }
    res.json(info);
    console.log(path.join(__dirname, 'uploads'));
  });

})

app.post('/signout', (req: Request, res : Response) => {
  // Invalidate token
  res.cookie('token', '').json('Success : User signed out')

})

app.get('/posts',async (req: Request, res : Response) => {
  // Fetches all posts from Postgres DB
  //res.json(await prisma.post.findMany())
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Error' });
  }
})

app.post('/posts', uploadMiddleware.single('file'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { originalname, path: tempPath } = req.file as Express.Multer.File;

  //const { originalname } = req.file as Express.Multer.File; // Type assertion req.file should be treated as type Express.Multer.File
  if (!originalname) {
    return res.status(400).json({ error: 'No original file name found' });
  }

  // Retrieve extension name of the file
  //const parts = originalname.split('.');
  //const ext = parts[parts.length - 1];

  if (!req.file.path) {
    return res.status(400).json({ error: 'No file path found' });
  }

  const ext = path.extname(originalname);
  const newPath = `${tempPath}${ext}`;
  const finalPath = newPath.replace(/\\/g, '/');

  fs.renameSync(tempPath, newPath);

  // Rename file with extension
  //const newPath = `${req.file.path}.${ext}`;
  //fs.renameSync(req.file.path, newPath);
  

  //res.json({ File : req.file });


  const {title, summary, content} = req.body;
  const {token} = req.cookies;

  // Create a post entry inside Postgres DB

  try {
    // Get authorID by verifying the token
    jwt.verify(token, SECRET_KEY, async (error: any, info: any) => {
      if (error) throw error;
      const postDoc = await prisma.post.create({
        data : {
          title,
          summary,
          content,
          cover : finalPath,
          published : true,
          authorId : info.id
        }
      })
      res.status(201).json(postDoc);
      console.log(finalPath)
    });
  }catch(error) {
    res.status(500).json('Error creating post')
  }

})

// Starts the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});