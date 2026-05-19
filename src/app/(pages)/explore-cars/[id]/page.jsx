
const CarDetailsPage = async ({ params }) => {
    const { id } = await params;

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/all-cars/${id}`);

    const car = await res.json();

    const bookby = await car.BookBy;

    return (
        <div className="mb-12">
            <h2 className="text-center mt-3 text-4xl text-[#0D0D33] md:text-5xl font-bold mb-4">
                Details Info
            </h2>
            <div className="hero bg-base-200 min-h-[80vh]">
                <div className="hero-content flex flex-col sm:grid sm:grid-cols-2 justify-center mx-auto gap-10">
                    <img
                        src={car.ImgURL}
                        alt={car.Name}
                        className="w-50 sm:w-100 rounded-lg shadow-2xl overflow-hidden"
                    />

                    <div className="min-w-70 sm:w-auto">
                        <h1 className="text-3xl sm:text-4xl font-bold">{car.Name}</h1>
                        <p className="py-6">
                            {car.Description}
                        </p>

                        <div className="grid gap-3 max-w-60">
                            <div className="flex items-center border rounded-xl p-2 justify-between">
                                <label className="flex gap-1 items-center">
                                    <input type="checkbox" className="checkbox" />
                                    <h2>BookBy</h2>
                                </label>

                                { bookby ? (<span>{car.BookBy}</span>) : ('0') }
                            </div>

                            <div className="flex items-center border rounded-xl p-2 justify-between">
                                <label className="flex gap-1 items-center">
                                    <input type="checkbox" className="checkbox" />
                                    <h2>Type</h2>
                                </label>

                                <span>{car.Type}</span>
                            </div>

                            <div className="flex items-center border rounded-xl p-2 justify-between">
                                <label className="flex gap-1 items-center">
                                    <input type="checkbox" className="checkbox" />
                                    <h2>Capacity</h2>
                                </label>

                                <span>{car.Capacity}</span>
                            </div>

                            <div className="flex items-center border rounded-xl p-2 justify-between">
                                <label className="flex gap-1 items-center">
                                    <input type="checkbox" className="checkbox" />
                                    <h2>RentPrice</h2>
                                </label>

                                <span>$ {car.RentPrice}</span>
                            </div>

                            <div className="flex items-center border rounded-xl p-2 justify-between">
                                <label className="flex gap-1 items-center">
                                    <h2 className="badge badge-info">Status</h2>
                                </label>

                                <span className={`badge badge-outline  badge-sm ${car.Status == "Available" ? 'badge-success' : 'badge-warning'}`}>{car.Status}</span>
                            </div>
                        </div>

                        <div className="flex justify-end mt-2">
                            <button className="btn btn-primary">Book Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarDetailsPage;