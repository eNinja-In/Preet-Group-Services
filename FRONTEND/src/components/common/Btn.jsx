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
                p-[2%] pl-[8%]
                text-left
                text-[115%] font-bold
                border-[3px]
                bg-[#0766AD] text-white 
                cursor-default
                hover:bg-white hover:text-black hover:cursor-pointer
                transition-colors duration-200
            "
        >
            {title}
        </button>
    );
}
