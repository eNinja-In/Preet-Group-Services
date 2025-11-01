import style from "./mainLeftKeys.module.css"
import Btn from "../common/Btn"
import CateogryTitle from "../common/CateogryTitle";
import { Link, useNavigate } from "react-router-dom";

export default function MainLeft() {
    const navigate = useNavigate()

    return (
        <div className={style.main} >
            {/* <CateogryTitle title={"SERVICE"}/> */}
            <Btn click={"/register-Complaint"} title={"Complaint Registration"} />
            <Btn click={"/attendence-management"} title={"Attendance Management"} />
            <Btn title={"Customer Feedback"} />
            {/* <Btn click={"/assign-task"} title={"Assign Task"} /> */}
            <Btn title={"Work Progress Tracking"} />
            <Btn title={"Service Dispatch"} />
            {/* <CateogryTitle title={"SPARE PARTS"}/> */}
            <Btn title={"Spare Parts Management"} />
            <Btn title={"Parts Return and Billing"} />
            {/* <Btn title={"Service Completion"} /> */}
        </div>
    )
}
// Complaint Registration
// Description: Allows users to register new complaints for service. ComplaintRegistration

// Assign Task
// Description: Assign workers to the registered complaint.

// Spare Parts Management
// Description: Allocate the necessary spare parts for the assigned service job.

// Service Dispatch
// Description: Send workers to the customer’s location.

// Work Progress Tracking
// Description: Monitor the work progress and send photo/video updates from the worker.

// Attendance Management
// Description: Record and track the daily attendance of the workers.

// Customer Feedback
// Description: Collect customer feedback after the service is completed.

// Parts Return and Billing
// Description: Manage the return of unused spare parts with the related billing information.

// Service Completion
// Description: Finalize and close the service job after completion.

