import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import WorkoutPlan from "./pages/WorkoutPlan";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Routes with Sidebar */}
        <Route path="/" element={<Layout showSideBar={true} />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="workout-plan" element={<WorkoutPlan />} />
          <Route path="*" element={<Dashboard />} />
        </Route>

        {/* Profile Route without Sidebar */}
        <Route path="profile" element={<Layout showSideBar={false} />}>
          <Route index element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

// src/App.tsx
