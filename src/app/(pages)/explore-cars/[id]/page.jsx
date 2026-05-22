import Link from "next/link";
import BookNowButton from "@/Components/BookNowButton";
import { FiArrowLeft, FiTag, FiUsers, FiUser, FiInfo } from "react-icons/fi";

const CarDetailsPage = async ({ params }) => {
    const { id } = await params;

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/all-cars/${id}`);

    const car = await res.json();

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 mb-12">
            {/* Back Button */}
            <div className="mb-6">
                <Link
                    href="/explore-cars"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                >
                    <FiArrowLeft className="w-4 h-4" />
                    <span>Back to Explore Cars</span>
                </Link>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">


                <div className="lg:col-span-8 space-y-8">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-[#0D0D33]">
                                {car?.Name}
                            </h1>
                        </div>
                        <div className="flex items-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${car?.Status === "Available"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                                }`}>
                                {car?.Status}
                            </span>
                        </div>
                    </div>


                    <div className="bg-slate-100 rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                        <img
                            src={car?.ImgURL}
                            alt={car?.Name}
                            className="w-full h-auto max-h-[500px] object-cover mx-auto"
                        />
                    </div>


                    <div>
                        <h2 className="text-xl font-bold text-[#0D0D33] mb-4">
                            Specifications
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="p-2 bg-indigo-50 text-[#0033FF] rounded-lg">
                                    <FiTag className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
                                        Type
                                    </span>
                                    <span className="text-sm font-bold text-slate-800">
                                        {car?.Type}
                                    </span>
                                </div>
                            </div>


                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="p-2 bg-indigo-50 text-[#0033FF] rounded-lg">
                                    <FiUsers className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
                                        Capacity
                                    </span>
                                    <span className="text-sm font-bold text-slate-800">
                                        {car?.Capacity} Persons
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="p-2 bg-indigo-50 text-[#0033FF] rounded-lg">
                                    <FiUser className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
                                        Booked By
                                    </span>
                                    <span className="text-sm font-bold text-slate-800">
                                        {car?.BookBy || "0"}
                                    </span>
                                </div>
                            </div>


                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <div className={`p-2 rounded-lg ${car?.Status === "Available" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                                    }`}>
                                    <FiInfo className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
                                        Status
                                    </span>
                                    <span className={`text-sm font-bold ${car?.Status === "Available" ? "text-green-600" : "text-amber-600"
                                        }`}>
                                        {car?.Status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="border-t border-slate-200 pt-6">
                        <h2 className="text-xl font-bold text-[#0D0D33] mb-3">
                            Description
                        </h2>
                        <p className={`text-left line-clamp-1 font-bold text-[13px] text-green-600 underline italic  ${car.UserListedCar == true ? 'grid' : 'hidden'}`}>
                            User Listed Car
                        </p>
                        <p className="text-slate-600 leading-relaxed text-justify">
                            {car?.Description}
                        </p>
                    </div>

                </div>


                <div className="lg:col-span-4 lg:sticky lg:top-6">
                    <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm space-y-6">
                        <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                                Rental Price
                            </span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-[#0D0D33]">
                                    $ {car?.RentPrice}
                                </span>
                                <span className="text-slate-500 font-medium text-sm">/ day</span>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-4 space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500 font-medium">Status</span>
                                <span className={`font-semibold ${car?.Status === "Available" ? "text-green-600" : "text-amber-600"
                                    }`}>
                                    {car?.Status}
                                </span>
                            </div>
                            <div className="flex justify-between border-t border-slate-50 pt-2">
                                <span className="text-slate-500 font-medium">Taxes & Fees</span>
                                <span className="text-slate-800 font-semibold">Calculated at checkout</span>
                            </div>
                        </div>

                        <div className="pt-2 flex justify-center w-full">
                            <BookNowButton car={car} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CarDetailsPage;