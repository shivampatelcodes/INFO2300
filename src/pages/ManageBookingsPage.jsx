/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, onSnapshot, updateDoc, doc, deleteDoc, getDoc } from "firebase/firestore";
import { app } from "../firebaseConfig";
import Navbar from '../components/Navbar';
import ConfirmationModal from '../components/ConfirmationModal';

const auth = getAuth(app);
const db = getFirestore(app);

const ManageBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        }
      }
    };

    const fetchBookings = () => {
      const q = query(collection(db, "bookings"), where("driverId", "==", auth.currentUser.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const bookingsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBookings(bookingsData);
        setLoading(false);
      });

      return unsubscribe;
    };

    fetchUserRole();
    const unsubscribe = fetchBookings();

    return () => unsubscribe();
  }, []);

  const handleAcceptBooking = async (bookingId) => {
    try {
      const bookingRef = doc(db, "bookings", bookingId);
      await updateDoc(bookingRef, { status: "Accepted" });
      alert("Booking accepted!");
    } catch (error) {
      console.error("Error accepting booking:", error);
    }
  };

  const handleRejectBooking = (bookingId) => {
    setSelectedBookingId(bookingId);
    setIsModalOpen(true);
  };

  const confirmRejectBooking = async () => {
    try {
      const bookingRef = doc(db, "bookings", selectedBookingId);
      await deleteDoc(bookingRef);
      setBookings(bookings.filter(booking => booking.id !== selectedBookingId));
      setIsModalOpen(false);
      alert("Booking rejected and deleted!");
    } catch (error) {
      console.error("Error rejecting booking:", error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar role={role} setRole={setRole} />
      <main>
        <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 py-6 bg-white shadow sm:rounded-lg sm:px-10">
            <h2 className="text-2xl font-semibold text-gray-800">Manage Bookings</h2>
            <div className="mt-4 space-y-4">
              {bookings.length > 0 ? (
                bookings.map((booking, index) => (
                  <div key={index} className="p-4 bg-gray-100 rounded-md shadow-sm">
                    <p><strong>Passenger:</strong> {booking.passengerEmail}</p>
                    <p><strong>Ride:</strong> {booking.rideId}</p>
                    <p><strong>Status:</strong> {booking.status}</p>
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
                  </div>
                ))
              ) : (
                <p>No bookings found.</p>
              )}
            </div>
          </div>
        </div>
      </main>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmRejectBooking}
        message="Are you sure you want to reject and delete this booking?"
      />
    </div>
  );
};

export default ManageBookingsPage;