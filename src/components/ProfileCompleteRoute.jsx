import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { Navigate, useLocation } from "react-router-dom";
import { app } from "../firebaseConfig";

const auth = getAuth(app);
const db = getFirestore(app);

const ProfileCompleteRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.fullName && data.phone && data.address) {
            setProfileComplete(true);
          }
        }
      }
      setLoading(false);
    };
    checkProfile();
  }, []);

  if (loading) return <div>Loading...</div>;

  // If already on settings page, render the settings to avoid redirect loop
  if (location.pathname === "/settings") return children;

  if (!profileComplete) {
    return <Navigate to="/settings" replace />;
  }

  return children;
};

ProfileCompleteRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProfileCompleteRoute;
