import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaRegIdCard, FaLock, FaPencilAlt, FaCheck, FaTimes } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { AiFillPhone } from "react-icons/ai";
import { BiCalendar, BiMaleFemale } from "react-icons/bi";
import { GiBodyHeight, GiWeight } from "react-icons/gi";
import { IoIosWarning } from "react-icons/io";
import { HiThumbUp } from "react-icons/hi";
import DefaultAvatar from "../assets/defaultAvatar.png";
import { apiRequest, ApiRoute } from "../utils/APIService";

const Profile: React.FC = () => {
  const navigate = useNavigate();

  // State for toggles
  const [emailToggle, setEmailToggle] = useState(true);
  const [phoneToggle, setPhoneToggle] = useState(false);

  // State for editing
  const [isEditing, setIsEditing] = useState(false);

  // ✅ State for user data
  const [userId, setUserId] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [birthDate, setBirthDate] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [height, setHeight] = useState<string | null>(null);
  const [weight, setWeight] = useState<string | null>(null);

  // ✅ State for validation errors
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [heightError, setHeightError] = useState<string | null>(null);

  // State for popups
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // ✅ Fetch user data from API
  const fetchUserData = async () => {
    try {
      const response = await apiRequest<{ data: any }>("GET_USER" as ApiRoute);
      console.log("Fetched user data:", response);

      const userData = response.data;

      setUserId(userData.PK);
      setUsername(userData.nickname);
      setFirstName(userData.first_name);
      setLastName(userData.last_name);
      setProfilePicture(userData.user_profile_picture_url || DefaultAvatar);
      setEmail(userData.email);
      setPhone(userData.phone);
      setBirthDate(userData.birthdate);
      setGender(userData.gender ? "Male" : "Female");
      setHeight(userData.height.toString());
      setWeight(userData.weight.toString());
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };
  
  // 📌 Call the fetchUserData when the component loads
  useEffect(() => {
    fetchUserData();
  }, []);

  // ✅ Email validation function
  const validateEmail = (value: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|mil|co|io|info|biz|me)$/;
    if (!emailPattern.test(value)) {
      setEmailError("Invalid email format.");
      return false;
    }
    setEmailError(null);
    return true;
  };

  // ✅ Phone validation and formatting function
  const validatePhone = (value: string) => {
    // ✅ Allow formats like: 1234567890, 123-456-7890, 123.456.7890, +1 (123) 456-7890
    const phonePattern = /^\+?1?\s?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/;

    // ✅ Remove non-numeric characters except the leading '+'
    const cleanedValue = value.replace(/[^\d+]/g, "");

    if (cleanedValue.length === 10) {
      // ✅ Format into +1 (XXX) XXX-XXXX if it's exactly 10 digits
      const formattedPhone = `+1 (${cleanedValue.slice(0, 3)}) ${cleanedValue.slice(3, 6)}-${cleanedValue.slice(6)}`;
      setPhone(formattedPhone);
      setPhoneError(null);
      return true;
    } else if (phonePattern.test(value)) {
      // ✅ Allow already formatted phone numbers like +1 (123) 456-7890
      setPhone(value);
      setPhoneError(null);
      return true;
    } else {
      setPhoneError("Invalid phone number format.");
      return false;
    }
  };

  // ✅ Height validation function
  const validateHeight = (value: string) => {
    if (!/^\d*\.?\d{0,1}$/.test(value) || value === "") {
      setHeightError("Invalid height format. Numeric input to one decimal place allowed.");
      return false;
    }
    setHeightError(null);
    return true;
  };

  // ✅ Calculate BMI
  const calculateBMI = () => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      if (heightInMeters > 0) {
        return (parseFloat(weight) / (heightInMeters * heightInMeters)).toFixed(1);
      }
    }
    return "N/A";
  };

  // ✅ Handle Save
  const handleSave = async () => {
    let isValid = true;
  
    if (!validateEmail(email || "")) isValid = false;
    if (!validatePhone(phone || "")) isValid = false;
    if (!validateHeight(height || "")) isValid = false;
  
    if (isValid) {
      try {
        console.log("Updating user data...");
  
        // ✅ Build request body (only updatable fields)
        const updatedUserData = {
          nickname: username || "",
          user_profile_picture_url: profilePicture || "",
          email: email || "",
          phone: phone || "",
          birthdate: birthDate || "",
          gender: gender === "Male" ? true : false,
          height: height ? parseFloat(height) : 0,
          first_name: firstName || "",
          last_name: lastName || "",
        };
  
        console.log("Request Body:", updatedUserData);
  
        // ✅ Update state first, then call API
        setUsername(updatedUserData.nickname);
        setFirstName(updatedUserData.first_name);
        setLastName(updatedUserData.last_name);
        setProfilePicture(updatedUserData.user_profile_picture_url);
        setEmail(updatedUserData.email);
        setPhone(updatedUserData.phone);
        setBirthDate(updatedUserData.birthdate);
        setGender(updatedUserData.gender ? "Male" : "Female");
        setHeight(updatedUserData.height.toString());

        console.log("Updated User Data:", updatedUserData);

        // ✅ Immediately call API to persist changes
        await apiRequest("UPDATE_USER" as ApiRoute, {
          body: updatedUserData,
        });
  
        console.log("Profile updated successfully");
        setIsEditing(false);
      } catch (error) {
        console.error("Failed to update user data:", error);
        alert(`Failed to update profile: ${error}`);
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchUserData(); // ✅ Reset to original values
  };

  return (
    <div className="flex flex-col bg-white h-screen w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-8 overflow-y-auto">
      {/* Scrollable Content */}
      <div className="flex-1 px-4 pb-24">
        {/* Back Button */}
        <button
          title="Back"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-700 hover:text-gray-900 text-base sm:text-lg md:text-xl font-medium transition"
        >
          <FaArrowLeft className="text-lg sm:text-xl md:text-2xl" />
          <span>Back</span>
        </button>

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center text-center md:text-left md:justify-start w-full gap-6 md:gap-10 border-b border-gray-200 pb-6">
          {/* Profile Picture */}
          <img
            // profilePicture || 
            src={DefaultAvatar}
            alt="Profile"
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
          />

          {/* User Name */}
          <div className="flex flex-col items-center md:items-start">
            {!isEditing ? (
              <>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                  {username || "Loading..."}
                </h2>
                <p className="text-md md:text-lg text-gray-600">
                  {firstName} {lastName}
                </p>
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={username || ""}
                  onChange={(e) => setUsername(e.target.value)}
                  className="text-2xl md:text-3xl font-semibold text-gray-900 border-b border-gray-400 focus:outline-none focus:border-blue-500 bg-transparent"
                />
                <div className="flex flex-col md:flex-row gap-2 text-md md:text-lg text-gray-600 mt-2">
                  <input
                    type="text"
                    value={firstName || ""}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="border-b border-gray-400 focus:outline-none focus:border-blue-500 bg-transparent"
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    value={lastName || ""}
                    onChange={(e) => setLastName(e.target.value)}
                    className="border-b border-gray-400 focus:outline-none focus:border-blue-500 bg-transparent"
                    placeholder="Last Name"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* User Information Section */}
        <div className="w-full mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
              User Information
            </h2>

            {/* Edit Button */}
            {!isEditing ? (
              <FaPencilAlt
                onClick={() => setIsEditing(true)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              />
            ) : (
              <div className="flex gap-2">
                {/* Save Button */}
                <FaCheck
                  onClick={handleSave}
                  className="text-green-500 hover:text-green-700 cursor-pointer"
                />
                {/* Cancel Button */}
                <FaTimes
                  onClick={handleCancel}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* User Data Rows */}
          <div className="flex flex-col gap-4 w-full">
            <DataRow icon={<FaRegIdCard />} label="User ID" value={userId || ""} isBold />
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
              value={email || ""}
              onChange={setEmail}
              editable={isEditing}
              stacked
              isBold
              toggle={emailToggle}
              onToggle={() => setEmailToggle(!emailToggle)}
              type="email"
            />
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
            <DataRow
              icon={<AiFillPhone />}
              label="Phone"
              value={phone || ""}
              onChange={setPhone}
              editable={isEditing}
              stacked
              isBold
              toggle={phoneToggle}
              onToggle={() => setPhoneToggle(!phoneToggle)}
              type="text"
            />
            {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}
            <DataRow
              icon={<BiCalendar />}
              label="Birth Date"
              value={birthDate || ""}
              onChange={setBirthDate}
              editable={isEditing}
              type="date"
              isBold
            />
            <DataRow
              icon={<BiMaleFemale />}
              label="Gender"
              value={gender || ""}
              onChange={setGender}
              editable={isEditing}
              isBold
              options={["Male", "Female"]}
            />
            <DataRow
              icon={<GiBodyHeight />}
              label="Height"
              value={height || ""}
              type="number"
              onChange={setHeight}
              editable={isEditing}
              isBold
              unit="cm"
            />
            {heightError && <p className="text-red-500 text-sm">{heightError}</p>}
            <DataRow
              icon={<GiWeight />}
              label="Weight"
              value={weight || ""}
              type="number"
              isBold
              unit="kg"
            />
            <DataRow icon={<GiWeight />} label="BMI" value={calculateBMI()} isBold />
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

      {/* Achievements Section
        <AchievementsSection /> */}
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

// ✅ Popup Component
const Popup: React.FC<{
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ message, onClose, onConfirm }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className="bg-white p-4 rounded-2xl shadow-lg w-[300px] text-center">
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

// 📌 Updated Reusable DataRow Component
const DataRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  type?: 'text' | 'number' | 'date' | 'email';
  isPassword?: boolean;
  isDelete?: boolean;
  stacked?: boolean;
  isBold?: boolean;
  noBoldValue?: boolean;
  toggle?: boolean;
  onToggle?: () => void;
  onReset?: () => void;
  onDelete?: () => void;
  editable?: boolean;
  onChange?: (val: string) => void;
  unit?: string;
  options?: string[];
}> = ({
  icon,
  label,
  value,
  type = 'text',
  isPassword = false,
  isDelete = false,
  stacked = false,
  isBold = false,
  noBoldValue = false,
  toggle,
  onToggle,
  editable = false,
  onChange,
  unit,
  options,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // ✅ Handler for Reset Password
  const handleResetPassword = () => {
    setPopupMessage("Are you sure you want to reset your password?");
    setShowPopup(true);
  };

  // ✅ Handler for Delete Account
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
        {/* Left Side: Icon & Label */}
        <div className="flex flex-row items-center gap-3">
          <span className="text-[#C69DE6] text-lg">{icon}</span>
          <div className="flex flex-col">
            {/* Label */}
            <span
              className={`text-gray-800 text-base ${
                isDelete ? "font-semibold" : ""
              }`}
            >
              {label}
            </span>

            {/* ✅ Show value underneath the label for stacked types (Email and Phone) */}
            {!isDelete && stacked && (
              editable ? (
                options ? (
                  // ✅ Dropdown for options (like Gender)
                  <select
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    className="text-gray-800 text-base border-b border-gray-400 focus:outline-none focus:border-blue-500"
                  >
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : type === "date" ? (
                  <input
                    type="date"
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    className="text-gray-800 text-base border-b border-gray-400 focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    className="text-gray-800 text-base border-b border-gray-400 focus:outline-none focus:border-blue-500"
                  />
                )
              ) : (
                <span
                  className={`text-gray-800 text-base ${
                    isBold && !noBoldValue ? "font-semibold" : ""
                  }`}
                >
                  {value}
                </span>
              )
            )}
          </div>
        </div>

        {/* ✅ Right Side: Value or Input */}
        <div className="flex flex-row items-center gap-1">
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
              editable ? (
                options ? (
                  // ✅ Dropdown on right side (if not underneath the label)
                  <select
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    className="text-gray-800 text-base border-b border-gray-400 focus:outline-none focus:border-blue-500"
                  >
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : type === "date" ? ( 
                  <input
                    type="date"
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    className="text-gray-800 text-base border-b border-gray-400 focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    className="text-gray-800 text-base border-b border-gray-400 focus:outline-none focus:border-blue-500"
                  />
                )
              ) : (
                <span
                  className={`text-gray-800 text-base ${
                    isBold && !noBoldValue ? "font-semibold" : ""
                  }`}
                >
                  {value}
                  {unit && <span className="ml-1">{unit}</span>}
                </span>
              )
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

          {/* ✅ Toggle Button */}
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

      {/* ✅ Popup */}
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
