"use client";
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
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
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteEndpoint, setDeleteEndpoint] = useState('');

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

    // Calculate totals for incoming and price
    const totals = React.useMemo(() => {
        let totalIncoming = 0;
        let totalPrice = 0;

        filteredOrders.forEach(order => {
            order.deliveries.forEach(delivery => {
                totalIncoming += delivery.cashprice ? Number(delivery.cashprice) : 0;
                totalPrice += delivery.deliveredQty * Number(order.pricePerUnit);
            });
        });

        return { totalIncoming, totalPrice };
    }, [filteredOrders]);

    // Handle actions (edit, delete, view)
    const handleEdit = (orderId, deliveryId) => {
        router.push(`/admin/Deliverd/editdeliverd/${orderId}/${deliveryId}`);
    };

    const handleDeleteClick = (orderId, deliveryId) => {
        setDeleteEndpoint(`${GlobalPropperties.localUrlParam}deliveries/${orderId}/deliveries/${deliveryId}`);
        setIsDeleteOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteOpen(false);
        setDeleteEndpoint('');
    };

    const handleView = (orderId) => {
        router.push(`/admin/Delivery/viewdelivery/${orderId}`);
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
                <div>
                    <Link href={"/admin/order/addorder"}>
                        <button className="bg-green-500 text-white rounded ms-2 px-4 py-1">Add</button>
                    </Link>
                </div>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">#</th>
                            <th scope="col" className="px-6 py-3">Invoice No</th>
                            <th scope="col" className="px-6 py-3">Description</th>
                            <th scope="col" className="px-6 py-3">Delivery Date</th>
                            <th scope="col" className="px-6 py-3">Delivered Qty</th>
                            <th scope="col" className="px-6 py-3">Price Per Unit</th>
                            <th scope="col" className="px-6 py-3">Incoming</th>
                            <th scope="col" className="px-6 py-3">Price</th>
                            <th scope="col" className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.flatMap((order, index) => 
                            order.deliveries.map((delivery, deliveryIndex) => (
                                <tr key={delivery._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="px-6 py-4">{index + 1}.{deliveryIndex + 1}</td>
                                    <td className="px-6 py-4">{order.invoiceNo}</td>
                                    <td className="px-6 py-4">{order.description}</td>
                                    <td className="px-6 py-4">{new Date(delivery.deliveryDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{delivery.deliveredQty}</td>
                                    <td className="px-6 py-4">{order.pricePerUnit}</td>
                                    <td className="px-6 py-4">{delivery.cashprice ? delivery.cashprice : '-'}</td>
                                    <td className="px-6 py-4">{delivery.deliveredQty * order.pricePerUnit}</td>
                                    <td className="px-6 py-4 flex space-x-2">
                                        <button onClick={() => handleEdit(order._id, delivery._id)} className="text-blue-500 hover:text-blue-700">
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleDeleteClick(order._id, delivery._id)} className="text-red-500 hover:text-red-700">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleView(order._id)} className="text-green-500 hover:text-green-700">
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    <tfoot className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <td colSpan="6" className="px-6 py-3 font-bold text-right">Total:</td>
                            <td className="px-6 py-3 font-bold">{totals.totalIncoming}</td>
                            <td className="px-6 py-3 font-bold">{totals.totalPrice}</td>
                            <td className="px-6 py-3"></td>
                        </tr>
                    </tfoot>
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
