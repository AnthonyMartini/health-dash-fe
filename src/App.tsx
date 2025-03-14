import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import WorkoutPlan from "./pages/WorkoutPlan";
//import { fetchAuthSession } from "aws-amplify/auth";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Routes with Sidebar */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />}></Route>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="workout-plan" element={<WorkoutPlan />} />
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

// src/App.tsx
