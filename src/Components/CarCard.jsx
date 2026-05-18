import { Button } from "@heroui/react";
import Link from "next/link";

const CarCard = ({ car }) => {
    return (
        <div className="flex justify-center">
            <div className="card bg-base-100 w-96 shadow-sm">
                <figure className="w-full">
                    <img className="w-auto h-auto"
                        src={car.ImgURL}
                        alt={car.Name} />
                </figure>
                <div className="card-body">
                    <h2 className="card-title">
                        <p className="text-sm text-left font-bold text-[#0D0D33]"> {car.Name}</p>

                        <div className={`badge badge-outline  badge-sm ${car.Status == "Available" ? 'badge-success' : 'badge-warning'}`}>{car.Status}</div>

                    </h2>
                    <p className="text-justify">
                        {car.Description}
                    </p>
                    <div className="card-actions justify-between">
                        <div className="badge badge-outline">
                            $ {car.RentPrice}
                        </div>

                        <Link href={`/explore-cars/${car._id}`} >
                            <Button className="btn btn-sm flex gap-2  items-center justify-start font-bold text-white bg-linear-to-r from-[#0D0D33] to-[#0033FF]">Details</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default CarCard;