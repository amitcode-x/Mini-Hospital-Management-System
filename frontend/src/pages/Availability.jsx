import { useState, useEffect } from "react";
import axiosClient from "../api/axios";

export default function Availability() {
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({
    date: "",
    start_time: "",
    end_time: "",
  });

  useEffect(() => {
    axiosClient.get("/api/doctors/my-slots/")
      .then(res => setSlots(res.data));
  }, []);

  const addSlot = async () => {
    await axiosClient.post("/api/doctors/my-slots/", form);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Add Availability */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Add Availability
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="date"
              onChange={e =>
                setForm({ ...form, date: e.target.value })
              }
              className="px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <input
              type="time"
              onChange={e =>
                setForm({ ...form, start_time: e.target.value })
              }
              className="px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <input
              type="time"
              onChange={e =>
                setForm({ ...form, end_time: e.target.value })
              }
              className="px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <button
            onClick={addSlot}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-medium transition"
          >
            Add Slot
          </button>
        </div>

        {/* My Slots */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            My Slots
          </h3>

          {slots.length === 0 && (
            <p className="text-gray-500">
              No slots added yet.
            </p>
          )}

          <ul className="space-y-3">
            {slots.map(s => (
              <li
                key={s.id}
                className="flex justify-between items-center p-3 border rounded-xl"
              >
                <span className="font-medium text-gray-800">
                  {s.date}
                </span>
                <span className="text-gray-600 text-sm">
                  {s.start_time} – {s.end_time}
                </span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
