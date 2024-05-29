import { createHashRouter } from "react-router-dom";
import { App } from "./App";
import { AdminPage } from "./page/AdminPage";
import { DashboardPage } from "./page/DashboardPage";

export const router = createHashRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/admin",
    element: <AdminPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
]);
