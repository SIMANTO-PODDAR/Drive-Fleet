'use client'
import { Check } from "@gravity-ui/icons";
import { Button, FieldError, Input, Label, Modal, Surface, TextArea, TextField } from "@heroui/react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const UpdateAddedCar = ({ car }) => {
    const [imageUrl, setImageUrl] = useState(car?.ImgURL || "");
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileUpload = async (file) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB.");
            return;
        }

        setIsUploading(true);
        const loadingToast = toast.loading("Uploading image...");

        try {
            const formData = new FormData();
            formData.append("image", file);

            const response = await fetch(
                `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API}`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const resData = await response.json();

            if (resData.success && resData.data?.url) {
                setImageUrl(resData.data.url);
                toast.success("Image uploaded successfully!", { id: loadingToast });
            } else {
                toast.error(resData.error?.message || "Failed to upload image.", { id: loadingToast });
            }
        } catch (err) {
            toast.error("Failed to upload image. Please try again.", { id: loadingToast });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!imageUrl && !isUploading) {
            setDragActive(true);
        }
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (imageUrl || isUploading) return;

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (imageUrl || isUploading) return;

        if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
        }
    };

    const UpdateInfo = async (event) => {
        const LoadingToast = toast.loading('Processing your request...');
        event.preventDefault();

        if (!imageUrl) {
            toast.error("Please upload a car image first.", { id: LoadingToast });
            return;
        }

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
                        <Modal.Dialog className="sm:max-w-xl mt-50">
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
                                                    min={1}
                                                    max={100000}
                                                    type="number"
                                                    placeholder="Enter daily rent price"
                                                    className="rounded-2xl"
                                                />
                                                <FieldError />
                                            </TextField>

                                            {/* Availability Status */}
                                            <div>
                                                <Label className="text-sm font-medium mb-1.5 block text-gray-700 ">Availability Status</Label>
                                                <select
                                                    name="Status"
                                                    required
                                                    defaultValue={car?.Status || ""}
                                                    className="w-full h-11 px-4 py-2.5 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white/60 text-black  font-medium hover:border-blue-500 dark:hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 cursor-pointer shadow-xs"
                                                >
                                                    <option className="bg-white text-black  font-medium" value="" disabled>Available / Unavailable</option>
                                                    <option className="bg-white text-black  font-medium" value="Available">Available</option>
                                                    <option className="bg-white text-black  font-medium" value="Unavailable">Unavailable</option>
                                                </select>
                                            </div>


                                            {/* Car Image URL */}
                                            <div className="md:col-span-2 flex flex-col gap-1.5">
                                                <Label className="text-sm font-medium">Car Image</Label>
                                                <input
                                                    type="hidden"
                                                    name="ImgURL"
                                                    value={imageUrl}
                                                />
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    accept="image/*"
                                                    className="hidden"
                                                    disabled={isUploading || !!imageUrl}
                                                />

                                                {imageUrl ? (
                                                    <div className="flex items-center justify-between gap-4 p-3 border rounded-2xl border-green-500/50 bg-green-50/10">
                                                        <div className="flex items-center gap-4">
                                                            <img
                                                                src={imageUrl}
                                                                alt="Car Preview"
                                                                className="w-16 h-16 rounded-xl object-cover border border-green-500"
                                                            />
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
                                                                    <Check className="size-4" /> Ready
                                                                </span>
                                                                <span className="text-xs text-gray-500">Image loaded</span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => setImageUrl("")}
                                                            className="text-xs font-semibold text-red-500 hover:underline px-2 py-1 cursor-pointer"
                                                        >
                                                            Change Image
                                                        </button>
                                                    </div>
                                                ) : isUploading ? (
                                                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl border-blue-400 bg-blue-50/10">
                                                        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-600 mb-2"></div>
                                                        <p className="text-sm text-blue-600 font-medium">Uploading image...</p>
                                                    </div>
                                                ) : (
                                                    <div
                                                        onDragOver={handleDragOver}
                                                        onDragLeave={handleDragLeave}
                                                        onDrop={handleDrop}
                                                        onClick={() => {
                                                            if (!imageUrl && !isUploading) {
                                                                fileInputRef.current?.click();
                                                            }
                                                        }}
                                                        className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${dragActive
                                                            ? "border-blue-500 bg-blue-50/20"
                                                            : "border-gray-300 hover:border-blue-400 hover:bg-gray-50/10"
                                                            }`}
                                                    >
                                                        <svg
                                                            className="w-8 h-8 mb-2 text-gray-400"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                            ></path>
                                                        </svg>
                                                        <p className="text-sm text-gray-600 text-center">
                                                            <span className="font-semibold text-blue-600 underline">Browse</span> or drag & drop a car image
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Car Type */}
                                            <div>
                                                <Label className="text-sm font-medium mb-1.5 block text-gray-700 ">Car Type</Label>
                                                <select
                                                    name="Type"
                                                    required
                                                    defaultValue={car?.Type || ""}
                                                    className="w-full h-11 px-4 py-2.5 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white/60 text-black  font-medium hover:border-blue-500 dark:hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 cursor-pointer shadow-xs"
                                                >
                                                    <option className="bg-white text-black  font-medium" value="" disabled>Select a car type</option>
                                                    <option className="bg-white text-black  font-medium" value="SUV">SUV</option>
                                                    <option className="bg-white text-black  font-medium" value="Sedan">Sedan</option>
                                                    <option className="bg-white text-black  font-medium" value="Hatchback">Hatchback</option>
                                                    <option className="bg-white text-black  font-medium" value="Luxury">Luxury</option>
                                                    <option className="bg-white text-black  font-medium" value="Sports">Sports</option>
                                                </select>
                                            </div>

                                            {/* Pickup Location */}
                                            <TextField
                                                defaultValue={car.PickupLocation}
                                                name="PickupLocation"
                                                isRequired>
                                                <Label>Pickup Location</Label>
                                                <Input type="text" maxLength={50} placeholder="e.g. Dhaka" className="rounded-2xl" />
                                                <FieldError />
                                            </TextField>

                                            {/* Description */}
                                            <div className="md:col-span-2">
                                                <TextField maxLength={170}
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