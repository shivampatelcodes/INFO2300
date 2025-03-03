import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import SignUp from "./pages/Register";
import SignIn from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SearchResults from "./pages/SearchResults";
import DriverDashboard from "./pages/DriverDashboard";
import BookingPage from "./pages/BookingPage";
import ManageBookingsPage from "./pages/ManageBookingsPage";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/search-results"
          element={
            <PrivateRoute>
              <SearchResults />
            </PrivateRoute>
          }
        />
        <Route
          path="/driver-dashboard"
          element={
            // <PrivateRoute>
              <DriverDashboard />
            // </PrivateRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <PrivateRoute>
              <BookingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-bookings"
          element={
            <PrivateRoute>
              <ManageBookingsPage />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
