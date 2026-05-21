"use client"

import Link from "next/link";
import { FiHome } from "react-icons/fi";
import { IoCarOutline } from "react-icons/io5";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[75vh] px-6 text-center bg-radial from-[#f4f7ff] to-white dark:from-[#0d0d33]/5 dark:to-transparent">
            <div className="max-w-xl mx-auto">
                <span className="inline-block text-[#0033FF] bg-[#0033FF]/10 text-xs px-4 py-1.5 rounded-full font-bold tracking-wider uppercase mb-3">
                    Error Code: 404
                </span>

                <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-[#0D0D33]">
                    You&apos;ve Veered <span className="bg-linear-to-r from-[#0D0D33] to-[#0033FF] bg-clip-text text-transparent">Off Course</span>
                </h1>

                <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto">
                    The destination you are trying to navigate to does not exist in our fleet records. Let&apos;s get your journey back on the right track!
                </p>
 
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href="/">
                        <button className="btn w-52 py-6 h-auto font-bold text-white bg-linear-to-r from-[#0D0D33] to-[#0033FF] hover:opacity-95 shadow-lg shadow-blue-500/20 border-0 flex items-center justify-center gap-2 rounded-xl transition-all hover:scale-[1.02]">
                            <FiHome className="text-lg" />
                            Home
                        </button>
                    </Link>

                    <Link href="/explore-cars">
                        <button className="btn w-52 py-6 h-auto font-bold bg-white text-[#0033FF] border-2 border-[#0033FF] hover:bg-[#0033FF]/5 flex items-center justify-center gap-2 rounded-xl transition-all hover:scale-[1.02]">
                            <IoCarOutline className="text-xl" />
                            Explore Our Fleet
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;