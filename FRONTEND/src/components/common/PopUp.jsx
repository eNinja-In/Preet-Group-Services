export default function PopUp({ data, Click, title }) {
    return (
        <div className="w-screen h-screen bg-[rgba(0,0,0,0.7)] fixed top-0 left-0 flex justify-center items-center">
            <div className="w-1/2 bg-white min-h-[20%] max-h-max p-4 rounded-xl border-4 border-blue-600 flex flex-col justify-center items-center relative">
                <div className="w-10 h-10 absolute top-3 right-3 flex justify-center items-center cursor-pointer" onClick={() => Click(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40">
                        <path d="M12 10.293l-4.707-4.707-1.414 1.414L10.293 12l-4.707 4.707 1.414 1.414L12 13.707l4.707 4.707 1.414-1.414L13.707 12l4.707-4.707-1.414-1.414z" />
                    </svg>
                </div>
                <h2 className="w-full text-center text-[250%] m-0 p-0">{title}</h2>
                <div className="w-full h-full text-white overflow-y-auto overflow-x-hidden flex flex-col justify-center">
                    {data && typeof data === "object" && !Array.isArray(data) ? (
                        Object.entries(data).map(([t, value], i) => (
                            <div key={i} className="w-full my-2 p-2 border-b border-white text-black flex flex-wrap justify-center items-center">
                                <div className="w-[35%] px-2 text-[150%] font-bold border-b-2 border-l-2 border-black -skew-x-12">{t}</div>
                                <div className="w-[40%] mx-5 text-left text-[110%] border-b-2 border-dotted border-black">{value}</div>
                            </div>
                        ))
                    ) : (
                        <strong className="w-full text-center text-[200%] text-red-600 font-bold">{data}</strong>
                    )}
                </div>
            </div>
        </div>
    );
}
