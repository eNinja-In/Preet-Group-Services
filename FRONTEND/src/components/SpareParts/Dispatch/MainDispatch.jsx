
export default function DispatchMain() {
    return (
        <div className="w-full">
            <div className="flex gap-5 flex-wrap">
                <div className='w-4/7 bg-amber-300'>Hello</div>
                <div className='w-2/5'><QuickAction /></div>
                <div className='w-5/5 bg-amber-800'>HIIIIIIIII</div>

            </div>
        </div>
    )
}


import { Link } from 'react-router-dom';
export function QuickAction() {
    return (
        <div className="w-full">
            <div className="w-full ">
                <h1 className='w-full text-2xl font-bold '>Quick Action</h1>
                <div className="w-full flex justify-center text-white bg-[#0766AD] gap-4 p-4 rounded-md shadow-md " >
                    <Link className="w-3/10text-white font-bold flex flex-col justify-center items-center cursor-pointer" to={"/spare-parts/add-dispatch"}>
                        <svg fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64px" height="64px" viewBox="0 0 344.34 344.34" xml:space="preserve" stroke="#ffffff" stroke-width="1.377356">
                            <g>
                                <polygon points="183.627,44.708 160.7,44.646 160.7,154.779 50.6,154.779 50.6,177.718 160.7,177.718 160.7,287.821 183.627,287.821 183.627,177.718 293.743,177.718 293.743,154.779 183.627,154.779 "></polygon>
                            </g>
                        </svg>
                        Add Dispatch
                    </Link>
                    <Link className="w-3/10 font-bold flex flex-col justify-center items-center" to={"/spare-parts/dispatch-reports"}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 17H15M9 13H15M9 9H10M13 3H8.2C7.0799 3 6.51984 3 6.09202 3.21799C5.71569 3.40973 5.40973 3.71569 5.21799 4.09202C5 4.51984 5 5.0799 5 6.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.0799 21 8.2 21H15.8C16.9201 21 17.4802 21 17.908 20.782C18.2843 20.5903 18.5903 20.2843 18.782 19.908C19 19.4802 19 18.9201 19 17.8V9M13 3L19 9M13 3V7.4C13 7.96005 13 8.24008 13.109 8.45399C13.2049 8.64215 13.3578 8.79513 13.546 8.89101C13.7599 9 14.0399 9 14.6 9H19" />
                        </svg>
                        Dispatch Reports</Link>
                    <Link className="w-3/10 font-bold flex flex-col justify-center items-center" to={""}> hi</Link>
                </div>
            </div>
        </div>
    )
}