
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
                    <Link className="w-3/10 font-bold flex flex-col justify-center items-center" to={"/"}> hello</Link>
                    <Link className="w-3/10 font-bold flex flex-col justify-center items-center" to={""}> hi</Link>
                </div>
            </div>
        </div>
    )
}