// "use client";

// import * as XLSX from "xlsx";
// import path from "path";
// import fs from "fs";
// import PowerChartHT from "./PowerChartHT";
// import ExcelLineChart from "./ExcelLineChart";

// const GraphtestPage = ({ jsonData }) => {
//   return (
//     <div>
//       <ExcelLineChart jsonData={jsonData} />
//       <PowerChartHT jsonData={jsonData} />
//     </div>
//   );
// };

// export async function getStaticProps() {
//   // Build the file path to your Excel file
//   const filePath = path.join(process.cwd(), "public", "HTdata.xlsx");

//   // Read the Excel file from the file system
//   const fileBuffer = fs.readFileSync(filePath);

//   // Parse the Excel file to JSON using XLSX
//   const workbook = XLSX.read(fileBuffer, { type: "buffer" });
//   const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//   const jsonData = XLSX.utils.sheet_to_json(worksheet);

//   // Return the parsed data as props
//   return {
//     props: {
//       jsonData,
//     },
//   };
// }

// export default GraphtestPage;
