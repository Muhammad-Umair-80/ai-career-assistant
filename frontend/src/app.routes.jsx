import { createBrowserRouter } from "react-router-dom";
import Login from "./features/auth/pages/login";
import Register from "./features/auth/pages/register";
import Protected from "./features/auth/components/protected.jsx";
import Home from "./features/interview/pages/Home.jsx";
import Interview from "./features/interview/pages/interview.jsx"
export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/interview/:interviewId",
    element: <Protected><Interview /></Protected>,
  }
], {
  // Opt into upcoming v7 behavior to silence future-flag warnings in console
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});