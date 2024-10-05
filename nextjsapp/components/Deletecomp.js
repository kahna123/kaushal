// Deletecomp.js
import React, { useState } from 'react';
import axios from 'axios';

const Deletecomp = ({ isOpen, onClose, deleteEndpoint }) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            // Get the token from session storage
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            // Set up axios headers for authorization
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            // Make DELETE request using axios
            const response = await axios.delete(deleteEndpoint, config);

            if (response.status === 200) {
                onClose();
                window.location.reload()
            } else {
                throw new Error('Failed to delete');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Error deleting item: ' + error.message); // Notify the user of the error
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-5">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                    &times;
                </button>
                <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                <p>Are you sure you want to delete this user?</p>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 mr-2"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        className={`bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Deletecomp;
