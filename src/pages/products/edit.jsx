import { Toastify } from "../../components/toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { NetworkServices } from "../../network/index";
import { PrimaryButton } from "../../components/button";
import { useCallback, useEffect, useRef, useState } from "react";
import { networkErrorHandeller } from "../../utils/helper";
import "react-quill/dist/quill.snow.css";
import { TextInput } from "../../components/input";
import { SkeletonForm } from "../../components/loading/skeleton-table";
import ReactQuill from "react-quill";

export const ProductEdit = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [selectedunitIds, setSelectedunitIds] = useState([]);
  const [singleImage, setSingleImage] = useState(null);
  const [multiImages, setMultiImages] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [product, setProduct] = useState({});
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  //   single product fetch
  const fetchData = useCallback(
    async (product) => {
      try {
        // setLoading(true);
        const response = await NetworkServices.Product.show(id);
        if (response?.status === 200 || response?.status === 201) {
          setProduct(response?.data?.data);

          setLoading(false);
        }
      } catch (error) {
        if (error) {
          setLoading(false);
          networkErrorHandeller(error);
        }
      }
    },
    [id]
  );
  useEffect(() => {
    fetchData();
  }, []);

  //   single image set in state
  const handleSingleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSingleImage(file);
    }
  };
  //   multi state set in multisetate
  const handleMultiImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setMultiImages(files);
    }
  };
  //   fetch category
  const fetchDataForUnit = useCallback(async (category) => {
    try {
      //   setLoading(true);
      const response = await NetworkServices.Category.index();

      if (response?.status === 200 || response?.status === 201) {
        setCategoryData(response?.data?.data?.data);
        setLoading(false);
      }
    } catch (error) {
      if (error) {
        networkErrorHandeller(error);
      }
    }
  }, []);
  useEffect(() => {
    fetchDataForUnit();
  }, []);
  /* submit reosurce */

  const onSubmit = async (data) => {
    try {
      console.log(data, "data is submit", product);
      setButtonLoading(true);
      const formData = new FormData();
      formData.append("title", data?.title); // Other form fields
      formData.append("description", data?.description); // Other form fields
      formData.append("sell_price", data?.sell_price); // Other form fields
      formData.append("category_id", data?.category_id); // Other form fields
      formData.append("rating", data?.rating); // Other form fields
      formData.append("tax_price", data?.tax_price); // Other form fields
      formData.append("buy_price", data?.buy_price); // Other form fields
      formData.append("stock_qty", data?.stock_qty); // Other form fields
      formData.append(
        "low_stock_quantity_warning",
        data?.low_stock_quantity_warning
      ); // Other form fields
      formData.append("thumbnail_image", singleImage);
      formData.append("_method", "PUT"); //
      multiImages.forEach((image, index) => {
        formData.append(`gallery_image[${index}]`, image); // Append multiple images
      });
      const response = await NetworkServices.Product.update(id, formData);

      if (response && (response.status === 201 || response?.status === 200)) {
        // navigate("/dashboard/product");
        setButtonLoading(false);
        return Toastify.Success(response?.data?.message);
      }
    } catch (error) {
      setButtonLoading(false);
      networkErrorHandeller(error);
    }
  };
  useEffect(() => {
    setValue("description", product?.description); // Update form state for description
    setValue("title", product?.title); // Update form state for title
    setValue("sell_price", product?.sell_price); // Update form state for sell_price
    setValue("category_id", product?.category_id); // Update form state for category_id
    setValue("rating", product?.rating); // Update form state for rating
    setValue("tax_price", product?.tax_price); // Update form state for tax_price
    setValue("buy_price", product?.buy_price); // Update form state for buy_price
    setValue("stock_qty", product?.stock_qty); // Update form state for stock_qty
    setValue("low_stock_quantity_warning", product?.low_stock_quantity_warning); // Update form state for low_stock_quantity_warning
    // setSingleImage(product?.thumbnail_image); // Update form state for thumbnail_image
    setValue("thumbnail_image", product?.thumbnail_image);
  }, []);
  //   set decription
  const handleQuillChange = (content) => {
    setValue("description", content); // Update form state
  };
  return (
    <>
      <section className="flex justify-between shadow-md p-4 px-6 rounded-md bg-white mb-3">
        <h2 className=" font-semibold text-xl">Product Create</h2>
        <Link to="/dashboard/product">
          <span className="border border-green-500 rounded-full material-symbols-outlined p-1">
            list
          </span>
        </Link>
      </section>

      {loading ? (
        <SkeletonForm />
      ) : (
        <section className="shadow-md my-5 p-4 px-6">
          <form className="px-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col md:flex-row gap-3 ">
              <div className="mb-6 lg:mb-2 w-full">
                <TextInput
                  label="Product Name"
                  name="title"
                  type="text"
                  placeholder="Enter category name"
                  control={control}
                  error={errors.name && errors.name.message}
                  rules={{ required: "Category Name is required" }}
                />
              </div>
              {/* cvategory field
               */}
              <div className="mb-14 w-full">
                <div className="mb-6 lg:mb-2  relative">
                  <label>Product Category </label>

                  <SearchDropdownWithSingle
                    register={register}
                    setValue={setValue}
                  />
                </div>
              </div>
            </div>

            {/* price area
             */}
            <div className="flex flex-col md:flex-row gap-3  ">
              {/* sell price area  */}
              <div className="mb-6 lg:mb-2 w-full">
                {errors?.name ? (
                  <span className="text-red-500 text-sm">
                    {errors?.name?.message}
                  </span>
                ) : (
                  <span className="  text-sm">Banner Title</span>
                )}
                <input
                  value={product?.sell_price ? product?.sell_price : "0"}
                  {...register("sell_price", {
                    required: {
                      value: true,
                      message: "Banner Title is required",
                    },
                    validate: (value) => value.trim() !== '' || "Title is required", // Optional validation to ensure non-empty
                  })}
                  type="number"
                  onChange={(e)=>{
                    setProduct({
                      ...product,
                      sell_price:e.target.value,
                    })
                  }}
                  placeholder="Enter your name"
                  className={`  w-full text-sm bg-white disabled:bg-gray-300 rounded-md outline-none p-[14px] border disabled:border-gray-300 ${
                    errors?.sell_price ? "border-red-500" : "border-gray-300"
                  } rounded-md`}
                />
              </div>
              {/* buy price area  */}
              <div className="mb-6 lg:mb-2 w-full">
                <TextInput
                  label="Buy Price"
                  name="buy_price"
                  type="number"
                  placeholder="Enter buy"
                  control={control}
                  error={errors.name && errors.name.message}
                  rules={{ required: "Category Name is required" }}
                />
              </div>
              {/* tax price area  */}
              <div className="mb-6 lg:mb-2 w-full">
                <TextInput
                  label="Tax Price"
                  name="tax_price"
                  type="number"
                  placeholder="Enter tax"
                  control={control}
                  error={errors.name && errors.name.message}
                  rules={{ required: "Category Name is required" }}
                />
              </div>
            </div>
            {/* quantity   */}
            <div className="flex flex-col md:flex-row gap-3">
              {/* stock quantity  */}
              <div className="mb-6 lg:mb-2 w-full">
                <TextInput
                  label="Stock Quantity"
                  name="stock_qty"
                  type="number"
                  placeholder="Enter tax"
                  control={control}
                  error={errors.name && errors.name.message}
                  rules={{ required: "Category Name is required" }}
                />
              </div>
              {/* show quantiy when it warning  */}
              <div className="mb-6 lg:mb-2 w-full">
                <TextInput
                  label="Low Quantity Show"
                  name="low_stock_quantity_warning"
                  type="number"
                  placeholder="Enter tax"
                  control={control}
                  error={errors.name && errors.name.message}
                  rules={{ required: "Category Name is required" }}
                />
              </div>
              {/* Rating */}

              <div className="mb-6 lg:mb-2 w-full">
                <p className="text-sm mb-1 text-gray-500">
                  Rating
                  <span className="text-red-500">*</span>
                </p>
                <input
                  type="number"
                  name="rating"
                  placeholder="enter minmum 1 and max 5 rating"
                  {...register("rating")}
                  min="1"
                  max="5"
                  className="w-full text-sm bg-white disabled:bg-gray-300 rounded-md outline-none p-[14px] border disabled:border-gray-300"
                />
              </div>
            </div>

            {/* description field  */}

            <div className="mb-6 lg:mb-2">
              <div className="quill-wrapper rounded-lg border border-gray-300">
                <ReactQuill
                  onChange={handleQuillChange}
                  placeholder="Write your description..."
                  className="w-full overflow-y-auto h-72"
                />
                {errors?.description && (
                  <p className="text-red-500 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
            {/* image area coide  */}
            <div className="flex flex-col md:flex-row gap-3">
              {/* thumbnail iamge  */}
              <div className="mb-6 lg:mb-2 w-full">
                <p className="text-sm mb-1 text-gray-500">
                  Thumbnail Image
                  <span className="text-red-500">*</span>
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSingleImageChange}
                  className="cursor-pointer w-full text-sm bg-white disabled:bg-gray-300 rounded-md outline-none p-[14px] border disabled:border-gray-300"
                />
              </div>
              {/* gallary iamge  */}
              <div className="mb-6 lg:mb-2 w-full">
                <p className="text-sm mb-1 text-gray-500">
                  Thumbnail Image
                  <span className="text-red-500">*</span>
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMultiImageChange}
                  className="cursor-pointer w-full text-sm bg-white disabled:bg-gray-300 rounded-md outline-none p-[14px] border disabled:border-gray-300"
                />
              </div>
            </div>
            {/* submit button */}
            <div className="my-4 flex justify-center">
              <PrimaryButton
                loading={buttonLoading}
                name="Product create"
              ></PrimaryButton>
            </div>
          </form>
        </section>
      )}
    </>
  );
};

const SearchDropdownWithSingle = ({ register, setValue }) => {
  const [searchText, setSearchText] = useState({});
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [open, setOpen] = useState(false);

  // Filter options based on user input
  //   const handleSearch = (e) => {
  //     const value = e.target.value;
  //     setSearchText(value);

  //     // Filter options by the search text
  //     const filtered = options.filter((option) =>
  //       option.toLowerCase().includes(value.toLowerCase())
  //     );

  //     setFilteredOptions(filtered);
  //   };

  // Handle selection from dropdown
  const handleOptionSelect = (option) => {
    setOpen(true);
    setSelectedOption(option);
    setSearchText(option);
    setValue("category_id", option?.category_id);
    // Set search text to selected option
    // setFilteredOptions([]); // Clear dropdown after selection
  };

  // fetch category data
  const fetchData = useCallback(async (category) => {
    try {
      //   setLoading(true);
      const response = await NetworkServices.Category.index();
      if (response?.status === 200 || response?.status === 201) {
        setFilteredOptions(response?.data?.data?.data);
        // setLoading(false);
      }
    } catch (error) {
      if (error) {
        networkErrorHandeller(error);
      }
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);
  const [isOpen, setIsOpen] = useState(false); // Track if the div is open
  const divRef = useRef(null); // Reference to the div element

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setIsOpen(false); // Close the div if click is outside
        setOpen(false);
      }
    };

    // Attach the event listener to the document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [divRef]);
  return (
    <div className="absolute w-full">
      <input
        type="text"
        value={searchText?.category_name}
        onFocus={() => setOpen(true)}
        // onBlur={()=>setOpen(false)}
        placeholder="Select your item"
        readOnly
        className={`w-full text-sm bg-white disabled:bg-gray-300 rounded-md outline-none p-[14px] border disabled:border-gray-300 cursor-pointer `}
      />

      {/* Display filtered options in a dropdown */}
      {open && (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            border: "1px solid #ccc",
          }}
          ref={divRef}
        >
          <input
            type="text"
            // value={searchText}
            // onSearch={handleSearch}
            placeholder="Search your "
            className="w-full text-sm bg-white disabled:bg-gray-300 rounded-md outline-none p-[14px] border disabled:border-gray-300 "
          />
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => handleOptionSelect(option)}
              style={{
                padding: "8px",
                cursor: "pointer",
                backgroundColor: "#f8f8f8",
                borderBottom: "1px solid #ddd",
              }}
            >
              {option?.category_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
