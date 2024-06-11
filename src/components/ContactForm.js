import React, { useState } from 'react';
import axios from 'axios';

const ContactForm = ({ fetchContacts, formData, setFormData, editIndex, setEditIndex }) => {
    const initialFormState = {
        fullName: '',
        matricNumber: '',
        email: '',
        message: '',
        department: '',
        photo: null
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (event) => {
        setFormData({ ...formData, photo: event.target.files[0] });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });

        try {
            if (editIndex === -1) {
                await axios.post('http://localhost:5000/api/contacts', data);
            } else {
                await axios.put(`http://localhost:5000/api/contacts/${formData._id}`, data);
                setEditIndex(-1);
            }
            setFormData(initialFormState);
            fetchContacts();
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting form. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-group p-3 border rounded">
            <h3 className="mb-3">{editIndex === -1 ? 'Add Contact' : 'Edit Contact'}</h3>
            <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input type="text" name="fullName" className="form-control" value={formData.fullName} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
                <label className="form-label">Matric Number</label>
                <input type="text" name="matricNumber" className="form-control" value={formData.matricNumber} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" name="email" className="form-control" value={formData.email} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea name="message" className="form-control" value={formData.message} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
                <label className="form-label">Department</label>
                <input type="text" name="department" className="form-control" value={formData.department} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
                <label className="form-label">Photo</label>
                <input type="file" name="photo" className="form-control" onChange={handleFileChange} />
            </div>
            <button type="submit" className="btn btn-primary">{editIndex === -1 ? 'Submit' : 'Update'}</button>
        </form>
    );
};

export default ContactForm;
