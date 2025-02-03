import React, { useState } from 'react';

const OrderInformation = () => {

  const [totalOrders, setTotalOrders] = useState(500);
  const [ordersProcessing, setOrdersProcessing] = useState(150);
  const [ordersDelivered, setOrdersDelivered] = useState(320);

  return (
    <div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-300 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Total Orders</h2>
          <p className="text-2xl font-bold mt-2">{totalOrders}</p>
        </div>

        <div className="bg-cyan-400 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Orders Processing</h2>
          <p className="text-2xl font-bold mt-2">{ordersProcessing}</p>
        </div>

        <div className="bg-yellow-300 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Orders Delivered</h2>
          <p className="text-2xl font-bold mt-2">{ordersDelivered}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderInformation;