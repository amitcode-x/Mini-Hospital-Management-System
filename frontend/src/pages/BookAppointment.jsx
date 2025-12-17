import { useEffect, useState } from "react";
import axiosClient from "../api/axios";

export default function BookAppointment() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState(null);

  // Load available slots
  useEffect(() => {
    axiosClient
      .get("/api/doctors/available-slots/")
      .then((res) => {
        setSlots(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  // Book slot
  const bookSlot = async (slotId) => {
    try {
      const res = await axiosClient.post("/api/bookings/book/", {
        slot_id: slotId,
      });

      setBookingId(res.data.id);
      alert("✅ Appointment booked!\n📧 Email & 📅 Calendar updated");

      // Refresh slots list
      setSlots((prev) => prev.filter((s) => s.id !== slotId));
    } catch (err) {
      alert("❌ Slot already booked. Please refresh.");
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Loading available slots...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Book Appointment
        </h2>

        {slots.length === 0 && (
          <p className="text-gray-500">
            No slots available
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="border rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition"
            >
              <div className="space-y-1">
                <p className="text-gray-800 font-semibold">
                  👨‍⚕️ Dr. {slot.doctor}
                </p>
                <p className="text-gray-600 text-sm">
                  📅 {slot.date}
                </p>
                <p className="text-gray-600 text-sm">
                  ⏰ {slot.start_time} – {slot.end_time}
                </p>
              </div>

              <button
                onClick={() => bookSlot(slot.id)}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl font-medium transition"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>

        {bookingId && (
          <p className="mt-6 text-green-600 font-medium">
            ✅ Booking ID: {bookingId}
          </p>
        )}
      </div>
    </div>
  );
}
