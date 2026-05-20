export default function Loading() {

    return <div>
        <h2 className="text-4xl text-[#0D0D33] md:text-5xl font-bold mb-4 mt-5 text-center">
            Explore All Cars
        </h2>
        <p className="text-[#0D0D33] max-w-2xl mx-auto text-center text-lg">
            Discover cars that match your needs. Compare details, explore options, and choose confidently.
        </p>

        <div className="flex justify-center mt-5">
            <span className="loading loading-spinner text-primary text-5xl"></span>
        </div>
    </div>
}