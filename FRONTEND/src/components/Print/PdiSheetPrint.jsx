/**
 * Utility function to print the PDI form details.
 * @param {object} formData - The current state of the form data.
 */
export default function PrintDetails(formData) {

    // Helper to format date for display (DD-MM-YYYY)
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).replace(/\//g, '-');
        } catch (e) {
            return dateString; // Return raw if date is invalid
        }
    };

    // Full list of checkpoints defined in the PdiForm component
    const fullCheckList = [
        "Level of Oil in Engine up to Level", "Air Cleaner Position w.r.t Hoses", "Level of Coolant in Radiator",
        "FIP Connection Check", "Fuel pipes suction, pressure & overflow leaks", "Engine Mounting",
        "Vibration", "Oil leakages", "Fan Belt Tension / Alignment",
        "Hosepipe & clamps tightness", "Paint Quality", "Electrical Connections (Wt meter / RPM / Oil meter)",
        "Turbo drain pipe fitting", "Engine Idling", "Engine Oil & Diesel Filter Tightness",
        "Temperature & Oil Pressure Sensor fitting", "Self starter & alternator fitting",
        "Diesel injectors, nozzle & banjo nut tightness", "EGR Fitting", "Coolant used",
        "Silencer position", "Idle RPM & Full RPM", "Oil Pressure at idle & full load",
        "Water temperature at full load",
    ];

    const printedDate = formatDate(new Date().toISOString().split('T')[0]);

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
        alert("Popup blocked! Enable popups to print.");
        return;
    }

    // --- HTML Template for Print Layout ---

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>PDI Sheet - ${formData.engineNo || 'Details'}</title>
        <style>
            @page {
                size: A4;
                margin: 15mm;
            }
            body {
                font-family: 'Times New Roman', Times, serif;
                margin: 0;
                padding: 0;
                font-size: 11pt; /* Professional font size */
                color: #000;
            }
            .container {
                width: 100%;
                margin: 0 auto;
            }
            h1, h2 {
                text-align: center;
                font-size: 16pt;
                margin-bottom: 5px;
            }
            .header-info, .section, .footer {
                margin-bottom: 15px;
                page-break-inside: avoid;
            }
            .title-underline {
                text-decoration: underline;
                font-weight: bold;
                margin-top: 5px;
            }
            .grid {
                display: flex;
                flex-wrap: wrap;
                gap: 5px 15px;
                border: 1px solid #000;
                padding: 8px;
            }
            .grid-item {
                flex-basis: 48%; /* Adjust for 2 columns */
                display: flex;
                justify-content: space-between;
                border-bottom: 1px dashed #ccc;
                padding-bottom: 2px;
            }
            .grid-item:nth-child(even) {
                border-left: none; /* remove internal border */
            }
            .grid-item span:first-child {
                font-weight: bold;
            }
            .grid-item span:last-child {
                font-weight: normal;
                text-decoration: underline;
            }

            /* Checklist Table Styling */
            .table {
                width: 100%;
                border-collapse: collapse;
            }
            .table th, .table td {
                border: 1px solid #000;
                padding: 6px 8px;
                text-align: left;
                font-size: 10pt;
            }
            .table th {
                background-color: #f0f0f0;
                text-align: center;
                font-weight: bold;
            }

            /* Remarks */
            .remarks-section {
                border: 1px solid #000;
                padding: 10px;
                min-height: 50px;
            }
            .remarks-section h3 {
                text-align: left;
                font-size: 12pt;
                margin: 0 0 5px 0;
            }

            /* Footer Signatures */
            .footer {
                margin-top: 40px;
                display: flex;
                justify-content: space-around;
            }
            .signature-box {
                width: 30%;
                text-align: center;
            }
            .signature-line {
                border-top: 1px solid #000;
                margin-top: 50px;
                padding-top: 2px;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <header>
                <h1>PREET AGRO INDUSTRIES PVT. LTD.</h1>
                <h2 class="title-underline">PDI SHEET PREET ENGINE</h2>
            </header>

            <div class="header-info">
                <div style="text-align: right; margin-bottom: 10px;">
                    Date of Print: <strong>${printedDate}</strong>
                </div>
                
                <div class="grid">
                    <div class="grid-item">
                        <span>Combine Model:</span> <span>${formData.combineModel || 'N/A'}</span>
                    </div>
                    <div class="grid-item">
                        <span>Engine No:</span> <span>${formData.engineNo || 'N/A'}</span>
                    </div>
                    <div class="grid-item">
                        <span>Chassis No:</span> <span>${formData.chassisNo || 'N/A'}</span>
                    </div>
                    <div class="grid-item">
                        <span>TREM:</span> <span>${formData.trem || 'N/A'}</span>
                    </div>
                    <div class="grid-item">
                        <span>FIP Make & Serial No:</span> <span>${formData.fipNo || 'N/A'}</span>
                    </div>
                    <div class="grid-item">
                        <span>Date of Sale (DoS):</span> <span>${formatDate(formData.doS)}</span>
                    </div>
                    <div class="grid-item">
                        <span>Customer Name:</span> <span>${formData.customerName || 'N/A'}</span>
                    </div>
                    <div class="grid-item">
                        <span>Dealer Name:</span> <span>${formData.dealerName || 'N/A'}</span>
                    </div>
                    <div class="grid-item" style="flex-basis: 98%;">
                        <span>State:</span> <span>${formData.state || 'N/A'}</span>
                    </div>
                </div>
            </div>

            <div class="section">
                <h3 class="title-underline" style="text-align: left; margin-top: 15px;">Component Specifications:</h3>
                <div class="grid" style="grid-template-columns: repeat(3, 1fr); display: grid; border: none; padding: 0;">
                    <div class="grid-item" style="border: none;"><span>Air Compressor Make:</span> <span>WABCO</span></div>
                    <div class="grid-item" style="border: none;"><span>Turbo Charger Make:</span> <span>HOLSET</span></div>
                    <div class="grid-item" style="border: none;"><span>Radiator Make:</span> <span>BANCO</span></div>
                    <div class="grid-item" style="border: none;"><span>Alternator Make:</span> <span>SEG</span></div>
                    <div class="grid-item" style="border: none;"><span>Self-Starter Make:</span> <span>SEG</span></div>
                </div>
            </div>

            <div class="section">
                <h3 class="title-underline" style="text-align: left;">PDI Check Points:</h3>
                <table class="table">
                    <thead>
                        <tr>
                            <th style="width: 75%;">Check Point Description</th>
                            <th style="width: 25%;">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${fullCheckList.map((point, i) => `
                            <tr>
                                <td>${i + 1}. ${point}</td>
                                <td style="text-align: center; font-weight: bold;">
                                    ${formData.checkpoints[point] || 'PENDING'}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <div class="section remarks-section">
                <h3 style="text-align: left; text-decoration: underline;">Remarks / Deviations:</h3>
                <p style="white-space: pre-wrap; word-wrap: break-word;">
                    ${formData.remarks || 'No remarks provided.'}
                </p>
            </div>

            <div class="footer">
                <div class="signature-box">
                    <p class="signature-line">Checked By (Engineer)</p>
                </div>
                <div class="signature-box">
                    <p class="signature-line">H.O.D. (Quality)</p>
                </div>
                <div class="signature-box">
                    <p class="signature-line">Approved By (Management)</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;

    // --- Write and Print ---
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Give the browser a moment to render before printing
    printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
    };
    
    // Fallback for browsers that don't support onload in new window context
    setTimeout(() => {
        if (!printWindow.document.body.innerHTML) { // Basic check if onload failed
            printWindow.focus();
            printWindow.print();
        }
    }, 500);
}