import { createContext, useContext, useEffect, useState } from "react";
import { apiService, ApiRoute } from "./utils/APIService";

interface UserAchievement {
  completed: boolean;
  progress?: number;
  date?: string;
  last_log_date?: string;
}

interface UserAchievements {
  [key: string]: UserAchievement;
}

export interface GetuserProps {
  PK: string;
  user_profile_picture_url: string;
  nickname: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birthdate: string;
  gender: boolean;
  height: string;
  weight: string;
  error: boolean;
  notification_subscription: boolean;
  achievements: UserAchievements;
}

type SetUserProps = {
  user_profile_picture_url: string;
  nickname: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birthdate: string;
  gender: boolean;
  height: string;
};
type UserContextType = {
  user: GetuserProps;
  updateUser: (user: SetUserProps) => void;
};

const UserContext = createContext<UserContextType>({
  user: {
    PK: "",
    user_profile_picture_url: "",
    nickname: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    birthdate: "",
    gender: true,
    height: "",
    weight: "",
    error: false,
    notification_subscription: false,
    achievements: {},
  },
  updateUser: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState({
    PK: "",
    user_profile_picture_url: "",
    nickname: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    birthdate: "",
    gender: true,
    height: "",
    weight: "",
    error: false,
    notification_subscription: false,
    achievements: {},
  });

  const updateUser = (user: SetUserProps) => {
    setUser((prev) => {
      return { ...prev, ...user };
    });
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await apiService.request<{ data: any }>(
          "GET_USER" as ApiRoute
        );
        console.log("Fetched user data:", response);

        const userData = response.data;
        setUser({ ...userData, error: false });
      } catch (error: any) {
        if (error.message === "404") {
          setUser({
            error: true,
            PK: "",
            user_profile_picture_url: "",
            nickname: "",
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            birthdate: "",
            gender: true,
            height: "",
            weight: "",
            notification_subscription: false,
            achievements: {},
          });
        }
        console.error("Error fetching user data:", error);
      }
    };

    checkUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
