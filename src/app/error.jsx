"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiHome, FiAlertTriangle, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { IoBuildOutline } from "react-icons/io5";

const Error = ({ error, reset }) => {
    const [showDiagnostics, setShowDiagnostics] = useState(false);

    useEffect(() => {
        console.error("Application error boundary triggered:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[75vh] px-6 text-center bg-radial from-[#fff5f5] to-white dark:from-[#330d0d]/5 dark:to-transparent">


            <div className="max-w-xl mx-auto w-full">
                <span className="inline-flex items-center gap-1.5 text-red-500 bg-red-50 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-3">
                    <FiAlertTriangle /> System Breakdown
                </span>

                <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-[#0D0D33]">
                    Roadblock <span className="bg-linear-to-r from-[#0D0D33] to-[#0033FF] bg-clip-text text-transparent">Encountered</span>
                </h1>

                <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto">
                    The engine stalled during your request. Let&apos;s try to restart the trip.
                </p>


                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                    <button
                        onClick={reset}
                        className="btn w-52 py-6 h-auto font-bold text-white bg-linear-to-r from-[#0D0D33] to-[#0033FF] hover:opacity-95 shadow-lg shadow-blue-500/20 border-0 flex items-center justify-center gap-2 rounded-xl transition-all hover:scale-[1.02]"
                    >
                        <IoBuildOutline className="text-xl" />
                        Restart
                    </button>

                    <Link href="/">
                        <button className="btn w-52 py-6 h-auto font-bold bg-white text-[#0D0D33] border-2 border-[#E2E8F0] hover:bg-gray-50 flex items-center justify-center gap-2 rounded-xl transition-all hover:scale-[1.02]">
                            <FiHome className="text-lg" />
                            Home
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Error;