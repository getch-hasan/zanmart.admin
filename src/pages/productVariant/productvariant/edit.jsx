import React, { useState, useEffect, useCallback } from "react";
import { NetworkServices } from "../../../network";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Toastify } from "../../../components/toastify";
import { SkeletonForm } from "../../../components/loading/skeleton-table";
import { networkErrorHandeller } from "../../../utils/helper";
import { SearchDropdownWithSingle } from "../../../components/input/selectsearch";
const ProductVariantEdit = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [colors, setColors] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [unit, setUnit] = useState([]);
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedAttribute, setSelectedAttribute] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [quantity, setQuantity] = useState("");
  const [weight, setWeight] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [allAttributes, setAllAttributes] = useState([]);
  const [productVariantData, setProductVariantData] = useState({});
  const [flatDiscount, setFlatDiscount] = useState("");
  // Fetch products, colors, attri=butes, and units from the APIs
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
        networkErrorHandeller(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  //   fetch product
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const ProductResponse = await NetworkServices.Product.index();
        if (ProductResponse.status === 200) {
          const result = ProductResponse?.data?.data?.data;
          const data = result.map((data) => {
            return {
              ...data,
              label: data?.product_name,
              value: data?.product_id,
            };
          });
          setProducts(data);
        }
      } catch (error) {}
    };
    fetchProducts();
  }, []);
  //   submit product variant as edit
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      // You can send this formData to your API
      const payload = [
        {
          product_id:
            Number(selectedProduct) || Number(productVariantData?.product_id),
          color_id:
            Number(selectedColor) || Number(productVariantData?.color_id),
          attribute_id:
            Number(selectedAttribute) ||
            Number(productVariantData?.attribute_id),
          unit_id: Number(selectedUnit) || Number(productVariantData?.unit_id),
          product_qty:
            Number(quantity) || Number(productVariantData?.product_qty),
          weight: Number(weight) || Number(productVariantData?.weight),
          price: Number(price) || Number(productVariantData?.price),
          flat_discount:
            Number(flatDiscount) || Number(productVariantData?.flat_discount),
          product_variant_id: Number(id),
        },
      ];
      const response = await NetworkServices.ProductVariant.update(id, payload);
      if (response.status === 200 || response.status === 201) {
        navigate("/dashboard/product-variant");
        Toastify.Success("Product varaint create successfully.");
      }
    } catch (error) {
      Toastify.Error(error);
    }
  };

  //  fetch product variant
  const fetchProductVariants = useCallback(async () => {
    try {
      const response = await NetworkServices.ProductVariant.show(id);
      if (response.status === 200) {
        // setAddedVariant(response?.data?.data)
        setSelectedProduct(response?.data?.data?.product_id);
        setProductVariantData(response?.data?.data);
      }
    } catch (error) {
      Toastify.Error(error);
    }
  }, [id]);
  useEffect(() => {
    fetchProductVariants();
  }, []);
  //    global exist value check function
  const defaultVariantFuntion = (key = [], filterName) => {
    const result = key?.find(
      (item) => item?.[filterName] === productVariantData?.[filterName]
    );
    return result;
  };
  //   find out attribute bye name
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
              <SearchDropdownWithSingle
                placeholder={
                  products.find(
                    (item) => item?.product_id == productVariantData?.product_id
                  )?.title ?? "Select your  product"
                }
                options={products}
                showName="title"
              />
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
                  <option
                    value={defaultVariantFuntion(colors, "color_id")?.color_id}
                  >
                    {" "}
                    {defaultVariantFuntion(colors, "color_id")?.name}{" "}
                  </option>
                  {colors?.map((color) => {
                    return (
                      defaultVariantFuntion(colors, "color_id")?.color_id !==
                        color?.color_id && (
                        <option key={color?.color_id} value={color?.color_id}>
                          {color?.name}
                        </option>
                      )
                    );
                  })}
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
                  <option
                    value={defaultVariantFuntion(unit, "unit_id")?.unit_id}
                  >
                    {defaultVariantFuntion(unit, "unit_id")?.name}
                  </option>
                  {unit?.map((itm) => {
                    return (
                      defaultVariantFuntion(unit, "unit_id")?.unit_id !==
                        itm?.unit_id && (
                        <option key={itm?.id} value={itm?.unit_id}>
                          {itm?.name}
                        </option>
                      )
                    );
                  })}
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
                  onChange={(e) => setSelectedAttribute(e.target.value)}
                  className="block w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={attributes?.length ? false : true}
                >
                  <option
                    value={
                      defaultVariantFuntion(allAttributes, "attribute_id")
                        ?.attribute_id
                    }
                  >
                    {defaultVariantFuntion(allAttributes, "attribute_id")?.name}
                  </option>
                  {attributes?.map((attribute) => {
                    return (
                      defaultVariantFuntion(allAttributes, "attribute_id")
                        ?.attribute_id !== attribute?.attribute_id && (
                        <option
                          key={attribute?.id}
                          value={attribute?.attribute_id}
                        >
                          {attribute?.name}
                        </option>
                      )
                    );
                  })}
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
                  //   value={productVariantData?.product_qty||''}
                  defaultValue={productVariantData?.product_qty}
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
                  defaultValue={productVariantData?.weight}
                  //   value={weight}
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
                  //   value={price}

                  defaultValue={productVariantData?.price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="block w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter Price"
                />
              </div>
              {/* Flat Discount Input */}
              <div className="flex-1">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Flat Discount ($)
                </label>
                <input
                  type="number"
                  id="price"
                  //   value={price}

                  defaultValue={productVariantData?.flat_discount}
                  onChange={(e) => setFlatDiscount(e.target.value)}
                  className="block w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter Price"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
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

export default ProductVariantEdit;
