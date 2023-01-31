import NavBar from "../components/SideNav";
import { useState } from "react";
import { json } from "react-router-dom";

type Student = {
  firstName: string;
  familyName: string;
  dateOfBirth: Date;
  id?: number;
}

type StudentsResponse = {
  students?: Student[];
  err?: any;
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  return <>
    <NavBar />
    <div className="page-content">
      <div>
        <button
          onClick={async () => {
            let req = await fetch("http://localhost:5000/students");
            let body: StudentsResponse = await req.json();
            if (body.err) {
              console.log(body.err);
            } else {
              setStudents(body.students ?? []);
            }
          }}
          type="submit"
        >Get Students</button>
        <button
          onClick={async () => {
            let student: Student = {
              firstName: "test",
              familyName: "student",
              dateOfBirth: new Date()
            }
            let res = await fetch("http://localhost:5000/students", { method: "post", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(student) });
            console.log(res)
          }}
          type="submit"
        >Add student</button>
      </div>
      <div>{JSON.stringify(students, null, 2)}</div>

    </div>
  </>
}