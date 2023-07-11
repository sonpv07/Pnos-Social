import logo from "./logo.svg";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import "./App.css";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Layout from "./components/layout/Layout";
import { AuthContext, UserAuth } from "./context/authContext";
import { useContext, useEffect } from "react";
import Protected from "./components/Protected";
import { DarkModeContext } from "./context/DarkModeContext";


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/home",

          element: (
            <Protected>
              <Home />
            </Protected>
          ),
        },

        {
          path: "/profile/:id",
          element: <Profile />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },

    {
      path: "/register",
      element: <Register />,
    },
  ]);
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
