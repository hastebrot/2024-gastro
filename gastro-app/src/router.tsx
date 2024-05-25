import { createHashRouter } from "react-router-dom";
import { App } from "./App";
import { AdminPage } from "./page/AdminPage";

export const router = createHashRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/admin",
    element: <AdminPage />,
  },
]);
