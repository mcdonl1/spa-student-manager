import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;


const prisma = new PrismaClient()


// GET all students
app.get("/students", (req, res) => {
  let allStudents = prisma.student.findMany().then(value => {
    res.json({ students: value });
  }).catch(err => {
    res.json({ err: err });
  });
});


// POST new student
app.post("/students", express.json(), async (req, res) => {
  let student = req.body;
  prisma.student.create({
    data: {
      firstName: student.firstName,
      familyName: student.familyName,
      dateOfBirth: student.dateOfBirth
    }
  }).catch(err => {
    res.json({ err: err })
  }).then(() => {
    res.json({ success: true })
  });
});

app.listen(PORT, () =>
  console.log(`Student manager backend listening on port ${PORT}!`),
);