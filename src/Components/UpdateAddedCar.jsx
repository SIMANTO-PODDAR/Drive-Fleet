'use client'
import { Button, FieldError, Input, Label, ListBox, Modal, Select, Surface, TextArea, TextField } from "@heroui/react";
import toast from "react-hot-toast";

const UpdateAddedCar = ({ car }) => {

    const UpdateInfo = async (event) => {
        const LoadingToast = toast.loading('Processing your request...');
        event.preventDefault();

        const RentPrice = event.target.RentPrice.value;
        const Type = event.target.Type.value;
        const ImgURL = event.target.ImgURL.value;
        const PickupLocation = event.target.PickupLocation.value;
        const Description = event.target.Description.value;
        const Status = event.target.Status.value;

        const carData = {
            RentPrice,
            Type,
            ImgURL,
            PickupLocation,
            Description,
            Status
        };

        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/all-cars/${car?._id}`,
            {
                method: "PATCH",
                headers: {
                    "content-type": "application/json",
                },

                body: JSON.stringify(carData)
            });

        if (res.ok == true) {
            toast.success('Car data updated successfully!', {
                id: LoadingToast
            });
            window.location.reload();
        }

        else {
            toast.error('Something went wrong! Try again.', {
                id: LoadingToast
            });
        };
    }

    return (
        <div>
            <Modal>
                <Button className="btn btn-sm flex gap-2  items-center justify-start font-bold text-white bg-linear-to-r from-[#0D0D33] to-[#0033FF]">Update</Button>

                <Modal.Backdrop>
                    <Modal.Container placement="auto">
                        <Modal.Dialog className="sm:max-w-xl">
                            <Modal.CloseTrigger />
                            <Modal.Header>
                                <Modal.Heading>Update Car Info</Modal.Heading>
                            </Modal.Header>
                            <Modal.Body>
                                <Surface variant="default">
                                    <form onSubmit={UpdateInfo}
                                        className="p-5 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                            {/* Daily Rent Price */}
                                            <TextField
                                                defaultValue={car.RentPrice}
                                                name="RentPrice"
                                                type="number"
                                                isRequired>
                                                <Label>Daily Rent Price</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="Enter daily rent price"
                                                    className="rounded-2xl"
                                                />
                                                <FieldError />
                                            </TextField>

                                            {/* Availability Status */}
                                            <div>
                                                <Select
                                                    defaultValue={car.Status}
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
                                                    <FieldError />
                                                </Select>
                                            </div>


                                            {/* Car Image URL */}
                                            <div className="md:col-span-2">
                                                <TextField
                                                    defaultValue={car.ImgURL}
                                                    name="ImgURL"
                                                    isRequired>
                                                    <Label >Car Image URL</Label>
                                                    <Input
                                                        type="url"
                                                        placeholder="Paste image URL"
                                                        className="rounded-2xl"
                                                    />
                                                    <FieldError />
                                                </TextField>
                                            </div>

                                            {/* Car Type */}
                                            <div>
                                                <Select
                                                    defaultValue={car.Type}
                                                    name="Type"
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
                                                    <FieldError />
                                                </Select>
                                            </div>

                                            {/* Pickup Location */}
                                            <TextField
                                                defaultValue={car.PickupLocation}
                                                name="PickupLocation"
                                                isRequired>
                                                <Label>Pickup Location</Label>
                                                <Input placeholder="e.g. Dhaka" className="rounded-2xl" />
                                                <FieldError />
                                            </TextField>

                                            {/* Description */}
                                            <div className="md:col-span-2">
                                                <TextField
                                                    defaultValue={car.Description}
                                                    name="Description"
                                                    isRequired>
                                                    <Label>Description</Label>
                                                    <TextArea
                                                        placeholder="Write details about the car..."
                                                        className="rounded-3xl"
                                                    />
                                                    <FieldError />
                                                </TextField>
                                            </div>
                                        </div>

                                        <Modal.Footer>
                                            <Button type="submit" className="btn btn-sm flex gap-2  items-center justify-start font-bold text-white bg-linear-to-r from-[#0D0D33] to-[#0033FF]">Update</Button>
                                        </Modal.Footer>
                                    </form>
                                </Surface>
                            </Modal.Body>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </div>
    );
};

export default UpdateAddedCar;