import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const RadarChart = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found. Please log in.");

        const baseUrl = import.meta.env.VITE_SERVER_BASE_URL;
        const endpoint = `/tickets?page=1&limit=2`;
        const url = `${baseUrl}${endpoint}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const { tickets } = await response.json();

        const priorities = tickets.reduce(
          (acc, ticket) => {
            acc[ticket.priority.toLowerCase()] += 1;
            return acc;
          },
          { low: 0, medium: 0, high: 0 }
        );

        const chartData = {
          labels: ["Low", "Medium", "High"],
          datasets: [
            {
              label: "Priority Distribution",
              data: [priorities.low, priorities.medium, priorities.high],
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              borderColor: "#800080",
              borderWidth: 2,
            },
          ],
        };

        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new Chart(chartRef.current, {
          type: "radar",
          data: chartData,
          options: {
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Priority Distribution" },
            },
            scales: {
              r: { beginAtZero: true },
            },
          },
        });
      } catch (error) {
        console.error("Error fetching priority data:", error);
      }
    };

    fetchData();

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  return <canvas ref={chartRef} />;
};

export default RadarChart;
