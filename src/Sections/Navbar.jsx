"use client"
import { Avatar } from "@heroui/react";
import Image from "next/image";
import Logo from "../../public/drivefleet-logo.png"
import Link from "next/link";
import { AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";
import { IoAddCircleOutline, IoBookmarksOutline } from "react-icons/io5";
import { MdOutlinePlaylistAddCircle } from "react-icons/md";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Navbar = () => {
    const { data } = authClient.useSession();
    const user = data?.user;
    const router = useRouter();

    const LogOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    toast.success('Log out successfully!');
                    window.location.reload();
                    router.push("/");
                },
            },
        });
    }

    return (
        <div className="sm:sticky top-0 z-50">
            <div className="navbar bg-base-100 shadow-sm flex-col sm:flex-row">
                <div className="sm:navbar-start">
                    <Image src={Logo} alt='DriveFleet Logo' height={40} title="Drive Fleet" />
                </div>
                <div className="navbar-center lg:flex">
                    <ul className="menu menu-horizontal px-1 gap-4 font-bold">
                        <Link className="hover:underline" href={'/'}>Home</Link>
                        <Link className="hover:underline" href={'/explore-cars'}>Explore Cars</Link>
                        <Link className="hover:underline" href={'/add-car'}>Add Car</Link>
                        <Link className="hover:underline" href={'/my-bookings'}>My Bookings</Link>

                    </ul>
                </div>
                <div className="sm:navbar-end">

                    <div className={`${user ? 'hidden' : ''}`}>
                        <Link className="btn font-bold text-white  bg-linear-to-r from-[#0D0D33] to-[#0033FF] hover:outline outline-[#0033FF] flex gap-2 items-center" href={'/login'}>
                            Login
                            <span className="text-xl rotate-180"><AiOutlineLogin /></span>
                        </Link>
                    </div>

                    <div className={`dropdown ${user ? '' : 'hidden'}`}>
                        <div className="flex gap-2 items-center">
                            <div>
                                <Avatar>
                                    <Avatar.Image alt={user?.name} src={user?.image}
                                        referrerPolicy="no-referrer" />
                                    <Avatar.Fallback>{user?.name.charAt(0)}</Avatar.Fallback>
                                </Avatar>
                            </div>

                            <div tabIndex={0} role="button" className="btn btn-ghost font-bold text-white bg-linear-to-r from-[#0D0D33] to-[#0033FF]">
                                {user?.name}
                            </div>
                        </div>

                        <ul
                            tabIndex="-1"
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-4 w-33 p-1.5 shadow">

                            <Link className="btn btn-ghost btn-sm flex gap-2  items-center justify-start font-bold px-0 hover:text-white hover:bg-linear-to-r from-[#0D0D33] to-[#0033FF]" href={'/add-car'}>
                                <span className="text-xl"><IoAddCircleOutline /></span>
                                Add Car
                            </Link>

                            <Link className="btn btn-ghost btn-sm flex gap-2  items-center justify-start font-bold px-0 hover:text-white hover:bg-linear-to-r from-[#0D0D33] to-[#0033FF]" href={'/my-bookings'}>
                                <span className="text-xl"><IoBookmarksOutline /></span>
                                My Bookings
                            </Link>

                            <Link className="btn btn-ghost btn-sm flex gap-2  items-center justify-start font-bold px-0 hover:text-white hover:bg-linear-to-r from-[#0D0D33] to-[#0033FF]" href={'/my-added-cars'}>
                                <span className="text-xl"><MdOutlinePlaylistAddCircle /></span>
                                My Added Cars
                            </Link>

                            <button onClick={LogOut} className="btn btn-error font-bold text-white flex gap-2 items-center" >
                                Logout
                                <span className="text-xl"><AiOutlineLogout /></span>
                            </button>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;