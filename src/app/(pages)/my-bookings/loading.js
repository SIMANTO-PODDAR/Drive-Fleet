export default function Loading() {

    return <div>
        <div>
            <h2 className="text-4xl text-[#0D0D33] md:text-5xl font-bold mb-4 mt-5 text-center">
                Booking Dashboard
            </h2>
            <p className="text-[#0D0D33] max-w-150 mx-auto text-center text-lg">
                See all your booked cars and their current status.
            </p>
        </div>

        <div className="flex justify-center mt-5">
            <span className="loading loading-spinner text-primary text-5xl"></span>
        </div>
    </div>
}