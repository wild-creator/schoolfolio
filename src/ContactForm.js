import React, { useState, useEffect } from "react";
import "./ContactForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

const ContactForm = ({ onClose, onSubmit, departments, contact }) => {
  const [formState, setFormState] = useState({
    fullName: "",
    email: "",
    message: "",
    department: "",
    matricNumber: "",
    picture: "",
  });
  const [err, setError] = useState("");

  useEffect(() => {
    if (contact) {
      setFormState(contact);
    }
  }, [contact]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "picture") {
      console.log(files[0]);
      setFormState((prevState) => ({
        ...prevState,
        picture: files[0],
      }));
    } else {
      setFormState({ ...formState, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formState).forEach((key) => {
      data.append(key, formState[key]);
    });
    try {
      onSubmit(formState);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="contact-form-overlay">
      <div className="contact-form-container">
        <button className="close-button" onClick={onClose}>
          <FontAwesomeIcon icon={faClose} />
        </button>
        <form onSubmit={handleSubmit}>
          <h2>{!contact ? "Create Contact" : "Edit Contact"}</h2>
          <input
            type="text"
            name="fullName"
            value={formState.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />
          <input
            type="email"
            name="email"
            value={formState.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <textarea
            name="message"
            value={formState.message}
            onChange={handleChange}
            placeholder="Type in your message"
            required
          />
          <select
            name="department"
            value={formState.department}
            onChange={handleChange}
            required
          >
            <option value="">Select a department</option>
            {departments.map((dept) => (
              <option key={dept.value} value={dept.value}>
                {dept.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="matricNumber"
            value={formState.matricNumber}
            onChange={handleChange}
            placeholder="Matric Number"
            required
          />
          <label>Upload picture:</label>
          {err && <div>Error: {err}</div>}
          <input type="file" name="picture" onChange={handleChange} />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;