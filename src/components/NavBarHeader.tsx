import React, { useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { IoIosNotifications } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import APPIconSVG from "../assets/AppIcon.svg";

interface NavBarHeaderProps {
  logoText?: string;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
}

const NavBarHeader: React.FC<NavBarHeaderProps> = ({
  onNotificationClick = () => console.log("Notifications clicked"),
  onProfileClick = () => console.log("Profile clicked"),
}) => {
  const navigate = useNavigate();
  const { signOut } = useAuthenticator();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  return (
    <div className="z-10 w-full h-[95px] p-6 bg-white flex items-center justify-between shadow-md sticky top-0">
      <div className="flex gap-2 font-bold text-xl sm:text-2xl text-[#e61313]">
        <img src={APPIconSVG} alt="My Icon" className="w-[30px] sm:w-[50px]" />
        <span>Swag Productions</span>
      </div>
      <div className="flex items-center gap-8">
        <IoIosNotifications className="w-7 h-7 p-1 cursor-pointer hover:bg-gray-300 rounded-full" />
        {/* Profile Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setShowProfileMenu(true)}
          onMouseLeave={() => setShowProfileMenu(false)}
        >
          <img
            src="https://blenderartists.org/uploads/default/original/4X/4/d/4/4d438fc90b83b63a7e664cf28ba6aeb3bc0e519a.jpeg"
            alt="Profile"
            className="w-11 h-11 cursor-pointer rounded-full hover:opacity-90"
            onClick={onProfileClick}
          />

          {showProfileMenu && (
            <div className="absolute right-0 w-30 bg-white shadow-lg rounded-lg">
              <p
                className="text-gray-700 cursor-pointer hover:bg-slate-200 px-3 h-[30px] flex items-center"
                onClick={() => navigate("/profile")}
              >
                Profile
              </p>
              <p
                className="text-red-500 cursor-pointer hover:bg-slate-200 px-3 h-[30px] flex items-center"
                onClick={signOut}
              >
                Logout
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBarHeader;
