/**
 * PopUp Component
 *
 * A highly customizable and reusable popup/modal component that can handle various content types,
 * including text, objects, images, and custom components.
 * The component allows the user to define custom content, title, close behavior, and more.
 *
 * Props:
 * - data (optional): The content to be displayed inside the popup. Can be a string, object, or other types.
 * - title (optional): The title of the popup.
 * - isOpen (optional): Whether the popup is open or not. Useful for controlling visibility from the parent.
 * - onClose (optional): A function that is called when the popup is closed.
 * - style (optional): Custom CSS styles to override the default ones.
 * - closeOnClickOutside (optional): Whether the popup should close when clicked outside.
 * - actions (optional): Custom actions (buttons or other components) to be displayed at the bottom of the popup.
 */

export default function PopUp({
    data,
    title,
    isOpen = false,
    onClose,
    style = {},
    closeOnClickOutside = true,
    actions = null
}) {
    const handleClickOutside = (e) => { if (e.target === e.currentTarget && closeOnClickOutside) onClose && onClose(false); };

    return isOpen ? (
        <div className="w-screen h-screen fixed top-0 left-0 bg-[rgba(0,0,0,0.7)] flex justify-center items-center z-50" onClick={handleClickOutside} >
            <div className={`w-full max-w-lg bg-white min-h-[20%] max-h-[80%] p-6 rounded-xl border-4 border-blue-600 flex flex-col justify-between items-center relative transition-all duration-300 ease-in-out transform ${style.customPopup}`} >
                {/* Close Button */}
                <div className="w-10 h-10 absolute top-3 right-3 flex justify-center items-center cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" onClick={() => onClose && onClose(false)} >
                        <path d="M12 10.293l-4.707-4.707-1.414 1.414L10.293 12l-4.707 4.707 1.414 1.414L12 13.707l4.707 4.707 1.414-1.414L13.707 12l4.707-4.707-1.414-1.414z" />
                    </svg>
                </div>

                {/* Title */}
                {title && (<h2 className="w-full text-center text-4xl  font-bold text-gray-800"> {title} </h2>)}

                {/* Content */}
                <div className="w-full h-fit text-gray-700 overflow-y-auto flex flex-col justify-start items-center">
                    {typeof data === "object" && !Array.isArray(data) ? (
                        Object.entries(data).map(([key, value], i) => (
                            <div key={i} className="w-full my-2 p-2 border-b border-gray-300 text-black flex flex-wrap justify-start items-center" >
                                <div className="w-[35%] px-2 text-lg font-bold text-blue-600"> {key} </div>
                                <div className="w-[60%] mx-5 text-left text-base">{value}</div>
                            </div>
                        ))
                    ) : typeof data === "string" ? (<strong className="w-full text-center text-2xl text-red-600 font-bold"> {data} </strong>
                    ) : typeof data === "number" ? (<div className="text-4xl font-extrabold text-gray-800">{data}</div>
                    ) : (data)}
                </div>

                {/* Custom Actions (Buttons or other components) */}
                {actions && (<div className="w-full mt-4 flex justify-center items-center">{actions}</div>)}
            </div>
        </div>
    ) : null;
}


// export default function PopUp({ data, Click, title }) {
//     return (
//         <div className="w-screen h-screen bg-[rgba(0,0,0,0.7)] fixed top-0 left-0 flex justify-center items-center">
//             <div className="w-1/2 bg-white min-h-[20%] max-h-max p-4 rounded-xl border-4 border-blue-600 flex flex-col justify-center items-center relative">
//                 <div className="w-10 h-10 absolute top-3 right-3 flex justify-center items-center cursor-pointer" onClick={() => Click(false)}>
//                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40">
//                         <path d="M12 10.293l-4.707-4.707-1.414 1.414L10.293 12l-4.707 4.707 1.414 1.414L12 13.707l4.707 4.707 1.414-1.414L13.707 12l4.707-4.707-1.414-1.414z" />
//                     </svg>
//                 </div>
//                 <h2 className="w-full text-center text-[250%] m-0 p-0">{title}</h2>
//                 <div className="w-full h-full text-white overflow-y-auto overflow-x-hidden flex flex-col justify-center">
//                     {data && typeof data === "object" && !Array.isArray(data) ? (
//                         Object.entries(data).map(([t, value], i) => (
//                             <div key={i} className="w-full my-2 p-2 border-b border-white text-black flex flex-wrap justify-center items-center">
//                                 <div className="w-[35%] px-2 text-[150%] font-bold border-b-2 border-l-2 border-black -skew-x-12">{t}</div>
//                                 <div className="w-[40%] mx-5 text-left text-[110%] border-b-2 border-dotted border-black">{value}</div>
//                             </div>
//                         ))
//                     ) : (
//                         <strong className="w-full text-center text-[200%] text-red-600 font-bold">{data}</strong>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }
