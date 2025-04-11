import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/NavBarHeader";

const Layout: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col ">
      {/* Sidebar */}
      <Header />
      <div className="flex-1  bg-[#EFF0F0] overflow-hidden clip">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
