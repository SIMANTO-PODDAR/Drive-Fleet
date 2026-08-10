import Link from "next/link";
import { FaMapMarkerAlt, FaUsers, FaTag } from "react-icons/fa";
import DeleteAddedCar from "./DeleteAddedCar";
import UpdateAddedCar from "./UpdateAddedCar";

const MyAddedCarsCard = ({ car }) => {
    const isAvailable = car?.Status === "Available";

    return (
        <div className="flex justify-center h-full">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 w-full max-w-sm flex flex-col overflow-hidden group">

                {/* 1. Car Image */}
                <div className="relative w-full h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Link href={`/explore-cars/${car?._id}`} className="block w-full h-full">
                        <img
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                            src={car?.ImgURL}
                            alt={car?.Name || "Car Image"}
                        />
                    </Link>
                    {car?.Type && (
                        <span className="absolute top-3 left-3 bg-[#0D0D33]/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                            {car.Type}
                        </span>
                    )}
                </div>

                {/* Card Content */}
                <div className="p-5 flex flex-col grow justify-between gap-4">
                    <div className="space-y-3">
                        {/* 2. Car Name */}
                        <h3 className="text-lg font-bold text-[#0D0D33] dark:text-white line-clamp-1 hover:text-[#0033FF] transition-colors duration-200">
                            <Link href={`/explore-cars/${car?._id}`}>
                                {car?.Name}
                            </Link>
                        </h3>

                        {/* 3. Description */}
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                            {car?.Description}
                        </p>

                        {/* 4. Price / Location / Capacity */}
                        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300">
                                <FaTag className="text-[#0033FF] shrink-0" />
                                <span className="truncate">
                                    Price: <span className="font-bold text-[#0D0D33] dark:text-white">${car?.RentPrice}</span>/day
                                </span>
                            </div>

                            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300">
                                <FaMapMarkerAlt className="text-red-500 shrink-0" />
                                <span className="truncate font-medium">{car?.PickupLocation || "N/A"}</span>
                            </div>

                            <div className="col-span-2 flex items-center gap-1.5 p-2 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300">
                                <FaUsers className="text-blue-500 shrink-0" />
                                <span className="truncate font-medium">
                                    Capacity: <span className="font-bold text-[#0D0D33] dark:text-white">{car?.Capacity} Seats</span>
                                </span>
                            </div>
                        </div>

                        {/* 5. Status Badge */}
                        <div className="pt-1 flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Status:</span>
                            <span
                                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${isAvailable
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                                        : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800"
                                    }`}
                            >
                                <span
                                    className={`w-1.5 h-1.5 rounded-full ${isAvailable ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                                        }`}
                                ></span>
                                {car?.Status || "Unavailable"}
                            </span>
                        </div>
                    </div>

                    {/* 6. Actions */}
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
                        <DeleteAddedCar carId={car?._id} />
                        <UpdateAddedCar car={car} />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MyAddedCarsCard;