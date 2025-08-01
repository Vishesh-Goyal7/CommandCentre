import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../config";
import "../styles/Projects.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newUpdate, setNewUpdate] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    team: "",
    problemStatement: "",
    nextDeadline: "",
    priority: "Mid"
  });
  const token = sessionStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await axios.get(`${BASE_URL}/projects`, { headers });
    setProjects(res.data);
  };

  const handleAddProject = async () => {
    await axios.post(`${BASE_URL}/projects`, { ...formData, isCompleted: false }, { headers });
    setFormData({ name: "", team: "", problemStatement: "", nextDeadline: "", priority: "Mid" });
    setShowModal(false);
    fetchProjects();
  };

  const handleMarkComplete = async (id) => {
    await axios.delete(`${BASE_URL}/projects/${id}`, { headers });
    fetchProjects();
  };

  const handleAddUpdate = async () => {
    if (!newUpdate.trim()) return;

    await axios.put(`${BASE_URL}/projects/${selectedProject._id}`, {
      statusUpdate: newUpdate
    }, { headers });

    setNewUpdate("");

    const res = await axios.get(`${BASE_URL}/projects`, { headers });
    setProjects(res.data);
    const updated = res.data.find(p => p._id === selectedProject._id);
    setSelectedProject(updated); 
  };

  const handleChangePriority = async (priority) => {
    await axios.put(`${BASE_URL}/projects/${selectedProject._id}`, {
      priority
    }, { headers });
    fetchProjects();
    setSelectedProject({ ...selectedProject, priority });
  };

  const getColorByPriority = (priority) => {
    switch (priority) {
      case "Very High": return "#e53935";
      case "High": return "#ff9800";
      case "Mid": return "#ffeb3b";
      case "Low": return "#aeea00";
      case "Very Low": return "#8bc34a";
      default: return "#B0BEC5";
    }
  };

  return (
    <div className="projects-page">
      <button className="new-project-btn" onClick={() => setShowModal(true)}>+ New Project</button>

      {projects.map((project) => (
        <div
          key={project._id}
          className="project-card"
          onClick={() => setSelectedProject(project)}
        >
          <div className="project-header" style={{ backgroundColor: getColorByPriority(project.priority) }}>
            <span className="project-title">{project.name}</span>
            <span className="project-deadline">
              {new Date(project.nextDeadline).toLocaleDateString()}
            </span>
          </div>
          <div className="project-body">
            <p><strong>Team:</strong> {project.team}</p>
            <p><strong>Problem:</strong> {project.problemStatement}</p>
            {project.isCompleted ? (
              <p className="complete-status">✔ Completed</p>
            ) : (
              <button className="complete-btn" onClick={(e) => {
                e.stopPropagation();
                handleMarkComplete(project._id);
              }}>Mark Completed</button>
            )}
          </div>
        </div>
      ))}

      {/* New Project Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Project</h3>
            {["name", "team", "problemStatement", "nextDeadline"].map(field => (
              <input
                key={field}
                type={field === "nextDeadline" ? "datetime-local" : "text"}
                placeholder={field}
                value={formData[field]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              />
            ))}
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="Very High">Very High</option>
              <option value="High">High</option>
              <option value="Mid">Mid</option>
              <option value="Low">Low</option>
              <option value="Very Low">Very Low</option>
            </select>
            <button onClick={handleAddProject}>Add Project</button>
          </div>
        </div>
      )}

      {/* Update Timeline Modal */}
      {selectedProject && (
        <div className="modal-backdrop" onClick={() => setSelectedProject(null)}>
          <div className="modal scroll-modal" onClick={(e) => e.stopPropagation()}>
            <div className="update-header">
              <h3>Updates – {selectedProject.name}</h3>
              <select value={selectedProject.priority} onChange={(e) => handleChangePriority(e.target.value)}>
                <option value="Very High">Very High</option>
                <option value="High">High</option>
                <option value="Mid">Mid</option>
                <option value="Low">Low</option>
                <option value="Very Low">Very Low</option>
              </select>
            </div>
            <div className="update-box">
              <input
                type="text"
                placeholder="Add new update..."
                value={newUpdate}
                onChange={(e) => setNewUpdate(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddUpdate()}
              />
              <button onClick={handleAddUpdate}>➤</button>
            </div>
            <div className="update-timeline">
              {Array.isArray(selectedProject.statusUpdate) &&
                [...selectedProject.statusUpdate].map((update, i, arr) => (
                  <div className="update-item" key={i}>
                    <div className={`dot ${i === 0 ? "active" : "inactive"}`}></div>
                    <p className={`update-text ${i === 0 ? "latest" : ""}`}>{update}</p>
                    {i < arr.length - 1 && <div className="line dotted" />}
                  </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
