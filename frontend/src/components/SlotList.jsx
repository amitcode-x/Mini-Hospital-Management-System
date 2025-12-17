import axiosClient from "../api/axios";

export default function SlotList({ slots, onBooked }) {
  const handleBook = async (slotId) => {
    try {
      await axiosClient.post("/bookings/book/", {
        slot_id: slotId,
      });

      alert("Appointment booked successfully!");
      onBooked(); // reload slots
    } catch (err) {
      alert("Slot already booked or error occurred");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {slots.map((slot) => (
        <div
          key={slot.id}
          className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
        >
          <div className="space-y-1">
            <p className="text-gray-800 font-semibold">
              📅 {slot.date}
            </p>
            <p className="text-gray-600 text-sm">
              ⏰ {slot.start_time} - {slot.end_time}
            </p>
            <p className="text-gray-600 text-sm">
              👨‍⚕️ Doctor ID: {slot.doctor}
            </p>
          </div>

          <button
            onClick={() => handleBook(slot.id)}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl font-medium transition"
          >
            Book Appointment
          </button>
        </div>
      ))}
    </div>
  );
}
