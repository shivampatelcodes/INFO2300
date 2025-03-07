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
  const user = auth.currentUser;

  useEffect(() => {
    const checkProfile = async () => {
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
  }, [user]);

  if (loading) return <div>Loading...</div>;

  // Redirect to sign in if no user is detected.
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // If the profile isn't complete and we're not already on the settings page, redirect there.
  if (!profileComplete && location.pathname !== "/settings") {
    return <Navigate to="/settings" replace />;
  }

  return children;
};

ProfileCompleteRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProfileCompleteRoute;
