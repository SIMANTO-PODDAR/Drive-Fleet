import Image from "next/image";
import Img from '../../public/banner.jpg';
import { LuChevronsRight } from "react-icons/lu";
import Link from "next/link";

const Hero = () => {
    return (
        <div>
            <div className="hero bg-base-200 min-h-[70vh] lg:min-h-[80vh] px-4 py-8 sm:py-12 justify-around">
                <div className="hero-content flex-col lg:flex-row-reverse gap-8 lg:gap-16 max-w-7xl mx-auto p-0 text-center lg:text-left">
                    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg flex justify-center">
                        <Image
                            src={Img}
                            alt="Banner"
                            className="w-full h-auto rounded-lg shadow-2xl object-cover"
                            width={550}
                            height={400}
                            priority
                        />
                    </div>

                    <div className="flex flex-col items-center lg:items-start">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                            Drive Smarter with <br />
                            <span className="bg-linear-to-r from-[#0D0D33] to-[#0033FF] bg-clip-text text-transparent">DriveFleet</span>
                        </h1>
                        <p className="py-4 sm:py-6 max-w-sm sm:max-w-md opacity-80 text-sm sm:text-base">
                            Reliable car rentals for every journey — fast booking, affordable pricing, and a fleet you can trust anytime, anywhere.
                        </p>

                        <Link href={'/explore-cars'}>
                            <button className="btn text-white bg-linear-to-r from-[#0D0D33] to-[#0033FF] flex gap-2 items-center">
                                Explore Cars
                                <span className="text-xl"><LuChevronsRight /></span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;