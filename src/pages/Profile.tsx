import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaRegIdCard,
  FaLock,
  FaPencilAlt,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { AiFillPhone } from "react-icons/ai";
import { BiCalendar, BiMaleFemale } from "react-icons/bi";
import { GiBodyHeight, GiWeight } from "react-icons/gi";
import { IoIosWarning } from "react-icons/io";
//import { HiThumbUp } from "react-icons/hi";
import DefaultAvatar from "../assets/defaultAvatar.png";
import { apiRequest, ApiRoute } from "../utils/APIService";

import { useUser } from "../GlobalContext.tsx";

// === Public VAPID key ===
const VAPID_PUBLIC_KEY =
  "BPE1_Y7s1jfjaSt06dNqIkD7LrzdWdyU2lK6NFoW8cAkk74NcAFpRPrT3yEA4bihIGgH6zAQLJkj3t_mC6jxZRs";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUser(); // grab user data from context

  // State for toggles
  const [notificationToggle, setNotificationToggle] = useState(
    user.notification_subscription
  );
  // State for editing
  const [isEditing, setIsEditing] = useState(false);

  // ✅ State for user data
  const [profilePicture, setProfilePicture] = useState<string>(
    user.user_profile_picture_url || "https://www.google.com"
  );

  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [username, setUsername] = useState<string | null>(user.nickname);
  const [firstName, setFirstName] = useState<string | null>(user.first_name);
  const [lastName, setLastName] = useState<string | null>(user.last_name);
  const [email, setEmail] = useState<string | null>(user.email);
  const [phone, setPhone] = useState<string | null>(user.phone);
  const [birthDate, setBirthDate] = useState<string | null>(user.birthdate);
  const [gender, setGender] = useState<string | null>(
    user.gender ? "Male" : "Female"
  );
  const [height, setHeight] = useState<string | null>(user.height);
  const weight = user.weight;

  const fetchUserData = () => {
    setProfilePicture(user.user_profile_picture_url);
    setUsername(user.nickname);
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setEmail(user.email);
    setPhone(user.phone);
    setBirthDate(user.birthdate);
    setGender(user.gender ? "Male" : "Female");
    setHeight(user.height);
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  // ✅ State for validation errors
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [heightError, setHeightError] = useState<string | null>(null);

  // State for popups
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // ✅ Email validation function
  const validateEmail = (value: string) => {
    const emailPattern =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|mil|co|io|info|biz|me)$/;
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
    const phonePattern =
      /^\+?1?\s?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/;

    // ✅ Remove non-numeric characters except the leading '+'
    const cleanedValue = value.replace(/[^\d+]/g, "");

    if (cleanedValue.length === 10) {
      // ✅ Format into +1 (XXX) XXX-XXXX if it's exactly 10 digits
      const formattedPhone = `+1 (${cleanedValue.slice(
        0,
        3
      )}) ${cleanedValue.slice(3, 6)}-${cleanedValue.slice(6)}`;
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
      setHeightError(
        "Invalid height format. Numeric input to one decimal place allowed."
      );
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
        return (parseFloat(weight) / (heightInMeters * heightInMeters)).toFixed(
          1
        );
      }
    }
    return "N/A";
  };

  // Replace this with actual image upload logic (e.g. S3, backend)
  const uploadImageToServer = async (file: File): Promise<string> => {
    try {
      // Step 1: Get presigned URL from backend via centralized API request
      const { uploadUrl, fileUrl } = await apiRequest("UPLOAD_PFP", {
        queryParams: { fileType: file.type },
      });

      // Step 2: Upload directly to S3 using presigned URL
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload image to S3");
      }

      return fileUrl;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
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

        let uploadedImageUrl = profilePicture; // fallback to existing

        // ✅ If a new profile image is selected, upload it
        if (newProfileImage) {
          console.log("Uploading new profile image...");
          uploadedImageUrl = await uploadImageToServer(newProfileImage); // replace with your own logic
          console.log("Uploaded Image URL:", uploadedImageUrl);
        }

        // ✅ Build request body
        const updatedUserData = {
          nickname: username || "",
          user_profile_picture_url: uploadedImageUrl || "",
          email: email || "",
          phone: phone || "",
          birthdate: birthDate || "",
          gender: gender === "Male" ? true : false,
          height: height ? parseFloat(height) : 0,
          first_name: firstName || "",
          last_name: lastName || "",
        };

        console.log("Request Body:", updatedUserData);

        // Updates the global context of user data
        updateUser({
          ...updatedUserData,
          height: height || "0",
        });
        setNewProfileImage(null); // Clear temp image

        // ✅ API call
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
    fetchUserData();
  };

  const handleToggleNotification = async () => {
    const toggled = !notificationToggle;
    setNotificationToggle(toggled);
    console.log("🔔 Notification toggle state changed to:", toggled);

    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        console.log("📱 Checking service worker registration...");
        const reg = await navigator.serviceWorker.register("/worker.js");
        console.log("✅ Service Worker registered:", reg);

        let subscription = await reg.pushManager.getSubscription();
        console.log("📡 Current subscription:", subscription);

        if (toggled) {
          if (!subscription) {
            console.log("🆕 Creating new push subscription...");
            subscription = await reg.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });
            console.log("✅ New Push Subscription created:", subscription);

            const device = /Mobi|Android/i.test(navigator.userAgent)
              ? "mobile"
              : "desktop";

            const browser = (() => {
              if (navigator.userAgent.includes("Chrome")) return "chrome";
              if (navigator.userAgent.includes("Firefox")) return "firefox";
              if (navigator.userAgent.includes("Safari")) return "safari";
              return "unknown";
            })();

            console.log("📤 Sending subscription to backend...");
            const response = await apiRequest("SUBSCRIBE_NOTIFICATION", {
              body: { subscription, device, browser },
            });
            console.log("✅ Backend response:", response);
          } else {
            console.log("ℹ️ Subscription already exists");
          }
        } else {
          console.log("🔴 Unsubscribing from notifications...");
          if (subscription) {
            await subscription.unsubscribe();
            console.log("✅ Push subscription removed from browser");

            await apiRequest("UNSUBSCRIBE_NOTIFICATION", {
              body: { device: "desktop", browser: "chrome" },
            });
            console.log("✅ Push subscription removed from backend");
          }
        }
      } catch (err) {
        console.error("❌ Push subscription error:", err);
      }
    } else {
      console.log("⚠️ Push notifications are not supported in this browser.");
    }
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
          {isEditing ? (
            <label
              htmlFor="profile-upload"
              className="cursor-pointer relative group"
            >
              <img
                src={
                  newProfileImage
                    ? URL.createObjectURL(newProfileImage)
                    : profilePicture || DefaultAvatar
                }
                alt="Profile"
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-2 border-gray-300 group-hover:border-blue-500 transition"
              />
              <input
                type="file"
                id="profile-upload"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setNewProfileImage(file);
                }}
                className="hidden"
              />
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition">
                Change
              </span>
            </label>
          ) : (
            <img
              src={profilePicture || DefaultAvatar}
              alt="Profile"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
            />
          )}

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
                  title="Set Username"
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
            <DataRow
              icon={<FaRegIdCard />}
              label="User ID"
              value={user.PK || ""}
              isBold
            />
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
              isBold
              type="email"
            />
            <DataRow
              icon={<MdEmail />}
              label="Push Notification"
              value={""}
              onChange={setEmail}
              isBold
              onToggle={handleToggleNotification}
              toggle={notificationToggle}
            />
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
            <DataRow
              icon={<AiFillPhone />}
              label="Phone"
              value={phone || ""}
              onChange={setPhone}
              editable={isEditing}
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
            {heightError && (
              <p className="text-red-500 text-sm">{heightError}</p>
            )}
            <DataRow
              icon={<GiWeight />}
              label="Weight"
              value={weight || ""}
              type="number"
              isBold
              unit="kg"
            />
            <DataRow
              icon={<GiWeight />}
              label="BMI"
              value={calculateBMI()}
              isBold
            />
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

/*
const AchievementsSection: React.FC = () => {
  return (
    <div className="mt-10 w-full">
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
        Achievements
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
        {Array.from({ length: 15 }).map((_, index) => (
          <AchievementCard
            key={index}
            title="Yay"
            icon={<HiThumbUp className="text-yellow-400 text-2xl" />}
          />
        ))}
      </div>
    </div>
  );
};


// 🏆 Individual Achievement Card
const AchievementCard: React.FC<{ title: string; icon: React.ReactNode }> = ({
  title,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center bg-[rgba(239,240,240,0.3)] rounded-lg w-40 h-24 p-4">
      {icon}
      <span className="text-sm font-medium mt-2">{title}</span>
    </div>
  );
};
*/
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
  type?: "text" | "number" | "date" | "email";
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
  type = "text",
  isPassword = false,
  isDelete = false,
  stacked = false,
  isBold = false,
  noBoldValue = false,
  editable = false,
  onChange,
  toggle,
  onToggle,
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
    console.log(
      `${popupMessage.includes("reset") ? "Password reset" : "Account deleted"}`
    );
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
            {!isDelete &&
              stacked &&
              (editable ? (
                options ? (
                  // ✅ Dropdown for options (like Gender)
                  <select
                    title="Select Options"
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
                    title="Select Date"
                    type="date"
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    className="text-gray-800 text-base border-b border-gray-400 focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <input
                    title="Set Value"
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
              ))}
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
                    title="Select Options"
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
                    title="Select Date"
                    type="date"
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    className="text-gray-800 text-base border-b border-gray-400 focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <input
                    title="Set Value"
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
