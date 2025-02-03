import React, { useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { NetworkServices } from "../../network";
import { networkErrorHandeller } from "../../utils/helper";
import { SkeletonTable } from "../../components/loading/skeleton-table";
import { Link } from "react-router-dom";
import { Toastify } from "../../components/toastify";
import { FaFacebookSquare, FaTwitterSquare, FaLinkedin,FaYoutube,FaInstagramSquare, FaRegEdit } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
const WebSetting = () => {
  const [loading, setLoading] = useState(false);
  const [websettingData, setwebsettingData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  // fetch websetting data
  const fetchData = useCallback(
    async (websetting) => {
      try {
        setLoading(true);
        const response = await NetworkServices.WebSetting.index(currentPage);
      
        if (response?.status === 200 || response?.status === 201) {
          setwebsettingData(response?.data?.data);
          setCurrentPage(response?.data?.current_page);
          setLastPage(response?.data?.last_page);
          setNextPageUrl(response?.data?.next_page_url);
          setPrevPageUrl(response?.data?.prev_page_url);
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
      const response = await NetworkServices.WebSetting.destroy(id);
      if (response.status === 200 || response?.status === 201) {
        fetchData();
        return Toastify.Info("websetting Deleted");
      }
    } catch (error) {
      networkErrorHandeller(error);
    }
  };
  const columns = [
    {
      name: "Web-Setting ID",
      cell: (row) => row?.web_setting_id,
    },

   
    {
      name: "Logo",
      cell: (row) => (
        <div>
          <img
            className="w-40 h-20 border rounded-full"
            src={`${process.env.REACT_APP_BASE_API}${row?.logo}`}
            alt="loading"
          />
        </div>
      ),
    },
    {
      name: "Title",
      cell: (row) => row?.title,
    },
    {
      name: "Email websetting",
      cell: (row) => row?.email,
    },
    {
      name: "Phone",
      cell: (row) => row?.phone,
    },
    {
      name: "Bio",
      cell: (row) => row?.bio,
    },
    {
      name: "Location",
      cell: (row) => row?.location,
    },
    {
      name: "Social Media",

      cell: (row) => (
        <div className="flex items-center gap-2 w-3 -ml-12 ">
          <a href={row?.facebook} className="h-6 w-6">
            <FaFacebookSquare  className="h-6 w-6"/>
          </a>
          <a href={row?.linkedin}   >
            <FaLinkedin className="h-6 w-6"/>
          </a>
          <a  href={row?.twitter}  >
            <FaTwitterSquare className="h-6 w-6"/>
          </a>
          <a href={row?.youtube}   >
            <FaYoutube className="h-6 w-6"/>
          </a>
          <a   href={row?.instagram}  >
            <FaInstagramSquare className="h-6 w-6"/>
          </a>
           
        </div>
      ),
    },

    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-1">
          <Link to={`/dashboard/web-setting/edit/${row?.web_setting_id}`}>
            <span className=" btn btn-sm material-symbols-outlined">
            <FaRegEdit/>
            </span>
          </Link>

          <span>
            <span
              className=" text-red-700 btn btn-sm material-symbols-outlined"
              onClick={() => destroy(row?.web_setting_id)}
            >
              <RiDeleteBin6Line />
            </span>
          </span>
        </div>
      ),
    },
  ];

  return (
    <section>
      <div className="flex justify-between shadow-md p-4 px-6 rounded-md">
        <h2 className=" font-semibold text-xl">Websetting List</h2>
        <Link to="/dashboard/web-setting/create"className="flex hover:bg-primary hover:text-white items-center gap-2 border-primary border text-primary  py-1 px-2  rounded-lg">
        Add New  <span className="  material-symbols-outlined p-1">
            add
          </span>
        </Link>
      </div>

      {loading ? (
        <SkeletonTable />
      ) : (
        <>
          <DataTable columns={columns} data={websettingData}   />
          <Pagination
          
            nextPageUrl={nextPageUrl}
            setCurrentPage={setCurrentPage}
            prevPageUrl={prevPageUrl}
            lastPage={lastPage}
            currentPage={currentPage}
          />
        </>
      )}
    </section>
  );
};

export default WebSetting;
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
