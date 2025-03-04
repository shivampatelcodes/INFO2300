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
  const [activeTab, setActiveTab] = useState("general"); // "profile", "account", "privacy", etc.
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

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/signin");
  };

  // Handlers for profile form changes and save
  const handleChange = (e) => {
    setDetails({
      ...details,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      try {
        await updateDoc(doc(db, "users", user.uid), {
          fullName: details.fullName,
          phone: details.phone,
          address: details.address,
        });
        alert("Profile updated successfully!");
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  // Render the content based on activeTab
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={details.fullName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={details.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={details.address}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Save Changes
              </button>
            </form>
          </div>
        );
      case "account":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
            <p>
              This section is under construction. (Add account-specific settings
              here.)
            </p>
          </div>
        );
      case "privacy":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Privacy</h2>
            <p>
              This section is under construction. (Add privacy-related settings
              here.)
            </p>
          </div>
        );
      default:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">General Settings</h2>
            <p>
              Select an option from the sidebar to view or edit your settings.
            </p>
          </div>
        );
    }
  };

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
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`text-left w-full text-blue-500 hover:underline block ${
                    activeTab === "profile" ? "font-bold" : ""
                  }`}
                >
                  Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("account")}
                  className={`text-left w-full text-blue-500 hover:underline block ${
                    activeTab === "account" ? "font-bold" : ""
                  }`}
                >
                  Account Settings
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("privacy")}
                  className={`text-left w-full text-blue-500 hover:underline block ${
                    activeTab === "privacy" ? "font-bold" : ""
                  }`}
                >
                  Privacy
                </button>
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
          {renderContent()}
        </section>
      </div>
    </div>
  );
};

export default Settings;
