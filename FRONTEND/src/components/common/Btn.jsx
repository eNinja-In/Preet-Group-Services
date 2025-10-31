import { useNavigate } from "react-router-dom";
import { useState } from 'react';
export default function Btn(prope) {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate()
    const title = prope.title;
    const click = prope.click;
    const type = prope.type;

    return (
        <button
            className="button"
            onClick={() => { navigate(click) }}
            type={type}
            style={{
                width: '94%',
                margin: '1% 3%',
                padding: '2%',
                paddingLeft: '8%',
                textAlign: 'left',
                fontSize: '115%',
                fontWeight: 'bold',
                backgroundColor: isHovered ? 'white' : '#0766AD',
                color: isHovered ? 'black' : 'white',
                borderWidth: '3px',
                cursor: isHovered ? 'pointer' : 'default'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {title}
        </button>
    )
}
