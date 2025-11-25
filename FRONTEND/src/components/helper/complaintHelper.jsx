/**
 * **fetchData Function**:
 * This function is responsible for fetching engine data from the backend API based on the provided engine number.
 * 
 * **Key Features**:
 * 1. **API Request**: Makes a POST request to the backend API (`/api/combine/get-combine`) to fetch the combine data using the engine number.
 * 2. **Success Handling**: If the data is successfully fetched, it updates the state with the fetched data and shows a success notification using a pop-up.
 * 3. **Error Handling**: In case of errors (either from the API or other issues), it displays an error message via a notification pop-up.
 * 4. **User Feedback**: The function provides feedback using notifications for both successful and error states, helping to guide the user.
 * 
 * The function is designed to be reusable and easy to integrate into various components that need to fetch data based on the engine number.
 */

export const fetchData = async (engineNo, chassisNo, setData, setNotification, setPopUp) => {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_SERVER_LINK}/api/combine/get-combine`,
            {
                method: "POST",
                body: JSON.stringify({ engineNo, chassisNo }),
                headers: { "Content-Type": "application/json" },
            }
        );

        const data = await response.json();

        
        if (data.success) {
            setData(data.data); // Update data state
            setNotification({ message: data.data, type: 'Combine Data Fetched Successfully' });
        } else {
            setNotification({ message: data.message || 'Error fetching data.', type: 'error' });
        }

        setPopUp(true);
    } catch (error) {
        console.error('Error fetching data:', error);
        setNotification({ message: 'Error fetching data. Please try again.', type: 'error' });
        setPopUp(true); // Show error notification
    }
};

export const regComplaint = async (EngineNo, data) => {
    const chassis = data.Chassis;
    const customer = data.Customer;
    const Dealer = data.Dealer;
    const Location = data.Location;
    const State = data.State;
    const Hours = data.Hours;
    const Problem = data.Problem;

    try {
        const response = await fetch(
            `${meta.env.VITE_SERVER_LINK}/api/service/reg-complaint`,
            {
                method: "POST",
                body: JSON.stringify({ EngineNo, chassis, customer, Dealer, Location, State, Hours, Problem }),
                headers: { "Content-Type": "application/json" },
            }
        )
        const result = await response.json();
        if (response.ok && result.success) { }

    } catch (error) {
        alert.error("ERROR", error)
    }
}
