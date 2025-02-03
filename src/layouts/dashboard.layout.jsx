import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/index";
import { Header } from "../components/Header";
import { useState } from "react";

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    // <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="bg-gray-200"> 
      <div className="flex h-screen overflow-hidden">
        {/* sidbar start  */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* Header start  */}
          <Header  sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
