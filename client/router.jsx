// import Onboard from "./src/components/Onboard"
// import Admin_signup from "./src/components/Admin-signup.jsx";
// import {AuthProvider} from "./src/Contexts/AuthContext"
// export const router = createBrowserRouter([
//   { path: "/user", element: (<AuthProvider> <UserSeeker /> <AuthProvider/>) },
//   {path: "/", element: <Onboard />},
//   {path: "/admin-signup", element: <Admin_signup/>},
// ]);
import UserpageSeeker from "./src/routes/seeker/userpage/userpageSeeker.jsx";
import UserpageMentor from "./src/routes/mentor/userpage/userpageMentor.jsx";
import UserpageCompany from "./src/routes/company/userpage/userpageCompany.jsx";
import { createBrowserRouter } from "react-router-dom";
import JobsApplied from "./src/routes/seeker/jobsApplied/jobsApplied.jsx";

import Onboard from "./src/components/Onboard";
import AdminSignup from "./src/components/AdminSignup.jsx";
import { AuthProvider } from "./src/Contexts/AuthContext";
import { CompaniesAuthProvider } from "./src/Contexts/CompaniesAuthContext.jsx";
import AdminUser from "./src/components/AdminUser.jsx";
import AdminLogin from "./src/components/AdminLogin.jsx";
import AdminUpdateProfile from "./src/components/AdminUpdateProfile.jsx";
import ForgotPassword from "./src/components/ForgotPassword.jsx";
import AdminPrivateRoute from "./src/components/AdminPrivateRoute.jsx";
import CompaniesLogin from "./src/components/CompaniesLogin.jsx";
import CompaniesPrivateRoute from "./src/components/CompaniesPrivateRoute.jsx";
import CompaniesSignup from "./src/components/CompaniesSignup.jsx";
import CompaniesUpdateProfile from "./src/components/CompaniesUpdateProfile.jsx";
import CompaniesUser from "./src/components/CompaniesUser.jsx";
import CompaniesForgotPassword from "./src/components/CompaniesForgotPassword.jsx";
import SeekerForgotPassword from "./src/components/SeekerForgotPassword.jsx";
import { SeekerAuthProvider } from "./src/Contexts/SeekerAuthContext.jsx";
import SeekerPrivateRoute from "./src/components/SeekerPrivateRoute.jsx";
import SeekerLogin from "./src/components/SeekerLogin.jsx";
import SeekerSignup from "./src/components/SeekerSignup.jsx";
import SeekerUser from "./src/components/SeekerUser.jsx";
import SeekerUpdateProfile from "./src/components/SeekerUpdateProfile.jsx";
import SeekerIntro from "./src/components/SeekerSignProcessIntro.jsx";
import SeekerSkills from "./src/components/SeekerSignupProcessSkills.jsx";
import SeekerChallenges from "./src/components/SeekerChallengers.jsx";
import SeekerEducation from "./src/components/SeekerEducation.jsx";
import SeekerJobs from "./src/components/SeekerJobs.jsx";
import SeekerProfilepic from "./src/components/SeekerProfilepic.jsx";
import ParentComponent from "./src/components/ParentComponent.jsx";
export const router = createBrowserRouter([
 {
  path:"/parent",
  element:(
    <SeekerAuthProvider>
      <ParentComponent/>
    </SeekerAuthProvider>
  )
 },
  // {
  //   path: "/SeekerProfilepic",
  //   element: (
  //     <SeekerAuthProvider>
  //       <SeekerProfilepic />
  //     </SeekerAuthProvider>
  //   ),
  // },
  // {
  //   path: "/SeekerJobs",
  //   element: (
  //     <SeekerAuthProvider>
  //       <SeekerJobs />
  //     </SeekerAuthProvider>
  //   ),
  // },
  // {
  //   path: "/seekerEducation",
  //   element: (
  //     <SeekerAuthProvider>
  //       <SeekerEducation />
  //     </SeekerAuthProvider>
  //   ),
  // },
  // {
  //   path: "/seekerChallenges",
  //   element: (
  //     <SeekerAuthProvider>
  //       <SeekerChallenges />
  //     </SeekerAuthProvider>
  //   ),
  // },
  // {
  //   path: "/seekerSkills",
  //   element: (
  //     <SeekerAuthProvider>
  //       <SeekerSkills />
  //     </SeekerAuthProvider>
  //   ),
  // },
  // {
  //   path: "/seekerIntro",
  //   element: (
  //     <SeekerAuthProvider>
  //       <SeekerIntro />
  //     </SeekerAuthProvider>
  //   ),
  // },
  {
    path: "/AdminUser",
    element: (
      <AuthProvider>
        <AdminPrivateRoute>
          <AdminUser />
        </AdminPrivateRoute>
      </AuthProvider>
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
    path: "/AdminLogin",
    element: (
      <AuthProvider>
        <AdminLogin />
      </AuthProvider>
    ),
  },
  {
    path: "/AdminSignup",
    element: (
      <AuthProvider>
        <AdminSignup />
      </AuthProvider>
    ),
  },
  {
    path: "/AdminUpdateProfile",
    element: (
      <AuthProvider>
        <AdminPrivateRoute>
          <AdminUpdateProfile />
        </AdminPrivateRoute>
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
    path: "/CompaniesLogin",
    element: (
      <CompaniesAuthProvider>
        <CompaniesLogin />
      </CompaniesAuthProvider>
    ),
  },
  {
    path: "/CompaniesSignup",
    element: (
      <CompaniesAuthProvider>
        <CompaniesSignup />
      </CompaniesAuthProvider>
    ),
  },
  {
    path: "/CompaniesUser",
    element: (
      <CompaniesAuthProvider>
        <CompaniesPrivateRoute>
          <CompaniesUser />
        </CompaniesPrivateRoute>
      </CompaniesAuthProvider>
    ),
  },
  {
    path: "/CompaniesPrivateRoute",
    element: (
      <CompaniesAuthProvider>
        <CompaniesPrivateRoute />
      </CompaniesAuthProvider>
    ),
  },
  {
    path: "/CompaniesUpdateProfile",
    element: (
      <CompaniesAuthProvider>
        {" "}
        <CompaniesPrivateRoute>
          <CompaniesUpdateProfile />
        </CompaniesPrivateRoute>
      </CompaniesAuthProvider>
    ),
  },
  {
    path: "/CompaniesForgotPassword",
    element: (
      <CompaniesAuthProvider>
        <CompaniesUpdateProfile />
      </CompaniesAuthProvider>
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
    path: "/SeekerPrivateRoute",
    element: (
      <SeekerAuthProvider>
        <CompaniesPrivateRoute />
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
    path: "/SeekerForgotPassword",
    element: (
      <SeekerAuthProvider>
        <SeekerUpdateProfile />
      </SeekerAuthProvider>
    ),
  },
  { path: "/user", element: <UserpageSeeker /> },
  { path: "/mentor", element: <UserpageMentor /> },
  { path: "/company", element: <UserpageCompany /> },
  { path: "/myjobs", element: <JobsApplied /> },
]);
