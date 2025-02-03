import React, { useState, useEffect } from 'react';
import TotalOrders from '../../components/dashboard/TotalOrders';
import OrderInformation from '../../components/dashboard/OrderInformation';
import DaliveryStatus from '../../components/dashboard/DelivaryStatus';
import LineGraph from '../../components/dashboard/LineGraph';

const Dashboard = () => {
 
  return (
    <div>
      <TotalOrders></TotalOrders>
      <OrderInformation></OrderInformation>
      {/* <DaliveryStatus></DaliveryStatus> */}
      {/* <LineGraph></LineGraph> */}
    </div>
  );
};

export default Dashboard;
