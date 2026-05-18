import CarCard from "@/Components/CarCard";

const AvailableCars = async () => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/available-cars`);
    const availableCars = await res.json();


    return (
        <div>
            <div className="text-center mt-3 mb-12">
                <h2 className="text-4xl text-[#0D0D33] md:text-5xl font-bold mb-4">
                    Available Cars
                </h2>

                <p className="text-[#0D0D33] max-w-2xl mx-auto text-lg">
                    Find the perfect ride for your next trip with comfort, style, and convenience
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 my-5 justify-center gap-10">
                    {
                        availableCars.map((car, ind) =>
                            <CarCard key={ind} car={car} />)

                    }
                </div>
            </div>
        </div>
    );
};

export default AvailableCars;