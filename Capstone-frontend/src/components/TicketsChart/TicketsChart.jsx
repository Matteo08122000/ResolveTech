import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

const TicketsChart = () => {
  const chartRef = useRef(null);
  const [tokenAvailable, setTokenAvailable] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setTokenAvailable(true);
    } else {
      console.error("Token not found. Please log in.");
    }
  }, []);

  useEffect(() => {
    if (tokenAvailable) {
      fetchData();
    }
  }, [tokenAvailable]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found. Please log in.");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/tickets`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const { tickets } = data;

      const statusCounts = tickets.reduce(
        (acc, ticket) => {
          const status = ticket.status?.toLowerCase();
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        },
        { open: 0, "in progress": 0, resolved: 0, closed: 0 }
      );

      const chartData = {
        labels: ["Open", "In progress", "Resolved", "Closed"],
        datasets: [
          {
            label: "Ticket Status",
            data: [
              statusCounts.open,
              statusCounts["in progress"],
              statusCounts.resolved,
              statusCounts.closed,
            ],
            backgroundColor: ["#800080", "#d4af37", "#191970", "#e5e5e5"],
            borderColor: ["#800080", "#d4af37", "#191970", "#e5e5e5"],
            borderWidth: 1,
          },
        ],
      };

      const ctx = chartRef.current.getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Ticket Status Distribution" },
          },
        },
      });
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  return <canvas  ref={chartRef} />;
};

export default TicketsChart;
