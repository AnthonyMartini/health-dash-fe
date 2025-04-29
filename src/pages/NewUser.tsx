import React, { useState } from "react";
import { apiService, ApiRoute } from "../utils/APIService";
import { useNavigate } from "react-router-dom";

/* ------------- DATA TYPES & MOCK ARRAYS ------------- */

/* ------------- MAIN PAGE ------------- */

const NewUserPage: React.FC = () => {
  const navigate = useNavigate();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div className="h-full w-full flex flex-col items-center p-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">
        Create User Profile
      </h1>

      <div className="p-4  rounded-lg shadow-md w-[400px] mx-auto bg-white">
        <label className="block mb-1 font-bold">Username</label>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={userDetails.username}
          onChange={handleChange}
          className="block w-full p-2 mb-2 border rounded"
        />
        <label className="block mb-1 font-bold">First Name</label>
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={userDetails.first_name}
          onChange={handleChange}
          className="block w-full p-2 mb-2 border rounded"
        />
        <label className="block mb-1 font-bold">Last Name</label>
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={userDetails.last_name}
          onChange={handleChange}
          className="block w-full p-2 mb-2 border rounded"
        />
        <label className="block mb-1 font-bold">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userDetails.email}
          onChange={handleChange}
          className="block w-full p-2 mb-2 border rounded"
        />
        <label className="block mb-1 font-bold">Phone #</label>
        <input
          type="text"
          name="phone"
          placeholder="+###########"
          value={userDetails.phone}
          onChange={handleChange}
          className="block w-full p-2 mb-2 border rounded"
        />
        <label className="block mb-1 font-bold">Height (cm)</label>
        <input
          type="number"
          name="height"
          placeholder="Height (cm)"
          value={userDetails.height}
          onChange={handleChange}
          className="block w-full p-2 mb-2 border rounded"
        />
        <label className="block mb-1 font-bold">Birthdate</label>
        <input
          type="date"
          title="date"
          name="date"
          value={userDetails.birthdate}
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
          value={userDetails.gender ? "Male" : "Female"}
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
              userDetails.birthdate === ""
            }
            className={`px-4 py-2 text-white rounded-full shadow-md transition ${
              !(
                userDetails.username === "" ||
                userDetails.first_name === "" ||
                userDetails.last_name === "" ||
                userDetails.email === "" ||
                userDetails.phone === "" ||
                userDetails.height === "" ||
                userDetails.birthdate === ""
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
