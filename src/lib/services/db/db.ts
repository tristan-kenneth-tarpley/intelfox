import { PrismaClient } from '@prisma/client/edge';

// todo add caching strategy?
const db = new PrismaClient();

export default db;
