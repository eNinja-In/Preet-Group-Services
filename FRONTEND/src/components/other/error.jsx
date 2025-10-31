import error from '/error.png'
export default function Error() {
    return (
        <div className="main" style={{ width: '100%' }}>
            <div className="error" style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src={error} alt="404 ERROR PAGE NOT FOUND" style={{ width: '50%' }} />
            </div>
        </div>
    )
}