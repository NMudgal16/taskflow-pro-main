import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="app-shell min-h-screen">
      <Sidebar />
      <main className="lg:pl-72">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
