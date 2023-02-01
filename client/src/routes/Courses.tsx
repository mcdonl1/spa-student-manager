import NavBar from "../components/SideNav";
import { useState, useEffect } from "react";


type Course = {
  name: string;
  id?: number;
}

type CoursesResponse = {
  courses?: Course[];
  err?: any;
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseName, setCourseName] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/courses").then(res => {
      res.json().then((body) => {
        if (body.err) {
          console.error(body.err);
          setCourses([]);
        } else {
          setCourses(body.courses ?? []);
        }
      })
    });
  }, []);

  const handleCourseSubmit = async (event: React.FormEvent<HTMLFormElement>, courseName: string) => {

    let course: Course = {
      name: courseName,
    }
    // POST new course
    let res = await fetch("http://localhost:5000/courses", {
      method: "post",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course)
    });
    let body = await res.json();
    if (body.success) {
      alert(`Course: ${course.name} has been successfully added to the database.`);
    } else {
      alert("Something went wrong. Please try again.");
      event.preventDefault();
    }
  }

  return <>
    <NavBar />
    <div className="page-content">
      <h2>Courses</h2>
      <div className="add-entry-div">
        <label className="form-title" htmlFor="create-course-form">Add a course</label>
        <form id="create-course-form" className="create-entry-form" onSubmit={event => handleCourseSubmit(event, courseName)}>
          <label htmlFor="course-name">Course Name</label>
          <input
            type="text"
            required
            placeholder="Math 101"
            id="course-name"
            value={courseName}
            onChange={event => {
              setCourseName(event.target.value);
            }}
          />
          <button className="submit-btn" type="submit">Submit</button>
        </form>
      </div>
      <table className="entry-table">
        <thead>
          <tr>
            <th>Course ID</th>
            <th>Course Name</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => <tr key={course.id} className="entry-row">
            <td>{course.id}</td>
            <td>{course.name}</td>
          </tr>)}
        </tbody>
      </table>
    </div>
  </>
}