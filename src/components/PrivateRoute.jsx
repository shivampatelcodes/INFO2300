import { Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { app } from "../firebaseConfig";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import PropTypes from 'prop-types';

const auth = getAuth(app);
const db = getFirestore(app);

const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      }
      setLoading(false);
    };

    fetchUserRole();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!auth.currentUser) {
    return <Navigate to="/signin" replace />;
  }

  if (userRole === "driver") {
    return <Navigate to="/driver-dashboard" replace />;
  }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;