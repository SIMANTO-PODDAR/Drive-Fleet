"use client"
import GoogleLoginButton from "@/Components/GoogleLoginButton";
import { authClient } from "@/lib/auth-client";
import { Check, Eye, EyeSlash } from "@gravity-ui/icons";
import { Button, Description, FieldError, Form, Input, InputGroup, Label, TextField } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const RegistrationPage = () => {
    const [eyeSlash, setEyeSlash] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);
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

    const Registration = async (e) => {
        e.preventDefault();

        if (!imageUrl) {
            toast.error("Please upload a profile image first.");
            return;
        }

        const LoadingToast = toast.loading('Processing your request..');

        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;

        const { data, error } = await authClient.signUp.email(
            {
                name: name,
                email: email,
                password: password,
                image: imageUrl,
            },

            {
                onSuccess: async () => {
                    toast.success("Registration completed successfully.", {
                        id: LoadingToast
                    });
                    await authClient.signOut();
                    router.push('/login');
                }
            }
        );

        if (error) {
            toast.error(error.message, {
                id: LoadingToast
            })
        };
    };

    return (
        <div>
            <div>
                <h2 className="text-4xl text-[#0D0D33] md:text-5xl font-bold mb-4 mt-5 text-center">
                    Join DriveFleet
                </h2>
                <p className="text-[#0D0D33] max-w-2xl mx-auto text-center text-lg">
                    Book cars quickly, manage your rentals, and explore a wide range of vehicles anytime.
                </p>
            </div>

            <div className="mt-2 sm:mt-10 mb-10 sm:mb-0 p-7 sm:p-0 flex justify-center scale-90 sm:scale-100">

                <div className="justify-center mt-5">

                    <Form className="flex w-96 flex-col gap-4"
                        onSubmit={Registration}
                    >

                        {/* Name */}
                        <TextField
                            isRequired
                            name="name"
                            type="text"
                        >
                            <Label>Name</Label>
                            <Input placeholder="Enter your Name" />
                            <FieldError />
                        </TextField>


                        {/* Email */}
                        <TextField
                            isRequired
                            name="email"
                            type="email"
                            validate={(value) => {
                                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                                    return "Please enter a valid email address";
                                }
                                return null;
                            }}
                        >
                            <Label>Email</Label>
                            <Input placeholder="Enter your Email" autoComplete="username" />
                            <FieldError />
                        </TextField>

                        {/* Image Upload */}
                        <div className="flex flex-col gap-1.5">
                            <Label className="text-sm font-medium">Profile Image<span className="text-red-500">*</span></Label>
                            <input
                                isRequired
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                                disabled={isUploading || !!imageUrl}
                            />

                            {imageUrl ? (
                                <div className="flex items-center gap-3 p-3 border rounded-xl border-green-500/50 bg-green-50/10">
                                    <img
                                        src={imageUrl}
                                        alt="Profile Preview"
                                        className="w-12 h-12 rounded-full object-cover border border-green-500"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
                                            <Check className="size-4" /> Ready
                                        </span>
                                        <span className="text-xs text-gray-500">Image successfully uploaded</span>
                                    </div>
                                </div>
                            ) : isUploading ? (
                                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl border-blue-400 bg-blue-50/10">
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
                                    className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${dragActive
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
                                        <span className="font-semibold text-blue-600 underline">Browse</span> or drag & drop an image
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                                </div>
                            )}
                        </div>

                        {/* Password */}
                        <TextField
                            isRequired
                            minLength={8}
                            name="password"
                            type="password"
                            validate={(value) => {
                                if (value.length < 8) {
                                    return "Password must be at least 8 characters";
                                }
                                if (!/[A-Z]/.test(value)) {
                                    return "Password must contain at least one uppercase letter";
                                }
                                if (!/[a-z]/.test(value)) {
                                    return "Password must contain at least one lowercase letter";
                                }
                                if (!/[0-9]/.test(value)) {
                                    return "Password must contain at least one number";
                                }
                                return null;
                            }}>
                            <Label>Password</Label>

                            <InputGroup>
                                <InputGroup.Input
                                    className="w-full"
                                    placeholder="Enter your Password"
                                    type={eyeSlash ? "text" : "password"}
                                    autoComplete="current-password"
                                />
                                <InputGroup.Suffix className="pr-0">
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="ghost"
                                        onPress={() => setEyeSlash(!eyeSlash)}
                                    >
                                        {eyeSlash ? <Eye className="size-4" /> : <EyeSlash className="size-4" />}
                                    </Button>
                                </InputGroup.Suffix>
                            </InputGroup>

                            <Description>Must be at least 8 characters with 1 uppercase, 1 lowercase and 1 number</Description>
                            <FieldError />

                        </TextField>

                        <div className="flex gap-2 justify-end">
                            <button type="submit" className="btn text-[#0033FF] w-full rounded-2xl hover:text-white hover:bg-linear-to-r from-[#0D0D33] to-[#0033FF]">
                                <Check />
                                Register
                            </button>
                        </div>
                        <div className="divider mt-0">OR</div>
                    </Form>

                    <GoogleLoginButton BtnFor={'Register'} />

                    <h1 className="font-bold text-center opacity-80 mt-3">Existing account? Continue with <Link href='/login' className="underline italic text-[#0033FF] opacity-100">Login</Link></h1>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;