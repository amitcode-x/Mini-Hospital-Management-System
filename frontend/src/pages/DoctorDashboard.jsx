import { useEffect, useState } from "react";
import axiosClient from "../api/axios";
import { useAuth } from "../context/AuthContext";
import SlotForm from "../components/SlotForm";
import GoogleConnectButton from "../components/GoogleConnectButton";

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSlots = async () => {
    try {
      const res = await axiosClient.get("/doctors/my-slots/");
      setSlots(res.data);
    } catch (err) {
      console.log("Failed to load slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Doctor Dashboard
          </h2>
          <p className="text-gray-600 mt-1">
            Welcome Dr. <span className="font-semibold">{user.username}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <GoogleConnectButton />
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Slot Form */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Create Availability Slot
        </h3>
        <SlotForm onCreated={loadSlots} />
      </div>

      {/* Slots List */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          My Availability Slots
        </h3>

        {loading && (
          <p className="text-gray-500">Loading slots...</p>
        )}

        {!loading && slots.length === 0 && (
          <p className="text-gray-500">
            No slots created yet.
          </p>
        )}

        {!loading && slots.length > 0 && (
          <ul className="space-y-3">
            {slots.map((slot) => (
              <li
                key={slot.id}
                className="flex items-center justify-between p-4 border rounded-xl"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {slot.date}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {slot.start_time} - {slot.end_time}
                  </p>
                </div>

                {slot.is_booked ? (
                  <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-600 font-medium">
                    Booked
                  </span>
                ) : (
                  <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-600 font-medium">
                    Available
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
