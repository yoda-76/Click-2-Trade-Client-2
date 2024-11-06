import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./page/Register.tsx";
import Login from "./page/Login.tsx";
import Dashboard from "./page/Dashboard.tsx";
import Trade from "./page/Trade.tsx";
import ManageChild from "./page/ManageChild.tsx";
import { CookiesProvider } from 'react-cookie'
import Test from "./page/Test.tsx";
import DhanAuth from "./page/DhanAuth.tsx";
import Profile from "./page/Profile.tsx";
import OptionChain from "./page/OptionChain.tsx";
// import OptionChainDashboard from "./page/OptionChainDashboard.tsx";
import AngelAuth from "./page/AngelAuth.tsx";
// import dotenv from 'dotenv'
// dotenv.config()
const router = createBrowserRouter([
  
  {
    path: "/",
    element: (
      <Provider store={store}>
        <Dashboard />
      </Provider>
    ),
  },
  {
    path: "/register",
    element: (
      <Provider store={store}>
        <Register />
      </Provider>
    ),
  },
  {
    path: "/login",
    element: (
      <Provider store={store}>
        <Login />
      </Provider>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <Provider store={store}>
        <Dashboard />
      </Provider>
    ),
  },
  {path:"/trade",
    element:(
      <Provider store={store}>
        <Trade/>
      </Provider>
    )
  },
  {
    path: "manage-child",
    element: (
      <Provider store={store}>
        <ManageChild />
      </Provider>
    ),
  },
  {
    path: "/profile",
    element: (
      <Provider store={store}>
        <Profile />
      </Provider>
    ),
  },
  {
    path: "/dhan-auth",
    element: (
      <Provider store={store}>
        <DhanAuth />
      </Provider>
    ),
  },
  {
    path: "/angel-auth",
    element: (
      <Provider store={store}>
        <AngelAuth />
      </Provider>
    ),
  },
  {
    path: "test",
    element: (
      <Provider store={store}>
        <Test />
      </Provider>
    ),
  },
  // {
  //   path: "/opt-chn-dashboard",
  //   element: (
  //     <Provider store={store}>
  //       <OptionChainDashboard />
  //     </Provider>
  //   ),
  // },
  {
    path: "/option-chain",
    element: (
      <Provider store={store}>
        <OptionChain />
      </Provider>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
     <CookiesProvider>
    <RouterProvider router={router} />
    </CookiesProvider>
  </React.StrictMode>
);