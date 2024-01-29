import UserSeeker from "./src/routes/seeker/userpage/UserSeeker.jsx"
import UserCompany from "./src/routes/company/userpage/UserCompany.jsx"
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  { path: "/user", element: <UserSeeker /> },
  { path: "/company", element: <UserCompany /> },
]);