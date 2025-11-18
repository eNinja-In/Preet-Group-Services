export default function Footbar() {
    return (
        <div className="w-full h-13 bg-[#0d86e0] flex justify-between items-center px-4">
            {/* Footer Left */}
            <div className="flex-1"></div>

            {/* Footer Right */}
            <div className="flex-1 text-right text-white font-bold text-lg"> Preet Groups © {new Date().getFullYear()} | Dev: <a href="/">eNinja-In</a> </div>
        </div>
    );
}
