import Image from "next/image";
import Img from '../../public/banner.jpg'
import { LuChevronsRight } from "react-icons/lu";
import Link from "next/link";


const Hero = () => {
    return (
        <div>
            <div className="hero bg-base-200 min-h-[80vh] justify-around">
                <div className="hero-content flex-col lg:flex-row-reverse lg:gap-25 scale-90 sm:scale-100 p-0 sm:p-1">
                    <div className='scale-60 sm:scale-100' >
                        <Image src={Img} alt="Banner" className="max-w-sm rounded-lg shadow-2xl" width={550} height={400} />
                    </div>


                    <div>
                        <h1 className="text-4xl sm:text-5xl font-bold ">Drive Smarter with <br />
                            <span className="bg-linear-to-r from-[#0D0D33] to-[#0033FF] bg-clip-text text-transparent">DriveFleet</span>
                        </h1>
                        <p className="py-6 max-w-90 sm:max-w-100 opacity-80 ">
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