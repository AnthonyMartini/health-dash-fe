import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/NavBarHeader";

import SideBar from "./components/SideBar";

const Layout: React.FC = () => {
  return (
    <div className="w-screen h-screen flex flex-col ">
      {/* Sidebar */}
      <Header />

      <div className="flex-1 flex ">
        {/* Header */}
        <SideBar />
        <div className="flex-1 bg-[#EFF0F0] p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
