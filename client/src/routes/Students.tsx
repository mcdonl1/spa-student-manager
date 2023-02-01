import NavBar from "../components/SideNav";
import { useState, useEffect } from "react";


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

const handleStudentSubmit = async (firstName: string, familyName: string, dateOfBirth: string) => {
  let student: Student = {
    firstName: firstName,
    familyName: familyName,
    dateOfBirth: new Date(dateOfBirth + "T00:00:00.000Z")
  }
  let res = await fetch("http://localhost:5000/students", {
    method: "post",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student)
  });
  console.log(res)
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [firstName, setFirstName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/students").then(res => {
      res.json().then((body) => {
        if (body.err) {
          console.log(body.err);
          setStudents([]);
        } else {
          setStudents(body.students ?? []);
        }
      })
    });
  }, []);

  return <>
    <NavBar />
    <div className="page-content">
      <div className="create-student-form">
        <form onSubmit={() => handleStudentSubmit(firstName, familyName, dateOfBirth)}>
          <label htmlFor="first-name">First Name</label>
          <input
            type="text"
            required
            placeholder="John"
            id="first-name"
            value={firstName}
            onChange={event => {
              setFirstName(event.target.value);
            }}
          />
          <label htmlFor="family-name">Family Name</label>
          <input
            type="text"
            required
            placeholder="Doe"
            id="family-name"
            value={familyName}
            onChange={event => {
              setFamilyName(event.target.value);
            }}
          />
          <label htmlFor="date-of-birth">Date of Birth</label>
          <input
            type="date"
            required
            id="date-of-birth"
            value={dateOfBirth}
            onChange={event => {
              let newDate = new Date(event.target.value + "T00:00:00.000Z")
              if (!isNaN(newDate.getTime())) {
                setDateOfBirth(event.target.value);
              }
            }}
          />
          <button
            type="submit"
          >
            Submit
          </button>
        </form>

      </div>
      <div>{JSON.stringify(students)}</div>

    </div>
  </>
}