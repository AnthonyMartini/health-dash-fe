import React from "react";
import { useNavigate } from "react-router-dom";
import dashboardIcon from "../assets/dashboard.svg";
import workoutPlanIcon from "../assets/workoutPlan.svg";
interface SideBarProps {
  Page?: string;
  Goals?: object; //need shape?
}

const SideBar: React.FC<SideBarProps> = ({}) => {
  const navigate = useNavigate();
  const buttons = [
    {
      page: "Dashboard",
      icon: dashboardIcon,
      selected: true,
      path: "/dashboard",
    },
    {
      page: "Workout Plan",
      icon: workoutPlanIcon,
      selected: false,
      path: "/workout-plan",
    },
  ];
  return (
    <div className="h-full flex-shrink-0 w-[270px] flex flex-col items-center gap-[10px] pt-[20px]">
      {buttons.map((item) => (
        <button
          className={`${
            item.selected
              ? "bg-[#FCE9E9] hover:bg-[#ffe2e2] text-[#DF1111]"
              : "bg-slate-200 hover:bg-slate-300 text-black"
          }  w-[230px] h-[44px] rounded-[10px]  flex gap-[10px] items-center p-2 cursor-pointer`}
          onClick={() => navigate(item.path)}
        >
          <div className="w-6 h-6">
            {item.icon && (
              <img
                src={item.icon}
                alt={`${item.page} icon`}
                className="w-6 h-6"
              />
            )}
          </div>
          {item.page}
        </button>
      ))}
    </div>
  );
};

export default SideBar;
