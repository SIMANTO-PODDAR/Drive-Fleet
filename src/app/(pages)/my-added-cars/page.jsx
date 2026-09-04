import MyAddedCarsCard from "@/Components/MyAddedCarsCard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { IoAddCircleOutline, IoCarSportOutline } from "react-icons/io5";

const MyAddedCarsPage = async () => {

    const session = await auth.api.getSession({
        headers: await headers()
    });

    const token = await auth.api.getToken({
        headers: await headers(),
    });

    const userToken = token?.token;
    const userId = await session?.user?.id;

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/added-cars/${userId}`, {
        headers: {
            authorization: `Bearer ${userToken}`
        }
    });

    const addedCars = await res.json();

    return (
        <div className="mt-8 sm:mt-12 mb-16 px-4">
            <div className="text-center mb-10">
                <h2 className="text-4xl text-[#0D0D33] md:text-5xl font-bold mb-4 mt-5">
                    My Added Cars
                </h2>
                <p className="text-[#0D0D33] max-w-150 mx-auto text-lg opacity-90">
                    All your added vehicles are displayed here for easy management.
                </p>
            </div>

            {addedCars && addedCars.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 my-5 justify-center gap-10">
                    {addedCars.map((car, ind) => (
                        <MyAddedCarsCard key={car._id || ind} car={car} />
                    ))}
                </div>
            ) : (
                <div className="max-w-md mx-auto my-12 p-8 sm:p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-linear-to-b from-slate-50/50 to-slate-100/50 dark:from-slate-900/50 dark:to-slate-900/80 shadow-sm backdrop-blur-xs flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 flex items-center justify-center text-[#0033FF] mb-6 shadow-inner">
                        <IoCarSportOutline className="w-10 h-10" />
                    </div>

                    <h3 className="text-2xl font-bold text-[#0D0D33] dark:text-white mb-2">
                        No Cars Listed Yet
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8 max-w-xs">
                        You haven&apos;t listed any vehicles yet. Add your first car to make it available for booking.
                    </p>

                    <Link href="/add-car">
                        <button className="btn font-bold text-white bg-linear-to-r from-[#0D0D33] to-[#0033FF] hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 rounded-xl px-6 flex items-center gap-2">
                            <IoAddCircleOutline className="text-xl" />
                            Add Your First Car
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyAddedCarsPage;