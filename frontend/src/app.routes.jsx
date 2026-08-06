const {createBrowserRouter} = require("react-router");
import Login from "./features/auth/pages/login";
import Register from "./features/auth/pages/register";
import {protected} from "./features/auth/components/protected.jsx"



export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/",
        element: <protected> <h1>Home page </h1></protected>
    }
]);