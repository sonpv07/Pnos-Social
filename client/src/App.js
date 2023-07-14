import logo from "./logo.svg";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import "./App.css";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  Routes,
  useNavigate,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Layout from "./components/layout/Layout";
import { AuthContext, UserAuth } from "./context/authContext";
import { useContext, useEffect } from "react";
import Protected from "./components/Protected";
import { DarkModeContext } from "./context/DarkModeContext";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import Layout2 from "./components/layout/Layout2";
import SuggestList from "./components/suggestList/SuggestList";
import PostOnly from "./components/postOnly/PostOnly";
import CreateStory from "./components/createStory/CreateStory";
import StoryOnly from "./components/StoryOnly/StoryOnly";

function App() {
  // const router = createBrowserRouter([
  //   {
  //     path: "/",
  //     element: <Layout />,
  //     children: [
  //       {
  //         path: "/home",

  //         element: (
  //           <Protected>
  //             <Home />
  //           </Protected>
  //         ),
  //       },

  //       {
  //         path: "/profile/:id",
  //         element: <Profile />,
  //       },
  //     ],
  //   },
  //   {
  //     path: "/login",
  //     element: <Login />,
  //   },

  //   {
  //     path: "/register",
  //     element: <Register />,
  //   },
  // ]);

  const queryClient = new QueryClient();

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route
            path="/"
            element={
              <Protected>
                <Layout />
              </Protected>
            }
          >
            <Route
              path="/home"
              index
              element={
                <Protected>
                  <Home />
                </Protected>
              }
            />
            <Route
              path="/profile/:id"
              index
              element={
                <Protected>
                  <Profile />
                </Protected>
              }
            />
          </Route>

          <Route
            element={
              <Protected>
                <Layout2 />
              </Protected>
            }
          >
            <Route
              path="/suggest"
              element={
                <Protected>
                  <SuggestList />
                </Protected>
              }
            />

            <Route
              path="/post/:id"
              element={
                <Protected>
                  <PostOnly />
                </Protected>
              }
            />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/story/:id" element={<StoryOnly />} />
        </Routes>
      </QueryClientProvider>
    </div>
  );
}

export default App;
