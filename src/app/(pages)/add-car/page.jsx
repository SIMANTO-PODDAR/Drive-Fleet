'use client'
import { Button, FieldError, Input, Label, ListBox, TextArea, TextField, Select, Card } from "@heroui/react";
import toast from "react-hot-toast";
import { IoAddCircleOutline } from "react-icons/io5";

const AddCarPage = () => {

    const addCar = async (event) => {
        event.preventDefault();
        const LoadingToast = toast.loading('Adding car...');

        const formData = new FormData(event.currentTarget);
        const carData = Object.fromEntries(formData.entries());


        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/all-cars`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(carData)
        });

        const data = await res;

        if (data.status == 200) {
            toast.success('Car added successfully!', {
                id: LoadingToast
            });
        }
        else {
            toast.error('Something went wrong! Try again.', {
                id: LoadingToast
            });
        };


    };

    return (
        <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-center mt-3">Add a New Car</h1>

            <div className="flex justify-center">
                <Card>
                    <form
                        onSubmit={addCar}
                        className="p-10 space-y-8 w-3xl"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Car Name */}
                            <div className="md:col-span-2">
                                <TextField name="CarName" isRequired>
                                    <Label>Car Name</Label>
                                    <Input placeholder="Enter car name" className="rounded-2xl" />
                                    <FieldError />
                                </TextField>
                            </div>

                            {/* Daily Rent Price */}
                            <TextField name="DailyRentPrice" type="number" isRequired>
                                <Label>Daily Rent Price</Label>
                                <Input
                                    type="number"
                                    placeholder="Enter daily rent price"
                                    className="rounded-2xl"
                                />
                                <FieldError />
                            </TextField>

                            {/* Car Type */}
                            <div>
                                <Select
                                    name="CarType"
                                    isRequired
                                    className="w-full"
                                    placeholder="Select a car type"
                                >
                                    <Label>Car Type</Label>
                                    <Select.Trigger className="rounded-2xl">
                                        <Select.Value />
                                        <Select.Indicator />
                                    </Select.Trigger>
                                    <Select.Popover>
                                        <ListBox>

                                            <ListBox.Item id="SUV" textValue="SUV">
                                                SUV
                                                <ListBox.ItemIndicator />
                                            </ListBox.Item>

                                            <ListBox.Item id="Sedan" textValue="Sedan">
                                                Sedan
                                                <ListBox.ItemIndicator />
                                            </ListBox.Item>

                                            <ListBox.Item id="Hatchback" textValue="Hatchback">
                                                Hatchback
                                                <ListBox.ItemIndicator />
                                            </ListBox.Item>

                                            <ListBox.Item id="Luxury" textValue="Luxury">
                                                Luxury
                                                <ListBox.ItemIndicator />
                                            </ListBox.Item>

                                            <ListBox.Item id="Sports" textValue="Sports">
                                                Sports
                                                <ListBox.ItemIndicator />
                                            </ListBox.Item>

                                        </ListBox>
                                    </Select.Popover>
                                </Select>
                            </div>

                            {/* Car Image URL */}
                            <div className="md:col-span-2">
                                <TextField name="CarImageUrl" isRequired>
                                    <Label >Car Image URL</Label>
                                    <Input
                                        type="url"
                                        placeholder="Paste image URL"
                                        className="rounded-2xl"
                                    />
                                    <FieldError />
                                </TextField>
                            </div>

                            {/* Seat Capacity */}
                            <TextField name="SeatCapacity" isRequired>
                                <Label>Seat Capacity</Label>
                                <Input
                                    placeholder="Enter seat capacity"
                                    className="rounded-2xl"
                                />
                                <FieldError />
                            </TextField>

                            {/* Pickup Location */}
                            <TextField name="PickupLocation" isRequired>
                                <Label>Pickup Location</Label>
                                <Input placeholder="e.g. Dhaka" className="rounded-2xl" />
                                <FieldError />
                            </TextField>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <TextField name="Description" isRequired>
                                    <Label>Description</Label>
                                    <TextArea
                                        placeholder="Write details about the car..."
                                        className="rounded-3xl"
                                    />
                                    <FieldError />
                                </TextField>
                            </div>

                            {/* Availability Status */}
                            <div>
                                <Select
                                    name="Status"
                                    isRequired
                                    className="w-full"
                                    placeholder="Available / Unavailable"
                                >
                                    <Label>Availability Status</Label>
                                    <Select.Trigger className="rounded-2xl">
                                        <Select.Value />
                                        <Select.Indicator />
                                    </Select.Trigger>
                                    <Select.Popover>
                                        <ListBox>

                                            <ListBox.Item id="Available" textValue="Available">
                                                Available
                                                <ListBox.ItemIndicator />
                                            </ListBox.Item>

                                            <ListBox.Item id="Unavailable" textValue="Unavailable">
                                                Unavailable
                                                <ListBox.ItemIndicator />
                                            </ListBox.Item>

                                        </ListBox>
                                    </Select.Popover>
                                </Select>
                            </div>
                        </div>

                        {/* Submit Btn*/}
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                variant="outline"
                                className="font-bold text-white  bg-linear-to-r from-[#0D0D33] to-[#0033FF]"
                            >
                                <span className="text-xl"><IoAddCircleOutline /></span>
                                Add Car
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default AddCarPage;