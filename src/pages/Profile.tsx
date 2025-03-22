import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaRegIdCard, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { AiFillPhone } from "react-icons/ai";
import { BiCalendar, BiMaleFemale } from "react-icons/bi";
import { GiBodyHeight, GiWeight } from "react-icons/gi";
import { IoIosWarning } from "react-icons/io";
import { HiThumbUp } from "react-icons/hi";
import DefaultAvatar from "../assets/defaultAvatar.png";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [emailToggle, setEmailToggle] = useState(true);
  const [phoneToggle, setPhoneToggle] = useState(false);

  // State for popups
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  return (
    <div className="flex flex-col bg-white h-screen w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-8 overflow-y-auto">
      {/* Scrollable Content */}
      <div className="flex-1 px-4 pb-24">
        {/* Back Button */}
        <button
          title="Back"
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
            src={DefaultAvatar}
            alt="Profile"
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
          />

          {/* User Name */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
              Peter Griffin
            </h2>
          </div>
        </div>

        {/* User Information Section */}
        <div className="w-full mt-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
            User Information
          </h2>

          {/* User Data Rows */}
          <div className="flex flex-col gap-4 w-full">
            <DataRow icon={<FaRegIdCard />} label="User ID" value="123456789" isBold />
            <DataRow
              icon={<FaLock />}
              label="Password"
              value=""
              isPassword
              onReset={() => setShowResetPopup(true)} // Popup Trigger
            />
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
              onDelete={() => setShowDeletePopup(true)} // Popup Trigger
            />
          </div>
        </div>

        {/* Achievements Section */}
        <AchievementsSection />
      </div>

      {/* POPUPS */}
      {showResetPopup && (
        <Popup
          message="Are you sure you want to reset your password?"
          onClose={() => setShowResetPopup(false)}
          onConfirm={() => {
            console.log("Password reset confirmed");
            setShowResetPopup(false);
          }}
        />
      )}

      {showDeletePopup && (
        <Popup
          message="Are you sure you want to delete your account?"
          onClose={() => setShowDeletePopup(false)}
          onConfirm={() => {
            console.log("Account deleted");
            setShowDeletePopup(false);
          }}
        />
      )}
    </div>
  );
};

// 🏆 Achievements Section
const AchievementsSection: React.FC = () => {
  return (
    <div className="mt-10 w-full">
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Achievements</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
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
    <div className="flex flex-col items-center justify-center bg-[rgba(239,240,240,0.3)] rounded-lg w-40 h-24 p-4">
      {icon}
      <span className="text-sm font-medium mt-2">{title}</span>
    </div>
  );
};

// 📌 Popup Component
const Popup: React.FC<{
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ message, onClose, onConfirm }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50">
    <div className="bg-white p-4 rounded-2xl shadow-lg w-[300px] text-center relative">
      <p className="text-lg font-semibold mb-4">{message}</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={onConfirm}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Yes
        </button>
        <button
          onClick={onClose}
          className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
        >
          No
        </button>
      </div>
    </div>
  </div>
);

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
  onReset?: () => void;
  onDelete?: () => void;
}> = ({
  icon,
  label,
  value,
  isPassword = false,
  isDelete = false,
  stacked = false,
  isBold = false,
  noBoldValue = false,
  toggle,
  onToggle,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // Handler for Reset Password
  const handleResetPassword = () => {
    setPopupMessage("Are you sure you want to reset your password?");
    setShowPopup(true);
  };

  // Handler for Delete Account
  const handleDeleteAccount = () => {
    setPopupMessage("Are you sure you want to delete your account?");
    setShowPopup(true);
  };

  const handleConfirm = () => {
    console.log(`${popupMessage.includes("reset") ? "Password reset" : "Account deleted"}`);
    setShowPopup(false);
  };

  return (
    <>
      <div className="group flex flex-row justify-between items-center p-4 bg-[rgba(239,240,240,0.3)] rounded-lg w-full">
        {/* Left Side: Icon & Text */}
        <div className="flex flex-row items-center gap-3">
          <span className="text-[#C69DE6] text-lg">{icon}</span>
          <div className="flex flex-col">
            <span
              className={`text-gray-800 text-base ${
                isDelete ? "font-semibold" : ""
              }`}
            >
              {label}
            </span>
            {(isDelete || stacked) && (
              <p
                className={`text-gray-800 text-base ${
                  isBold && !noBoldValue ? "font-semibold" : ""
                }`}
              >
                {value}
              </p>
            )}
          </div>
        </div>

        {/* Right Side Content */}
        <div className="flex flex-row items-center gap-3">
          {!isDelete ? (
            isPassword ? (
              <button
                title="Reset Password"
                className="px-4 py-2 text-[#FF3B30] text-base font-semibold border border-[#FF3B30] rounded-lg hover:bg-[#FF3B30] hover:text-white transition"
                onClick={handleResetPassword}
              >
                Reset Password
              </button>
            ) : !stacked ? (
              <span
                className={`text-gray-800 text-base ${
                  isBold ? "font-semibold" : ""
                }`}
              >
                {value}
              </span>
            ) : null
          ) : (
            <button
              title="Delete"
              className="px-4 py-2 text-[#FF3B30] text-base font-semibold border border-[#FF3B30] rounded-lg hover:bg-[#FF3B30] hover:text-white transition"
              onClick={handleDeleteAccount}
            >
              Delete
            </button>
          )}

          {/* Toggle Button (for Email & Phone) */}
          {onToggle && (
            <button
              title="Toggle"
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

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-4 rounded-2xl shadow-lg w-[300px] text-center relative">
            <p className="text-lg font-semibold mb-4">{popupMessage}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirm}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Yes
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
