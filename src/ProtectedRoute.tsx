import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, ApiRoute } from "./utils/APIService";
import { setStoredUserInfo } from "./utils/authUtils";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      let userData = null;
      try {
        userData = await apiRequest<{ data: any }>("GET_USER" as ApiRoute);
      } catch (error: any) {
        if (error.message === "404") {
          navigate("/new-user");
        }
      } finally {
        if (userData) {
          setStoredUserInfo(userData); 
        }
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
};

export default ProtectedRoute;

const Redirect = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        await apiRequest<{ data: any }>("GET_USER" as ApiRoute);
      } catch (error: any) {
        if (error.message !== "404") {
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
};

export { Redirect };
