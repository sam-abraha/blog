import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { PrismaClient, User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';


const prisma = new PrismaClient();
const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // Allow this origin
  credentials: true, // Allow credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));
app.use(express.json());
app.use(cookieParser())

dotenv.config();
const PORT = process.env.PORT;
const SECRET_KEY: string = process.env.SECRET_KEY as string; 
const SALT = bcrypt.genSaltSync(10)


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
  });

})

app.post('/signout', (req: Request, res : Response) => {
  // Invalidate token
  res.cookie('token', '').json('Success : User signed out')

})

// Starts the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});