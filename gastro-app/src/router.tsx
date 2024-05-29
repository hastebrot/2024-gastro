import { createHashRouter } from "react-router-dom";
import { AdminPage } from "./page/AdminPage";
import { DashboardPage } from "./page/DashboardPage";

export const router = createHashRouter([
  {
    path: "/",
    element: <DashboardPage />,
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
