import style from "./mainRightKeys.module.css"
import Btn from "../common/Btn"
import CateogryTitle from "../common/CateogryTitle";

export default function MainRight() {
    return (
        <div className={style.main}>
            {/* <Btn title={"Warranty Check"}></Btn> */}
            {/* <Btn title={"hello"}></Btn> */}
            {/* <CateogryTitle title={"ENGINE"} /> */}
            <Btn title={"Engine Dispatch"}></Btn>
            {/* <Btn title={"Vehicle Assignment"}></Btn> */}
            {/* <Btn title={"Driver Tracking"}></Btn> */}
            <Btn title={"Delivery Confirmation"}></Btn>
            {/* <Btn title={"Delivery Paperwork"}></Btn> */}
            <Btn title={"Driver Payments"}></Btn>
            {/* <Btn title={"hello"}></Btn> */}
            {/* <Btn title={"hello"}></Btn> */}
            {/* <Btn title={"hello"}></Btn> */}
            {/* <Btn title={"hello"}></Btn> */}
            {/* <CateogryTitle title={"REPORTS"} /> */}
            <Btn title={"PDI Reports"}></Btn>
            <Btn title={"Service Reports"}></Btn>
            {/* <Btn title={"hello"}></Btn> */}
            {/* <Btn title={"hello"}></Btn> */}
            <Btn title={"User Settings"}></Btn>

        </div>
    )
}



// This section is responsible for managing engine dispatch and vehicle tracking for deliveries.
// Engine Dispatch
// Description: Dispatch the engine to the customer or dealer.

// Vehicle Assignment
// Description: Assign a vehicle for the engine delivery.

// Driver Tracking
// Description: Monitor the vehicle's route and status during delivery.

// Delivery Confirmation
// Description: Confirm the successful delivery of engines and parts.

// Driver Payments
// Description: Manage driver bill payment after vehicle return.

// Delivery Paperwork
// Description: Handle the required documentation related to deliveries and payments.

// This section will focus on accessing reports and managing service history.
// PDI Reports
// Description: View Pre-Delivery Inspection (PDI) reports, including engine numbers, chassis numbers, and customer details.

// Warranty Check
// Description: Verify if a complaint is under warranty or not.

// Service Reports
// Description: Access detailed service and complaint reports.

// This is where system administrators can manage user settings and configurations.
// Admin Panel
// Description: Manage app configuration and user roles.

// User Settings
// Description: Allow users to manage their personal and account-related settings.