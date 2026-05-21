import DeleteAddedCar from "./DeleteAddedCar";
import UpdateAddedCar from "./UpdateAddedCar";

const MyAddedCarsCard = ({ car }) => {
    return (
        <div className="flex justify-center">
            <div className="card bg-base-100 w-96 shadow-sm">
                <figure className="w-full">
                    <img className="w-auto h-auto"
                        src={car.ImgURL}
                        alt={car.Name} />
                </figure>
                <div className="flex mt-auto">
                    <div className="card-body h-53">
                        <h2 className="card-title">
                            <p className="text-sm text-left font-bold text-[#0D0D33]"> {car.Name}</p>

                            <div className={`badge badge-outline  badge-sm ${car.Status == "Available" ? 'badge-success' : 'badge-warning'}`}>{car.Status}</div>
                        </h2>

                        <div>
                            <p className="text-justify line-clamp-1">
                                {car.Description}
                            </p>

                            <div className="flex justify-between  p-1 border rounded-xl my-0.5">Capacity
                                <span className="mr-4">{car.Capacity}</span>
                            </div>
                            <div className="flex justify-between gap-5 p-1 border rounded-xl">Location
                                <span className="mr-4 line-clamp-1">{car.PickupLocation}</span>
                            </div>
                            <div className="flex justify-between  p-1 border rounded-xl my-0.5">RentPrice
                                <span className="mr-4">$ {car.RentPrice}</span>
                            </div>

                        </div>
                        <div className="card-actions justify-between items-baseline">
                            <DeleteAddedCar carId={car._id} />

                            <UpdateAddedCar car={car} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyAddedCarsCard;