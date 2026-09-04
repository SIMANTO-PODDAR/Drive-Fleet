import { BookingTable } from "@/Components/BookingTable";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { IoBookmarksOutline } from "react-icons/io5";
import { LuChevronsRight } from "react-icons/lu";

const MyBookingsPage = async () => {

    const session = await auth.api.getSession({
        headers: await headers()
    });

    const token = await auth.api.getToken({
        headers: await headers(),
    });

    const userToken = token?.token;
    const userId = await session?.user?.id;

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/all-bookings/${userId}`, {
        headers: {
            authorization: `Bearer ${userToken}`
        }
    });

    const bookingData = await res.json();

    return (
        <div className="mt-8 sm:mt-12 mb-16 px-4">
            <div className="text-center mb-10">
                <h2 className="text-4xl text-[#0D0D33] md:text-5xl font-bold mb-4 mt-5">
                    Booking Dashboard
                </h2>
                <p className="text-[#0D0D33] max-w-150 mx-auto text-lg opacity-90">
                    See all your booked cars and their current status.
                </p>
            </div>

            {bookingData && bookingData.length > 0 ? (
                <div className="mb-5 sm:mb-50">
                    <BookingTable bookingData={bookingData} />
                </div>
            ) : (
                <div className="max-w-md mx-auto my-12 p-8 sm:p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-linear-to-b from-slate-50/50 to-slate-100/50 dark:from-slate-900/50 dark:to-slate-900/80 shadow-sm backdrop-blur-xs flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 flex items-center justify-center text-[#0033FF] mb-6 shadow-inner">
                        <IoBookmarksOutline className="w-10 h-10" />
                    </div>

                    <h3 className="text-2xl font-bold text-[#0D0D33] dark:text-white mb-2">
                        No Bookings Found
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8 max-w-xs">
                        You haven&apos;t reserved any cars yet. Browse our collection and book your next drive today.
                    </p>

                    <Link href="/explore-cars">
                        <button className="btn font-bold text-white bg-linear-to-r from-[#0D0D33] to-[#0033FF] hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 rounded-xl px-6 flex items-center gap-2">
                            Explore Available Cars
                            <LuChevronsRight className="text-xl" />
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyBookingsPage;