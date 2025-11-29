/**
 * MainLeft Component
 * 
 * This component renders a sidebar menu with various buttons for navigation. 
 * It is designed for use in a larger application, providing quick access to 
 * different sections such as complaint registration, attendance management, 
 * customer feedback, and more.
 * 
 * Key Features:
 * 1. Contains multiple buttons with different titles.
 * 2. Each button navigates to a specific route when clicked.
 * 3. The component is hidden on smaller screens (using TailwindCSS's max-sm:hidden).
 * 4. Buttons are styled using a custom CSS module (`mainLeftKeys.module.css`).
 * 
 * Functionalities:
 * 1. Renders buttons with titles like "Complaint Registration", "Attendance Management", etc.
 * 2. Each button has an associated route for navigation.
 * 3. The component makes use of React Router's `useNavigate` hook for navigation.
 * 
 * Dependencies:
 * - React (for component creation)
 * - React Router (for navigation)
 * - TailwindCSS (for styling)
 * - Custom CSS module (`mainLeftKeys.module.css` for additional styling)
 */
import Btn from "../common/Btn"
export default function MainLeft() {

    return (
        <div className="w-full h-full bg-white max-sm:hidden">
            <Btn click={"/register-Complaint"} title={"Complaint Registration"} />
            <Btn click={"/attendence-management"} title={"Attendance Management"} />
            <Btn title={"Customer Feedback"} />
            <Btn title={"Work Progress Tracking"} />
            <Btn title={"Service Dispatch"} />
            <Btn click={"/spare-parts"} title={"Spare Parts Management"} />
            {/* <Btn title={"Parts Return and Billing"} /> */}
        </div>
    );
}
