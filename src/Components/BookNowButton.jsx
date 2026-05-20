"use client"
import { authClient } from "@/lib/auth-client";
import { Modal, Surface, Select, Label, ListBox, FieldError, Button, TextArea, TextField } from "@heroui/react";
import toast from "react-hot-toast";

const BookNowButton = ({ car }) => {

    const { data: session } = authClient.useSession();
    const user = session?.user;

    const Booking = async (event) => {
        event.preventDefault();
        const LoadingToast = toast.loading('Processing your request...');

        const Data = {
            //Booking data
            CarName: car.Name,
            TotalPrice: car.RentPrice,
            BookingDate: new Date(),

            //user data 
            userId: user?.id,

            //form data
            DriverNeeded: event.target.Driver.value,
            SpecialNote: event.target.Note.value,
        };

        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/all-bookings`, {
            method: "POST",
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(Data),
        });

        if (res.ok == true) {
            toast.success('Booking successful.', {
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
            <Modal>

                <Button className="btn btn-[15px] font-bold text-white bg-linear-to-r from-[#0D0D33] to-[#0033FF]">Book Now</Button>

                <Modal.Backdrop>
                    <Modal.Container placement="auto">
                        <Modal.Dialog className="sm:max-w-xl mt-50">
                            <Modal.CloseTrigger />
                            <Modal.Header>
                                <Modal.Heading>Booking Info</Modal.Heading>
                            </Modal.Header>
                            <Modal.Body>
                                <Surface variant="default">
                                    <form onSubmit={Booking}
                                        className="p-5 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                            {/* Driver Needed */}
                                            <div>
                                                <Select
                                                    name="Driver"
                                                    isRequired
                                                    className="w-full"
                                                    placeholder="Yes/No"
                                                >
                                                    <Label>Driver Needed</Label>
                                                    <Select.Trigger className="rounded-xl">
                                                        <Select.Value />
                                                        <Select.Indicator />
                                                    </Select.Trigger>
                                                    <Select.Popover>
                                                        <ListBox>

                                                            <ListBox.Item id="Yes" textValue="Yes">
                                                                Yes
                                                                <ListBox.ItemIndicator />
                                                            </ListBox.Item>

                                                            <ListBox.Item id="No" textValue="No">
                                                                No
                                                                <ListBox.ItemIndicator />
                                                            </ListBox.Item>

                                                        </ListBox>
                                                    </Select.Popover>
                                                    <FieldError />
                                                </Select>
                                            </div>

                                            {/* Special Note */}
                                            <div className="md:col-span-2">
                                                <TextField
                                                    name="Note"
                                                    isRequired>
                                                    <Label>Special Note</Label>
                                                    <TextArea
                                                        placeholder="Special Note"
                                                        className="rounded-xl"
                                                    />
                                                    <FieldError />
                                                </TextField>
                                            </div>
                                        </div>

                                        <Modal.Footer>
                                            <Button type="submit" className="btn btn-[15px] flex gap-2  items-center justify-start font-bold text-white bg-linear-to-r from-[#0D0D33] to-[#0033FF]">Book Now</Button>
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

export default BookNowButton;