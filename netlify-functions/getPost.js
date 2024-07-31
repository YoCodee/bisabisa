import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function handler(event, context) {
  try {
    const posts = await prisma.post.findMany();
    return {
      statusCode: 200,
      body: JSON.stringify(posts),
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
}
