"use client";
import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react'; // Import only the Eye icon
import CallFor from '@/utilities/CallFor';
import { useRouter } from 'next/navigation';

const OrdersTable = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });
    const router = useRouter();

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

    // Calculate total incoming price from deliveries
    const calculateIncoming = (deliveries) => {
        return deliveries.reduce((acc, delivery) => acc + (parseFloat(delivery.cashprice) || 0), 0);
    };

    // Determine order status based on the quantities and incoming prices
    const getOrderStatus = (totalQty, totalDeliveredQty, incomingPrice, totalPrice) => {
        if (totalQty === totalDeliveredQty && incomingPrice === totalPrice) {
            return 'Order Successful';
        } else if (totalQty === totalDeliveredQty) {
            return 'Delivery Completed';
        } else if (incomingPrice === totalPrice) {
            return 'Payment Completed';
        } else {
            return 'Pending Order';
        }
    };

    // Get status classes based on order status
    const getStatusClassNames = (status) => {
        switch (status) {
            case 'Order Successful':
                return 'bg-green-500 text-xl text-white px-4 py-2 rounded';
            case 'Delivery Completed':
                return 'bg-yellow-500 text-xl text-white px-4 py-2 rounded';
            case 'Payment Completed':
                return 'bg-blue-500 text-xl text-white px-4 py-2 rounded';
            case 'Pending Order':
                return 'bg-red-500 text-xl text-white px-4 py-2 rounded';
            default:
                return 'bg-gray-500 text-xl text-white px-4 py-2 rounded';
        }
    };

    // Handle actions (view)
    const handleView = (orderId) => {
        console.log('View order:', orderId);
        router.push(`/admin/Delivery/viewdelivery/${orderId}`);
    };

    // Handle delivery logic
    const handleDelivery = (orderId) => {
        console.log('Deliver order:', orderId);
        router.push(`/admin/Delivery/adddelivery/${orderId}`);
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
                        className="bg-blue-500 text-white rounded ms-2 px-4 py-1"
                    >
                        Search
                    </button>
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
                            <th scope="col" className="px-6 py-3">Incoming</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order, index) => {
                            const incomingPrice = calculateIncoming(order.deliveries);
                            const status = getOrderStatus(order.totalQty, order.totalDeliveredQty, incomingPrice, order.totalPrice);
                            const statusClass = getStatusClassNames(status); // Get class names for the status

                            return (
                                <tr key={order._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="px-6 py-4">{index + 1}</td>
                                    <td className="px-6 py-4">{order.description}</td>
                                    <td className="px-6 py-4">{order.invoiceNo}</td>
                                    <td className="px-6 py-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{order.totalQty}</td>
                                    <td className="px-6 py-4">{order.pricePerUnit}</td>
                                    <td className="px-6 py-4">{order.totalDeliveredQty}</td>
                                    <td className="px-6 py-4">{order.totalPrice}</td>
                                    <td className="px-6 py-4">{incomingPrice}</td>
                                    <td className="px-6 py-4">
    <button className={statusClass}>{status}</button>
</td>
                                    <td className="px-6 py-4 flex space-x-2">
                                      {order.totalQty == order.totalDeliveredQty && incomingPrice == order.totalPrice  ? ''  : <button onClick={() => handleDelivery(order._id)} className="bg-blue-500 text-white rounded px-4 py-1">
                                           Add Delivery
                                        </button>  }
                                        <button onClick={() => handleView(order._id)} className="text-green-500 hover:text-green-700">
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersTable;
