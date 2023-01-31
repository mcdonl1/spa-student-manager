import express from 'express';
import {PrismaClient} from '@prisma/client';

const app = express();
const PORT = process.env.PORT || 5000;

const prisma = new PrismaClient()


async function main() {
  let allStudents = await prisma.student.findMany();
  console.log(allStudents)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

app.listen(PORT, () =>
  console.log(`Example app listening on port ${PORT}!`),
);