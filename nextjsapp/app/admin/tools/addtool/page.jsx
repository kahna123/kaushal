"use client";
import CallFor from "@/utilities/CallFor";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

const ToolingForm = () => {
  const [formData, setFormData] = useState({
    date: "",
    description: "",
    qty: "",
    rate: "",
  });

  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    date: Yup.date().required("Date is required"),
    description: Yup.string().required("Description is required"),
    qty: Yup.number().positive("Quantity must be positive").required("Quantity is required"),
    rate: Yup.number().positive("Rate must be positive").required("Rate is required"),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for the field being changed
    setErrors({
      ...errors,
      [name]: undefined,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate the data against the schema
      await validationSchema.validate(formData, { abortEarly: false });

      const response = await CallFor("toolings", "post", formData, "Auth");

      if (response?.data) {
        toast.success("Tooling data added successfully");
        router.push("/admin/tools");
      } else {
        toast.error("Failed to add tooling data");
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        toast.error("An error occurred while adding tooling data");
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white text-black dark:bg-gray-800 dark:text-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Add Tooling</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="date" className="block font-bold mb-2">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 dark:text-black focus:ring-blue-400"
          />
          {errors.date && <div className="text-red-500">{errors.date}</div>}
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block font-bold mb-2">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:outline-none dark:text-black focus:ring-2 focus:ring-blue-400"
          />
          {errors.description && <div className="text-red-500">{errors.description}</div>}
        </div>

        <div className="mb-4">
          <label htmlFor="qty" className="block font-bold mb-2">
            Quantity
          </label>
          <input
            type="number"
            id="qty"
            name="qty"
            value={formData.qty}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:outline-none dark:text-black focus:ring-2 focus:ring-blue-400"
          />
          {errors.qty && <div className="text-red-500">{errors.qty}</div>}
        </div>

        <div className="mb-4">
          <label htmlFor="rate" className="block font-bold mb-2">
            Rate
          </label>
          <input
            type="number"
            id="rate"
            name="rate"
            value={formData.rate}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:outline-none dark:text-black focus:ring-2 focus:ring-blue-400"
          />
          {errors.rate && <div className="text-red-500">{errors.rate}</div>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ToolingForm;
