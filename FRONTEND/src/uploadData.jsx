import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import moment from "moment"; // npm install moment
import { registerCombine } from "./components/helper/combineHelper";

export default function BulkRegister() {
  const [results, setResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const stopFlag = useRef(false);

  // --- File Handling and Data Normalization ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      let jsonData = XLSX.utils.sheet_to_json(ws, { defval: "NaN" });

      // Normalize empty string cells to "NaN" and trim values
      jsonData = jsonData.map((row) => {
        const keys = [
          "MODEL",
          "ENGINE NO",
          "CHASSIS NO",
          "FIP",
          "PDI DATE",
          "CUSTOMER NAME",
          "DEALER NAME",
          "STATE",
        ];
        const normalizedRow = {};
        keys.forEach((key) => {
          let val = row[key];
          if (val === null || val === undefined || (typeof val === 'string' && val.trim() === "")) {
            val = "NaN";
          }

          // Convert Excel serial number dates to a Date object
          if (key === "PDI DATE" && typeof val === "number") {
            // Convert Excel serial date number to JavaScript Date
            val = excelSerialToDate(val);  // Convert Excel serial number to a Date object
          } else if (key === "PDI DATE") {
            // If it's already a date string, convert to Date object
            val = new Date(val);  // This ensures the value is a JavaScript Date
          }

          normalizedRow[key] = val; // No need to convert to string, it's already a Date or NaN
        });
        return normalizedRow;
      });

      setResults([]);
      processExcelData(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  // --- Convert Excel Serial Date to JavaScript Date ---
  const excelSerialToDate = (serial) => {
    // Excel's "base date" is January 1, 1900.
    const excelEpoch = new Date(1900, 0, 1);
    // Excel treats January 1, 1900 as day 1, but JavaScript Date treats it as day 0
    excelEpoch.setDate(excelEpoch.getDate() + serial - 2); // Adjust for the offset
    return excelEpoch;
  };

  // --- Processing Logic ---
  const processExcelData = async (data) => {
    stopFlag.current = false;
    setIsProcessing(true);

    for (let i = 0; i < data.length; i++) {
      if (stopFlag.current) break;

      const row = data[i];

      // Convert Excel → Backend payload
      const payload = {
        combineModel: row["MODEL"] || "NaN",
        engineNo: row["ENGINE NO"] || "NaN",
        chassisNo: row["CHASSIS NO"] || "NaN",
        fipNo: row["FIP"] || "NaN",
        doS: (row["PDI DATE"] + 1), // The `doS` field will be a Date object here
        customerName: row["CUSTOMER NAME"] || "NaN",
        dealerName: row["DEALER NAME"] || "NaN",
        state: row["STATE"] || "NaN",
      };
      // console.log(payload)
      // >>> CRITICAL LOGGING STEP: Check what is being sent
      console.log(`[Row ${i + 1}] Sending Payload:`, payload);

      let res = await registerCombine(payload);

      // Retry logic (up to 2 attempts total)
      let attempt = 1;
      while (!res.success && attempt < 2) {
        res = await registerCombine(payload);
        attempt++;
      }

      if (res.success) {
        setResults((prev) => [
          ...prev,
          { engineNo: payload.engineNo, status: "success" },
        ]);
      } else {
        setResults((prev) => [
          ...prev,
          { engineNo: payload.engineNo, status: "error", msg: res.message },
        ]);
      }

      // Prevent backend overload
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    setIsProcessing(false);
  };

  const stopProcessing = () => {
    stopFlag.current = true;
    setIsProcessing(false);
  };

  // --- Render/UI ---
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-3">📄 Bulk Excel Register</h1>

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        className="border p-2 rounded"
      />

      {isProcessing && (
        <button
          onClick={stopProcessing}
          className="ml-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          🛑 STOP PROCESS
        </button>
      )}

      {isProcessing && (
        <p className="mt-2 text-blue-600 font-semibold">Processing... Please wait.</p>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-bold">Results:</h2>
        <div className="mt-3 border p-4 max-h-96 overflow-y-auto bg-gray-50">
          {results.length === 0 && !isProcessing && <p className="text-gray-500">Upload a file to begin processing.</p>}
          {results.map((r, index) => (
            <p
              key={index}
              className={
                r.status === "success"
                  ? "text-green-700 font-semibold"
                  : "text-red-600 font-semibold"
              }
            >
              {index + 1}. **Engine No:** {r.engineNo} —{" "}
              {r.status === "success"
                ? "✅ Registered Successfully"
                : `❌ Failed: ${r.msg}`}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
