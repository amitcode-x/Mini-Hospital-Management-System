import { useState } from "react";
import axiosClient from "../api/axios";

export default function SlotForm({ onCreated }) {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!date || !startTime || !endTime) {
      setError("All fields required");
      return;
    }

    try {
      await axiosClient.post("/doctors/my-slots/", {
        date,
        start_time: startTime,
        end_time: endTime,
      });

      setDate("");
      setStartTime("");
      setEndTime("");
      onCreated(); // reload slots
    } catch (err) {
      setError("Slot creation failed (duplicate or invalid time)");
    }
  };

  return (
    <div className="bg-white border rounded-2xl p-6 shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Create Availability Slot
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-medium transition"
        >
          Create Slot
        </button>
      </form>

      {error && (
        <p className="mt-4 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
