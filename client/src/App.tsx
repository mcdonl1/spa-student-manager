import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { createBrowserRouter, Link, Router, RouterProvider } from 'react-router-dom'
import Home from "./routes/Home";
import Students from "./routes/Students";
import Courses from "./routes/Courses";
import Results from "./routes/Results";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/students",
    element: <Students/>,
  },
  {
    path: "/courses",
    element: <Courses/>,
  },
  {
    path: "/results",
    element: <Results/>,
  },
]);

function App() {
  const [count, setCount] = useState(0)


  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
