import NavBar from "../components/SideNav";
import { useState, useEffect } from "react";
import { Student, StudentsResponse } from "./Students";
import { Course, CoursesResponse } from "./Courses";


type Result = {
  studentId: number;
  courseId: number;
  grade: string;
  id?: number;
}

type ResultsResponse = {
  results?: Result[];
  err?: any;
}

type ResultsTableRows = {
  [resultId: number]: {
    studentName: string;
    courseName: string;
    grade: string;
  }
}

const GRADES = ["A", "B", "C", "D", "E", "F"];

export default function Results() {
  const [students, setStudents] = useState<Student[]>([]);
  const [studentId, setStudentId] = useState<number>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseId, setCourseId] = useState<number>();
  const [results, setResults] = useState<Result[]>([]);
  const [tableRows, setTableRows] = useState<ResultsTableRows>({});
  const [grade, setGrade] = useState(GRADES[0]);


  useEffect(() => {
    fetch("http://localhost:5000/students").then(res => {
      res.json().then((body) => {
        if (body.err) {
          console.error(body.err);
          setStudents([]);
        } else {
          setStudents(body.students ?? []);
          setStudentId(body.students[0].id ?? undefined);
        }
      })
    });
    fetch("http://localhost:5000/courses").then(res => {
      res.json().then((body) => {
        if (body.err) {
          console.error(body.err);
          setCourses([]);
        } else {
          setCourses(body.courses ?? [])
          setCourseId(body.courses[0].id ?? undefined);
        }
      })
    });
    fetch("http://localhost:5000/results").then(res => {
      res.json().then((body) => {
        if (body.err) {
          console.error(body.err);
          setResults([]);
        } else {
          setResults(body.results ?? []);
        }
      })
    });
  }, []);

  useEffect(() => {
    let newTableRows: ResultsTableRows = {};

    // loop through results
    results.forEach(result => {
      if (result.id && tableRows[result.id] === undefined) {
        // If result is new (not in rows yet)
        // Get student and course for each result (return early if not found)
        const newStudent = students.find(student => student.id === result.studentId);
        if (!newStudent) return;
        const newCourse = courses.find(course => course.id === result.courseId);
        if (!newCourse) return;
        // Add to rows at id
        newTableRows[result.id] = {
          studentName: `${newStudent.firstName} ${newStudent.familyName}`,
          courseName: newCourse.name,
          grade: result.grade
        }
      }
    });
    setTableRows({ ...tableRows, ...newTableRows });
  }, [results])

  const handleResultSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    grade: string,
    courseId: number,
    studentId: number
  ) => {
    let result: Result = {
      grade: grade,
      courseId: courseId,
      studentId: studentId
    }

    // POST new result
    let res = await fetch("http://localhost:5000/results", {
      method: "post",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    });
    let body = await res.json();
    if (body.success) {
      alert(`Result has been successfully added to the database.`);
    } else {
      alert("Something went wrong. Please try again.");
      event.preventDefault();
    }
  }

  return <>
    <NavBar />
    <div className="page-content">
      <h2>Results</h2>
      <div className="add-entry-div">
        <label className="form-title" htmlFor="create-result-form">Add a result</label>
        <form
          id="create-result-form"
          className="create-entry-form"
          onSubmit={event => handleResultSubmit(event, grade, courseId as number, studentId as number)}
        >
          <label htmlFor="select-course">Course</label>
          <select
            id="select-course"
            value={courseId}
            onChange={event => setCourseId(parseInt(event.target.value))}
          >
            {courses.map(course => {
              return <option key={course.id} value={course.id}>
                {course.name}
              </option>
            })}
          </select>
          <label htmlFor="select-student">Student</label>
          <select
            id="select-student"
            value={studentId}
            onChange={event => setStudentId(parseInt(event.target.value))}
          >
            {students.map(student => {
              return <option key={student.id} value={student.id}>
                {`${student.firstName} ${student.familyName}`}
              </option>
            })}
          </select>
          <label htmlFor="select-grade">Grade</label>
          <select
            id="select-grade"
            value={grade}
            onChange={event => setGrade(event.target.value)}
          >
            {GRADES.map(grade => <option key={grade} value={grade}>{grade}</option>)}
          </select>
          <button className="submit-btn" type="submit">Submit</button>
        </form>
      </div>
      <table className="entry-table">
        <thead>
          <tr>
            <th>Course</th>
            <th>Student</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(tableRows).map(([id, row]) => <tr key={id} className="entry-row">
            <td>{row.courseName}</td>
            <td>{row.studentName}</td>
            <td>{row.grade}</td>
          </tr>)}
        </tbody>
      </table>
    </div>
  </>
}