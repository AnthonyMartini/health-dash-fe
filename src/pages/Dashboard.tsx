import React from "react";

interface SideBarProps {
  Page?: string;
  Goals?: object; //need shape?
}

const NotFound: React.FC<SideBarProps> = ({}) => {
  return (
    <div className="h-[400px] w-[400px] p-2">
      <div>
        <h1 className="text-3xl font-bold h-[60px]">Welcome Back, Peter</h1>
        <h3 className="text-md font-semibold text-slate-700">
          Here is your health overview for the day:
        </h3>
      </div>
    </div>
  );
};

export default NotFound;
