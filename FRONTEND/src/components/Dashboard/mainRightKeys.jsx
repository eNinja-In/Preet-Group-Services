/**
 * MainRight Component
 * 
 * This component renders a sidebar with buttons that represent various actions 
 * related to engine dispatch, delivery tracking, reports, and user settings. 
 * It provides an interface for users to access sections such as engine dispatch, 
 * delivery confirmation, service reports, and user settings.
 * 
 * Key Features:
 * 1. Renders buttons for various tasks like "Engine Dispatch", "Delivery Confirmation", etc.
 * 2. Each button corresponds to a specific section or functionality in the app.
 * 3. The component uses custom styling via `mainRightKeys.module.css`.
 * 4. Buttons are displayed with conditional rendering based on the current functionality.
 * 
 * Functionalities:
 * 1. Displays a list of action buttons like "Engine Dispatch", "Driver Payments", "PDI Reports", etc.
 * 2. Each button triggers a navigation or action related to the task.
 * 3. Buttons are styled using TailwindCSS along with a custom CSS module for additional design customizations.
 * 4. The component may display category titles for organizing related tasks (though currently commented out).
 * 
 * Dependencies:
 * - React (for component-based structure)
 * - TailwindCSS (for styling)
 * - Custom CSS module (`mainRightKeys.module.css` for layout and design)
 * - `Btn` (a reusable component for rendering action buttons)
 * - `CateogryTitle` (a reusable component for section headers, currently commented out)
 */
import Btn from "../common/Btn";

export default function MainRight() {
    return (
        <div className="w-full h-full bg-white">
            {/* Category Title: ENGINE */}
            <Btn title={"Engine Dispatch"} />
            <Btn title={"Delivery Confirmation"} />
            <Btn title={"Driver Payments"} />

            {/* Category Title: REPORTS */}
            <Btn click={"/pdi/Reports"} title={"PDI Reports"} />
            <Btn title={"Service Reports"} />
            <Btn title={"Spare Parts Reports"} />

            {/* Category Title: USER SETTINGS */}
            <Btn click={"/admin/user-settings"} title={"User Settings"} />
        </div>
    );
}
