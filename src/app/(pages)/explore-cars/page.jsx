import CarCard from "@/Components/CarCard";

const ExploreCarsPage = async () => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/all-cars`, { cache: "no-store" });

    const allCars = await res.json();

    return (
        <div>
            <h2 className="text-4xl text-[#0D0D33] md:text-5xl font-bold mb-4 mt-5 text-center">
                Explore All Cars
            </h2>
            <p className="text-[#0D0D33] max-w-2xl mx-auto text-center text-lg">
                Discover cars that match your needs. Compare details, explore options, and choose confidently.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 my-5 justify-center gap-10">
                {
                    allCars.map((car, ind) =>
                        <CarCard key={ind} car={car} />)

                }
            </div>

        </div>
    );
};

export default ExploreCarsPage;