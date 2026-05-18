import Image from "next/image";
import Img from '../../public/banner.jpg'
import { LuChevronsRight } from "react-icons/lu";


const Hero = () => {
    return (
        <div>
            <div className="hero bg-base-200 min-h-[80vh] justify-around">
                <div className="hero-content flex-col lg:flex-row-reverse lg:gap-25">
                    <Image src={Img} alt="Banner" className="max-w-sm rounded-lg shadow-2xl" width={700} height={400} />

                    <div>
                        <h1 className="text-5xl font-bold ">Drive Smarter with <br />
                            <span className="bg-linear-to-r from-[#0D0D33] to-[#0033FF] bg-clip-text text-transparent">DriveFleet</span>
                        </h1>
                        <p className="py-6 max-w-150 opacity-80 ">
                            Reliable car rentals for every journey — fast booking, affordable pricing, and a fleet you can trust anytime, anywhere.
                        </p>

                        <button className="btn text-white bg-linear-to-r from-[#0D0D33] to-[#0033FF] flex gap-2 items-center">
                            Explore Cars
                            <span  className="text-xl"><LuChevronsRight /></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;