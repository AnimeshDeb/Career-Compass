import UserSeeker from "./src/routes/seeker/userpage/UserSeeker.jsx"
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  { path: "/user", element: <UserSeeker /> },
]);