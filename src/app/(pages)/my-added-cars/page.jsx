import MyAddedCarsCard from "@/Components/MyAddedCarsCard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const MyAddedCarsPage = async () => {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    const userId = await session?.user?.id

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/added-cars/${userId}`);
    const addedCars = await res.json();

    return (
        <div>
            <div>
                <h2 className="text-4xl text-[#0D0D33] md:text-5xl font-bold mb-4 mt-5 text-center">
                    My Added Cars
                </h2>
                <p className="text-[#0D0D33] max-w-150 mx-auto text-center text-lg">
                    All your added vehicles are displayed here for easy management.
                </p>
            </div>

            <div>
                {
                    addedCars.map((car, ind) =>
                        <MyAddedCarsCard key={ind} car={car} />)

                }
            </div>
        </div>
    );
};

export default MyAddedCarsPage;