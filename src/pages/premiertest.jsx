import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";
import PowerChartHT from "@/Components/PowerChartHT";
import ExcelLineChart from "../components/ExcelLineChart";

import ExcelMultiLineChartWithFilter from "@/Components/CurrentChart";
import ExcelStackedBarChart from "@/Components/StackedCurrentChart";
import ExcelCompositeChart from "@/Components/CompositeChart";
import styles from "./pages.module.css";
import Head from "next/head";

const AllChartsPage = ({ jsonData1, jsonData2, jsonData3 }) => {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Manrope:wght@400;800&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className={styles.topbar}>Premier Test</div>
      <div className={styles.container}>
        <ExcelLineChart jsonData={jsonData1} />
        <PowerChartHT jsonData={jsonData1} />
        <ExcelCompositeChart jsonData={jsonData2} />
        <ExcelMultiLineChartWithFilter jsonData={jsonData3} />
        <ExcelStackedBarChart jsonData={jsonData3} />
      </div>
    </>
  );
};

export async function getStaticProps() {
  try {
    // Fetch and parse the first Excel file
    const filePath1 = path.join(process.cwd(), "public", "HTdata.xlsx");
    const fileBuffer1 = fs.readFileSync(filePath1);
    const workbook1 = XLSX.read(fileBuffer1, { type: "buffer" });
    const worksheet1 = workbook1.Sheets[workbook1.SheetNames[0]];
    const jsonData1 = XLSX.utils.sheet_to_json(worksheet1);

    // Fetch and parse the second Excel file
    const filePath2 = path.join(process.cwd(), "public", "FeederKw.xlsx");
    const fileBuffer2 = fs.readFileSync(filePath2);
    const workbook2 = XLSX.read(fileBuffer2, { type: "buffer" });
    const worksheet2 = workbook2.Sheets[workbook2.SheetNames[0]];
    const jsonData2 = XLSX.utils.sheet_to_json(worksheet2);

    // Fetch and parse the third Excel file
    const filePath3 = path.join(process.cwd(), "public", "FeederCurrent.xlsx");
    const fileBuffer3 = fs.readFileSync(filePath3);
    const workbook3 = XLSX.read(fileBuffer3, { type: "buffer" });
    const worksheet3 = workbook3.Sheets[workbook3.SheetNames[0]];
    const jsonData3 = XLSX.utils.sheet_to_json(worksheet3);

    // Return the parsed data as props to the page
    return {
      props: {
        jsonData1,
        jsonData2,
        jsonData3,
      },
    };
  } catch (error) {
    console.error("Error fetching Excel data:", error);
    return {
      props: {
        jsonData1: [],
        jsonData2: [],
        jsonData3: [],
      },
    };
  }
}

export default AllChartsPage;
