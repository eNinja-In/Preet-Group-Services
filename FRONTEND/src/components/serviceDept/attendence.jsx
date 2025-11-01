import style from "./CSS/custromerComp.module.css"

import { useState } from "react";

export default function Attendence() {
    const [Fetch, setFetch] = useState(false);

    const handleFetch = () => {
        console.log("Fetching")
        setFetch(true)
    };


    return (
        <div className={style.main}>
            <div className={style.attend} style={{ width: '100%' }}>
                <div className={style.form}>
                    <form className={style.fetchForm}>
                        <div className={style.autoInfoInput}>
                            <div className={style.inputSection}>
                                <input
                                    type="text"
                                    // value={EngineNo}
                                    placeholder="Employee Code"
                                    // onChange={(e) => setEngineNo(e.target.value)}
                                    // onClick={() => { }}
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
                        </div>
                    </form>
                    <form className={style.dataForm}>
                        <div className={style.complaintForm}>
                            {/* Data fields populated with `data` state */}
                            <div className={style.inputSection} style={{ marginRight: '20%' }}>
                                <input
                                    type="Number"
                                    // value={data.Chassis}
                                    placeholder="Contact No"
                                    // onChange={(e) => setData((prev) => ({ ...prev, Chassis: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className={style.inputSection}>
                                <input
                                    type="text"
                                    // value={data.Customer}
                                    placeholder="Location"
                                    // onChange={(e) => setData((prev) => ({ ...prev, Customer: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className={style.regData}>
                                <button className={style.regBtn} type="submit" >
                                    {/* {Register ? "REGISTERING..." : "REGISTER"} */}
                                    hello
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}