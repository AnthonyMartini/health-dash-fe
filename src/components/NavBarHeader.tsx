import React, { useState, useEffect, useRef } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { IoIosNotifications } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import APPIconSVG from "../assets/AppIcon.svg";
import DefaultAvatar from "../assets/defaultAvatar.png";
import { useUser } from "../GlobalContext.tsx";
import { apiService, ApiRoute } from "../utils/APIService";
import { FaSpinner } from "react-icons/fa";
import { FaRegSquare, FaCheckSquare } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const MOTIVATIONAL_QUOTES = [
  "The only bad workout is the one that didn't happen. - Arnold Schwarzenegger",
  "Success starts with self-discipline. - Ronnie Coleman",
  "The body achieves what the mind believes. - Dorian Yates",
  "Pain is temporary. Quitting lasts forever. - Lance Armstrong",
  "The only way to define your limits is by going beyond them. - Arthur Jones",
  "Strength does not come from winning. Your struggles develop your strengths. - Arnold Schwarzenegger",
  "The difference between the impossible and the possible lies in a person's determination. - Tommy Lasorda",
  "The only person you are destined to become is the person you decide to be. - Ralph Waldo Emerson",
  "Your body can stand almost anything. It's your mind that you have to convince. - Andrew Murphy",
  "The secret of getting ahead is getting started. - Mark Twain",
  "You don't have to be extreme, just consistent. - Ronnie Coleman",
  "The only way to prove you are a good sport is to lose. - Ernie Banks",
  "The pain you feel today will be the strength you feel tomorrow. - Jay Cutler",
  "The only way to do great work is to love what you do. - Steve Jobs",
  "The difference between try and triumph is a little umph. - Marvin Phillips",
  "The only limit to our realization of tomorrow is our doubts of today. - Franklin D. Roosevelt",
  "The harder you work, the harder it is to surrender. - Vince Lombardi",
  "The only way to achieve the impossible is to believe it is possible. - Charles Kingsleigh",
  "Every champion was once a contender that refused to give up. - Rocky Balboa",
  "The difference between ordinary and extraordinary is that little extra. - Jimmy Johnson"
];

interface NavBarHeaderProps {
  logoText?: string;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
}

interface Notification {
  id: string;
  title: string;
  text: string;
  created_at: string;
}

const NavBarHeader: React.FC<NavBarHeaderProps> = ({
  //onNotificationClick = () => console.log("Notifications clicked"),
  onProfileClick = () => console.log("Profile clicked"),
}) => {
  const { user } = useUser(); // grab user data from context
  const navigate = useNavigate();
  const { signOut } = useAuthenticator();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");
  const notificationRef = useRef<HTMLDivElement>(null);
  const [hoveredGoal, setHoveredGoal] = useState<string | null>(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setCurrentQuote(MOTIVATIONAL_QUOTES[randomIndex]);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.request<{ 
          status: number;
          message: string;
          data: Notification[];
        }>("GET_NOTIFICATIONS" as ApiRoute);
        
        if (response.data) {
          setNotifications(response.data);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleDeleteNotification = async (notificationId: string, timestamp: string) => {
    try {
      await apiService.request("DELETE_NOTIFICATION" as ApiRoute, {
        queryParams: { timestamp }
      });
      // Update local state by removing only the specific notification
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => 
          !(notification.id === notificationId && notification.created_at === timestamp)
        )
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleToggleGoal = (goalTitle: string) => {
    // Implementation of handleToggleGoal
  };

  const handleDeleteGoal = (goalTitle: string) => {
    // Implementation of handleDeleteGoal
  };

  return (
    <div className="z-10 w-full h-[95px] p-6 flex items-center justify-between shadow-[0_2px_6px_rgba(13,26,38,0.15)] sticky top-0">
      <div className="flex items-center gap-8">
        <div
          className="flex gap-2 font-bold text-xl sm:text-2xl text-[#e61313] cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <img 
            src={APPIconSVG} 
            alt="My Icon" 
            className="w-[30px] sm:w-[50px] filter invert-[31%] sepia-[72%] saturate-[1804%] hue-rotate-[339deg] brightness-[92%] contrast-[94%]" 
          />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-300">Next Step Tracker</span>
        </div>
        <div className="hidden md:block">
          <div className="relative">
            <p className="text-sm italic leading-relaxed tracking-wide pl-2 pr-2 bg-gradient-to-r from-red-600 to-orange-300 bg-clip-text text-transparent">
              <span className="absolute -left-1 top-0 text-gray-300 text-xl">"</span>
              {currentQuote}
              <span className="absolute -right-1 top-0 text-gray-300 text-xl">"</span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="relative" ref={notificationRef}>
          <div className="relative">
            <IoIosNotifications 
              className="w-7 h-7 p-1 cursor-pointer hover:bg-gray-300 rounded-full" 
              onClick={handleNotificationClick}
            />
            {notifications.length > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            )}
          </div>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white shadow-[0_2px_6px_rgba(13,26,38,0.15)] rounded-lg max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <FaSpinner className="animate-spin text-gray-500 text-xl" />
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div 
                    key={`notification-${notification.id}`}
                    className="p-3 border-b border-gray-100 hover:bg-gray-50 group relative"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{notification.text}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteNotification(notification.id, notification.created_at)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-200 rounded-full"
                      >
                        <FaTrash className="text-red-500 w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No notifications
                </div>
              )}
            </div>
          )}
        </div>
        {/* Profile Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setShowProfileMenu(true)}
          onMouseLeave={() => setShowProfileMenu(false)}
        >
          <img
            src={user.user_profile_picture_url || DefaultAvatar}
            alt="Profile"
            className="w-11 h-11 cursor-pointer rounded-full hover:opacity-90"
            onClick={onProfileClick}
          />

          {showProfileMenu && (
            <div className="absolute right-0 w-30 bg-white shadow-[0_2px_6px_rgba(13,26,38,0.15)] rounded-lg">
              <p
                className="text-gray-700 cursor-pointer hover:bg-slate-200 px-3 h-[30px] flex items-center"
                onClick={() => navigate("/profile")}
              >
                Profile
              </p>
              <p
                className="text-red-500 cursor-pointer hover:bg-slate-200 px-3 h-[30px] flex items-center"
                onClick={signOut}
              >
                Logout
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBarHeader;