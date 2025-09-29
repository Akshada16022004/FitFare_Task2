import React, { useState } from "react";
import "./Modal.css";

const NotificationModal = ({ isOpen, onClose, onSubmit }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ message });
    setMessage("");
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Send Notification</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
          <div className="modal-buttons">
            <button type="submit" className="submit-btn">Send</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationModal;
