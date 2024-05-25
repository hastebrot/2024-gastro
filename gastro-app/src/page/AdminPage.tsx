import { Link } from "react-router-dom";
import { Layout } from "./Layout";

export const AdminPage = () => {
  return (
    <Layout>
      <div className="p-4">
        <Link className="underline text-blue-600" to="/">
          back
        </Link>
        <div className="pb-4">admin page</div>
      </div>
    </Layout>
  );
};
