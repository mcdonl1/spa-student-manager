import {Link} from "react-router-dom";
export default function SideNav() {
  return <div className="side-nav">
      <h1 className="nav-header">
        Student Manager
      </h1>
      <nav className="nav-links">
        <Link className="nav-link" to="/">Home</Link>
        <Link className="nav-link" to="/students">Students</Link>
        <Link className="nav-link" to="/courses">Courses</Link>
        <Link className="nav-link" to="/results">Results</Link>
      </nav>
    </div>
}