import ComplaintData from "../models/complaintModel.js"
export const registerComplaint = async (req, res) => {
    try {
        const { engineNo, chassisNo, customerName, contact, location, state, workHr, problem } = req.body;
        if (![engineNo, contact, problem].every(Boolean)) return res.status(400).json({ success: false, message: 'Engine No, Contact and Problem are required.' });

        const newComplaint = new ComplaintData({ engineNo, chassisNo, customerName, contact, location, state, workHr, problem });
        await newComplaint.save();

        console.log(`Complaint Registered Successfully: EngineNo: ${engineNo} - Problem: ${problem}`.bgGreen);
        res.status(201).json({ success: true, message: 'Complaint registered successfully.', complaint: { id: newComplaint._id, engineNo: newComplaint.engineNo } });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) return res.status(400).json({ success: false, message: 'Engine No or Chassis No already exists.' });
        res.status(500).json({ success: false, message: 'Server error, please try again later.' });
    }
};