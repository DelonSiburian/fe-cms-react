import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom";
import BaseLayout from "./layouts/BaseLayout";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Post from "./pages/Post";
import Register from "./pages/Register";
import PrivateRoute from "./utils/PrivateRoute";
import PublicRoute from "./utils/PublicRoute";
import { AuthProvider } from "./utils/AuthProvider";
import ManageContent from "./pages/ManageContent";
import ManageTags from './pages/ManageTags';  
import ManageCategory from './pages/ManageCategory';
import ManagePosts from './pages/ManagePosts';
import Profile from './pages/Profile';

const queryClient = new QueryClient();
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<BaseLayout />}>
          <Route
            path="login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
        </Route>
        <Route path="/" element={<RootLayout />}>
          <Route
            index
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="posts"
            element={
              <PrivateRoute>
                <Post />
              </PrivateRoute>
            }
          />
          <Route path="/manage-content" element={
            <PrivateRoute>
              <ManageContent />
            </PrivateRoute>
            } 
          />    
          <Route path="/manage-content/tags" element={
            <PrivateRoute>
              <ManageTags />
            </PrivateRoute>
            } 
          />    
          <Route path="/manage-content/categories" element={
            <PrivateRoute>
              <ManageCategory />
            </PrivateRoute>
            } 
          />    
          <Route path="/manage-content/posts" element={
            <PrivateRoute>
              <ManagePosts />
            </PrivateRoute>
            } 
          />    
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
            } 
          />    
        </Route>
      </Route>
    )
  );
  return (
    <>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
    </>
  );
}

export default App;
