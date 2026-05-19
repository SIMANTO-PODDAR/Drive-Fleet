"use client"
import GoogleLoginButton from "@/Components/GoogleLoginButton";
import { authClient } from "@/lib/auth-client";
import { Check, Eye, EyeSlash } from "@gravity-ui/icons";
import { Button, Description, FieldError, Form, Input, InputGroup, Label, TextField } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const RegistrationPage = () => {
    const [eyeSlash, setEyeSlash] = useState(false);
    const router = useRouter();

    const Registration = async (e) => {
        e.preventDefault();
        const LoadingToast = toast.loading('Processing your request..');

        const name = e.target.name.value;
        const email = e.target.email.value;
        const photo = e.target.photo.value;
        const password = e.target.password.value;

        const { data, error } = await authClient.signUp.email(
            {
                name: name,
                email: email,
                password: password,
                image: photo,
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

                        {/* Photo-url */}
                        <TextField
                            isRequired
                            name="photo"
                            type="url"
                        >
                            <Label>Photo URL</Label>
                            <Input placeholder="Enter your Photo URL" />
                            <FieldError />
                        </TextField>

                        {/* Password */}
                        <TextField
                            isRequired
                            minLength={6}
                            name="password"
                            type="password"
                            validate={(value) => {
                                if (value.length < 6) {
                                    return "Password must be at least 6 characters";
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

                            <Description>Must be at least 6 characters with 1 uppercase, 1 lowercase and 1 number</Description>
                            <FieldError />

                        </TextField>

                        <div className="flex gap-2 justify-end">
                            <button type="submit" className="btn text-[#0033FF] w-full rounded-2xl hover:text-white hover:bg-linear-to-r from-[#0D0D33] to-[#0033FF]">
                                <Check />
                                Register
                            </button>
                        </div>
                        <h1 className="font-bold text-center opacity-80">Existing account? Continue with <Link href='/login' className="underline italic text-[#0033FF] opacity-100">Login</Link></h1>
                        <GoogleLoginButton />
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;