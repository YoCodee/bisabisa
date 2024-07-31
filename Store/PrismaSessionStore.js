import { PrismaClient } from '@prisma/client';
import session from 'express-session';

const prisma = new PrismaClient();

class PrismaSessionStore extends session.Store {
  constructor() {
    super();
  }

  async get(sid, callback) {
    try {
      const session = await prisma.session.findUnique({
        where: { sid },
      });
      callback(null, session ? JSON.parse(session.data) : null);
    } catch (error) {
      callback(error);
    }
  }

  async set(sid, session, callback) {
    try {
      await prisma.session.upsert({
        where: { sid },
        update: {
          data: JSON.stringify(session),
          expires: session.cookie.expires,
        },
        create: {
          sid,
          data: JSON.stringify(session),
          expires: session.cookie.expires,
        },
      });
      callback(null);
    } catch (error) {
      callback(error);
    }
  }

  async destroy(sid, callback) {
    try {
      await prisma.session.delete({
        where: { sid },
      });
      callback(null);
    } catch (error) {
      callback(error);
    }
  }
}

export default PrismaSessionStore;
