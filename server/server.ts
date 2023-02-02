import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;


const prisma = new PrismaClient();


// GET all students
app.get("/students", async (req, res) => {
  let allStudents = await prisma.student.findMany()
  res.json({ students: allStudents });
});

// POST new student
app.post("/students", express.json(), async (req, res) => {
  const student = req.body;
  const createStudent = await prisma.student.create({
    data: {
      firstName: student.firstName,
      familyName: student.familyName,
      dateOfBirth: student.dateOfBirth
    }
  });
  if (createStudent) {
    res.status(200);
    res.json({ success: true });
  } else {
    res.status(500);
    res.json({ err: true })
  }
});

// GET all courses
app.get("/courses", async (req, res) => {
  let allCourses = await prisma.course.findMany();
  res.json({ courses: allCourses });
});

// POST new course
app.post("/courses", express.json(), async (req, res) => {
  const course = req.body;
  const createCourse = await prisma.course.create({
    data: {
      name: course.name
    }
  });
  if (createCourse) {
    res.status(200);
    res.json({ success: true });
  } else {
    res.status(500);
    res.json({ err: true })
  }
});

// GET all results
app.get("/results", async (req, res) => {
  let allResults = await prisma.result.findMany();
  res.json({ results: allResults });
});

// POST new course
app.post("/results", express.json(), async (req, res) => {
  const result = req.body;
  const createResult = await prisma.result.create({
    data: {
      studentId: result.studentId,
      courseId: result.courseId,
      grade: result.grade
    }
  });
  if (createResult) {
    res.status(200);
    res.json({ success: true });
  } else {
    res.status(500);
    res.json({ err: true })
  }
});

app.listen(PORT, () =>
  console.log(`Student manager backend listening on port ${PORT}!`),
);