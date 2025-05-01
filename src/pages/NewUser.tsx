import React, { useState } from "react";
import { apiService, ApiRoute } from "../utils/APIService";
import { useNavigate } from "react-router-dom";

/* ------------- DATA TYPES & MOCK ARRAYS ------------- */

/* ------------- MAIN PAGE ------------- */

const NewUserPage: React.FC = () => {
  const navigate = useNavigate();

  // ✅ State for validation errors
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    birthdate: "",
    gender: true,
    height: "",
  });

  const validateEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailPattern =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|mil|co|io|info|biz|me)$/i;

    if (!emailPattern.test(e.target.value)) {
      setEmailError("Invalid email format.");
      return false;
    }
    handleChange({
      target: { name: e.target.name, value: e.target.value.toLowerCase() },
    } as React.ChangeEvent<HTMLInputElement>);
    setEmailError(null);
    return true;
  };

  // ✅ Phone validation and formatting function
  const validatePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ✅ Allow formats like: 1234567890, 123-456-7890, 123.456.7890, +1 (123) 456-7890
    const phonePattern = /^\+?[1-9]\d{1,14}$/;

    if (!phonePattern.test(e.target.value)) {
      setPhoneError("Invalid phone format.");
      return false;
    }
    handleChange(e);
    setPhoneError(null);
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div className="h-full w-full flex flex-col items-center p-4 overflow-y-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">
        Create User Profile
      </h1>

      <div className="p-4  rounded-lg shadow-md w-[400px] mx-auto bg-white">
        <label className="block mb-1 font-bold">Username</label>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="block w-full p-2 mb-2 border rounded"
        />

        <label className="block mb-1 font-bold">First Name</label>
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          onChange={handleChange}
          className="block w-full p-2 mb-2 border rounded"
        />
        <label className="block mb-1 font-bold">Last Name</label>
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          onChange={handleChange}
          className="block w-full p-2 mb-2 border rounded"
        />
        <label className="block mb-1 font-bold">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={validateEmail}
          className="block w-full p-2 mb-2 border rounded"
        />
        {emailError && (
          <p className="text-red-500 text-sm mb-2">{emailError}</p>
        )}
        <label className="block mb-1 font-bold">Phone #</label>
        <input
          type="text"
          name="phone"
          placeholder="+###########"
          onChange={validatePhone}
          className="block w-full p-2 mb-2 border rounded"
        />
        {phoneError && (
          <p className="text-red-500 text-sm mb-2">{phoneError}</p>
        )}
        <label className="block mb-1 font-bold">Height (cm)</label>
        <input
          type="number"
          name="height"
          placeholder="Height (cm)"
          onChange={handleChange}
          className="block w-full p-2 mb-2 border rounded"
        />
        <label className="block mb-1 font-bold">Birthdate</label>
        <input
          type="date"
          title="date"
          name="date"
          onChange={(e) =>
            setUserDetails({
              ...userDetails,
              birthdate: e.target.value,
            })
          }
          className="text-gray-800 text-base border-b border-gray-400 focus:outline-none focus:border-blue-500"
        />
        <label className="block mb-1 font-bold">Gender</label>
        <select
          title="gender"
          onChange={(e) =>
            setUserDetails({
              ...userDetails,
              gender: e.target.value === "Male",
            })
          }
          className="text-gray-800 text-base border-b border-gray-400 focus:outline-none focus:border-blue-500"
        >
          <option key={"Male"} value={"Male"}>
            Male
          </option>
          <option key={"Female"} value={"Female"}>
            Female
          </option>
        </select>

        <div className="flex justify-center w-full cursor-pointer">
          <button
            onClick={() => {
              async function sendData() {
                await apiService.request<{
                  nickname: string;
                  first_name: string;
                  last_name: string;
                  email: string;
                  phone: string;
                  birthdate: string;
                  gender: boolean;
                  height: number;
                }>("UPDATE_USER" as ApiRoute, {
                  body: {
                    nickname: userDetails.username,
                    first_name: userDetails.first_name,
                    last_name: userDetails.last_name,
                    email: userDetails.email,
                    phone: userDetails.phone,
                    birthdate: userDetails.birthdate,
                    gender: userDetails.gender,
                    height: Number(userDetails.height),
                  },
                });
              }
              sendData();
              navigate("/");
            }}
            disabled={
              userDetails.username === "" ||
              userDetails.first_name === "" ||
              userDetails.last_name === "" ||
              userDetails.email === "" ||
              userDetails.phone === "" ||
              userDetails.height === "" ||
              userDetails.birthdate === "" ||
              emailError !== null ||
              phoneError !== null
            }
            className={`px-4 py-2 text-white rounded-full shadow-md transition ${
              !(
                userDetails.username === "" ||
                userDetails.first_name === "" ||
                userDetails.last_name === "" ||
                userDetails.email === "" ||
                userDetails.phone === "" ||
                userDetails.height === "" ||
                userDetails.birthdate === "" ||
                emailError !== null ||
                phoneError !== null
              )
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Complete
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewUserPage;
