import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { PrismaClient, User } from '@prisma/client';


const prisma = new PrismaClient();
const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // Allow this origin
  credentials: true, // Allow credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));
app.use(express.json());
dotenv.config();
const PORT = process.env.PORT;
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
    // Benutzer anhand des Benutzernamens finden
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

    // Check passwords
    const passwordMatch = bcrypt.compareSync(password,userDoc.password);
    if (passwordMatch) {
      res.json({Message : "Success"});
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

// Starts the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});