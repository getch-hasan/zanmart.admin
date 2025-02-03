import { Toastify } from "../../components/toastify";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { NetworkServices } from "../../network/index";
import { PrimaryButton } from "../../components/button";
import { useCallback, useEffect,    useState } from "react";
import { networkErrorHandeller } from "../../utils/helper";
import "react-quill/dist/quill.snow.css";
 
import { SkeletonForm } from "../../components/loading/skeleton-table";
import ReactQuill from "react-quill";
import { SearchDropdownWithSingle } from "../../components/input/selectsearch";

export const ProductCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false); 
  const [singleImage, setSingleImage] = useState(null);
  const [multiImages, setMultiImages] = useState([]); 
  // react hooks form 
  const { 
    register,
    handleSubmit,
    trigger,
    setValue,
    formState: { errors },
  } = useForm();
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
   
  /* submit reosurce */

  const onSubmit = async (data) => {
    try {
      setButtonLoading(true);
      const formData = new FormData();
      formData.append("title", data?.title); // Other form fields
      formData.append("description", data?.description); // Other form fields
      formData.append("sell_price", data?.sell_price); // Other form fields
      formData.append("category_id", data?.category_id); // Other form fields
      formData.append("rating", data?.rating); // Other form fields
      formData.append("tax_price", data?.tax_price); // Other form fields
      formData.append("buy_price", data?.buy_price); // Other form fields
      formData.append("flat_discount", data?.flat_discount); // Other form fields
      formData.append("stock_qty", data?.stock_qty); // Other form fields
      formData.append("brand_id", data?.brand_id); // Other form fields
      formData.append(
        "low_stock_quantity_warning",
        data?.low_stock_quantity_warning
      ); // Other form fields
      formData.append("thumbnail_image", singleImage);
      multiImages.forEach((image, index) => {
        formData.append(`gallery_image[${index}]`, image); // Append multiple images
      });
      const response = await NetworkServices.Product.store(formData);

      if (response && (response.status === 201 || response?.status === 200)) {
        navigate("/dashboard/product");
        setButtonLoading(false);
        return Toastify.Success(response?.data?.message);
      }
    } catch (error) {
      setButtonLoading(false);
      networkErrorHandeller(error);
    }
  };
  // description handler react quill 
  const handleQuillChange = (content) => {
    setValue("description", content); // Update form state
  };

  // fetch category list
  const [categoryList, setCategoryList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  // category fetch 
  const fetchCategoryList = async () => {
    try {
      const response = await NetworkServices.Category.index();
      if (response?.status === 200 || response?.status === 201) {
        const result = response?.data?.data?.data;
        //  setCategoryList(result);
        const data = result.map((item) => {
          return {
            label: item?.category_name,
            value: item?.category_id,
            ...item,
          };
        });
        setCategoryList(data);
      }
    } catch (error) {
      networkErrorHandeller(error);
    }
  };
  // fetch brand list 
  const fetchBrandList = async () => {
    try {
      const response = await NetworkServices.Brand.index();
      if (response?.status === 200 || response?.status === 201) {
        const result = response?.data?.data?.data;
        //  setCategoryList(result);
        const data = result.map((item) => {
          return {
            label: item?.name,
            value: item?.brand_id,
            ...item,
          };
        }); 
        setBrandList(data);
      }
    } catch (error) {
      networkErrorHandeller(error);
    }
  };
  // fetch brand and category list 
  useEffect(() => {
    fetchCategoryList();
    fetchBrandList();
  }, []);
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
        <section className="shadow-md my-5  ">
          <form className="px-4 py-3 space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <div>
            <TextInput
                  name="title"
                  label="Product Title"
                  register={register}
                  errors={errors}
                  trigger={trigger}
                  placeholder="Enter Product Title"
                />
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <div className=" lg:mb-2 w-full">
                {/* product title field  */}
                
                 <label className="text-gray-700 font-medium">
                  Product Category{" *"}
                </label>
                <SearchDropdownWithSingle
                  options={categoryList}
                  handleChange={(e) => {
                    console.log(e);
                    setValue("category_id", e?.category_id);
                  }}
                />
              </div>
              {/* category field
               */}
              <div className="  w-full  ">
                <label className="text-gray-700 font-medium">
                  Product Brand{" *"}
                </label>
                <SearchDropdownWithSingle
                  options={brandList}
                  handleChange={(e) => {
                    console.log(e);
                    setValue("brand_id", e?.brand_id);
                  }}
                  showName="name"
                />
              </div>
            </div>

            {/* price area
             */}
            <div className="flex flex-col md:flex-row gap-3  ">
              {/* sell price area  */}
              <div className="mb-6 lg:mb-2 w-full">
                <TextInput
                  name="sell_price"
                  label="Sell Price"
                  type={"number"}
                  register={register}
                  errors={errors}
                  trigger={trigger}
                  placeholder="Enter Sell Price"
                />
              </div>
              {/* buy price area  */}
              <div className="mb-6 lg:mb-2 w-full">
                <TextInput
                  name="buy_price"
                  label="Buy Price"
                  type={"number"}
                  register={register}
                  errors={errors}
                  trigger={trigger}
                  placeholder="Enter Buy Price"
                />
              </div>
              {/* tax price area  */}
              <div className="mb-6 lg:mb-2 w-full">
                <TextInput
                  name="tax_price"
                  label="Tax Price"
                  type={"number"}
                  register={register}
                  errors={errors}
                  trigger={trigger}
                  placeholder="Enter Tax Price"
                />
              </div>
              <div className="mb-6 lg:mb-2 w-full">
                <TextInput
                  name="flat_discount"
                  label="Flat Discount"
                  type={"number"}
                  register={register}
                  errors={errors}
                  trigger={trigger}
                  placeholder="Enter Flat Discount"
                />
              </div>
            </div>
            {/* quantity   */}
            <div className="flex flex-col md:flex-row gap-3">
              {/* stock quantity  */}
              <div className="mb-6 lg:mb-2 w-full">
                <TextInput
                  name="stock_qty"
                  label="Stock Quantity"
                  type={"number"}
                  register={register}
                  errors={errors}
                  trigger={trigger}
                  placeholder="Enter Stock Quantity"
                />
              </div>
              {/* show quantiy when it warning  */}
              <div className="mb-6 lg:mb-2 w-full">
                <TextInput
                  label="Low Quantity Show"
                  name="low_stock_quantity_warning"
                  type={"number"}
                  register={register}
                  errors={errors}
                  trigger={trigger}
                  placeholder="Enter Low Stock Quantity"
                />
              </div>
              {/* Rating */}

              <div className="mb-6 lg:mb-2 w-full">
                <TextInput
                  label="Rating"
                  name="rating"
                  type={"number"}
                  register={register}
                  errors={errors}
                  trigger={trigger}
                  min="1"
                  max="5"
                  placeholder="enter minmum 1 and max 5 rating"
                />
              </div>
            </div>

            {/* description field  */}

            <div className="mb-6 lg:mb-2">
              <p className="text-sm mb-1 text-gray-500">
                Product Description
                <span className="text-red-500">*</span>
              </p>
              <div className="quill-wrapper   rounded-lg border border-gray-300 overflow-hidden">
                <ReactQuill
                  onChange={handleQuillChange}
                  placeholder="Write your description..."
                  className="w-full overflow-y-auto h-72 bg-white rounded-md"
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
                <p className="text-sm mb-1 font-medium text-gray-700 ">
                  Thumbnail Image
                  <span className="text-red-500">*</span>
                </p>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSingleImageChange}
                  className="file-input file-input-bordered file-input-info w-full  "
                />
              </div>

              {/* gallary iamge  */}
              <div className="mb-6 lg:mb-2 w-full">
                <p className="text-sm mb-1 text-gray-500">
                  Gallary Image
                  <span className="text-red-500">*</span>
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMultiImageChange}
                  className="file-input file-input-bordered file-input-info w-full  "
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

const TextInput = ({
  name,
  label,
  asterRisk = true,
  type = "text",
  errors,
  register,
  trigger,
  ...rest
}) => {
  return (
    <>
      <label
        htmlFor={name}
        className={`block text-base font-medium text-gray-700 pb-2.5 ${
          errors?.[name] ? "border-red-500 text-red-500" : ""
        }`}
      >
        {label} {asterRisk && "*"}
      </label>
      <input
        id={name}
        type={type}
        {...register(name, {
          required: "This field is required",
        })}
        onBlur={() => trigger(name)} // Validate dynamically on blur
        className={`px-2 py-3 block w-full h-[50px] bg-white border rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          errors?.[name] ? "border-red-500" : "border-gray-300"
        }`}
        {...rest}
      />
      {errors?.[name] && (
        <p className="mt-2 text-sm text-red-500">{errors[name]?.message}</p>
      )}
    </>
  );
};
