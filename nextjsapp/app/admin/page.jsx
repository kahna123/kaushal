"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Trash2, Eye } from 'lucide-react'; // Import Lucide icons
import CallFor from '@/utilities/CallFor';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Deletecomp from '@/components/Deletecomp';
import GlobalPropperties from '@/utilities/GlobalPropperties';

const OrdersTable = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });
    const router = useRouter();

    const token = sessionStorage.getItem('token');
    
    // Fetch orders from the API
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await CallFor("orders", "get", null, "Auth");
                setOrders(response.data.orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    // Handle sorting
    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Sort orders based on the sortConfig
    const sortedOrders = React.useMemo(() => {
        let sortableOrders = [...orders];
        if (sortConfig.key) {
            sortableOrders.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableOrders;
    }, [orders, sortConfig]);

    // Handle search
    const filteredOrders = sortedOrders.filter(order => 
        order.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
        order.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle actions (edit, delete, view)
    const handleEdit = (orderId) => {
        router.push(`/admin/order/editorder/${orderId}`);
    };

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteEndpoint, setDeleteEndpoint] = useState('');

    const handleDeleteClick = (userId) => {
        setDeleteEndpoint(`${GlobalPropperties.localUrlParam}orders/${userId}`); // Adjust based on your API
        setIsDeleteOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteOpen(false);
        setDeleteEndpoint(''); // Reset the endpoint
    };

    const handleView = (orderId) => {
        router.push(`/admin/order/vieworder/${orderId}`);
    };

    // Download Excel function
    const handleDownloadExcel = async () => {
        axios.get('https://respo-umzu.onrender.com/api/orders/downloadexcel', {
            responseType: 'blob', // Important for downloading files
            headers: {
                'Authorization': `Bearer ${token}` // Include the token in the request header
            }
        })
        .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'orders.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove(); // Optional: remove the link after clicking
        })
        .catch((error) => {
            console.error('Error downloading file:', error);
        });
    };

    return (
        <div>
            <div className="flex justify-between mb-4">
                <div>
                    <input 
                        type="text" 
                        placeholder="Search by Invoice No or Description" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="border border-gray-300 rounded px-2 py-1"
                    />
                    <button 
                        onClick={() => setSearchTerm('')} 
                        className="bg-blue-500 my-2 text-white rounded ms-2 px-4 py-1"
                    >
                        Search
                    </button>
                </div>
                <div>
                    <button 
                        onClick={handleDownloadExcel} // Add download function on click
                        className="bg-red-500 text-white rounded ms-2 my-2 px-4 py-1"
                    >
                        Export
                    </button>
                    <Link href={"/admin/order/addorder"}>
                        <button 
                            className="bg-green-500 text-white rounded ms-2 px-4 py-1"
                        >
                            Add
                        </button>
                    </Link>
                </div>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">#</th>
                            <th scope="col" className="px-6 py-3" onClick={() => handleSort('description')}>Description</th>
                            <th scope="col" className="px-6 py-3" onClick={() => handleSort('invoiceNo')}>Invoice No</th>
                            <th scope="col" className="px-6 py-3">Order Date</th>
                            <th scope="col" className="px-6 py-3">Total Qty</th>
                            <th scope="col" className="px-6 py-3">Price Per Unit</th>
                            <th scope="col" className="px-6 py-3">Total Delivered Qty</th>
                            <th scope="col" className="px-6 py-3">Total Price</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order, index) => (
                            <tr key={order._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-6 py-4">{index + 1}</td>
                                <td className="px-6 py-4">{order.description}</td>
                                <td className="px-6 py-4">{order.invoiceNo}</td>
                                <td className="px-6 py-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4">{order.totalQty}</td>
                                <td className="px-6 py-4">{order.pricePerUnit}</td>
                                <td className="px-6 py-4">{order.totalDeliveredQty}</td>
                                <td className="px-6 py-4">{order.totalPrice}</td>
                                <td className="px-6 py-4">{order.status ? 'Delivered' : 'Pending'}</td>
                                <td className="px-6 py-4 flex space-x-2">
                                    <button onClick={() => handleEdit(order._id)} className="text-blue-500 hover:text-blue-700">
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDeleteClick(order._id)} className="text-red-500 hover:text-red-700">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleView(order._id)} className="text-green-500 hover:text-green-700">
                                        <Eye className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Deletecomp
                isOpen={isDeleteOpen} 
                onClose={closeDeleteModal} 
                deleteEndpoint={deleteEndpoint} 
            />
        </div>
    );
};

export default OrdersTable;
