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
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};
