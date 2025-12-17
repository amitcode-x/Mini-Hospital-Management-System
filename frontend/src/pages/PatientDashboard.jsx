import { useEffect, useState } from "react";
import axiosClient from "../api/axios";
import { useAuth } from "../context/AuthContext";
import SlotList from "../components/SlotList";
import GoogleConnectButton from "../components/GoogleConnectButton";

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSlots = async () => {
    try {
      const res = await axiosClient.get("/doctors/available-slots/");
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
            Patient Dashboard
          </h2>
          <p className="text-gray-600 mt-1">
            Welcome, <span className="font-semibold">{user.username}</span>
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

      {/* Appointments Section */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Available Appointments
        </h3>

        {loading && (
          <p className="text-gray-500">Loading available slots...</p>
        )}

        {!loading && slots.length === 0 && (
          <p className="text-gray-500">
            No available slots right now.
          </p>
        )}

        {!loading && slots.length > 0 && (
          <SlotList slots={slots} onBooked={loadSlots} />
        )}
      </div>
    </div>
  );
}
