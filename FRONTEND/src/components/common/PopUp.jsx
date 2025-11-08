import { useState } from "react";
import style from "./PopUp.module.css"; // Import the CSS file

export default function PopUp(props) {
    const Data = props.data;  // Assuming data is passed as a prop
    const Click = props.Click;
    const title = props.title;
    return (
        <div className={style.main}>
            {/* Fix: Wrap the function call inside an anonymous function */}
            <div className={style.popup} >
                {/* Inline SVG for the close icon */}
                <div className={style.closer} onClick={() => Click(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40">
                        <path d="M12 10.293l-4.707-4.707-1.414 1.414L10.293 12l-4.707 4.707 1.414 1.414L12 13.707l4.707 4.707 1.414-1.414L13.707 12l4.707-4.707-1.414-1.414z" />
                    </svg>
                </div>
                <h2 className={style.heading}>{title}</h2>
                <div className={style.dataList}>
                    {/* Render each item from the data */}
                    {Data && (
                        typeof Data === 'object' && !Array.isArray(Data) ? (
                            Object.entries(Data).map(([title, value], i) => (
                                <div key={i} className={style.popupItem}>
                                    <div className={style.title}>{title}</div>
                                    <div className={style.value}>{value}</div>
                                </div>
                            ))
                        ) : (
                            <strong>{Data}</strong> // If it's not an object (like a string or number), just display it
                        )
                    )}

                </div>
            </div>
        </div>
    );
}
