"use client";
import React, { useState } from 'react';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast'; // Import react-hot-toast
import CallFor from '@/utilities/CallFor';
import { useRouter } from 'next/navigation';

const OrderForm = () => {
  const [formData, setFormData] = useState({
    orderDate: '',
    invoiceNo: '',
    description: '',
    totalQty: '',
    pricePerUnit: '',
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter(); // Initialize useRouter

  // Define Yup validation schema
  const schema = Yup.object().shape({
    orderDate: Yup.string().required('Order date is required'),
    invoiceNo: Yup.string().required('Invoice number is required'),
    description: Yup.string().required('Description is required'),
    totalQty: Yup.number().required('Total quantity is required').min(1, 'Quantity must be at least 1'),
    pricePerUnit: Yup.number().required('Price per unit is required').min(0, 'Price must be at least 0'),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: '', // Clear error message for the field
    }));
  };

  const validateForm = async () => {
    try {
      await schema.validate(formData, { abortEarly: false });
      return true; // Return true if validation passes
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach((error) => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
      return false; // Return false if validation fails
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setErrorMessage(''); // Clear previous error messages

    const isValid = await validateForm(); // Validate the form
    if (!isValid) return; // If validation fails, exit

    try {
      const response = await CallFor('orders', 'post', formData, 'Auth'); // Adjust this as needed
     
	  if(response)
	  {
		toast.success('Order created successfully!'); // Show success toast
		router.push('/admin'); // Redirect to /admin
		console.log(response.data); // Handle response as needed
	  }
	  else
	  {
		toast.error('Order cancell!');
	  }
    } catch (error) {
		toast.error(error)
      setErrorMessage('Error creating order. Please try again.');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-8 p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="text-lg font-bold text-center mb-4">Order</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-5">
          <label htmlFor="orderDate" className="block mb-2 text-sm font-medium text-gray-700">Order Date</label>
          <input
            type="date"
            name="orderDate"
            id="orderDate"
            className={`bg-gray-50 border ${errors.orderDate ? 'border-red-500' : 'border-gray-300'} text-gray-900 placeholder-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            value={formData.orderDate}
            onChange={handleChange}
          />
          {errors.orderDate && <p className="mt-2 text-sm text-red-600">{errors.orderDate}</p>}
        </div>

        <div className="mb-5">
          <label htmlFor="invoiceNo" className="block mb-2 text-sm font-medium text-gray-700">Invoice No</label>
          <input
            type="text"
            name="invoiceNo"
            id="invoiceNo"
            className={`bg-gray-50 border ${errors.invoiceNo ? 'border-red-500' : 'border-gray-300'} text-gray-900 placeholder-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            value={formData.invoiceNo}
            onChange={handleChange}
          />
          {errors.invoiceNo && <p className="mt-2 text-sm text-red-600">{errors.invoiceNo}</p>}
        </div>

        <div className="mb-5">
          <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            name="description"
            id="description"
            className={`bg-gray-50 border ${errors.description ? 'border-red-500' : 'border-gray-300'} text-gray-900 placeholder-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
        </div>

        <div className="mb-5">
          <label htmlFor="totalQty" className="block mb-2 text-sm font-medium text-gray-700">Total Quantity</label>
          <input
            type="number"
            name="totalQty"
            id="totalQty"
            className={`bg-gray-50 border ${errors.totalQty ? 'border-red-500' : 'border-gray-300'} text-gray-900 placeholder-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            value={formData.totalQty}
            onChange={handleChange}
          />
          {errors.totalQty && <p className="mt-2 text-sm text-red-600">{errors.totalQty}</p>}
        </div>

        <div className="mb-5">
          <label htmlFor="pricePerUnit" className="block mb-2 text-sm font-medium text-gray-700">Price Per Unit</label>
          <input
            type="number"
            name="pricePerUnit"
            id="pricePerUnit"
            className={`bg-gray-50 border ${errors.pricePerUnit ? 'border-red-500' : 'border-gray-300'} text-gray-900 placeholder-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            value={formData.pricePerUnit}
            onChange={handleChange}
          />
          {errors.pricePerUnit && <p className="mt-2 text-sm text-red-600">{errors.pricePerUnit}</p>}
        </div>

        <button type="submit" className="w-full p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500">Submit Order</button>
        {errorMessage && <p className="mt-4 text-sm text-red-600">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default OrderForm;
