"use client";
import React, { useState, useEffect } from "react";
import { Edit, Trash2, Eye } from "lucide-react"; // Import Lucide icons
import CallFor from "@/utilities/CallFor";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Deletecomp from "@/components/Deletecomp";
import GlobalPropperties from "@/utilities/GlobalPropperties";
import axios from "axios";

const page = () => {
  const [toolings, setToolings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "ascending",
  });
  const router = useRouter();
  const token = sessionStorage.getItem('token');
  // Fetch toolings from the API
  useEffect(() => {
    const fetchToolings = async () => {
      try {
        const response = await CallFor("toolings", "get", null, "Auth");
        setToolings(response.data);
      } catch (error) {
        console.error("Error fetching toolings:", error);
      }
    };

    fetchToolings();
  }, []);

  // Handle sorting
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Sort toolings based on the sortConfig
  const sortedToolings = React.useMemo(() => {
    let sortableToolings = [...toolings];
    if (sortConfig.key) {
      sortableToolings.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableToolings;
  }, [toolings, sortConfig]);

  // Handle search
  const filteredToolings = sortedToolings.filter(
    (tooling) =>
      tooling.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tooling.date.includes(searchTerm)
  );

  // Handle actions (edit, delete, view)
  const handleEdit = (toolId) => {
    router.push(`/admin/tools/edittool/${toolId}`);
  };

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteEndpoint, setDeleteEndpoint] = useState("");


  const handleDownloadExcel = async () => {
	axios.get('https://respo-umzu.onrender.com/api/toolings/downloadexcel', {
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

  const handleDeleteClick = (toolingId) => {
    // Set the endpoint for the deletion
    setDeleteEndpoint(`${GlobalPropperties.localUrlParam}toolings/${toolingId}`);
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
    setDeleteEndpoint(""); // Reset the endpoint
  };

  const handleView = (toolingId) => {
    router.push(`/admin/tooling/viewtooling/${toolingId}`);
  };

  const totalSum = filteredToolings.reduce((sum, tooling) => sum + tooling.total, 0);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div>
          <input
            type="text"
            placeholder="Search by Description or Date"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          />
          <button
            onClick={() => setSearchTerm("")}
            className="bg-blue-500 text-white rounded my-2 ms-2 px-4 py-1"
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
          <Link href={"/admin/tools/addtool"}>
            <button className="bg-green-500 text-white rounded ms-2 px-4 py-1">
              Add
            </button>
          </Link>
        </div>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                # {/* Serial Number Column Header */}
              </th>
              <th scope="col" className="px-6 py-3" onClick={() => handleSort("date")}>
                Date
              </th>
              <th scope="col" className="px-6 py-3" onClick={() => handleSort("description")}>
                Description
              </th>
              <th scope="col" className="px-6 py-3" onClick={() => handleSort("qty")}>
                Quantity
              </th>
              <th scope="col" className="px-6 py-3" onClick={() => handleSort("rate")}>
                Rate
              </th>
              <th scope="col" className="px-6 py-3" onClick={() => handleSort("total")}>
                Total
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredToolings.map((tooling, index) => (
              <tr key={tooling._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4">{index + 1}</td> {/* Serial Number */}
                <td className="px-6 py-4">{new Date(tooling.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">{tooling.description}</td>
                <td className="px-6 py-4">{tooling.qty}</td>
                <td className="px-6 py-4">{tooling.rate}</td>
                <td className="px-6 py-4">{tooling.total}</td>
                <td className="px-6 py-4 flex space-x-2">
                  <button onClick={() => handleEdit(tooling._id)} className="text-blue-500 hover:text-blue-700">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDeleteClick(tooling._id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  {/* <button onClick={() => handleView(tooling._id)} className="text-green-500 hover:text-green-700">
                    <Eye className="w-5 h-5" />
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 dark:bg-gray-700">
              <td colSpan="5" className="px-6 py-3 font-bold">
              </td>
              <td className="px-6 py-3 font-bold">  Total:{totalSum}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <Deletecomp isOpen={isDeleteOpen} onClose={closeDeleteModal} deleteEndpoint={deleteEndpoint} />
    </div>
  );
};

export default page;
