import React from 'react';
import axios from 'axios';

const ContactList = ({ contacts, fetchContacts, setFormData, setEditIndex }) => {

    const handleDelete = async (contactId) => {
        try {
            await axios.delete(`http://localhost:5000/api/contacts/${contactId}`);
            fetchContacts();
        } catch (error) {
            console.error('Error deleting contact:', error);
            alert('Error deleting contact. Please try again.');
        }
    };

    const handleEdit = (index) => {
        setFormData(contacts[index]);
        setEditIndex(index);
    };

    return (
        <ul className="list-group mt-3">
            {contacts.map((contact, index) => (
                <li key={contact._id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        {contact.photo && (
                            <img src={`http://localhost:5000/${contact.photo}`} alt="Contact" className="img-thumbnail me-3" width="100" />
                        )}
                        <div>
                            <h5 className="mb-1">{contact.fullName}</h5>
                            <p className="mb-1">Matric Number: {contact.matricNumber}</p>
                            <p className="mb-1">Email: {contact.email}</p>
                            <p className="mb-1">Department: {contact.department}</p>
                            <p className="mb-1">Message: {contact.message}</p>
                        </div>
                    </div>
                    <div>
                        <button onClick={() => handleEdit(index)} className="btn btn-warning me-2">Edit</button>
                        <button onClick={() => handleDelete(contact._id)} className="btn btn-danger">Delete</button>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default ContactList;
