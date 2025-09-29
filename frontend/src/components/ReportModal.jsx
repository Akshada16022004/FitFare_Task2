import React, { useState } from "react";
import "./Modal.css";

const ReportModal = ({ isOpen, onClose, onSubmit }) => {
  const [reportType, setReportType] = useState("monthly");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ reportType });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Generate Report</h2>
        <form onSubmit={handleSubmit}>
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <div className="modal-buttons">
            <button type="submit" className="submit-btn">Generate</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
