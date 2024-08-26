import React, { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import DateTimePicker from "@/Components/Datetimepicker";
import styles from "./ExcelLineChart.module.css";
// Register the chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ExcelMultiLineChartWithFilter = ({ jsonData }) => {
  const [chartData, setChartData] = useState(null); // Initialized as null to prevent rendering too early
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDateTime, setStartDateTime] = useState(
    new Date("July 7 2024, 11:00:00")
  );
  const [endDateTime, setEndDateTime] = useState(
    new Date("July 7 2024, 12:00:00")
  );
  const [currentType, setCurrentType] = useState("All"); // Default to All currents
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
      const labels = jsonData
        .map((row) => {
          const excelDate = row["DATE & TIME"];
          return convertExcelDateToJSDate(excelDate);
        })
        .filter((date) => date >= startDateTime && date <= endDateTime)
        .map((date) => date.toLocaleString());

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
        // Alkaline_1
        "rgba(255, 99, 132, 1)", // Alkaline_1_R_Current (Red)
        "rgba(255, 206, 86, 1)", // Alkaline_1_Y_Current (Yellow)
        "rgba(54, 162, 235, 1)", // Alkaline_1_B_Current (Blue)

        // ALOXPECVD_2
        "rgba(75, 192, 192, 1)", // ALOXPECVD_2_R_Current (Teal)
        "rgba(153, 102, 255, 1)", // ALOXPECVD_2_Y_Current (Purple)
        "rgba(255, 159, 64, 1)", // ALOXPECVD_2_B_Current (Orange)

        // ALOXPECVD_3
        "rgba(201, 203, 207, 1)", // ALOXPECVD_3_R_Current (Grey)
        "rgba(99, 255, 132, 1)", // ALOXPECVD_3_Y_Current (Light Green)
        "rgba(102, 102, 255, 1)", // ALOXPECVD_3_B_Current (Light Blue)

        // Diffusion_1
        "rgba(255, 102, 102, 1)", // Diffusion_1_R_Current (Light Red)
        "rgba(255, 102, 204, 1)", // Diffusion_1_Y_Current (Pink)
        "rgba(102, 255, 178, 1)", // Diffusion_1_B_Current (Mint)

        // Diffusion_2
        "rgba(178, 255, 102, 1)", // Diffusion_2_R_Current (Lime)
        "rgba(255, 255, 102, 1)", // Diffusion_2_Y_Current (Soft Yellow)
        "rgba(102, 178, 255, 1)", // Diffusion_2_B_Current (Sky Blue)

        // Diffusion_3
        "rgba(204, 102, 255, 1)", // Diffusion_3_R_Current (Lavender)
        "rgba(255, 178, 102, 1)", // Diffusion_3_Y_Current (Peach)
        "rgba(102, 255, 255, 1)", // Diffusion_3_B_Current (Cyan)

        // Diffusion_4
        "rgba(255, 102, 178, 1)", // Diffusion_4_R_Current (Magenta)
        "rgba(178, 102, 255, 1)", // Diffusion_4_Y_Current (Violet)
        "rgba(255, 178, 204, 1)", // Diffusion_4_B_Current (Light Pink)

        // Ext_D1_Heater
        "rgba(255, 153, 51, 1)", // Ext_D1_Heater_R_Current (Bright Orange)
        "rgba(255, 51, 51, 1)", // Ext_D1_Heater_Y_Current (Bold Red)
        "rgba(0, 204, 102, 1)", // Ext_D1_Heater_B_Current (Deep Green)

        // Ext_D2_Heater
        "rgba(51, 102, 255, 1)", // Ext_D2_Heater_R_Current (Royal Blue)
        "rgba(204, 255, 153, 1)", // Ext_D2_Heater_Y_Current (Pastel Green)
        "rgba(255, 102, 0, 1)", // Ext_D2_Heater_B_Current (Orange-Red)

        // Ext_D3_Heater
        "rgba(102, 255, 102, 1)", // Ext_D3_Heater_R_Current (Bright Green)
        "rgba(153, 204, 255, 1)", // Ext_D3_Heater_Y_Current (Light Blue)
        "rgba(255, 51, 153, 1)", // Ext_D3_Heater_B_Current (Hot Pink)

        // Ext_D4_Heater
        "rgba(153, 102, 255, 1)", // Ext_D4_Heater_R_Current (Purple)
        "rgba(255, 206, 86, 1)", // Ext_D4_Heater_Y_Current (Yellow)
        "rgba(75, 192, 192, 1)", // Ext_D4_Heater_B_Current (Teal)

        // HotWaterTank_1
        "rgba(255, 99, 132, 1)", // HotWaterTank_1_R_Current (Red)
        "rgba(54, 162, 235, 1)", // HotWaterTank_1_Y_Current (Blue)
        "rgba(255, 206, 86, 1)", // HotWaterTank_1_B_Current (Yellow)

        // HotWaterTank_2
        "rgba(75, 192, 192, 1)", // HotWaterTank_2_R_Current (Teal)
        "rgba(153, 102, 255, 1)", // HotWaterTank_2_Y_Current (Purple)
        "rgba(255, 159, 64, 1)", // HotWaterTank_2_B_Current (Orange)

        // PreAnnealing_1
        "rgba(201, 203, 207, 1)", // PreAnnealing_1_R_Current (Grey)
        "rgba(99, 255, 132, 1)", // PreAnnealing_1_Y_Current (Light Green)
        "rgba(102, 102, 255, 1)", // PreAnnealing_1_B_Current (Light Blue)

        // PreAnnealing_2
        "rgba(255, 102, 102, 1)", // PreAnnealing_2_R_Current (Light Red)
        "rgba(255, 102, 204, 1)", // PreAnnealing_2_Y_Current (Pink)
        "rgba(102, 255, 178, 1)", // PreAnnealing_2_B_Current (Mint)

        // Texture_1
        "rgba(178, 255, 102, 1)", // Texture_1_R_Current (Lime)
        "rgba(255, 255, 102, 1)", // Texture_1_Y_Current (Soft Yellow)
        "rgba(102, 178, 255, 1)", // Texture_1_B_Current (Sky Blue)
      ];

      // Generate datasets dynamically based on the selected current type
      let lineDatasets = [];

      if (currentType === "All") {
        // Include all R, Y, and B currents for each system
        systems.forEach((system, index) => {
          ["R_Current", "Y_Current", "B_Current"].forEach((type, typeIndex) => {
            const key = `${system}_${type}`;
            lineDatasets.push({
              label: key,
              data: jsonData
                .map((row) => row[key])
                .filter((_, i) => {
                  const date = convertExcelDateToJSDate(
                    jsonData[i]["DATE & TIME"]
                  );
                  return date >= startDateTime && date <= endDateTime;
                }),
              borderColor: colors[(index * 3 + typeIndex) % colors.length],
              backgroundColor: colors[(index * 3 + typeIndex) % colors.length],
              borderWidth: 2,
              fill: false,
              pointRadius: 3,
              pointHoverRadius: 6,
              tension: 0.4,
            });
          });
        });
      } else {
        // Only include the selected current type for each system
        lineDatasets = systems.map((system, index) => {
          const key = `${system}_${currentType}`;
          return {
            label: key,
            data: jsonData
              .map((row) => row[key])
              .filter((_, i) => {
                const date = convertExcelDateToJSDate(
                  jsonData[i]["DATE & TIME"]
                );
                return date >= startDateTime && date <= endDateTime;
              }),
            borderColor: colors[index % colors.length],
            backgroundColor: colors[index % colors.length],
            borderWidth: 2,
            fill: false,
            pointRadius: 3,
            pointHoverRadius: 6,
            tension: 0.4,
          };
        });
      }

      // Set the chart data
      setChartData({
        labels: labels,
        datasets: lineDatasets,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error processing chart data:", error);
      setError(error.message);
      setLoading(false);
    }
  }, [startDateTime, endDateTime, currentType, jsonData]); // Re-fetch data when currentType or jsonData changes

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
        type: "category", // Ensure correct scale type is registered
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          borderDash: [8, 4],
        },
      },
      y: {
        stacked: false,
        ticks: {
          beginAtZero: true,
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
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
      <h2>Individual Current Chart</h2>
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
        <label>
          <input
            type="radio"
            value="All"
            checked={currentType === "All"}
            onChange={handleCurrentTypeChange}
          />
          All Currents
        </label>
      </div>
      {chartData && chartData.labels && chartData.labels.length > 0 && (
        <div className={styles.chart}>
          <Line ref={chartRef} data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default ExcelMultiLineChartWithFilter;
