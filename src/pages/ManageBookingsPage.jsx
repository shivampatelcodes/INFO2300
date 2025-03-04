/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { app } from "../firebaseConfig";
import Navbar from "../components/Navbar";
import ConfirmationModal from "../components/ConfirmationModal";
import Modal from "../components/Modal";

const auth = getAuth(app);
const db = getFirestore(app);

const ManageBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

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

    const fetchBookingsWithRideDates = () => {
      const q = query(
        collection(db, "bookings"),
        where("driverId", "==", auth.currentUser.uid)
      );
      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        // Create an array of booking objects with ride date attached
        const bookingsData = await Promise.all(
          querySnapshot.docs.map(async (docSnap) => {
            const booking = { id: docSnap.id, ...docSnap.data() };
            // If date is not stored in booking, fetch it from rides collection
            if (!booking.date && booking.rideId) {
              const rideRef = doc(db, "rides", booking.rideId);
              const rideDoc = await getDoc(rideRef);
              if (rideDoc.exists()) {
                booking.date = rideDoc.data().date;
              }
            }
            return booking;
          })
        );
        setBookings(bookingsData);
        setLoading(false);
      });

      return unsubscribe;
    };

    fetchUserRole();
    const unsubscribe = fetchBookingsWithRideDates();

    return () => unsubscribe();
  }, []);

  const handleAcceptBooking = async (bookingId) => {
    try {
      const bookingRef = doc(db, "bookings", bookingId);
      await updateDoc(bookingRef, { status: "Accepted" });
      setModalMessage("Booking accepted!");
      setAcceptModalOpen(true);
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
      setBookings(
        bookings.filter((booking) => booking.id !== selectedBookingId)
      );
      setIsModalOpen(false);
      setModalMessage("Booking rejected and deleted!");
      setAcceptModalOpen(true);
    } catch (error) {
      console.error("Error rejecting booking:", error);
    }
  };

  const filteredBookings = filterDate
    ? bookings.filter((booking) => {
        // Parse the attached date field from rides collection
        const bookingDate = booking.date?.toDate
          ? booking.date.toDate().toISOString().split("T")[0]
          : booking.date && booking.date.seconds
          ? new Date(booking.date.seconds * 1000).toISOString().split("T")[0]
          : "";
        return bookingDate === filterDate;
      })
    : bookings;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar role={role} setRole={setRole} />
      <main>
        <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 py-6 bg-white shadow sm:rounded-lg sm:px-10">
            <h2 className="text-2xl font-semibold text-gray-800">
              Manage Bookings
            </h2>
            <div className="mt-4">
              <label
                htmlFor="filterDate"
                className="block text-sm font-medium text-gray-700"
              >
                Filter by Date
              </label>
              <input
                type="date"
                id="filterDate"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="mt-4 space-y-4">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-100 rounded-md shadow-sm"
                  >
                    <p>
                      <strong>Passenger:</strong> {booking.passengerEmail}
                    </p>
                    <p>
                      <strong>Ride:</strong> {booking.rideId}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {(() => {
                        if (
                          booking.date &&
                          typeof booking.date.toDate === "function"
                        ) {
                          return booking.date.toDate().toLocaleDateString();
                        } else if (booking.date && booking.date.seconds) {
                          return new Date(
                            booking.date.seconds * 1000
                          ).toLocaleDateString();
                        } else if (typeof booking.date === "string") {
                          return new Date(booking.date).toLocaleDateString();
                        } else {
                          return "Invalid Date";
                        }
                      })()}
                    </p>
                    <p>
                      <strong>Status:</strong> {booking.status}
                    </p>
                    {booking.status !== "Accepted" && (
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
      </main>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmRejectBooking}
        message="Are you sure you want to reject and delete this booking?"
      />
      <Modal
        isOpen={acceptModalOpen}
        onClose={() => setAcceptModalOpen(false)}
        message={modalMessage}
      />
    </div>
  );
};

export default ManageBookingsPage;
