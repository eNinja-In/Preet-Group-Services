import style from "./CSS/custromerComp.module.css"
import { use, useState } from "react";
import { fetchData } from "../helper/dataFecth";
import PopUp from "../common/PopUp";

export default function CompReg() {
    const [EngineNo, setEngineNo] = useState("");
    const [WarrentyChech, setWarrentyChech] = useState(true);
    const [Warrenty, setWarrenty] = useState("");

    const [popup, setPopUp] = useState(false)

    const [Fetch, setFetch] = useState(false);
    const [Register, setRegister] = useState(false);

    const fetchedData = [];
    const [data, setData] = useState({ Chassis: "", Customer: "", Dealer: "", Location: "", State: "", Hours: "", Problem: "", WarrentyChech: true, Warrenty: "", });


    const handleFetch = () => {
        if (EngineNo !== "") {
            setFetch(true);  // Trigger the data fetch
            fetchData(EngineNo, setData);  // Call the helper function to fetch data
            setFetch(false);  // Trigger the data fetch
            setPopUp(true)
        }
    };

    return (
        <>
            <div className={style.main}>
                {popup ? <PopUp data={data} Click={setPopUp}  title={'Engine Information'} /> : ''}
                <div className={style.compForm}>
                    <div className={style.form}>
                        {/* Data Fetch Form */}
                        <form className={style.fetchForm}>
                            <div className={style.autoInfoInput}>
                                <div className={style.inputSection}>
                                    <input
                                        type="text"
                                        value={EngineNo}
                                        placeholder="Engine No."
                                        onChange={(e) => setEngineNo(e.target.value)}
                                        onClick={() => { }}
                                        required
                                    />
                                </div>
                                <div className={style.fetchData}>
                                    <button
                                        className={style.fetchBtn}
                                        type="button"
                                        disabled={Fetch}
                                        onClick={handleFetch}
                                    >
                                        {Fetch ? "FETCHING..." : "FETCH"}
                                    </button>
                                </div>

                                <div className={style.warrenty}>
                                    <div className={style.warrentyCheck}>
                                        {WarrentyChech ? (
                                            <span className={style.warrentyTrue} style={{ color: 'rgb(15, 148, 15)' }}>
                                                {Warrenty}
                                            </span>
                                        ) : (
                                            <span className={style.warrentyFalse} style={{ color: 'red' }}>
                                                {Warrenty}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>

                        {/* Data Entry Form */}
                        <form className={style.dataForm}>
                            <div className={style.complaintForm}>
                                {/* Data fields populated with `data` state */}
                                <div className={style.inputSection} style={{ marginRight: '1%' }}>
                                    <input
                                        type="text"
                                        value={data.Chassis}
                                        placeholder="Chassis No."
                                        onChange={(e) => setData((prev) => ({ ...prev, Chassis: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className={style.inputSection}>
                                    <input
                                        type="text"
                                        value={data.Customer}
                                        placeholder="Customer Name"
                                        onChange={(e) => setData((prev) => ({ ...prev, Customer: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className={style.inputSection}>
                                    <input
                                        type="text"
                                        value={data.Dealer}
                                        placeholder="Dealer Name"
                                        onChange={(e) => setData((prev) => ({ ...prev, Dealer: e.target.value }))}
                                    />
                                </div>
                                <div className={style.locaionForm}>
                                    <div className={style.inputSection} style={{ width: '60%' }}>
                                        <input
                                            type="text"
                                            value={data.Location}
                                            placeholder="Location"
                                            onChange={(e) => setData((prev) => ({ ...prev, Location: e.target.value }))}
                                        />
                                    </div>
                                    <div className={style.inputSection} style={{ width: '30%' }}>
                                        <input
                                            type="text"
                                            value={data.State}
                                            placeholder="State"
                                            onChange={(e) => setData((prev) => ({ ...prev, State: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className={style.inputSection}>
                                    <input
                                        type="number"
                                        style={{ width: '25%', padding: '2%' }}
                                        value={data.Hours}
                                        placeholder="Working Hours"
                                        onChange={(e) => setData((prev) => ({ ...prev, Hours: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className={style.textSection}>
                                    <textarea
                                        value={data.Problem}
                                        rows={5}
                                        placeholder="Describe Problem "
                                        onChange={(e) => setData((prev) => ({ ...prev, Problem: e.target.value }))}
                                        required
                                    />
                                </div>
                            </div>
                            <div className={style.regData}>
                                <button className={style.regBtn} type="submit" disabled={Register}>
                                    {Register ? "REGISTERING..." : "REGISTER"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
