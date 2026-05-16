import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-[#0f1118] text-slate-200">
      <Sidebar />
      <main className="lg:pl-80">
        <div className="min-h-screen px-6 py-10 sm:px-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
