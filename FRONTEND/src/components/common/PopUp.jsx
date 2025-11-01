import { useState } from "react"
export default function PopUp(prope) {
    const [popup, setPopUp] = useState(false)
    const Data = prope
    return (
        <>
            {popup ? '' :
                <div className="m" style={{ width: '100vw', height: "100vh", backgroundColor: 'black', position: 'fixed', top: '0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="p" style={{ width: '85%', backgroundColor: 'blue', height: '20%', padding: "2%", borderRadius: '15px', border: '5px solid white' }}>
                        <div className="n" style={{ width: '100%', backgroundColor: 'green', height: '100%' }}>
                            {/* {Data ? (() => (Data).map(([title, value], i) => {
                                .da>
                             })) : console.log("NaN")} */}
                        </div>
                    </div>
                </div>}
        </>
    )
}