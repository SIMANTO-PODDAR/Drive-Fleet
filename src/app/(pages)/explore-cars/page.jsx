import CarCard from "@/Components/CarCard";
import SearchFilter from "@/Components/SearchFilter";

const ExploreCarsPage = async ({ searchParams }) => {
    const params = await searchParams;
    const search = params?.search || "";
    const type = params?.type || "";

    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (type) query.set("type", type);

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/all-cars?${query.toString()}`, {
        cache: "no-store"
    });

    const allCars = await res.json();

    return (
        <div>
            <h2 className="text-4xl text-[#0D0D33] md:text-5xl font-bold mb-4 mt-5 text-center">
                Explore All Cars
            </h2>
            <p className="text-[#0D0D33] max-w-2xl mx-auto text-center text-lg">
                Discover cars that match your needs. Compare details, explore options, and choose confidently.
            </p>

            <div className="p-3 sm:p-0">
                <SearchFilter initialSearch={search} initialType={type} />
            </div>


            {allCars.length === 0 ? (
                <div className="text-center text-gray-500 my-10 text-xl font-semibold">
                    No cars found matching your criteria.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 my-5 justify-center gap-10">
                    {allCars.map((car, ind) => (
                        <CarCard key={car._id || ind} car={car} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExploreCarsPage;