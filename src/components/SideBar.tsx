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
    <div className=" h-full flex-shrink-0 w-[270px] flex flex-col items-center gap-[10px] py-[20px] sticky top-[95px] ">
      {buttons.map((item) => (
        <button
          className={`${
            item.page === SelectedPage
              ? "bg-[#FCE9E9] hover:bg-[#ffcccc] text-[#DF1111]"
              : "bg-slate-200 hover:bg-slate-300 text-black"
          }  w-[230px] h-[44px] rounded-[10px]  flex gap-[10px] items-center p-2 cursor-pointer`}
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
