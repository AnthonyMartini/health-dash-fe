import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaRegIdCard, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { AiFillPhone } from "react-icons/ai";
import { BiCalendar, BiMaleFemale } from "react-icons/bi";
import { GiBodyHeight, GiWeight } from "react-icons/gi";
import { IoIosWarning } from "react-icons/io";
import { HiThumbUp } from "react-icons/hi"; // Icon for achievements

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [emailToggle, setEmailToggle] = useState(true);
  const [phoneToggle, setPhoneToggle] = useState(false);

  return (
    <div className="flex flex-col bg-gray-100 h-screen w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-8 overflow-hidden">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 flex items-center gap-2 text-gray-700 hover:text-gray-900 text-base sm:text-lg md:text-xl font-medium transition"
        >
          <FaArrowLeft className="text-lg sm:text-xl md:text-2xl" />
          <span>Back</span>
        </button>

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center text-center md:text-left md:justify-start w-full gap-6 md:gap-10 border-b border-gray-200 pb-6">
          {/* Profile Image */}
          <img
            src="https://blenderartists.org/uploads/default/original/4X/4/d/4/4d438fc90b83b63a7e664cf28ba6aeb3bc0e519a.jpeg"
            alt="Profile"
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-md"
          />

          {/* User Name */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">Peter Griffin</h2>
          </div>
        </div>

        {/* User Information Section */}
        <div className="w-full mt-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">User Information</h2>

          {/* User Data Rows */}
          <div className="flex flex-col gap-4 w-full">
            <DataRow icon={<FaRegIdCard />} label="User ID" value="123456789" isBold isMasked />
            <DataRow icon={<FaLock />} label="Password" value="" isPassword />
            <DataRow 
              icon={<MdEmail />} 
              label="Email" 
              value="petergriffin@mail.com" 
              stacked 
              isBold 
              toggle={emailToggle} 
              onToggle={() => setEmailToggle(!emailToggle)} 
            />
            <DataRow 
              icon={<AiFillPhone />} 
              label="Phone" 
              value="+1 (111) 111-1111" 
              stacked 
              isBold 
              toggle={phoneToggle} 
              onToggle={() => setPhoneToggle(!phoneToggle)} 
            />
            <DataRow icon={<BiCalendar />} label="Birth Date" value="Feb 11, 2025" isBold />
            <DataRow icon={<BiMaleFemale />} label="Gender" value="Male" isBold />
            <DataRow icon={<GiBodyHeight />} label="Height" value="190.5 cm" isBold />
            <DataRow icon={<GiWeight />} label="Weight" value="122 kg" isBold />
            <DataRow icon={<GiWeight />} label="BMI" value="33.6" isBold />

            {/* Delete Account Row */}
            <DataRow
              icon={<IoIosWarning />}
              label="Delete Account"
              value="Not happy with the product? Delete your account and you'll never hear from us again."
              isDelete
              isBold
              noBoldValue
            />
          </div>
        </div>

        {/* Achievements Section */}
        <AchievementsSection />
      </div>
    </div>
  );
};

// 🏆 Achievements Section
const AchievementsSection: React.FC = () => {
  return (
    <div className="mt-10 w-full">
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Achievements</h2>

      {/* Responsive Achievements Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
        {/* Repeat the "Yay" achievement 15 times */}
        {Array.from({ length: 15 }).map((_, index) => (
          <AchievementCard key={index} title="Yay" icon={<HiThumbUp className="text-yellow-400 text-2xl" />} />
        ))}
      </div>
    </div>
  );
};

// 🏆 Individual Achievement Card
const AchievementCard: React.FC<{ title: string; icon: React.ReactNode }> = ({ title, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-200 rounded-lg w-40 h-24 p-4 shadow-md">
      {icon}
      <span className="text-sm font-medium mt-2">{title}</span>
    </div>
  );
};

// 📌 Reusable DataRow Component
const DataRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  isPassword?: boolean;
  isDelete?: boolean;
  stacked?: boolean;
  isBold?: boolean;
  noBoldValue?: boolean;
  toggle?: boolean;
  onToggle?: () => void;
  isMasked?: boolean;
}> = ({
  icon, label, value, isPassword = false, isDelete = false, stacked = false, 
  isBold = false, noBoldValue = false, toggle, onToggle, isMasked
}) => {
  return (
    <div className="group flex flex-row justify-between items-center p-4 border-b border-gray-300 w-full">
      {/* Left Side: Icon & Text */}
      <div className="flex flex-row items-center gap-3">
        <span className="text-[#C69DE6] text-lg">{icon}</span>
        <div className="flex flex-col">
          <span className={`text-gray-800 text-base ${isDelete ? "font-semibold" : ""}`}>{label}</span>
          {(isDelete || stacked) && (
            <p className={`text-gray-800 text-base ${isBold && !noBoldValue ? "font-semibold" : ""}`}>
              {value}
            </p>
          )}
        </div>
      </div>

      {/* Right Side Content */}
      <div className="flex flex-row items-center gap-3">
        {!isDelete ? (
          isPassword ? (
            <button className="px-4 py-2 text-[#FF3B30] text-base font-semibold border border-[#FF3B30] rounded-lg hover:bg-[#FF3B30] hover:text-white transition">
              Reset Password
            </button>
          ) : !stacked ? (
            <span className={`text-gray-800 text-base ${isBold ? "font-semibold" : ""}`}>
              {isMasked ? (
                <span className="group-hover:hidden">*********</span>
              ) : value}
              {isMasked && (
                <span className="hidden group-hover:inline">{value}</span>
              )}
            </span>
          ) : null
        ) : (
          <button className="px-4 py-2 text-[#FF3B30] text-base font-semibold border border-[#FF3B30] rounded-lg hover:bg-[#FF3B30] hover:text-white transition">
            Delete
          </button>
        )}

        {/* Toggle Button (for Email & Phone) */}
        {onToggle && (
          <button
            onClick={onToggle}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              toggle ? "bg-[#34C759]" : "bg-[#FF3B30]"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                toggle ? "translate-x-6" : ""
              }`}
            ></div>
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
