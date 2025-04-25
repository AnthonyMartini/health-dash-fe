// Get user info from localStorage
export const getStoredUserInfo = () => {
    const raw = localStorage.getItem("userInfo");
    return raw ? JSON.parse(raw) : null;
  };
  
  // Set user info in localStorage
  export const setStoredUserInfo = (user: any) => {
    localStorage.setItem("userInfo", JSON.stringify(user));
  };
  
  // Clear user info from localStorage
  export const clearStoredUserInfo = () => {
    localStorage.removeItem("userInfo");
  };
  