import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";

const auth = getAuth();
const db = getFirestore();

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({
    fullName: "",
    phone: "",
    address: "",
  });
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setDetails({
            fullName: data.fullName || "",
            phone: data.phone || "",
            address: data.address || "",
          });
          setRole(data.role || "");
        }
      }
      setLoading(false);
    };
    fetchUserDetails();
  }, []);

  const handleChange = (e) => {
    setDetails({
      ...details,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      try {
        await updateDoc(doc(db, "users", user.uid), details);
        navigate(role === "driver" ? "/driver-dashboard" : "/dashboard");
      } catch (error) {
        console.error("Error updating settings:", error);
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/signin");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar role={role} setRole={setRole} />
      <div className="max-w-7xl mx-auto px-4 py-6 lg:flex lg:space-x-6">
        {/* Sidebar */}
        <aside className="lg:w-1/4 mb-6 lg:mb-0">
          <div className="bg-white shadow rounded-md p-6">
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/profile"
                  className="text-blue-500 hover:underline block"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/account"
                  className="text-blue-500 hover:underline block"
                >
                  Account Settings
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-blue-500 hover:underline block"
                >
                  Privacy
                </Link>
              </li>
              {/* Add more links as needed */}
            </ul>
            <div className="mt-6">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>
        {/* Main Content */}
        <section className="lg:w-3/4 bg-white shadow rounded-md p-6">
          <h2 className="text-2xl font-bold mb-4">General Settings</h2>
          <p>
            Select an option from the sidebar to view or edit your settings.
          </p>
          {/* This area can be expanded for additional settings content */}
        </section>
      </div>
    </div>
  );
};

export default Settings;
