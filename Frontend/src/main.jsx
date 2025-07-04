import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AllVideo from './components/Pages/AllVideo.jsx'
import VideoDetail from './components/Pages/VideoDetail.jsx'
import ChannelDetail from './components/Pages/ChannelDetail.jsx'
import LoginForm from './components/Auth/LoginForm.jsx'
import Protected from './components/Auth/AuthLayout.jsx'
import SignUpForm from './components/Auth/SignUpForm.jsx';
import Profile from './components/Pages/Profile.jsx'
import MyContent from './components/Pages/MyContent.jsx'
import History from './components/Pages/History.jsx'
import Collections from './components/Pages/Collections.jsx'
import Support from './components/Pages/Support.jsx'
import Search from './components/Header/Search.jsx'

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <AllVideo />,
        exact: true,
        index: true,
      },
      {
        path: "/login",
        element: (
          <Protected authentication={false}>
            <LoginForm />
          </Protected>)
      },
      {
        path: "/signup",
        element: (
          <Protected authentication={false}>
            <SignUpForm />
          </Protected>
        )
      },
      {
        path: "/home",
        element: <AllVideo />,
        exact: true,
        index: true,
      },
      {
        path: "/video/:videoId",
        element: <VideoDetail />,
        exact: true,
        index: true,
      },
      {
        path: "/channel/:channelId",
        element: <ChannelDetail />,
        exact: true,
        index: true,
      },
      // {
      //   path: "/liked-videos",
      //   element: <AllVideo />,
      //   exact: true,
      //   index: true,
      // },
      {
        path: "/history",
        element: <History />,
        exact: true,
        index: true,
      },
      {
        path: "/my-content",
        element: <MyContent/>,
        exact: true,
        index: true,
      },
      {
        path: "/collections",
        element: <Collections />,
        exact: true,
        index: true,
      },
      {
        path: "/subscribers",
        element: <AllVideo />,
        exact: true,
        index: true,
      },
      {
        path: "/support",
        element: <Support />,
        exact: true,
        index: true,
      },
      {
        path: "/settings",
        element: <Profile />,
        exact: true,
        index: true,
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer />
    </Provider>
  </QueryClientProvider>


)
