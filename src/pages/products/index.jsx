 
import React, { useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { NetworkServices } from "../../network";
import { networkErrorHandeller } from "../../utils/helper";
import { SkeletonTable } from "../../components/loading/skeleton-table";
import { Link } from "react-router-dom";
import { Toastify } from "../../components/toastify";

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
const Product = () => {
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState([]);
  const [currentPage, setCurrentPage] = useState(
      1
  );
  const [lastPage, setLastPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  // fetch product data
  const fetchData = useCallback(
    async (product) => {
      try {
        setLoading(true);
        const response = await NetworkServices.Product.index(currentPage,10);
         console.log(response,"product");
        if (response?.status === 200 || response?.status === 201) {
          setProductData(response?.data?.data?.data);
          setCurrentPage(response?.data?.data?.current_page);
          setLastPage(response?.data?.data?.last_page);
          setNextPageUrl(response?.data?.data?.next_page_url);
          setPrevPageUrl(response?.data?.data?.prev_page_url);
          setLoading(false);
        }
      } catch (error) {
     
        if (error) {
          setLoading(false);
          networkErrorHandeller(error);
        }
      }
    },
    [currentPage]
  );
  useEffect(() => {
    fetchData();
  }, [currentPage]);

  // delete data
  const destroy = async (id) => {
    try {
      const response = await NetworkServices.Product.destroy(id);
     
      if (response.status === 200 || response?.status === 201) {
        fetchData();
        return Toastify.Info("product Deleted");
      }
    } catch (error) {
    
      networkErrorHandeller(error);
    }
  };

  const conditionalRowStyles = [
    {
      when: () => true, // Apply this style function to all rows
      style: (row, index) => ({
        backgroundColor: index % 2 === 0 ? "#000000" : "#111111", // Conditional background color
      }),
    },
  ];
  
  const columns = [
    {
      name: "Product ID",
      cell: (row) => row?.product_id,
    },
    {
      name: "Image",
      cell: (row) => (
        <div>
          <img
            className="w-20 h-20 border rounded-full"
            src={`${process.env.REACT_APP_BASE_API}${row?.thumbnail_image}`}
            alt="loading"
          />
        </div>
      ),
    },

    {
      name: "Product Name",
      cell: (row) => row?.title,
    },
   
    {
      name: " Sale Price",
      cell: (row) => row?.sell_price,
    },
    {
      name: " Flat Discount",
      cell: (row) => row?.flat_discount,
    },
    {
      name: "Buy Price",
      cell: (row) => row?.buy_price,
    },
    {
      name: "In Stock",
      cell: (row) => row?.stock_qty,
    },
   

    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-3">
          <Link to={`/dashboard/product/edit/${row?.product_id}`}>
            <span className="">
            <FaRegEdit />
            </span>
          </Link>

          <span>
            <span
              className="text-red-700  cursor-pointer"
              onClick={() => destroy(row?.product_id)}
            >
              <RiDeleteBin6Line/>
            </span>
          </span>
        </div>
      ),
    },
  ]; 
  return (
    <section>
      <div className="flex justify-between shadow-md p-4 px-6 rounded-md">
        <h2 className=" font-semibold text-xl">Product List</h2>
        <Link to="/dashboard/product/create" className="flex hover:bg-primary hover:text-white items-center gap-2 border-primary border text-primary  py-1 px-2  rounded-lg">
        Add New  <span className="  material-symbols-outlined p-1">
            add
          </span>
        </Link>
      </div>

      {loading ? (
        <SkeletonTable />
      ) : (
        <>
          <DataTable pagination  columns={columns} data={productData} />
          {/* <Pagination
            nextPageUrl={nextPageUrl}
            setCurrentPage={setCurrentPage}
            prevPageUrl={prevPageUrl}
            lastPage={lastPage}
            currentPage={currentPage}
          /> */}
        </>
      )}
    </section>
  );
};

export default Product;
const Pagination = ({
  nextPageUrl,
  setCurrentPage,
  prevPageUrl,
  lastPage,
  currentPage,
}) => {
  const handleNext = () => {
    if (nextPageUrl) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrev = () => {
    if (prevPageUrl) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  // pagination store
  useEffect(() => {
    sessionStorage.setItem("currentPage", currentPage);
  }, [currentPage]);
  return (
    <>
      <div className="flex justify-end items-center gap-2 my-3">
        <button
          onClick={() => {
            setCurrentPage(1);
          }}
          disabled={!prevPageUrl}
          className={`px-2 py-2 rounded-lg font-medium text-white transition-all duration-300 ${
            !prevPageUrl
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          <FaAngleDoubleLeft />
        </button>
        <button
          onClick={handlePrev}
          disabled={!prevPageUrl}
          className={`px-2 py-2 rounded-lg font-medium text-white transition-all duration-300 ${
            !prevPageUrl
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          <IoIosArrowBack />
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {lastPage}
        </span>
        <button
          onClick={handleNext}
          disabled={!nextPageUrl}
          className={`px-2 py-2 rounded-lg font-medium text-white transition-all duration-300 ${
            !nextPageUrl
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          <IoIosArrowForward />
        </button>
        <button
          onClick={() => {
            setCurrentPage(lastPage);
          }}
          disabled={!nextPageUrl}
          className={`px-2 py-2 rounded-lg font-medium text-white transition-all duration-300 ${
            !nextPageUrl
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          <FaAngleDoubleRight />
        </button>
      </div>
    </>
  );
};
 