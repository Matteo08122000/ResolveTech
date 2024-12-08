import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

const TicketsPieChart = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
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

        const priorityCounts = tickets.reduce(
          (acc, ticket) => {
            const priority = ticket.priority?.toLowerCase();
            acc[priority] = (acc[priority] || 0) + 1;
            return acc;
          },
          { low: 0, medium: 0, high: 0 }
        );

        const totalTickets =
          priorityCounts.low + priorityCounts.medium + priorityCounts.high;

        const chartData = {
          labels: ["Low", "Medium", "High"],
          datasets: [
            {
              label: "Ticket Priorities",
              data: [
                priorityCounts.low,
                priorityCounts.medium,
                priorityCounts.high,
              ],
              backgroundColor: ["#800080", "#d4af37", "#191970"],
              hoverOffset: 4,
            },
          ],
        };

        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        const ctx = chartRef.current.getContext("2d");
        chartInstanceRef.current = new Chart(ctx, {
          type: "pie",
          data: chartData,
          options: {
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Ticket Priority Distribution" },
              datalabels: {
                color: "#fff",
                formatter: (value, context) => {
                  const percentage = ((value / totalTickets) * 100).toFixed(2);
                  return `${percentage}%`;
                },
                font: { weight: "bold" },
              },
            },
          },
          plugins: [ChartDataLabels],
        });
      } catch (error) {
        console.error("Error fetching tickets:", error);
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

export default TicketsPieChart;
