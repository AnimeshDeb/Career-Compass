import UserpageSeeker from "./src/routes/seeker/userpage/userpageSeeker.jsx";
import UserpageMentor from "./src/routes/mentor/userpage/userpageMentor.jsx";
import UserpageCompany from "./src/routes/company/userpage/userpageCompany.jsx";
import { createBrowserRouter } from "react-router-dom";
import JobsApplied from "./src/routes/seeker/jobsApplied/jobsApplied.jsx";
import SearchUser from "./src/routes/onboard/searchUsers/searchUsers.jsx";
import Onboard from "./src/routes/onboard/Onboard.jsx";
import { AuthProvider } from "./src/Contexts/AuthContext";
import ForgotPassword from "./src/routes/seeker/signup/ForgotPassword.jsx";
import { SeekerAuthProvider } from "./src/Contexts/SeekerAuthContext.jsx";
import SeekerPrivateRoute from "./src/routes/seeker/signup/steps/SeekerPrivateRoute.jsx";
import SeekerLogin from "./src/routes/seeker/signup/steps/SeekerLogin.jsx";
import SeekerSignup from "./src/routes/seeker/signup/SeekerSignup.jsx";
import SeekerUser from "./src/routes/seeker/signup/steps/SeekerUser.jsx";
import SeekerUpdateProfile from "./src/routes/seeker/signup/steps/SeekerUpdateProfile.jsx";
import ParentComponent from "./src/routes/seeker/signup/ProcessSignUp.jsx";

import JobList from "./src/routes/JobList/JobList.jsx";
export const router = createBrowserRouter([
  {
    path: "/parent",
    element: (
      <SeekerAuthProvider>
        <ParentComponent />
      </SeekerAuthProvider>
    ),
  },
  {
    path: "/",
    element: (
      <AuthProvider>
        <Onboard />
      </AuthProvider>
    ),
  },
  {
    path: "/ForgotPassword",
    element: (
      <AuthProvider>
        <ForgotPassword />
      </AuthProvider>
    ),
  },
  {
    path: "/SeekerLogin",
    element: (
      <SeekerAuthProvider>
        <SeekerLogin />
      </SeekerAuthProvider>
    ),
  },
  {
    path: "/SeekerSignup",
    element: (
      <SeekerAuthProvider>
        <SeekerSignup />
      </SeekerAuthProvider>
    ),
  },
  {
    path: "/SeekerUser",
    element: (
      <SeekerAuthProvider>
        <SeekerPrivateRoute>
          <SeekerUser />
        </SeekerPrivateRoute>
      </SeekerAuthProvider>
    ),
  },
  {
    path: "/SeekerUpdateProfile",
    element: (
      <SeekerAuthProvider>
        {" "}
        <SeekerPrivateRoute>
          <SeekerUpdateProfile />
        </SeekerPrivateRoute>
      </SeekerAuthProvider>
    ),
  },
  {
    path: "/Joblist",
    element: <JobList />,
  },
  {
    path: "/SeekerForgotPassword",
    element: (
      <SeekerAuthProvider>
        <SeekerUpdateProfile />
      </SeekerAuthProvider>
    ),
  },
  { path: "/searchUsers", element: <SearchUser /> },
  { path: "/user", element: <UserpageSeeker /> },
  { path: "/mentor", element: <UserpageMentor /> },
  { path: "/company", element: <UserpageCompany /> },
  { path: "/myjobs", element: <JobsApplied /> },
]);
