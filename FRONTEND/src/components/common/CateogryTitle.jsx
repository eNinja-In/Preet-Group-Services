import { useState } from 'react';
export default function CateogryTitle(prope) {
    const title = prope.title;
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="mainCat"
            style={{
                width: '82%',
                margin: '1% 6%',
                padding: '1.7%',
                paddingLeft: '8%',
                transform: 'skewX(-25deg)',
                borderBottom: '4px solid black',
                borderLeft: '4px solid black',
                cursor: hovered ? 'none' : 'default'
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <p style={{ width: '100%', margin: 0, padding: 0, fontSize: '180%', fontWeight: 1000, transform: 'skew(25deg)' }}>
                {title}
            </p>
        </div>
    );
}
