import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL || ''
});
const prisma = new PrismaClient({ adapter });

async function main() {
    // Todo : Donner de test
}


main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
