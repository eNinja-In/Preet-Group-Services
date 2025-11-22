import { useState } from "react";
import PopUp from "../common/PopUp";
import { registerCombine } from "../helper/combineHelper";

export default function PdiForm() {
  const [formData, setFormData] = useState({
    combineModel: "",
    engineNo: "",
    trem: "4",
    chassisNo: "",
    fipNo: "",
    remarks: "",
    checkpoints: {},
    doS: "",
    customerName: "",
    dealerName: "",
    state: "",
  });

  const [popup, setPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState({ message: "", type: "" });
  const [errors, setErrors] = useState({}); // To store form validation errors

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheck = (point, value) => {
    setFormData((prev) => ({
      ...prev,
      checkpoints: { ...prev.checkpoints, [point]: value },
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      "combineModel",
      "engineNo",
      "fipNo",
      "doS",
      "state",
      "customerName",
      "dealerName",
    ];
    let validationErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        validationErrors[field] = `${field.replace(/([A-Z])/g, ' $1')} is required.`;
      }
    });

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const sanitize = (data) => {
    const copy = { ...data };
    Object.keys(copy).forEach((key) => {
      if (!copy[key]) copy[key] = "NaN";
    });
    return copy;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // If validation fails, prevent submission

    setLoading(true);
    setNote({ message: "", type: "" });

    try {
      const clean = sanitize(formData);
      const res = await registerCombine(clean);

      setNote({
        message: res.data || res.message,
        type: res.success ? "SUCCESS" : "ERROR",
      });
    } catch (err) {
      setNote({ message: err.message, type: "ERROR" });
    } finally {
      setPopup(true);
      setLoading(false);
    }
  };

  const printDetails = () => {
    // This function prints the form details in a clean, formatted way matching the example

    const printWindow = window.open("", "_blank");
    printWindow.document.write("<html><head><title>Form Details</title>");

    // Styling for the print layout
    printWindow.document.write(`
    <style>
      @page {
        size: A4;
        margin: 15mm;
      }

      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        font-size: 12px;
        line-height: 1.4;
      }

      h1, h2, h3 {
        text-align: center;
        margin-bottom: 10px;
      }

      .container {
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
      }

      .section {
        margin-bottom: 20px;
        page-break-inside: avoid;
      }

      .section h3 {
        margin-bottom: 5px;
        text-decoration: underline;
      }

      .table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }

      .table td, .table th {
        border: 1px solid #000;
        padding: 5px 10px;
        text-align: left;
      }

      .table th {
        background-color: #f4f4f4;
      }

      .bold {
        font-weight: bold;
      }

      .flex {
        display: flex;
        justify-content: space-between;
      }

      .max-width {
        max-width: 300px;
        overflow-wrap: break-word;
        word-wrap: break-word;
      }

      .text-center {
        text-align: center;
      }

      .underline {
        text-decoration: underline;
      }

      .footer {
        margin-top: 40px;
        display: flex;
        justify-content: space-between;
      }

      .footer div {
        width: 30%;
      }

      /* Ensuring text fits within A4 */
      .remarks, .container {
        width: 100%;
        word-wrap: break-word;
      }

      p, td {
        font-size: 14px;
        margin: 0;
        padding: 0;
      }
        td{font-size: 12px}

      /* For the top header */
      .header-section {
        margin-bottom: 20px;
      }

      .header-section p {
        margin: 2px 0;
      }

      /* Adjusting specific form positioning and space */
      .checklist-section {
        margin-top: 15px;
      }

      .checklist-section td {
        padding: 5px 10px;
        border: 1px solid #000;
      }

      .footer {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
      }

      .footer div {
        width: 30%;
      }

      /* Style for Remarks section */
      .remarks-section {
        margin-top: 10px;
        padding: 2px;
        font-size: 12px;
        border: 1px solid black;
      }

      .remarks-section p {
        max-width: 100%;
        word-wrap: break-word;
      }
          .variableSpan {
    font-weight: bold;
    text-decoration: underline;
    font-size: 16px;
  }

    </style>
  </head><body>`);

    // HEADER
    printWindow.document.write(`
<div class="container">
  <h1 class="underline">PREET AGRO INDUSTRIES PVT. LTD.</h1>
  <h3 class="underline">PDI SHEET PREET ENGINE</h3>

  <!-- Header Information Section -->
  <div>
    <div style="display: flex; justify-content: end;">
      <p>Date: <span class="variableSpan">${formData.doS}</span></p>
    </div>
    <p>Model: <span class="variableSpan">${formData.combineModel}</span></p>
    <div style="display: flex; justify-content: space-between;">
      <p style="">Engine No: <span class="variableSpan">${formData.engineNo}</span></p>
      <p style="">TREM: <span class="variableSpan">${formData.trem}</span></p>
      <p style="">Chassis No: <span class="variableSpan">${formData.chassisNo}</span></p>
    </div>
    <p>FIP Serial No: <span class="variableSpan">${formData.fipNo}</span></p>
    <div style="display: flex; justify-content: space-between;">
      <p>Air Compressor Make: <span class="variableSpan">WABCO</span></p>
      <p>Turbo Charger Make: <span class="variableSpan">HOLSET</span></p>
      <p>Radiator Make: <span class="variableSpan">BANCO</span></p>
    </div>
    <div style="display: flex; justify-content: space-between;">
      <p>Alternator Make: <span class="variableSpan">SEG</span></p>
      <p>Self-Starter Make: <span class="variableSpan">SEG</span></p>
    </div>
  </div>

  <!-- Check Points Section -->
  <div class="checklist-section">
    <table class="table">
      <thead>
        <tr>
          <th style="width: 70%;">Check Point</th>
          <th style="width: 30%;">Status</th>
        </tr>
      </thead>
      <tbody>
        ${Object.keys(formData.checkpoints).map((point, i) => `
          <tr>
            <td>${i + 1}. ${point}</td>
            <td>${formData.checkpoints[point]}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <!-- Remarks Section -->
  <div class="remarks-section">
    <h3>Remarks:</h3>
    <p class="max-width">${formData.remarks}</p>
  </div>

  <!-- Footer Section -->
  <div class="footer">
    <div><p class="bold">Checked By:</p><p>_____________________</p></div>
    <div class="text-center"><p class="bold">H.O.D.</p><p>_____________________</p></div>
    <div><p class="bold">Approved By:</p><p>_____________________</p></div>
  </div>
</div>
  `);

    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };





  const list = [
    "Level of Oil in Engine up to Level",
    "Air Cleaner Position w.r.t Hoses",
    "Level of Coolant in Radiator",
    "FIP Connection Check",
    "Fuel pipes suction, pressure & overflow leaks",
    "Engine Mounting",
    "Vibration",
    "Oil leakages",
    "Fan Belt Tension / Alignment",
    "Hosepipe & clamps tightness",
    "Paint Quality",
    "Electrical Connections (Wt meter / RPM / Oil meter)",
    "Turbo drain pipe fitting",
    "Engine Idling",
    "Engine Oil & Diesel Filter Tightness",
    "Temperature & Oil Pressure Sensor fitting",
    "Self starter & alternator fitting",
    "Diesel injectors, nozzle & banjo nut tightness",
    "EGR Fitting",
    "Coolant used",
    "Silencer position",
    "Idle RPM & Full RPM",
    "Oil Pressure at idle & full load",
    "Water temperature at full load",
  ];

  return (
    <div className="w-full p-6 bg-white">
      {popup && (
        <PopUp
          data={note.message}
          type={note.type}
          isOpen={true}
          onClose={() => setPopup(false)}
          title={note.type}
        />
      )}

      <div className="bg-gray-50 p-10 shadow-md rounded-md">
        {/* HEADER */}
        <h1 className="text-2xl font-bold text-center">PREET AGRO INDUSTRIES PVT. LTD.</h1>
        <p className="text-center underline font-semibold mt-2">PDI SHEET PREET ENGINE</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">

          {/* UPPER FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Combine Model No."
              name="combineModel"
              value={formData.combineModel}
              onChange={handleInput}
              error={errors.combineModel}
            />
            <Field
              label="Engine No."
              name="engineNo"
              value={formData.engineNo.toUpperCase()}
              onChange={handleInput}
              error={errors.engineNo}
            />
            <Field
              label="TREM"
              name="trem"
              value={formData.trem}
              onChange={handleInput}
            />
            <Field
              label="Chassis No."
              name="chassisNo"
              value={formData.chassisNo.toUpperCase()}
              onChange={handleInput}
            />
            <Field
              label="FIP Make & Serial No."
              name="fipNo"
              value={formData.fipNo}
              onChange={handleInput}
              error={errors.fipNo}
            />
            <Field
              label="Customer Name"
              name="customerName"
              value={formData.customerName.toUpperCase()}
              onChange={handleInput}
              error={errors.customerName}
            />
            <Field
              label="Dealer Name"
              name="dealerName"
              value={formData.dealerName.toUpperCase()}
              onChange={handleInput}
              error={errors.dealerName}
            />
            <Field
              label="State"
              name="state"
              value={formData.state.toUpperCase()}
              onChange={handleInput}
              error={errors.state}
            />
            <Field
              label="Date of Sale"
              name="doS"
              value={formData.doS}
              onChange={handleInput}
              error={errors.doS}
              type="date"
            />
          </div>

          {/* PARTS ROW */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-200 rounded">
            <Static label="Air Compressor Make" value="WABCO" />
            <Static label="Turbo Charger Make" value="HOLSET" />
            <Static label="Radiator Make" value="BANCO" />
            <Static label="Alternator Make" value="SEG" />
            <Static label="Self-Starter Make" value="SEG" />
          </div>

          {/* CHECK POINTS */}
          <h2 className="font-semibold text-lg">Check Points:</h2>
          <div className="space-y-3">
            {list.map((item, i) => (
              <div key={i} className="flex justify-between items-center border p-2 rounded">
                <span>{i + 1}. {item}</span>
                <div className="flex gap-3">
                  {["Ok", "Not Ok", "Rework"].map((status) => (
                    <label key={status} className="flex items-center gap-1">
                      <input
                        type="radio"
                        name={item}
                        checked={formData.checkpoints[item] === status}
                        onChange={() => handleCheck(item, status)}
                      />
                      {status}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* REMARK BOX */}
          <div>
            <label className="font-medium">Remarks:</label>
            <textarea
              name="remarks"
              className="w-full border rounded p-2 mt-1"
              rows={3}
              value={formData.remarks}
              onChange={handleInput}
            />
          </div>

          {/* SUBMIT AND PRINT BUTTONS */}
          <div className="flex justify-between">
            <button
              disabled={loading}
              className="px-10 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit PDI Sheet"}
            </button>
            <button
              type="button"
              onClick={printDetails}
              className="px-10 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Print Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* SMALL HELPER UI COMPONENTS */
function Field({ label, name, value, onChange, error, type = "text" }) {
  return (
    <div>
      <label className="font-medium">{label}</label>
      <input
        type={type}
        name={name}
        className="w-full border p-2 rounded mt-1"
        value={value}
        onChange={onChange}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}

function Static({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="font-medium">{label}:</span>
      <span>{value}</span>
    </div>
  );
}
