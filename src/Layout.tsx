import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/NavBarHeader";

import SideBar from "./components/SideBar";

interface LayoutProps {
  showSideBar: boolean;
}
const Layout: React.FC<LayoutProps> = ({ showSideBar }) => {
  return (
    <div className="w-full h-screen flex flex-col ">
      {/* Sidebar */}
      <Header />

      <div className="flex-1 flex ">
        {/* Header */}
        {showSideBar && <SideBar />}

        <div className="flex-1 bg-[#EFF0F0] p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
