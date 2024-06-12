import React, { useState, useEffect } from "react";
import axios from "axios";
import ContactForm from "./ContactForm";
import ContactCard from "./ContactCard";
import "./App.css";

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editContact, setEditContact] = useState(null);
  const departments = [
    {
      label: "College of Engineering- Biomedical Engineering",
      value: "Biomedical Engineering",
    },
    {
      label: "College of Engineering- Computer Engineering",
      value: "Computer Engineering",
    },
    {
      label: "College of Engineering- Electrical / Electronics Engineering",
      value: "Electrical / Electronics Engineering",
    },
    {
      label: "College of Engineering- Mechanical Engineering",
      value: "Mechanical Engineering",
    },
    {
      label: "College of Engineering- Mechatronics Engineering",
      value: "Mechatronics Engineering",
    },
    {
      label: "College of Engineering- Telecommunications Engineering",
      value: "Telecommunications Engineering",
    },
    {
      label: "College of Environmental Sciences- Building Technology",
      value: "Building Technology",
    },
    {
      label: "College of Environmental Sciences- Quantity Surveying",
      value: "Quantity Surveying",
    },
    {
      label: "College of Environmental Sciences- Surveying and Geoinformatics",
      value: "Surveying and Geoinformatics",
    },
    {
      label: "College of Environmental Sciences- Urban and Regional Planning",
      value: "Urban and Regional Planning",
    },
    {
      label: "College of Environmental Sciences- Estate Management",
      value: "Estate Management",
    },
    {
      label: "College of Environmental Sciences- College of Food Science",
      value: "College of Food Science",
    },
    {
      label: "College of Environmental Sciences- Biotechnology",
      value: "Biotechnology",
    },
    {
      label: "College of Environmental Sciences- Food Technology",
      value: "Food Technology",
    },
    {
      label:
        "College of Environmental Sciences- Food Technology (Food Science with Business)",
      value: "Food Technology (Food Science with Business)",
    },
    {
      label: "College of Environmental Sciences- Nutrition and Dietetics",
      value: "Nutrition and Dietetics",
    },
    {
      label:
        "College of Environmental Sciences- Culinary Science and Hospitality Management",
      value: "Culinary Science and Hospitality Management",
    },
    {
      label:
        "College of Information and Communications Technology- Computer Science & Technology",
      value: "Computer Science & Technology",
    },
    {
      label:
        "College of Information and Communications Technology- Information Technology",
      value: "Information Technology",
    },
    {
      label: "College of Management Sciences- Accounting",
      value: "Accounting",
    },
    {
      label: "College of Management Sciences- Business Computing & IT",
      value: "Business Computing & IT",
    },
    {
      label: "College of Management Sciences- Economics",
      value: "Economics",
    },
    {
      label: "College of Management Sciences- Finance & Banking",
      value: "Finance & Banking",
    },
    {
      label: "College of Management Sciences- Human Resources Management",
      value: "Human Resources Management",
    },
    {
      label: "College of Management Sciences- International Business",
      value: "International Business",
    },
    {
      label: "College of Management Sciences- Marketing",
      value: "Marketing",
    },
    {
      label:
        "College of Management Sciences- Transport Management and Planning",
      value: "Transport Management and Planning",
    },
    {
      label: "College of Management Sciences- Project Management and Logistics",
      value: "Project Management and Logistics",
    },
    {
      label: "College of Natural & Applied Sciences- Microbiology",
      value: "Microbiology",
    },
    {
      label: "College of Natural & Applied Sciences- Industrial Chemistry",
      value: "Industrial Chemistry",
    },
    {
      label: "College of Natural & Applied Sciences- Biochemistry",
      value: "Biochemistry",
    },
    {
      label: "College of Natural & Applied Sciences- Physics with Electronics",
      value: "Physics with Electronics",
    },
    {
      label:
        "College of Natural & Applied Sciences- Applied Mathematics with Statistics",
      value: "Applied Mathematics with Statistics",
    },
  ];

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${window.location.origin}/api/user`);
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const handleFormSubmit = async (newContact) => {
    if (editContact) {
      await handleEdit(editContact._id, { ...editContact, ...newContact });
    } else {
      try {
        const response = await axios.post(
          `${window.location.origin}/api/user`,
          newContact,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setContacts((prevContacts) => [...prevContacts, response.data]);
        setShowForm(false);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
  };

  const handleEdit = async (id, updatedData) => {
    try {
      const response = await axios.put(
        `${window.location.origin}/api/user/${id}`,
        updatedData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact._id === id ? response.data : contact
        )
      );
      setEditContact(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error editing contact:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${window.location.origin}/api/user/${id}`);
      setContacts((prevContacts) =>
        prevContacts.filter((contact) => contact._id !== id)
      );
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const openForm = (contact = null) => {
    alert("Feel free to use HTML tags to make your contact card better");
    setEditContact(contact);
    setShowForm(true);
  };

  return (
    <div className="FormApp">
      <header className="FormApp-header">
        <h1>Contact Messages</h1>
        {contacts.length === 0 ? (
          <p>No contact messages</p>
        ) : (
          contacts.map((contact) => (
            <ContactCard
              key={contact._id}
              contact={contact}
              onEdit={() => openForm(contact)}
              onDelete={() => handleDelete(contact._id)}
            />
          ))
        )}
        <button className="create-button" onClick={() => openForm(null)}>
          Create Contact
        </button>
        {showForm && (
          <ContactForm
            onClose={() => setShowForm(false)}
            onSubmit={handleFormSubmit}
            departments={departments}
            contact={editContact}
          />
        )}
      </header>
    </div>
  );
};

export default App;
