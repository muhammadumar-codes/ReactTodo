import { Outlet } from "react-router-dom";
import Sidebar from "../components/SideBar/SideBar"
import Topbar from "../components/TopBar/TopBar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
