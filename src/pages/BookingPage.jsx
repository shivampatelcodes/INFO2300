/* eslint-disable no-unused-vars */
import React from 'react';
import { useLocation } from 'react-router-dom';

const BookingPage = () => {
  const location = useLocation();
  const { bookings } = location.state || { bookings: [] };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Bookings</h2>
      <div className="space-y-4">
        {bookings.length > 0 ? (
          bookings.map((booking, index) => (
            <div key={index} className="p-4 bg-gray-100 rounded-md shadow-sm">
              <p><strong>Passenger:</strong> {booking.passengerEmail}</p>
              <p><strong>Trip Date:</strong> {booking.tripDate}</p>
              <p><strong>Pickup Location:</strong> {booking.pickupLocation}</p>
              <p><strong>Dropoff Location:</strong> {booking.dropoffLocation}</p>
            </div>
          ))
        ) : (
          <p>No bookings available.</p>
        )}
      </div>
    </div>
  );
};

export default BookingPage;