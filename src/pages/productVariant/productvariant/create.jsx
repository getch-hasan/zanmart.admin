import React, { useState, useEffect } from "react";
import { NetworkServices } from "../../../network";
import { Link, useNavigate } from "react-router-dom";
import { Toastify } from "../../../components/toastify";
import { SkeletonForm } from "../../../components/loading/skeleton-table";
import { SearchDropdownWithSingle } from "../../../components/input/selectsearch";
 
const ProductForm = () => {
  const [products, setProducts] = useState([]);
  const [colors, setColors] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [allAttributes, setAllAttributes] = useState([]);
  const [unit, setUnit] = useState([]);
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedAttribute, setSelectedAttribute] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [quantity, setQuantity] = useState("");
  const [weight, setWeight] = useState("");
  const [price, setPrice] = useState("");
  const [flatDiscount, setFlatDiscount] = useState("");
  const [loading, setLoading] = useState(false);
  const [addedVariant, setAddedVariant] = useState([]);
  // all attribute color,unit filter product fetch here
  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true)
      try {
        const colorResponse = await NetworkServices.Color.index();
        const attributeResponse = await NetworkServices.Attribute.index();
        const unitResponse = await NetworkServices.Unit.index();
        if (
          colorResponse?.status === 200 &&
          attributeResponse?.status === 200 &&
          unitResponse?.status === 200
        ) {
          setColors(colorResponse?.data?.data?.data);
          setAllAttributes(attributeResponse?.data?.data?.data);
          setUnit(unitResponse?.data?.data?.data);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const [ddd, setdd] = useState(false);
  useEffect(() => {
    // only product fetch here
    const fetchProducts = async () => {
      try {
        const ProductResponse = await NetworkServices.Product.index();
        if (ProductResponse.status === 200) {
            const result = ProductResponse?.data?.data?.data;
           const data = result.map((data)=>{
            return{
             ...data,
              label: data?.product_name,
              value: data?.product_id,
            }

           })
          setProducts(data);
        }
      } catch (error) {
        Toastify.Error(error);
      }
    };
    fetchProducts();
  }, [ddd]);
  // submit here   code
  const handleSubmit = async (e) => {
    try {
      const data = {
        product_id: Number(selectedProduct),
        color_id: Number(selectedColor),
        attribute_id: Number(selectedAttribute),
        unit_id: Number(selectedUnit),
        product_qty: Number(quantity),
        weight: Number(weight),
        price: Number(price),
        flat_discount : Number(flatDiscount)
      };
      const updateValue = [...addedVariant, data];
      e.preventDefault();
      // You can send this formData to your API
      const response = await NetworkServices.ProductVariant.store(updateValue);
      if (response.status === 200 || response.status === 201) {
        navigate("/dashboard/product-variant");
        return Toastify.Success("Product varaint create successfully.");
      }
    } catch (error) {
      return Toastify.Error(error);
    }
  };

  // added variant variants
  const handelAllVariant = () => {
    const data = {
      product_id: Number(selectedProduct),
      color_id: Number(selectedColor),
      attribute_id: Number(selectedAttribute),
      unit_id: Number(selectedUnit),
      product_qty: Number(quantity),
      weight: Number(weight),
      price: Number(price),
      flat_discount : Number(flatDiscount)
    };
    setAddedVariant((prev) => [...prev, data]);
    setdd(!ddd);
    setSelectedColor("");
    setSelectedAttribute("");
    setSelectedProduct("");
    setSelectedUnit("");
    setPrice("");
    setQuantity("");
    setWeight("");
    setFlatDiscount("");
  };
  // change attribute code here
  const handleAttributeChange = (e) => {
    if (!selectedUnit) {
      Toastify.Error("please select unit");
      return;
    }
    setSelectedAttribute(e.target.value);
  };
  const handleUnitChangeForAttribute = (e) => {
    setSelectedUnit(e.target.value);
    setAttributes(
      allAttributes.filter(
        (attribute) => attribute?.unit?.unit_id === Number(e.target.value)
      )
    );
  };
 
  return (
    <>
      {loading ? (
        <SkeletonForm />
      ) : (
        <div className="p-6 bg-gray-100 rounded-md shadow-md mx-auto">
          <div className="flex justify-between">
            <h2 className="text-lg font-bold mb-4 text-gray-700">
              Product Information
            </h2>
            <Link to={`/dashboard/product-variant/`}>
              <span className="border border-green-500 rounded-full material-symbols-outlined p-1">
                list
              </span>
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Product Select Dropdown */}
            <div className="mb-4 "> 

                <SearchDropdownWithSingle options={products} showName="title" handleChange={(e)=>{
                    console.log(e?.product_id);
                    setSelectedProduct(e?.product_id)
                }}/>
            </div>

            {/* Row for Color and Attribute */}
            <div className="flex mb-4 gap-4">
              {/* Color Select Dropdown */}
              <div className="flex-1">
                <label
                  htmlFor="color"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Select Color
                </label>
                <select
                  id="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="block w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Color</option>
                  {colors?.map((color) => (
                    <option key={color?.color_id} value={color?.color_id}>
                      {color?.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Unit Select Dropdown */}
              <div className="flex-1">
                <label
                  htmlFor="unit"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Select Unit
                </label>
                <select
                  id="unit"
                  value={selectedUnit}
                  onChange={handleUnitChangeForAttribute}
                  className="block w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Unit</option>
                  {unit?.map((itm) => (
                    <option key={itm?.id} value={itm?.unit_id}>
                      {itm?.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row for Unit and Quantity */}
            <div className="flex mb-4 gap-4">
              {/* Attribute Select Dropdown */}
              <div className="flex-1">
                <label
                  htmlFor="attribute"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Select Attribute
                </label>
                <select
                  id="attribute"
                  value={selectedAttribute}
                  onChange={handleAttributeChange}
                  className="block w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={attributes?.length ? false : true}
                >
                  <option value="">Select Attribute</option>
                  {attributes?.map((attribute) => (
                    <option key={attribute?.id} value={attribute?.attribute_id}>
                      {attribute?.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Quantity Input */}
              <div className="flex-1">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Product Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="block w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter Quantity"
                />
              </div>
            </div>

            {/* Row for Weight and Price */}
            <div className="flex mb-4 gap-4">
              {/* Weight Input */}
              <div className="flex-1">
                <label
                  htmlFor="weight"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Weight (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="block w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter Weight"
                />
              </div>

              {/* Price Input */}
              <div className="flex-1">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price ($)
                </label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="block w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter Price"
                />
              </div>
              {/* flat discount  */}
              <div className="flex-1">
                <label
                  htmlFor="flat_discount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Flat Discount ($)
                </label>
                <input
                  type="number"
                  id="flat_discount"
                  value={flatDiscount}
                  onChange={(e) => setFlatDiscount(e.target.value)}
                  className="block w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter Flat Discount"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <span
                onClick={handelAllVariant}
                className="cursor-pointer flex justify-center w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add
              </span>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ProductForm;
