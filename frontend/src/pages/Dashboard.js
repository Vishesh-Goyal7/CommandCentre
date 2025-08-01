import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../config';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [note, setNote] = useState(null);
  const [event, setEvent] = useState(null);
  const [project, setProject] = useState(null);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };

    axios.get(`${BASE_URL}/notes`, { headers }).then(res => {
      const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      if (sorted.length) setNote(sorted[0]);
    });

    axios.get(`${BASE_URL}/events`, { headers }).then(res => {
      const sorted = res.data.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
      if (sorted.length) setEvent(sorted[0]);
    });

    axios.get(`${BASE_URL}/projects`, { headers }).then(res => {
      const sorted = res.data.sort((a, b) => new Date(a.nextDeadline) - new Date(b.nextDeadline));
      if (sorted.length) setProject(sorted[0]);
    });
  }, [token]);

  return (
    <div className="dashboard-container">
      <div className="row">
        <div className="card" onClick={() => navigate("/notes")}>
          <h3>Notes</h3>
          <p>{note ? truncate(note.title) : "No notes found."}</p>
        </div>
        <div className="card" onClick={() => navigate("/events")}>
          <h3>Events</h3>
          <p>{event ? truncate(event.title) : "No events scheduled."}</p>
        </div>
      </div>
      <div className="card full-width" onClick={() => navigate("/projects")}>
        <h3>Projects</h3>
        <p>{project ? truncate(project.name) : "No active projects."}</p>
      </div>
    </div>
  );
};

const truncate = (str, max = 40) => str.length > max ? str.slice(0, max) + "..." : str;

export default Dashboard;
