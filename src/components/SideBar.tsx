import React from "react";
import { useNavigate } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { CgGym } from "react-icons/cg";

interface SideBarProps {
  SelectedPage?: string;
  Goals?: object; //need shape?
}

const SideBar: React.FC<SideBarProps> = ({ SelectedPage }) => {
  const navigate = useNavigate();
  const buttons = [
    {
      page: "Dashboard",
      icon: <LuLayoutDashboard />,
      selected: true,
      path: "/dashboard",
    },
    {
      page: "Workout Plan",
      icon: <CgGym />,
      selected: false,
      path: "/workout-plan",
    },
  ];
  return (
    <div className=" h-[60px] md:h-full flex-shrink-0 md:w-[270px] w-full flex md:flex-col items-center gap-[10px] py-[20px] justify-center md:justify-start ">
      {buttons.map((item, index) => (
        <button
          key={`item-${index}`}
          className={`${
            item.page === SelectedPage
              ? "bg-[#FCE9E9] hover:bg-[#ffcccc] text-[#DF1111]"
              : "bg-[#EFF0F0] hover:bg-slate-300 text-black"
          }  sm:w-[230px] w-[150px] h-[44px] rounded-[10px] shadow-lg flex gap-[10px] items-center p-2 cursor-pointer`}
          onClick={() => navigate(item.path)}
        >
          {item.icon}
          {item.page}
        </button>
      ))}
    </div>
  );
};

export default SideBar;
