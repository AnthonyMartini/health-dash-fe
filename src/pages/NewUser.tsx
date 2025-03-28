import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { apiRequest, ApiRoute } from "../utils/APIService";
import { useNavigate } from "react-router-dom";

/* ------------- DATA TYPES & MOCK ARRAYS ------------- */

/* ------------- MAIN PAGE ------------- */
interface userDetailsProps {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  height: number;
  weight: number;
}

const NewUserPage: React.FC = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState<userDetailsProps>({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    height: 0,
    weight: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]:
        e.target.name === "height" ? Number(e.target.value) : e.target.value,
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
        <label className="block mb-1 font-bold">Height (cm)</label>
        <input
          type="number"
          name="height"
          placeholder="Height (cm)"
          value={userDetails.height}
          onChange={handleChange}
          className="block w-full p-2 mb-2 border rounded"
        />
        <label className="block mb-1 font-bold">Weight (kg)</label>
        <input
          type="number"
          name="weight"
          placeholder="Weight (kg)"
          value={userDetails.weight}
          onChange={handleChange}
          className="block w-full p-2 mb-2 border rounded"
        />
        <div className="flex justify-center w-full">
          <button
            onClick={() => {
              async function sendData() {
                await apiRequest("UPDATE_USER" as ApiRoute, {
                  body: {
                    nickname: userDetails.username,
                    first_name: userDetails.first_name,
                    last_name: userDetails.last_name,
                    email: userDetails.email,
                    height: Number(userDetails.height),
                  },
                });
              }
              sendData();
              navigate("/");
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition"
          >
            Complete
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewUserPage;
