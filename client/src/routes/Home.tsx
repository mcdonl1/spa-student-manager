import NavBar from "../components/SideNav";
import { Link } from "react-router-dom";


export default function Home() {
  return <>
    <NavBar />
    <div className="page-content">
      <h2>Welcome</h2>
      <div className="card-grid">
        <Link className="card-link" to="/students">
          <div className="card-header">
            Students
          </div>
          <div className="card-body">
            Add and view students
          </div>
        </Link>
        <Link className="card-link" to="/courses">
          <div className="card-header">
            Courses
          </div>
          <div className="card-body">
            Add and view courses
          </div>
        </Link>
        <Link className="card-link" to="/results">
          <div className="card-header">
            Results
          </div>
          <div className="card-body">
            Add and view results for students/classes
          </div>
        </Link>
      </div>
    </div>
  </>
}