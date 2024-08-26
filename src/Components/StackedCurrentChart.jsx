import React, { useEffect, useState, useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import DateTimePicker from "@/Components/Datetimepicker";
import styles from "./ExcelLineChart.module.css";
// Register the chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ExcelCompositeChart = ({ jsonData }) => {
  const [chartData, setChartData] = useState(null); // Initialized as null to prevent rendering too early
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDateTime, setStartDateTime] = useState(
    new Date("July 7 2024, 11:00:00")
  );
  const [endDateTime, setEndDateTime] = useState(
    new Date("July 7 2024, 12:00:00")
  );
  const [currentType, setCurrentType] = useState("R_Current"); // Default to R_Current
  const chartRef = useRef(null); // For handling chart instance

  // Function to convert Excel date serial number to JavaScript Date
  const convertExcelDateToJSDate = (serial) => {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    const fractional_day = serial - Math.floor(serial) + 0.0000001;
    const total_seconds = Math.floor(86400 * fractional_day);
    const seconds = total_seconds % 60;
    const hours = Math.floor(total_seconds / 3600);
    const minutes = Math.floor((total_seconds - hours * 3600) / 60);

    // Set the time components
    date_info.setSeconds(seconds);
    date_info.setMinutes(minutes);
    date_info.setHours(hours);

    return date_info;
  };

  const handleCurrentTypeChange = (e) => {
    setCurrentType(e.target.value); // Update the selected current type
  };

  useEffect(() => {
    // Ensure that jsonData is defined and not empty before processing
    if (!jsonData || jsonData.length === 0) {
      setError("No data available");
      setLoading(false);
      return;
    }

    try {
      // Convert Excel serial dates to JavaScript Date format and filter
      const filteredData = jsonData.filter((row) => {
        const excelDate = row["DATE & TIME"];
        const date = convertExcelDateToJSDate(excelDate);
        return date >= startDateTime && date <= endDateTime;
      });

      const labels = filteredData.map((row) =>
        convertExcelDateToJSDate(row["DATE & TIME"]).toLocaleString()
      );

      // List of systems to consider
      const systems = [
        "Alkaline_1",
        "ALOXPECVD_2",
        "ALOXPECVD_3",
        "Diffusion_1",
        "Diffusion_2",
        "Diffusion_3",
        "Diffusion_4",
        "Ext_D1_Heater",
        "Ext_D2_Heater",
        "Ext_D3_Heater",
        "Ext_D4_Heater",
        "HotWaterTank_1",
        "HotWaterTank_2",
        "PreAnnealing_1",
        "PreAnnealing_2",
        "Texture_1",
      ];

      const colors = [
        "rgba(255, 99, 132, 0.8)", // Red
        "rgba(255, 206, 86, 0.8)", // Yellow
        "rgba(54, 162, 235, 0.8)", // Blue
        "rgba(75, 192, 192, 0.8)", // Teal
        "rgba(153, 102, 255, 0.8)", // Purple
        "rgba(255, 159, 64, 0.8)", // Orange
        "rgba(201, 203, 207, 0.8)", // Grey
        "rgba(99, 255, 132, 0.8)", // Light Green
        "rgba(102, 102, 255, 0.8)", // Light Blue
        "rgba(255, 102, 102, 0.8)", // Light Red
        "rgba(255, 102, 204, 0.8)", // Pink
        "rgba(102, 255, 178, 0.8)", // Mint
        "rgba(178, 255, 102, 0.8)", // Lime
        "rgba(255, 255, 102, 0.8)", // Soft Yellow
        "rgba(102, 178, 255, 0.8)", // Sky Blue
      ];

      // Generate datasets for stacked bar chart
      const barDatasets = systems.map((system, index) => ({
        label: `${system}_${currentType}`,
        data: filteredData.map((row) => row[`${system}_${currentType}`] || 0),
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length],
        borderWidth: 1,
      }));

      // Calculate total current for the selected type
      const totalCurrentData = filteredData.map((row) => {
        return systems.reduce((total, system) => {
          const value = row[`${system}_${currentType}`] || 0;
          return total + value;
        }, 0);
      });

      // Line dataset for total current
      const lineDataset = {
        label: "Total Current",
        data: totalCurrentData,
        type: "line",
        borderColor: "rgba(255, 0, 0, 1)", // Red line for total current
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6,
        fill: false,
        yAxisID: "y2", // Use the secondary y-axis for the line dataset
      };

      // Set the chart data
      setChartData({
        labels: labels,
        datasets: [...barDatasets, lineDataset],
      });

      setLoading(false);
    } catch (error) {
      console.error("Error processing chart data:", error);
      setError(error.message);
      setLoading(false);
    }
  }, [startDateTime, endDateTime, currentType, jsonData]);

  useEffect(() => {
    // Clean up the chart when the component unmounts or before a new chart is rendered
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          borderDash: [8, 4],
        },
      },
      y: {
        stacked: true,
        ticks: {
          beginAtZero: true,
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      y2: {
        type: "linear",
        position: "right",
        grid: {
          drawOnChartArea: false, // Don't draw grid lines for the secondary y-axis
        },
        ticks: {
          beginAtZero: true,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.containergraph}>
      <h2>Composite Current Chart</h2>
      <DateTimePicker
        startDateTime={startDateTime}
        setStartDateTime={setStartDateTime}
        endDateTime={endDateTime}
        setEndDateTime={setEndDateTime}
      />
      <div className={styles.type}>
        <label>
          <input
            type="radio"
            value="R_Current"
            checked={currentType === "R_Current"}
            onChange={handleCurrentTypeChange}
          />
          R Current
        </label>
        <label>
          <input
            type="radio"
            value="Y_Current"
            checked={currentType === "Y_Current"}
            onChange={handleCurrentTypeChange}
          />
          Y Current
        </label>
        <label>
          <input
            type="radio"
            value="B_Current"
            checked={currentType === "B_Current"}
            onChange={handleCurrentTypeChange}
          />
          B Current
        </label>
      </div>
      {chartData && chartData.labels && chartData.labels.length > 0 && (
        <div className={styles.chart}>
          <Bar ref={chartRef} data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default ExcelCompositeChart;
