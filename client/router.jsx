import UserCandidate from "./src/routes/candidates/userpage/UserCandidate.jsx"
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  { path: "/user", element: <UserCandidate /> },
]);