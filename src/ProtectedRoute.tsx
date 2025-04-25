import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, ApiRoute } from "./utils/APIService";
import { useUser } from "./GlobalContext.tsx";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser(); // grab user data from context
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      console.log("USER HAS AN ERROR:", user.error);

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
  const { user } = useUser(); // grab user data from context

  useEffect(() => {
    const checkUser = async () => {
      console.log("USER HAS AN ERROR:", user.error);
      try {
        await apiRequest<{ data: any }>("GET_USER" as ApiRoute);
        navigate("/");
      } catch (error: any) {
        console.log("Stay on Page");
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
