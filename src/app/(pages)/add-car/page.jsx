'use client'
import { authClient } from "@/lib/auth-client";
import { Check } from "@gravity-ui/icons";
import { Button, Card, FieldError, Input, Label, TextArea, TextField } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { IoAddCircleOutline } from "react-icons/io5";

const AddCarPage = () => {

    const { data: session } = authClient.useSession();
    const user = session?.user;

    const [imageUrl, setImageUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);
    const router = useRouter();

    const handleFileUpload = async (file) => {
        if (!file) return;

        if (imageUrl) {
            return;
        }

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

    const addCar = async (event) => {
        event.preventDefault();

        if (!imageUrl) {
            toast.error("Please upload a car image first.");
            return;
        }

        setIsSubmitting(true);
        const LoadingToast = toast.loading('Adding car...');

        const Name = event.target.Name.value;
        const RentPrice = event.target.RentPrice.value;
        const BookBy = 0;
        const Type = event.target.Type.value;
        const ImgURL = imageUrl;
        const Capacity = event.target.Capacity.value;
        const PickupLocation = event.target.PickupLocation.value;
        const Description = event.target.Description.value;
        const Status = event.target.Status.value;
        const userId = user?.id;
        const UserListedCar = true;


        const carData = {
            Name,
            RentPrice,
            BookBy,
            Type,
            ImgURL,
            Capacity,
            PickupLocation,
            Description,
            Status,

            userId,
            UserListedCar
        }

        try {
            const { data: tokenData } = await authClient.token();
            const userToken = tokenData?.token;

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/all-cars`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${userToken}`
                },
                body: JSON.stringify(carData)
            });

            const data = await res;

            if (data.status == 200) {
                toast.success('Car added successfully!', {
                    id: LoadingToast
                });

                setTimeout(() => {
                    router.push(`/my-added-cars`);
                }, 1500);
            }
            else {
                toast.error('Something went wrong! Try again.', {
                    id: LoadingToast
                });
                setIsSubmitting(false);
            }
        } catch (error) {
            toast.error('Something went wrong! Try again.', {
                id: LoadingToast
            });
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl sm:text-5xl font-bold text-center mt-3">Add a New Car</h1>

            <div className="flex justify-center">
                <Card>
                    <form
                        onSubmit={addCar}
                        className="p-10 space-y-8 min-w-80 sm:w-150 lg:w-3xl"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Car Name */}
                            <div className="md:col-span-2">
                                <TextField name="Name" isRequired>
                                    <Label>Car Name</Label>
                                    <Input maxLength={35} placeholder="Enter car name" className="rounded-2xl" />
                                    <FieldError />
                                </TextField>
                            </div>

                            {/* Daily Rent Price */}
                            <TextField name="RentPrice" type="number" isRequired>
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

                            {/* Car Type */}
                            <div>
                                <Label className="text-sm font-medium mb-1.5 block text-gray-700 ">Car Type</Label>
                                <select
                                    name="Type"
                                    required
                                    defaultValue=""
                                    className="w-full h-11 px-4 py-2.5 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-900/60 text-black  font-medium hover:border-blue-500 dark:hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 cursor-pointer shadow-xs"
                                >
                                    <option className="bg-white dark:bg-zinc-900 text-black  font-medium" value="" disabled>Select a car type</option>
                                    <option className="bg-white dark:bg-zinc-900 text-black  font-medium" value="SUV">SUV</option>
                                    <option className="bg-white dark:bg-zinc-900 text-black  font-medium" value="Sedan">Sedan</option>
                                    <option className="bg-white dark:bg-zinc-900 text-black  font-medium" value="Hatchback">Hatchback</option>
                                    <option className="bg-white dark:bg-zinc-900 text-black  font-medium" value="Luxury">Luxury</option>
                                    <option className="bg-white dark:bg-zinc-900 text-black  font-medium" value="Sports">Sports</option>
                                </select>
                            </div>

                            {/* Car Image Upload */}
                            <div className="md:col-span-2 flex flex-col gap-1.5">
                                <Label className="text-sm font-medium">Car Image</Label>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                    disabled={isUploading || !!imageUrl}
                                />

                                {imageUrl ? (
                                    <div className="flex items-center gap-4 p-3 border rounded-2xl border-green-500/50 bg-green-50/10">
                                        <img
                                            src={imageUrl}
                                            alt="Car Preview"
                                            className="w-16 h-16 rounded-xl object-cover border border-green-500"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
                                                <Check className="size-4" /> Ready
                                            </span>
                                            <span className="text-xs text-gray-500">Image successfully uploaded</span>
                                        </div>
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

                            {/* Seat Capacity */}
                            <TextField name="Capacity" isRequired>
                                <Label>Seat Capacity</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    max={500}
                                    placeholder="Enter seat capacity"
                                    className="rounded-2xl"
                                />
                                <FieldError />
                            </TextField>

                            {/* Pickup Location */}
                            <TextField name="PickupLocation" isRequired>
                                <Label>Pickup Location</Label>
                                <Input maxLength={50} placeholder="e.g. Dhaka" className="rounded-2xl" />
                                <FieldError />
                            </TextField>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <TextField maxLength={170} name="Description" isRequired>
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
                                <Label className="text-sm font-medium mb-1.5 block text-gray-700 ">Availability Status</Label>
                                <select
                                    name="Status"
                                    required
                                    defaultValue=""
                                    className="w-full h-11 px-4 py-2.5 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-900/60 text-black  font-medium hover:border-blue-500 dark:hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 cursor-pointer shadow-xs"
                                >
                                    <option className="bg-white dark:bg-zinc-900 text-black  font-medium" value="" disabled>Available / Unavailable</option>
                                    <option className="bg-white dark:bg-zinc-900 text-black  font-medium" value="Available">Available</option>
                                    <option className="bg-white dark:bg-zinc-900 text-black  font-medium" value="Unavailable">Unavailable</option>
                                </select>
                            </div>
                        </div>

                        {/* Submit Btn*/}
                        <div>
                            <Button
                                type="submit"
                                variant="outline"
                                isDisabled={isSubmitting}
                                isLoading={isSubmitting}
                                className="w-full font-bold text-white bg-linear-to-r from-[#0D0D33] to-[#0033FF] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {!isSubmitting && <span className="text-xl"><IoAddCircleOutline /></span>}
                                {isSubmitting ? "Adding Car..." : "Add Car"}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default AddCarPage;