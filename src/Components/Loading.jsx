import { FaCarSide } from "react-icons/fa6";

const Loading = () => {
    return (
        <div className="min-h-[65vh] w-full flex flex-col items-center justify-center py-12 px-4">
            {/* Brand Spinner & Icon */}
            <div className="relative flex items-center justify-center mb-6">
                {/* Outer glowing pulsing ring */}
                <div className="absolute w-20 h-20 rounded-full bg-gradient-to-r from-[#0D0D33] to-[#0033FF] opacity-20 animate-ping" />

                {/* Rotating gradient border spinner */}
                <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-[#0033FF] border-r-[#0D0D33] animate-spin" />

                {/* Center Icon */}
                <div className="absolute flex items-center justify-center text-[#0033FF]">
                    <FaCarSide className="w-6 h-6 animate-pulse" />
                </div>
            </div>

            {/* Loading Text */}
            <div className="text-center space-y-2 mb-10">
                <h3 className="text-xl font-bold bg-linear-to-r from-[#0D0D33] to-[#0033FF] bg-clip-text text-transparent tracking-wide">
                    Loading DriveFleet...
                </h3>
                <p className="text-xs font-medium text-slate-400">
                    Preparing your vehicle experience
                </p>
            </div>
        </div>
    );
};

export default Loading;