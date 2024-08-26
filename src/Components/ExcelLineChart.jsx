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
import DateTimePicker from "./Datetimepicker";
import styles from "./ExcelLineChart.module.css";

// Register scales and other required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ExcelLineChart = ({ jsonData }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDateTime, setStartDateTime] = useState(
    new Date("July 7 2024, 11:00:00")
  );
  const [endDateTime, setEndDateTime] = useState(
    new Date("July 7 2024, 12:00:00")
  );
  const chartRef = useRef(null);

  const convertExcelDateToJSDate = (serial) => {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    const fractional_day = serial - Math.floor(serial) + 0.0000001;
    const total_seconds = Math.floor(86400 * fractional_day);
    const seconds = total_seconds % 60;
    const hours = Math.floor(total_seconds / 3600);
    const minutes = Math.floor((total_seconds - hours * 3600) / 60);

    date_info.setSeconds(seconds);
    date_info.setMinutes(minutes);
    date_info.setHours(hours);

    return date_info;
  };

  const generateShade = (baseColor, index, totalShades) => {
    const alpha = 1 - (index / totalShades) * 0.4;
    return baseColor.replace(/1\)$/, `${alpha})`);
  };

  useEffect(() => {
    try {
      const labels = jsonData
        .map((row) => {
          const excelDate = row["DATE & TIME"];
          return convertExcelDateToJSDate(excelDate);
        })
        .filter((date) => date >= startDateTime && date <= endDateTime)
        .map((date) => date.toLocaleString());

      const relevantKeys = [
        "HT_OG1_R_Current",
        "HT_OG1_Y_Current",
        "HT_OG1_B_Current",
        "HT_OG2_R_Current",
        "HT_OG2_Y_Current",
        "HT_OG2_B_Current",
      ];

      const baseColors = {
        R: "rgba(255, 0, 0, 1)",
        Y: "rgba(245, 230, 83, 1)",
        B: "rgba(0, 0, 255, 1)",
      };

      const datasets = relevantKeys.map((key, index) => {
        const colorKey = key.split("_")[2];
        const totalShades = relevantKeys.filter((k) =>
          k.includes(colorKey)
        ).length;
        const shade = generateShade(
          baseColors[colorKey],
          index % totalShades,
          totalShades
        );

        return {
          label: key,
          data: jsonData
            .map((row) => row[key])
            .filter((_, index) => {
              const date = convertExcelDateToJSDate(
                jsonData[index]["DATE & TIME"]
              );
              return date >= startDateTime && date <= endDateTime;
            }),
          fill: false,
          borderColor: shade,
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 6,
          tension: 0.4,
        };
      });

      setChartData({
        labels: labels,
        datasets: datasets,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error processing chart data:", error);
      setError(error.message);
      setLoading(false);
    }
  }, [startDateTime, endDateTime, jsonData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Disable aspect ratio to allow the chart to fill its container
    scales: {
      x: {
        type: "category",
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          borderDash: [8, 4],
        },
      },
      y: {
        stacked: false,
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
      <h2>HT Current Chart</h2>
      <DateTimePicker
        startDateTime={startDateTime}
        setStartDateTime={setStartDateTime}
        endDateTime={endDateTime}
        setEndDateTime={setEndDateTime}
      />
      {chartData && chartData.labels && chartData.labels.length > 0 && (
        <div className={styles.chart}>
          <Line ref={chartRef} data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default ExcelLineChart;
