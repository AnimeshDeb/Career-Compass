import UserSeeker from "./src/routes/seeker/userpage/UserSeeker.jsx"
import UserMentor from "./src/routes/company/userpage/UserMentor.jsx"
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  { path: "/user", element: <UserSeeker /> },
  { path: "/mentor", element: <UserMentor /> },
]);