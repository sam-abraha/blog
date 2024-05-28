import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
const PORT = process.env.PORT;

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
    const user = await prisma.user.create({
      data: {
        name: username,
        password: password,
      },
    });
    console.log('User created:', user);
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
  }
}


app.post('/signin', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await createUser(username, password);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Starts the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
