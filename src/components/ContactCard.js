import React, { useState } from "react";
import "./ContactCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import defaultImage from "./user.jpg";

function ContactCard({ contact, onDelete, onEdit }) {
  const [displayFull, setDisplayFull] = useState(false);
  const slicedMessage = () => {
    if (contact.message.length > 200) {
      return !displayFull
        ? contact.message.slice(0, 201) +
            "..." +
            contact.message.slice(
              contact.message.length - 4,
              contact.message.length
            )
        : contact.message;
    } else {
      return contact.message;
    }
  };
  const sanitizedMessage = parse(DOMPurify.sanitize(slicedMessage()));
  return (
    <div className="contact-card">
      <div className="contact-header">
        <div className="contact-details">
          <div className="contact-avatar">
            <img
              src={
                contact.picture.trim() !== ""
                  ? `${contact.picture}`
                  : defaultImage
              }
              alt={contact.fullName}
            />
          </div>
          <div>
            <h2 className="contact-name">{contact.fullName}</h2>
            <p
              className="contact-message"
              title={
                contact.message.length > 200 ? "Expand message" : "Message"
              }
              onClick={() => {
                setDisplayFull((prev) => !prev);
              }}
            >
              {sanitizedMessage}
            </p>
            <p>
              <b style={{ fontWeight: 500 }}>Department: </b>
              <i>{contact.department}</i>
            </p>
            <p>
              <b style={{ fontWeight: 500 }}>Matric Number: </b>
              <i>{contact.matricNumber}</i>
            </p>
            <p>
              <b style={{ fontWeight: 500 }}>Email: </b>
              <i>{contact.email}</i>
            </p>
          </div>
        </div>
        <div className="contact-edit">
          <button className="edit-button" onClick={() => onEdit(contact)}>
            <FontAwesomeIcon
              icon={faEdit}
              style={{ fontSize: "13px", margin: "0 5px 0 0", padding: "none" }}
            />
            Edit
          </button>
          <button
            className="edit-button"
            style={{ background: "#dd3b3b" }}
            onClick={() => onDelete(contact._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContactCard;