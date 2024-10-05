"use client";
import CallFor from '@/utilities/CallFor';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter

function Page({ params }) {
  const router = useRouter(); // Initialize useRouter
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await CallFor(`orders/${params.orderid}`, 'get', null, 'Auth');
        setOrderData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [params.orderid]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!orderData) {
    return <div>No order found.</div>;
  }

  const {
    orderDate,
    invoiceNo,
    description,
    totalQty,
    pricePerUnit,
    totalDeliveredQty,
    status,
    totalPrice,
    deliveries,
  } = orderData;

  // Define status styles
  const statusClass = status ? 'bg-green-500' : 'bg-red-500';
  const statusText = status ? 'Delivered' : 'Pending';

  return (
    <div className="relative p-4">
      <button 
        onClick={() => router.push("/admin")} 
        className="absolute right-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
        Back
      </button>
      <h2 className="text-2xl font-bold mb-4 text-gray-600">Order Details</h2>

      <div className="overflow-x-auto"> {/* Added for horizontal scrolling */}
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="py-2 px-4 text-black dark:text-white text-center">Order Date</th>
              <th className="py-2 px-4 text-black dark:text-white text-center">Invoice No</th>
              <th className="py-2 px-4 text-black dark:text-white text-center">Description</th>
              <th className="py-2 px-4 text-black dark:text-white text-center">Total Qty</th>
              <th className="py-2 px-4 text-black dark:text-white text-center">Price Per Unit</th>
              <th className="py-2 px-4 text-black dark:text-white text-center">Total Delivered Qty</th>
              <th className="py-2 px-4 text-black dark:text-white text-center">
                Status
              </th>
              <th className="py-2 px-4 text-black dark:text-white text-center">Total Price</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b dark:border-gray-600">
              <td className="py-5 px-4 text-black dark:text-white text-center">{new Date(orderDate).toLocaleDateString()}</td>
              <td className="py-2 px-4 text-black dark:text-white text-center">{invoiceNo}</td>
              <td className="py-2 px-4 text-black dark:text-white text-center">{description}</td>
              <td className="py-2 px-4 text-black dark:text-white text-center">{totalQty}</td>
              <td className="py-2 px-4 text-black dark:text-white text-center">{pricePerUnit}</td>
              <td className="py-2 px-4 text-black dark:text-white text-center">{totalDeliveredQty}</td>
              <td className={`py-2 px-4 text-center`}>
                <button className={`${statusClass} text-white px-2 py-1 rounded-lg`}>
                  {statusText}
                </button>
              </td>
              <td className="py-2 px-4 text-black dark:text-white text-center">{totalPrice}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-xl font-semibold mt-6 text-gray-600">Deliveries</h3>
      <div className="overflow-x-auto"> {/* Added for horizontal scrolling */}
        <table className="min-w-full bg-white dark:bg-gray-800 mt-4">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="py-2 px-4 text-black dark:text-white text-center">Delivery Date</th>
              <th className="py-2 px-4 text-black dark:text-white text-center">Delivered Qty</th>
              <th className="py-2 px-4 text-black dark:text-white text-center">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((delivery) => (
              <tr key={delivery._id} className="border-b dark:border-gray-600">
                <td className="py-2 px-4 text-black dark:text-white text-center">{new Date(delivery.deliveryDate).toLocaleDateString()}</td>
                <td className="py-2 px-4 text-black dark:text-white text-center">{delivery.deliveredQty}</td>
                <td className="py-2 px-4 text-black dark:text-white text-center">{delivery.deliveredQty * pricePerUnit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Page;
