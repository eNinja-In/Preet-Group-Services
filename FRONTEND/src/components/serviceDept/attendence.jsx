import style from "./CSS/custromerComp.module.css"
import PopUp from '../common/PopUp'
import { useState } from "react";
import { FetAttend, RegAttend } from "../helper/attendHelper"

export default function Attendence() {
    const [empCode, setEmpCode] = useState("");
    const [contact, setContact] = useState("")
    const [loaction, setLocation] = useState("")
    const [state, setState] = useState("")

    const [Fetch, setFetch] = useState(false);
    const [popup, setPopUp] = useState(false)
    const [data, setData] = useState({ Name: "", Contact: '', EngineNo: "", Location: "", State: "", Problem: "" });

    const handleFetch = async () => {
        console.log("Fetching")
        setFetch(true)
        const result = await FetAttend(empCode, setData);
        if (result) setPopUp(true)
        setFetch(false)
    };

    const handleSubmit = () => {
        console.log("submit")
        // RegAttend();
    }

    return (
        <div className={style.main}>
            {popup ? <PopUp data={data} Click={setPopUp} title={"Employee Last Location"} /> : ''}
            <div className={style.attend} style={{ width: '100%' }}>
                <div className={style.form}>
                    <form className={style.fetchForm}>
                        <div className={style.autoInfoInput}>
                            <div className={style.inputSection}><input type="number" value={empCode} placeholder="Employee Code" onChange={(e) => setEmpCode(e.target.value)} required /></div>
                            <div className={style.fetchData}><button className={style.fetchBtn} type="button" disabled={Fetch} onClick={handleFetch}>{Fetch ? "FETCHING..." : "FETCH"}</button></div>
                        </div>
                    </form>
                    <form className={style.dataForm}>
                        <div className={style.complaintForm}>
                            {/* Data fields populated with `data` state */}
                            <div className={style.inputSection} style={{ marginRight: '20%' }}> <input type="number" value={data.Contact} placeholder="Contact No" onChange={(e) => setData((prev) => ({ ...prev, Chassis: e.target.value }))} required /></div>
                            <div className={style.inputSection}><input type="text" value={loaction} placeholder="Location" onChange={(e) => setLocation(e.target.value)} required /></div>
                            <div className={style.regData}><button className={style.regBtn} onClick={handleSubmit} >SUBMIT</button></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}