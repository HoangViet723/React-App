import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';

const PieChart = () => {
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        type: 'bar', // Thay đổi từ 'pie' thành 'bar'
        width: '100%',
        height: '500px',
      },
      labels: [],
    },
    series: [],
  });

  useEffect(() => {
    axios
      .get('http://localhost:3001/user')
      .then((response) => {
        const addressData = response.data.reduce((acc, curr) => {
          acc[curr.address] = (acc[curr.address] || 0) + 1;
          return acc;
        }, {});

        setChartData({
          options: {
            ...chartData.options,
            labels: Object.keys(addressData),
          },
          series: [{ data: Object.values(addressData) }], // Đối với biểu đồ cột, dữ liệu cần được đặt trong một mảng
        });
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <center>
        <h2>Biểu đồ địa chỉ</h2>
      </center>
      <ReactApexChart options={chartData.options} series={chartData.series} type="bar" />
    </div>
  );
};

export default PieChart;
