import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../config";
import "../styles/Events.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newBrief, setNewBrief] = useState("");
  const [newDateTime, setNewDateTime] = useState("");
  const token = sessionStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await axios.get(`${BASE_URL}/events`, { headers });
    // Sort ascending so nearest event comes first
    const sorted = res.data.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    setEvents(sorted);
  };

  const handleCreate = async () => {
    if (!newTitle || !newDateTime) return;

    await axios.post(`${BASE_URL}/events`, {
      title: newTitle,
      brief: newBrief,
      dateTime: newDateTime
    }, { headers });

    setNewTitle(""); setNewBrief(""); setNewDateTime("");
    fetchEvents();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${BASE_URL}/events/${id}`, { headers });
    fetchEvents();
  };

  const handleEdit = async (event) => {
    const updatedTitle = prompt("Edit event title:", event.title);
    const updatedBrief = prompt("Edit event brief:", event.brief);
    const updatedDate = prompt("Edit event date/time:", event.dateTime);

    await axios.put(`${BASE_URL}/events/${event._id}`, {
      title: updatedTitle || event.title,
      brief: updatedBrief || event.brief,
      dateTime: updatedDate || event.dateTime
    }, { headers });

    fetchEvents();
  };

  return (
    <div className="events-page">
      {events.map((event) => (
        <div className="event-card breathing-card" key={event._id}>
          <div className="event-header">
            <h4>{event.title}</h4>
            <div className="event-actions">
              <button onClick={() => handleEdit(event)}>✏️</button>
              <button onClick={() => handleDelete(event._id)}>🗑️</button>
            </div>
          </div>
          <p className="event-brief">{event.brief}</p>
          <p className="event-datetime">
            {new Date(event.dateTime).toLocaleString()}
          </p>
        </div>
      ))}

      {/* Add new event */}
      <div className="event-footer">
        <input
          type="text"
          placeholder="Event title..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Brief note (optional)"
          value={newBrief}
          onChange={(e) => setNewBrief(e.target.value)}
        />
        <input
          type="datetime-local"
          value={newDateTime}
          onChange={(e) => setNewDateTime(e.target.value)}
        />
        <button onClick={handleCreate}>➕</button>
      </div>
    </div>
  );
};

export default Events;
