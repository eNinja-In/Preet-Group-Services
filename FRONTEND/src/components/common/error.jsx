import error from '/error.png'

export default function Error() {
    return (
        <div className="main w-full">
            <div className="error w-full h-full flex justify-center items-center">
                <img
                    src={error}
                    alt="404 ERROR PAGE NOT FOUND"
                    className="w-1/2"
                />
            </div>
        </div>
    )
}
