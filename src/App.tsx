import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import WorkoutPlan from "./pages/WorkoutPlan";
import ProtectedRoute, { Redirect } from "./ProtectedRoute";
import NewUserPage from "./pages/NewUser";
import { AchievementProvider } from "./AchievementContext";
import { ApiProvider } from "./components/ApiProvider";
import AchievementPopup from "./components/AchievementPopup";

const App: React.FC = () => {
  return (
    <Router>
      <AchievementProvider>
        <ApiProvider>
          <AchievementPopup />
      <Routes>
        {/* Routes with Sidebar */}
        <Route path="" element={<Layout />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workout-plan"
            element={
              <ProtectedRoute>
                <WorkoutPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/new-user"
            element={
              <Redirect>
                <NewUserPage />
              </Redirect>
            }
          />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
        </ApiProvider>
      </AchievementProvider>
    </Router>
  );
};

export default App;
