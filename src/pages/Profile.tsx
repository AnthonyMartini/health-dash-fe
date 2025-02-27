import React from "react";

interface ProfileProps {
  Page?: string;
  Goals?: object; //need shape?
}

const Profile: React.FC<ProfileProps> = ({}) => {
  return (
    <div className="h-[400px] w-[400px] p-2">
      <div>
        <h1 className="text-3xl font-bold h-[60px]">Profile Page</h1>
      </div>
    </div>
  );
};

export default Profile;
