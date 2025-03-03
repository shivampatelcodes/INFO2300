/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, addDoc, query, where, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import { app } from "../firebaseConfig";
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import ConfirmationModal from '../components/ConfirmationModal';

const auth = getAuth(app);
const db = getFirestore(app);

const DriverDashboard = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [tripDetails, setTripDetails] = useState({ origin: "", destination: "", date: "", seats: "", driverName: "", driverMobile: "" });
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setEmail(userData.email);
          setRole(userData.role);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handlePostTrip = async () => {
    const { origin, destination, date, seats, driverName, driverMobile } = tripDetails;
    if (!origin || !destination || !date || !seats || !driverName || !driverMobile) {
      setModalMessage("Please fill out all fields before posting the trip.");
      setIsModalOpen(true);
      return;
    }

    try {
      await addDoc(collection(db, "rides"), {
        ...tripDetails,
        driverId: auth.currentUser.uid,
        driverEmail: auth.currentUser.email,
        status: "available"
      });
      setModalMessage("Trip posted successfully!");
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error posting trip: ", error);
      setModalMessage("Error posting trip. Please try again.");
      setIsModalOpen(true);
    }
  };

  const fetchBookings = async () => {
    try {
      const q = query(collection(db, "bookings"), where("driverId", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const bookingsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(bookingsData);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleAcceptBooking = (bookingId) => {
    setSelectedBookingId(bookingId);
    setConfirmationAction('accept');
    setIsConfirmationModalOpen(true);
  };

  const handleRejectBooking = (bookingId) => {
    setSelectedBookingId(bookingId);
    setConfirmationAction('reject');
    setIsConfirmationModalOpen(true);
  };

  const confirmAction = async () => {
    if (confirmationAction === 'accept') {
      try {
        const bookingRef = doc(db, "bookings", selectedBookingId);
        await updateDoc(bookingRef, { status: "Accepted" });
        setBookings(bookings.map(booking => booking.id === selectedBookingId ? { ...booking, status: "Accepted" } : booking));
        setIsConfirmationModalOpen(false);
      } catch (error) {
        console.error("Error accepting booking:", error);
      }
    } else if (confirmationAction === 'reject') {
      try {
        const bookingRef = doc(db, "bookings", selectedBookingId);
        await deleteDoc(bookingRef);
        setBookings(bookings.filter(booking => booking.id !== selectedBookingId));
        setIsConfirmationModalOpen(false);
      } catch (error) {
        console.error("Error rejecting booking:", error);
      }
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const userName = email.split('@')[0];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar role={role} setRole={setRole} />
      <main>
        <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 py-6 bg-white shadow sm:rounded-lg sm:px-10">
            <h2 className="text-2xl font-semibold text-gray-800">Welcome, {userName}!</h2>
            <p className="mt-4 text-gray-600">You are logged in as a <span className="font-bold">{role}</span>.</p>
            
            {/* Post Trips */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800">Post Trips</h3>
              <div className="mt-4 space-y-4">
                <input
                  type="text"
                  placeholder="Driver Name"
                  value={tripDetails.driverName}
                  onChange={(e) => setTripDetails({ ...tripDetails, driverName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Driver Mobile"
                  value={tripDetails.driverMobile}
                  onChange={(e) => setTripDetails({ ...tripDetails, driverMobile: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Origin"
                  value={tripDetails.origin}
                  onChange={(e) => setTripDetails({ ...tripDetails, origin: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Destination"
                  value={tripDetails.destination}
                  onChange={(e) => setTripDetails({ ...tripDetails, destination: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="date"
                  value={tripDetails.date}
                  onChange={(e) => setTripDetails({ ...tripDetails, date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Available Seats"
                  value={tripDetails.seats}
                  onChange={(e) => setTripDetails({ ...tripDetails, seats: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  onClick={handlePostTrip}
                  className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Post Trip
                </button>
              </div>
            </div>

            {/* Manage Bookings */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800">Manage Bookings</h3>
              <button
                onClick={fetchBookings}
                className="w-full px-4 py-2 mb-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Fetch Bookings
              </button>
              <div className="mt-4 space-y-4">
                {bookings.length > 0 ? (
                  bookings.map((booking, index) => (
                    <div key={index} className="p-4 bg-gray-100 rounded-md shadow-sm">
                      <p><strong>Passenger:</strong> {booking.passengerEmail}</p>
                      <p><strong>Ride:</strong> {booking.rideId}</p>
                      <p><strong>Status:</strong> {booking.status}</p>
                      {booking.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleAcceptBooking(booking.id)}
                            className="px-4 py-2 mt-2 mr-2 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectBooking(booking.id)}
                            className="px-4 py-2 mt-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No bookings found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={modalMessage}
      />
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={confirmAction}
        message={`Are you sure you want to ${confirmationAction} this booking?`}
      />
    </div>
  );
};

export default DriverDashboard;