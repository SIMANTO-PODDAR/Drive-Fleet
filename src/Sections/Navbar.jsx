"use client"
import { useState } from "react";
import { Avatar } from "@heroui/react";
import Image from "next/image";
import Logo from "../../public/drivefleet-logo.png"
import Link from "next/link";
import { AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";
import { IoClose, IoHomeOutline, IoCarSportOutline, IoAddCircleOutline, IoBookmarksOutline } from "react-icons/io5";
import { MdOutlinePlaylistAddCircle } from "react-icons/md";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { GoSidebarCollapse } from "react-icons/go";

const Navbar = () => {
    const [isSideDoorOpen, setIsSideDoorOpen] = useState(false);
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

    const closeSideDoor = () => setIsSideDoorOpen(false);

    return (
        <>
            <div className="sticky top-0 z-40 bg-base-100/95 backdrop-blur-md transition-all duration-300 border-b border-base-200/60 shadow-xs">
                <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 justify-between">

                    <div className="navbar-start flex items-center gap-3">

                        {/* Side Door Menu Trigger Button (Active on <1024px / <lg) */}
                        <button
                            onClick={() => setIsSideDoorOpen(true)}
                            className="btn btn-ghost btn-circle lg:hidden text-2xl hover:bg-base-200"
                            aria-label="Open Side Door Menu"
                            title="Open Side Door Menu"
                        >
                            <GoSidebarCollapse />
                        </button>

                        {/* Logo */}
                        <Link href="/" className="transition-transform hover:scale-105 flex items-center">
                            <Image src={Logo} alt='DriveFleet Logo' height={40} title="Drive Fleet" className="h-10 w-auto object-contain" />
                        </Link>
                    </div>

                    {/* Navbar Center - Desktop Links visible on screens >=1024px (>=lg) */}
                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal px-1 gap-1 md:gap-3 font-bold text-sm lg:text-base">
                            <li>
                                <Link className="px-3 py-2 rounded-lg hover:text-blue-600 hover:bg-base-200/50 transition-all duration-200" href={'/'}>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link className="px-3 py-2 rounded-lg hover:text-blue-600 hover:bg-base-200/50 transition-all duration-200" href={'/explore-cars'}>
                                    Explore Cars
                                </Link>
                            </li>
                            <li>
                                <Link className="px-3 py-2 rounded-lg hover:text-blue-600 hover:bg-base-200/50 transition-all duration-200" href={'/add-car'}>
                                    Add Car
                                </Link>
                            </li>
                            <li>
                                <Link className="px-3 py-2 rounded-lg hover:text-blue-600 hover:bg-base-200/50 transition-all duration-200" href={'/my-bookings'}>
                                    My Bookings
                                </Link>
                            </li>
                            <li>
                                <Link className="px-3 py-2 rounded-lg hover:text-blue-600 hover:bg-base-200/50 transition-all duration-200" href={'/my-added-cars'}>
                                    My Added Cars
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Navbar End - User Session / Login */}
                    <div className="navbar-end flex items-center justify-end">
                        <div className={`${user ? 'hidden' : 'block'}`}>
                            <Link className="btn font-bold text-white bg-linear-to-r from-[#0D0D33] to-[#0033FF] hover:opacity-90 hover:shadow-md transition-all duration-200 flex gap-2 items-center px-4 sm:px-5" href={'/login'}>
                                Login
                                <span className="text-xl rotate-180"><AiOutlineLogin /></span>
                            </Link>
                        </div>

                        <div className={`dropdown dropdown-end ${user ? 'block' : 'hidden'}`}>
                            {/* Unified Avatar & Name Button */}
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn font-bold text-white bg-linear-to-r from-[#0D0D33] to-[#0033FF] hover:opacity-95 shadow-sm flex items-center gap-2 px-3 py-1.5 h-auto min-h-0 rounded-full sm:rounded-lg"
                            >
                                <Avatar className="w-7 h-7">
                                    <Avatar.Image alt={user?.name} src={user?.image} referrerPolicy="no-referrer" />
                                    <Avatar.Fallback>{user?.name?.charAt(0)}</Avatar.Fallback>
                                </Avatar>
                                <span>{user?.name}</span>
                            </div>

                            {/* Dropdown Menu - Logout Only */}
                            <ul
                                tabIndex="-1"
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-40 p-2 shadow-xl border border-base-200">
                                <li>
                                    <button onClick={LogOut} className="btn btn-error btn-sm font-bold text-white flex gap-2 items-center justify-center w-full">
                                        <span className="text-xl"><AiOutlineLogout /></span>
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* SIDE DOOR MENU (DRAWER) */}
            {/* Backdrop overlay */}
            <div
                onClick={closeSideDoor}
                className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity duration-300 ${isSideDoorOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
            />

            {/* Side Door Drawer Panel */}
            <aside
                className={`fixed top-0 left-0 bottom-0 w-72 sm:w-80 bg-base-100 z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out transform ${isSideDoorOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Side Door Header */}
                <div className="p-4 border-b border-base-200 flex items-center justify-between bg-base-200/40">
                    <div className="flex items-center gap-2">
                        <Image src={Logo} alt='DriveFleet Logo' height={36} className="h-9 w-auto object-contain" />
                    </div>
                    <button
                        onClick={closeSideDoor}
                        className="btn btn-sm btn-circle btn-ghost hover:bg-base-300 text-xl"
                        aria-label="Close Side Door Menu"
                    >
                        <IoClose />
                    </button>
                </div>

                {/* Side Door Menu Content */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between">
                    <ul className="menu menu-vertical gap-2 font-bold text-base">
                        <li>
                            <Link onClick={closeSideDoor} className="py-3 px-4 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-3" href={'/'}>
                                <IoHomeOutline className="text-xl" />
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link onClick={closeSideDoor} className="py-3 px-4 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-3" href={'/explore-cars'}>
                                <IoCarSportOutline className="text-xl" />
                                Explore Cars
                            </Link>
                        </li>
                        <li>
                            <Link onClick={closeSideDoor} className="py-3 px-4 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-3" href={'/add-car'}>
                                <IoAddCircleOutline className="text-xl" />
                                Add Car
                            </Link>
                        </li>
                        <li>
                            <Link onClick={closeSideDoor} className="py-3 px-4 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-3" href={'/my-bookings'}>
                                <IoBookmarksOutline className="text-xl" />
                                My Bookings
                            </Link>
                        </li>
                        <li>
                            <Link onClick={closeSideDoor} className="py-3 px-4 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-3" href={'/my-added-cars'}>
                                <MdOutlinePlaylistAddCircle className="text-xl" />
                                My Added Cars
                            </Link>
                        </li>
                    </ul>

                    {/* Bottom Session Details inside Side Door */}
                    <div className="border-t border-base-200 pt-4 mt-auto">
                        {user ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-2 bg-base-200/50 rounded-xl">
                                    <Avatar>
                                        <Avatar.Image alt={user?.name} src={user?.image} referrerPolicy="no-referrer" />
                                        <Avatar.Fallback>{user?.name?.charAt(0)}</Avatar.Fallback>
                                    </Avatar>
                                    <div className="overflow-hidden">
                                        <p className="font-bold text-sm truncate">{user?.name}</p>
                                        <p className="text-xs text-base-content/70 truncate">{user?.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        closeSideDoor();
                                        LogOut();
                                    }}
                                    className="btn btn-error btn-sm w-full font-bold text-white flex gap-2 items-center justify-center"
                                >
                                    <AiOutlineLogout className="text-lg" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                onClick={closeSideDoor}
                                className="btn w-full font-bold text-white bg-linear-to-r from-[#0D0D33] to-[#0033FF] hover:opacity-90 flex gap-2 items-center justify-center"
                                href={'/login'}
                            >
                                Login
                                <span className="text-xl rotate-180"><AiOutlineLogin /></span>
                            </Link>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Navbar;