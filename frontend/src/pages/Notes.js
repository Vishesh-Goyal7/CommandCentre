import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../config";
import "../styles/Notes.css";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [textNote, setTextNote] = useState("");
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const token = sessionStorage.getItem("token");

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const res = await axios.get(`${BASE_URL}/notes`, { headers });
    setNotes(res.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${BASE_URL}/notes/${id}`, { headers });
    fetchNotes();
  };

  const handleEdit = async (note) => {
    const newTitle = prompt("Edit note title:", note.title);
    if (!newTitle) return;
    const newContent = prompt("Edit note content:", note.content);
    if (!newContent) return;

    await axios.put(`${BASE_URL}/notes/${note._id}`, {
      title: newTitle,
      content: newContent,
      type: note.type
    }, { headers });

    fetchNotes();
  };

  const handleTextSubmit = async () => {
    if (!textNote.trim()) return;

    const title = prompt("Enter title for this text note:");
    if (!title) return;

    await axios.post(`${BASE_URL}/notes`, {
      title,
      content: textNote,
      type: "text"
    }, { headers });

    setTextNote("");
    fetchNotes();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const title = prompt("Enter title for this image note:");
    if (!title) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", "image");
    formData.append("image", file);

    await axios.post(`${BASE_URL}/notes`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    fetchNotes();
  };

  return (
    <div className="notes-page">
      {notes.map(note => (
        <div className="note-card breathing-card" key={note._id}>
          <div className="note-header">
            <div>
              <h4>{note.title}</h4>
              <span>{new Date(note.createdAt).toLocaleString()}</span>
            </div>
            <div className="note-actions">
              <button onClick={() => handleEdit(note)}>✏️</button>
              <button onClick={() => handleDelete(note._id)}>🗑️</button>
            </div>
          </div>
          <div className="note-body">
            {note.type === "text" ? (
              <p>{note.content}</p>
            ) : (
              <img
                src={note.content}
                alt={note.title}
                onClick={() => setFullscreenImage(note.content)}
              />
            )}
          </div>
        </div>
      ))}

      <div className="note-footer">
        <input
          type="text"
          placeholder="Type something..."
          value={textNote}
          onChange={(e) => setTextNote(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
        />
        <label className="upload-btn">
          📎
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageUpload}
          />
        </label>
        <button onClick={handleTextSubmit}>➤</button>
      </div>

      {fullscreenImage && (
        <div className="fullscreen-modal" onClick={() => setFullscreenImage(null)}>
          <img src={fullscreenImage} alt="fullscreen" />
        </div>
      )}
    </div>
  );
};

export default Notes;
