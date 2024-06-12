import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';

const App = () => {
    const [contacts, setContacts] = useState([]);
    const [formData, setFormData] = useState({});
    const [editIndex, setEditIndex] = useState(-1);

    const fetchContacts = async () => {
        try {
            const response = await axios.get(`${window.location.origin}/api/user`);
            setContacts(response.data);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6">
                    <ContactForm fetchContacts={fetchContacts} formData={formData} setFormData={setFormData} editIndex={editIndex} setEditIndex={setEditIndex} />
                </div>
                <div className="col-md-6">
                    <ContactList contacts={contacts} fetchContacts={fetchContacts} setFormData={setFormData} setEditIndex={setEditIndex} />
                </div>
            </div>
        </div>
    );
};

export default App;
