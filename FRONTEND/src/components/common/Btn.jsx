import { useNavigate } from "react-router-dom";

export default function Btn({ title, click, type }) {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(click)}
            type={type}
            className="
                w-[94%]
                my-[1%] mx-[3%]
                p-[1%] pl-[8%]
                text-left
                text-xl font-bold
                border-2 border-transparent
                bg-[#0766AD] text-white 
                cursor-pointer
                hover:bg-white hover:text-black  hover:border-black
                transition-colors duration-200
            "
        >
            {title}
        </button>
    );
}
