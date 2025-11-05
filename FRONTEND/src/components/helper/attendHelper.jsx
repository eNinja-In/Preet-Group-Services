async function RegAttend(empCode, data) {
    const date = data.date;
    const location = data.location;
    const state = data.state;
    const contact = data.contact;
    try {
        const response = await fetch(
            `${meta.env.VITE_SERVER_LINK}/api/service/register-attendence`,
            {
                method: "POST",
                body: JSON.stringify({ empCode, EngineNo, Location: location, State: state, contact: contact, date }),
                headers: { "Content-Type": "application/json" },
            }
        )
        const result = await response.json();
        if (response.ok && result.success) { }

    } catch (error) {
        alert.error("ERROR", error)
    }
}

async function FetAttend(empCode, setData) {
    try {
        const response = await fetch(
            `${meta.env.VITE_SERVER_LINK}/api/service/fetch-attendence`,
            {
                method: "POST",
                body: JSON.stringify({ empCode }),
                headers: { "Content-Type": "application/json" },
            }
        )
        const result = await response.json(); // Parse JSON response once
        if (response.ok && result.success) {
            console.error("Login error:", error);
            const fetchedData = { Name: `${empcode}`, Contact: `${empcode}`, EngineNo: `${empcode}`, Location: `${empcode}`, State: `${empcode}`, Problem: `${empcode}` }

            setData(fetchedData);
        }
        else { setError(result.message || "Data Fetching  Please try again."); }
    } catch (error) { console.log("Error fetching data:", error); }
}
function EditAttend() { }

export { RegAttend, FetAttend, EditAttend };