import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { privateRequest } from "../../config/axios.config";
import moment from "moment";
import { FaCarSide } from "react-icons/fa";
import OrderModal from "../../components/orderFormModal/OrderModal";
const OrderDetails = () => {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState(""); // Track selected status

  useEffect(() => {
    privateRequest
      .get(`/admin/order/${id}`)
      .then((response) => {
        setOrderDetails(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const handleStatusChange = (event) => {
    const selectedStatus = event.target.value;
    setStatus(selectedStatus);
    if (selectedStatus === "Processing") {
      setIsModalOpen(true); // Open modal if Processing is selected
    }
  };

  //   formate date code here
  const formatDate = (dateString) => {
    const formattedDate = moment(dateString).format("DD MMM YYYY");
    return formattedDate;
  };
  const orderAllPrice =  () => {
    let subtotal =  orderDetails?.["order item"]?.reduce((acc, curr) => Number(acc) + Number(curr?.sell_price)*curr?.qty, 0);
    let taxPrice = orderDetails?.["order item"]?.reduce((acc, curr) => Number(acc) + Number(curr?.product.tax_price) , 0);
    return{
      subtotal,
    taxPrice,
    totalPrice: subtotal + taxPrice,
    }
  }
const hendleOpnenOrderModal=()=>{
setIsModalOpen(!isModalOpen)
console.log(isModalOpen)
}

  console.log(orderAllPrice()?.subtotal);
  return (
    <div>
      <div className="flex gap-5 ">
        <div className="w-8/12 space-y-4">
          {/* order product show section  */}
          <section className="rounded-lg p-4 shadow-sm bg-blue-50 space-y-3">
            <div className="flex justify-between">
            <p className="bg-[#F7FAFC] p-4 rounded-lg font-bold text-base text-gray-500">
              All Item
            </p> 
            <select
                value={status}
                onChange={handleStatusChange}
                className="bg-primary text-white rounded-lg px-5"
              >
                <option value="">Select Status</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
            {orderDetails?.["order item"]?.map((item, index) => (
              <div
                className={` flex justify-between items-center hover:bg-[#F7FAFC] rounded-lg p-4 ${
                  index % 2 === 0 ? "bg-[#F7FAFC]" : ""
                }`}
              >
                <div className="flex gap-4 items-center">
                  <img
                    className="w-16 h-16 border rounded-lg"
                    src={`${process.env.REACT_APP_BASE_API}${item?.product?.thumbnail_image}`}
                    alt="loading"
                  />
                  <div>
                    <p>Product Name</p>
                    <p className="text-base font-bold text-gray-600">
                      {" "}
                      {item?.product?.title}
                    </p>
                  </div>
                </div>
                <div>
                  <p>quantity</p>
                  <p className="text-base font-bold text-gray-600">
                    {" "}
                    {item?.qty}
                  </p>
                </div>
                <div>
                  <p>price</p>
                  <p className="text-base font-bold text-gray-600">
                    {item?.sell_price * item?.qty}
                  </p>
                </div>
              </div>
            ))}
          </section>
          {/* pricing calculation code here  */}
          <section className="rounded-lg p-4 shadow-sm bg-blue-50 space-y-3">
            <div className={`  rounded-lg p-4  `}>
              <div className="  w-full flex py-3 font-bold text-black   bg-[#F7FAFC]">
                <p className="w-3/4">Cart Totals</p>
                <p className="1/4">Price</p>
              </div>
              <div className=" border-b-2 w-full flex py-4 font-bold  hover:bg-[#F7FAFC] mt-2">
                <p className="w-3/4">Subtotal:</p>
                <p className="1/4">${orderAllPrice()?.subtotal}</p>
              </div>

              {/* <div className=" border-b-2 w-full flex py-4 font-bold  hover:bg-[#F7FAFC]">
                <p className="w-3/4">Shipping:</p>
                <p className="1/4">$10.00</p>
              </div> */}

              <div className=" border-b-2 w-full flex py-4 font-bold  hover:bg-[#F7FAFC]">
                <p className="w-3/4">Tax (GST):</p>
                <p className="1/4">${
                  orderAllPrice()?.taxPrice
                }</p>
              </div>

              <div className=" border-b-2 w-full flex py-4 font-bold  hover:bg-[#F7FAFC]">
                <p className="w-3/4 text-black">Total price:</p>
                <p className="1/4 text-red-500"> 
                $
                {
                  orderAllPrice()?.totalPrice
                }
                </p>
              </div>
            </div>
          </section>
        </div>
        {/* order divided second part  */}
        <section className="w-4/12 space-y-4">
          {/* order summary
           */}
          <section className="rounded-lg p-4 shadow-sm bg-blue-50">
            <h2 className="font-bold text-base text-black pb-2"> Summary</h2>
            <div className="grid grid-cols-2">
              <div className="text-gray-600 text-base">
                <p>Order ID</p>
                <p>Date</p>
                <p>Total</p>
              </div>
              <div className="font-bold text-base text-black ">
                <p>order me</p>
                <p>{formatDate(orderDetails?.["order Details"]?.updated_at)}</p>
                <p className="text-red-600">
                  ${orderDetails?.["order Details"]?.total_amount}
                </p>
              </div>
            </div>
          </section>
          {/* shpping address  */}
          <section className="rounded-lg p-4 shadow-sm bg-blue-50">
            <h2 className="font-bold text-base text-black pb-2">
              Shipping Address
            </h2>
            <p className="text-gray-600 overflow-auto">
              {orderDetails?.["order Details"]?.shipping_address?.address_line1}
              ,{" "}
              {orderDetails?.["order Details"]?.shipping_address?.address_line2}
              , {orderDetails?.["order Details"]?.shipping_address?.postal_code}
              , {orderDetails?.["order Details"]?.shipping_address?.union?.name}
              ,{" "}
              {orderDetails?.["order Details"]?.shipping_address?.upazila?.name}
              ,{" "}
              {
                orderDetails?.["order Details"]?.shipping_address?.district
                  ?.name
              }
              ,{" "}
              {
                orderDetails?.["order Details"]?.shipping_address?.division
                  ?.name
              }
            </p>
          </section>
          {/* payment method section  */}
          <section className="rounded-lg p-4 shadow-sm bg-blue-50">
            <h2 className="font-bold text-base text-black pb-2">
              Payment Method
            </h2>
            <p className="text-gray-600 overflow-auto">
              {orderDetails?.["order Details"]?.payment_status}
            </p>
          </section>
          {/* tracking order and expected date of delivery  */}
          <section className="rounded-lg p-4 shadow-sm bg-blue-50">
            <h2 className="font-bold text-base text-black pb-2">
              Expected Date Of Delivery
            </h2>
            <p className="text-green-600 overflow-auto font-bold text-base">
              {formatDate(orderDetails?.["order Details"]?.updated_at)}
            </p>
            <Link to={`/dashboard/order/order-tracking/${id}`} className="border border-blue-600 rounded-lg text-blue-600 hover:text-white hover:bg-blue-600 font-semibold text-base w-full flex justify-center items-center gap-2 py-3 mt-3">
              {" "}
              <FaCarSide /> Track Order
            </Link>
          </section>
        </section>
      </div>
      {
        isModalOpen && <OrderModal setIsModalOpen={setIsModalOpen} hendleOpnenOrderModal={hendleOpnenOrderModal}/>
      }
    </div>
  );
};

export default OrderDetails;
