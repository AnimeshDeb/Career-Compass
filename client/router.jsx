import UserSeeker from "./src/routes/seeker/userpage/UserSeeker.jsx"
import UserMentor from "./src/routes/mentor/userpage/UserMentor.jsx"
import { createBrowserRouter } from "react-router-dom";
import UserCompany from "./src/routes/company/userpage/UserCompany.jsx";
import JobsApplied from "./src/routes/seeker/jobsApplied/jobsApplied.jsx"

export const router = createBrowserRouter([
  { path: "/user", element: <UserSeeker /> },
  { path: "/mentor", element: <UserMentor /> },
  { path: "/company", element: <UserCompany /> },
  { path: "/myjobs", element: <JobsApplied /> },
]);