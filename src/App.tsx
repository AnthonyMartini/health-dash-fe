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
        {/* Use Layout to wrap the main routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="workout-plan" element={<WorkoutPlan />} />
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

// src/App.tsx
