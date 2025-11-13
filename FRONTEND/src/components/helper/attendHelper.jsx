// Function to register attendance (append string data to the array)
async function RegAttend(empCode, data) {
    const { date, location, state, contact, engineNo } = data;

    try {
        // Send a POST request to register the attendance
        const response = await fetch(
            `${import.meta.env.VITE_SERVER_LINK}/api/attendence/register`,
            {
                method: "POST",
                body: JSON.stringify({ empCode, engineNo, contact, Location: location, state: state, date, }),
                headers: { "Content-Type": "application/json", },
            }
        );

        const result = await response.json();

        // Check if the response is successful
        if (response.ok && result.success) { console.log("Attendance registered successfully", result.message); }
        else { console.error("Error: ", result.message || "Failed to register attendance."); }

    }
    // Handle any errors that occur during the fetch request
    catch (error) {
        console.error("Error while registering attendance: ", error);
        // alert("Error while registering attendance. Please try again.");
    }
}


async function FetAttend(empCode, setData, setError) {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_SERVER_LINK}/api/attendence/fetch-attendence`, // Correct endpoint
            {
                method: "POST",
                body: JSON.stringify({ empCode }), // Send empCode in request body
                headers: { "Content-Type": "application/json" },
            }
        );
        // console.log("1")
        const result = await response.json(); // Parse the JSON response

        if (response.ok && result.success) {
            // Function to get the last item from a comma-separated string
            const getLastItem = (str) => {
                const items = str.split(',').map(item => item.trim()); // Split and remove any extra spaces Return the last item
                return items[items.length - 1];
            };

            // Map the fetched data and extract the last item from each field
            const extractedData = {
                name: result.data.name,
                contact: result.data.contact,
                engineNo: getLastItem(result.data.engineNo),
                location: getLastItem(result.data.location),
                state: getLastItem(result.data.state),
                date: getLastItem(result.data.date),
            };

            // Set the fetched data in frontend state (using React's setState)
            setData(extractedData);
            return true

        } else {
            // If response is not ok, show the error message
            setError(result.message || "Failed to fetch data. Please try again.");
            return false
        }
    } catch (error) {
        // Handle network or other errors
        console.log("Error fetching data:", error);
        setError("An error occurred while fetching data. Please try again.");
        return false
    }
}



function EditAttend() { }



// Function to register new attendance (create a new record)
async function createNewAttendence(empCode, data) {
    const { name, engineNo, location, state, contact, date } = data;

    try {
        // Send a POST request to register the new attendance
        const response = await fetch(
            `${import.meta.env.VITE_SERVER_LINK}/api/attendence/new-attendance`,
            {
                method: "POST",
                body: JSON.stringify({ empCode, name, engineNo, contact, Location: location, state, date, }),
                headers: { "Content-Type": "application/json", },
            }
        );

        const result = await response.json();

        // Check if the response is successful
        if (response.ok && result.success) {
            console.log("Attendance registered successfully", result.message);
            // Additional logic on success (e.g., update UI, redirect, etc.)
        } else {
            console.error("Error: ", result.message || "Failed to register new attendance.");
        }

    } catch (error) {
        // Handle any errors that occur during the fetch request
        console.error("Error while registering new attendance: ", error);
        alert("Error while registering new attendance. Please try again.");
    }
}


export { RegAttend, FetAttend, EditAttend, createNewAttendence };
