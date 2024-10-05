"use client";
import CallFor from '@/utilities/CallFor';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';

const DeliveryForm = ({ params }) => {
    const [deliveryDate, setDeliveryDate] = useState('');
    const [deliveredQty, setDeliveredQty] = useState('');
    const [availableQty, setAvailableQty] = useState(0);
	const [price, setprice] = useState(0);
    const router = useRouter()
    const orderId = params.orderid;

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await CallFor(`orders/${orderId}`, 'get', null, 'Auth');
                if (response) {
                    const { totalQty, totalDeliveredQty } = response.data;
                    setAvailableQty(totalQty - totalDeliveredQty);
                }
            } catch (error) {
                toast.error('Failed to fetch order details');
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    const validationSchema = Yup.object().shape({
        deliveryDate: Yup.date().required('Delivery Date is required'),
        deliveredQty: Yup.number()
            .typeError('Delivered Quantity must be a number')
            .positive('Delivered Quantity must be a positive number')
            .integer('Delivered Quantity must be an integer')
            .required('Delivered Quantity is required'),
    });

	const handleSubmit = async (e) => {
		e.preventDefault();
	
		const body = {
			deliveryDate,
			deliveredQty: Number(deliveredQty),
			cashprice:Number(price) // Convert deliveredQty to a number
		};
	
		try {
			// await validationSchema.validate(body, { abortEarly: false });
	
			// Manual check for available quantity
			if (body.deliveredQty > availableQty) {
				toast.error(`Delivered Quantity cannot exceed available quantity (${availableQty})`);
				return;
			}
	
			const response = await CallFor(`deliveries/${orderId}/deliveries`, 'POST', body, 'Auth');
	
			if (response) {
				toast.success('Delivery information submitted successfully!');
				router.push("/admin/Delivery/")
			}
	
		} catch (error) {
			if (error instanceof Yup.ValidationError) {
				error.inner.forEach((err) => toast.error(err.message));
			} else {
				toast.error('Failed to submit delivery information');
			}
		}
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
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2" htmlFor="deliveredQty">Delivered Quantity (Available: {availableQty})</label>
                    <input
                        type="number"
                        id="deliveredQty"
                        value={deliveredQty}
                        onChange={(e) => setDeliveredQty(e.target.value)}
                        className="border border-gray-400 dark:border-gray-300 p-2 rounded w-full"
                        min="0"
                    />
                </div>

				<div className="mb-4">
                    <label className="block mb-2" htmlFor="deliveredQty">Cash Price</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setprice(e.target.value)}
                        className="border border-gray-400 dark:border-gray-300 p-2 rounded w-full"
                        min="0"
                    />
                </div>

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default DeliveryForm;
