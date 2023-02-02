import NavBar from "../components/SideNav";
import { useState, useEffect } from "react";


export type Student = {
  firstName: string;
  familyName: string;
  dateOfBirth: Date | string;
  id?: number;
}

export type StudentsResponse = {
  students?: Student[];
  err?: any;
}

const isYearsApart = (firstDate: Date, secondDate: Date, years: number) => {
  const offsetDate = new Date(firstDate);
  offsetDate.setFullYear(firstDate.getFullYear() + years);
  if (secondDate > offsetDate) {
    return true;
  } else {
    return false;
  }
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [firstName, setFirstName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [warningText, setWarningText] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/students").then(res => {
      res.json().then((body) => {
        if (body.err) {
          console.error(body.err);
          setStudents([]);
        } else {
          setStudents(body.students ?? []);
        }
      })
    });
  }, []);

  const handleStudentSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    firstName: string,
    familyName: string,
    dateOfBirth: string
  ) => {
    event.preventDefault();
    let student: Student = {
      firstName: firstName,
      familyName: familyName,
      dateOfBirth: new Date(dateOfBirth + "T00:00:00.000Z")
    }
    // Return early and display warning if student is <10
    if (!isYearsApart(student.dateOfBirth as Date, new Date(), 10)) {
      event.preventDefault(); // Stop page from refreshing
      setWarningText("Student must be at least 10 years old.");
      return;
    }

    // POST new student
    let res = await fetch("http://localhost:5000/students", {
      method: "post",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
    let body = await res.json();
    if (body.success) {
      alert(`Student: ${student.firstName} ${student.familyName} has been successfully added to the database.`);
      location.reload();
    } else {
      alert("Something went wrong. Please try again.");
    }
  }

  return <>
    <NavBar />
    <div className="page-content">
      <h2>Students</h2>
      <div className="add-entry-div">
        <label className="form-title" htmlFor="create-student-form">Add a student</label>
        <form id="create-student-form" className="create-entry-form" onSubmit={event => handleStudentSubmit(event, firstName, familyName, dateOfBirth)}>
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
          {warningText.length > 0 ? <span className="form-warning">{warningText}</span> : <br />}
          <button className="submit-btn" type="submit">Submit</button>
        </form>
      </div>
      <table className="entry-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Family Name</th>
            <th>Date of Birth</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => <tr key={student.id} className="entry-row">
            <td>{student.firstName}</td>
            <td>{student.familyName}</td>
            <td>{new Date(student.dateOfBirth).toDateString()}</td>
          </tr>)}
        </tbody>
      </table>
    </div>
  </>
}