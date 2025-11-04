export const fetchData = async (EngineNo, setData) => {
    try {
        const fetchedData = {
            Chassis: `${EngineNo}`,
            Customer: `${EngineNo}`,
            Dealer: `${EngineNo}`,
            Location: `${EngineNo}`,
            State: `${EngineNo}`,
            Hours: 100,  // Example
            Problem: `${EngineNo}`,
            WarrentyChech: true,
            Warrenty: `${EngineNo}`,
        };
        setData(fetchedData);
    } catch (error) {alert.error("Error fetching data:", error);}
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
