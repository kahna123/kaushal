"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import CallFor from '@/utilities/CallFor';

const page = ({ params }) => {
    const [deliveryDate, setDeliveryDate] = useState('');
    const [deliveredQty, setDeliveredQty] = useState('');
    const [cashPrice, setCashPrice] = useState('');
    const [availableQty, setAvailableQty] = useState(0);
    const [totalDeliveredQty, setTotalDeliveredQty] = useState(0);  // Already delivered quantity
    const [deliveredQtyError, setDeliveredQtyError] = useState('');
    const router = useRouter();
    const orderId = params.orderid;
    const deliveryId = params.deliverdid;

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await CallFor(`orders/${orderId}`, 'get', null, 'Auth');
                if (response) {
                    const { totalQty, totalDeliveredQty } = response.data;
                    setAvailableQty(totalQty - totalDeliveredQty);
                    setTotalDeliveredQty(totalDeliveredQty); // Store the total delivered quantity
                }
            } catch (error) {
                toast.error('Failed to fetch order details');
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    useEffect(() => {
        const fetchDeliveryDetails = async () => {
            try {
                const response = await CallFor(`deliveries/${orderId}/deliveries/${deliveryId}`, 'get', null, 'Auth');
                if (response) {
                    const { deliveryDate, deliveredQty, cashprice } = response.data;
                    setDeliveryDate(deliveryDate.split('T')[0]);
                    setDeliveredQty(deliveredQty);
                    setCashPrice(cashprice);
                }
            } catch (error) {
                toast.error('Failed to fetch delivery details');
            }
        };

        fetchDeliveryDetails();
    }, [orderId, deliveryId]);

    const validateForm = () => {
        if (!deliveryDate) {
            toast.error('Delivery Date is required');
            return false;
        }
        if (!deliveredQty || isNaN(deliveredQty) || deliveredQty <= 0 || !Number.isInteger(Number(deliveredQty))) {
            toast.error('Delivered Quantity must be a positive integer');
            return false;
        }
        if (!cashPrice || isNaN(cashPrice) || cashPrice <= 0) {
            toast.error('Cash Price must be a positive number');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const body = {
            deliveryDate,
            deliveredQty: Number(deliveredQty),
            cashprice: Number(cashPrice)
        };

        const maxAllowedQty = availableQty + Number(deliveredQty);
        if (body.deliveredQty > maxAllowedQty) {
            toast.error(`Delivered Quantity cannot exceed the total available quantity (${maxAllowedQty})`);
            return;
        }

        try {
            const response = await CallFor(`deliveries/${orderId}/deliveries/${deliveryId}`, 'put', body, 'Auth');

            if (response) {
                toast.success('Delivery information updated successfully!');
                router.push("/admin/Deliverd");
            } else {
                toast.error('Failed to update delivery information');
            }
        } catch (error) {
            console.error('Error updating delivery:', error);
            toast.error('Failed to submit delivery information');
        }
    };

    const handleDeliveredQtyChange = (e) => {
        const inputQty = Number(e.target.value);
        const maxAllowedQty = availableQty + totalDeliveredQty;  // Calculate max allowed quantity

        if (inputQty > maxAllowedQty) {
            setDeliveredQtyError(`Delivered Quantity cannot exceed the total available quantity (${maxAllowedQty})`);
        } else {
            setDeliveredQtyError('');
        }

        setDeliveredQty(e.target.value);
    };

    return (
        <div className="flex justify-center">
            <form onSubmit={handleSubmit} className="bg-gray-200 dark:bg-gray-600 p-4 rounded shadow-md max-w-md w-full">
                <h2 className="text-lg font-bold mb-4">Delivery Form</h2>
                <div className="mb-4">
                    <label className="block mb-2" htmlFor="deliveryDate">Delivery Date</label>
                    <input
                        type="date"
                        id="deliveryDate"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className="border border-gray-400 dark:border-gray-300 p-2 rounded w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2" htmlFor="deliveredQty">Delivered Quantity (Available: {availableQty}, Already Delivered: {totalDeliveredQty})</label>
                    <input
                        type="number"
                        id="deliveredQty"
                        value={deliveredQty}
                        onChange={handleDeliveredQtyChange}
                        className={`border p-2 rounded w-full ${deliveredQtyError ? 'border-red-500' : 'border-gray-400 dark:border-gray-300'}`}
                        min="1"
                        required
                    />
                    {deliveredQtyError && <p className="text-red-500 mt-2">{deliveredQtyError}</p>}
                </div>
                <div className="mb-4">
                    <label className="block mb-2" htmlFor="cashPrice">Cash Price</label>
                    <input
                        type="number"
                        id="cashPrice"
                        value={cashPrice}
                        onChange={(e) => setCashPrice(e.target.value)}
                        className="border border-gray-400 dark:border-gray-300 p-2 rounded w-full"
                        min="0"
                        step="0.01"
                        required
                    />
                </div>
                <button 
                    type="submit" 
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                    disabled={!deliveryDate || !deliveredQty || !cashPrice || deliveredQtyError}
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default page;

