import Image from "next/image";
import BMW from "../../public/bmw.png";
import Hyundai from "../../public/hyundai.jpg";
import Tesla from "../../public/Tesla.png";
import Toyota from "../../public/toyota.png";

const OurFleetPartners = () => {
    return (
        <div className="mt-3 sm:mt-20">
            <section className="card py-20 bg-[#0D0D33] text-white">
                <div className="mx-auto px-6 text-center">

                    <h2 className="text-4xl font-bold mb-4">
                        Trusted by Leading Automotive Brands
                    </h2>

                    <p className="text-gray-300 max-w-2xl mx-auto mb-12">
                        We collaborate with globally recognized automotive brands to deliver
                        reliable, premium, and comfortable driving experiences.
                    </p>

                    <div className="
                    grid grid-cols-1 text-center gap-3 sm:gap-5 mt-5 text-black/50 justify-between py-5
                    sm:grid-cols-2 sm:py-20 sm:mt-10
                    lg:grid-cols-4 lg:py-0"
                    >

                        <div className="card bg-base-100 card-md shadow-sm">
                            <div className="card-body flex flex-col items-center">
                                <Image src={BMW} alt="bmw-logo"
                                    height={70} />
                                <p className="text-[18px]">BMW</p>
                            </div>
                        </div>

                        <div className="card bg-base-100 card-md shadow-sm">
                            <div className="card-body flex flex-col items-center">
                                <Image src={Hyundai} alt="hyundai-logo"
                                    height={70} />
                                <p className="text-[18px]">Hyundai</p>
                            </div>
                        </div>

                        <div className="card bg-base-100 card-md shadow-sm">
                            <div className="card-body flex flex-col items-center">
                                <Image src={Tesla} alt="tesla-logo"
                                    height={70} />
                                <p className="text-[18px]">Tesla</p>
                            </div>
                        </div>

                        <div className="card bg-base-100 card-md shadow-sm">
                            <div className="card-body flex flex-col items-center">
                                <Image src={Toyota} alt="toyota-logo"
                                    height={70} />
                                <p className="text-[18px]">Toyota</p>
                            </div>
                        </div>

                    </div>

                </div>
            </section>
        </div>
    );
};

export default OurFleetPartners;