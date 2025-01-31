// src/App.tsx

import React from "react";
import "./App.css";
import { useAuthenticator } from "@aws-amplify/ui-react";

const App: React.FC = () => {
  const { signOut } = useAuthenticator();
  return (
    <div className="container">
      <h1 className="spinning-title rainbow_text_animated">
        AWS Health Dashboard
      </h1>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
};

export default App;
