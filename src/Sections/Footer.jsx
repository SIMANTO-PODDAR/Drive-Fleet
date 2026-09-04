"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaLocationDot,
    FaPhone,
    FaRegEnvelope,
} from "react-icons/fa6";

const primaryLinks = [
    { label: "Home", href: "/" },
    { label: "Explore Cars", href: "/explore-cars" },
    { label: "Add Car", href: "/add-car" },
    { label: "My Added Cars", href: "/my-added-cars" },
    { label: "My Bookings", href: "/my-bookings" },
];

const accountLinks = [
    { label: "Login", href: "/login" },
    { label: "Registration", href: "/registration" },
];

const socialLinks = [
    { label: "Facebook", href: "#", icon: FaFacebookF },
    { label: "Instagram", href: "#", icon: FaInstagram },
    { label: "LinkedIn", href: "#", icon: FaLinkedinIn },
];

function isActive(pathname, href) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
}

function FooterLink({ href, label, pathname }) {
    const active = isActive(pathname, href);

    return (
        <Link
            href={href}
            className={`group inline-flex items-center gap-2 text-sm transition-all duration-200 ${active
                ? "font-medium text-cyan-400"
                : "text-slate-400 hover:-translate-y-0.5 hover:text-cyan-300"
                }`}
            aria-current={active ? "page" : undefined}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${active
                    ? "scale-100 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.65)]"
                    : "scale-0 bg-cyan-400 group-hover:scale-100"
                    }`}
            />
            {label}
        </Link>
    );
}

export default function Footer() {
    const pathname = usePathname();

    return (
        <footer className="relative overflow-hidden border-t border-slate-800/80 bg-slate-950 text-slate-300">
            {/* Ambient theme glow */}
            <div className="pointer-events-none absolute -left-24 top-0 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-rose-500/10 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
                    {/* About */}
                    <div>
                        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400/80">
                            About DriveFleet
                        </p>
                        <p className="max-w-sm text-sm leading-7 text-slate-400">
                            A modern car rental platform designed to make vehicle discovery, listing, and booking simple and dependable.
                        </p>

                        <div className="mt-6 space-y-3 text-sm text-slate-400">
                            <a className="flex items-start gap-3 transition-colors hover:text-slate-200" href="mailto:support@drivefleet.com">
                                <FaRegEnvelope className="mt-0.5 text-cyan-400" />
                                <span>support@drivefleet.com</span>
                            </a>
                            <a className="flex items-start gap-3 transition-colors hover:text-slate-200" href="tel:+8801000000000">
                                <FaPhone className="mt-0.5 text-rose-400" />
                                <span>+880 1000-000000</span>
                            </a>
                            <div className="flex items-start gap-3">
                                <FaLocationDot className="mt-0.5 text-cyan-400" />
                                <span>Dhaka, Bangladesh</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400/80">
                            Navigation
                        </p>
                        <nav className="flex flex-col items-start gap-3" aria-label="Footer navigation">
                            {primaryLinks.map((link) => (
                                <FooterLink key={link.href} {...link} pathname={pathname} />
                            ))}
                        </nav>
                    </div>

                    {/* Account */}
                    <div>
                        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400/80">
                            Account
                        </p>
                        <nav className="flex flex-col items-start gap-3" aria-label="Account navigation">
                            {accountLinks.map((link) => (
                                <FooterLink key={link.href} {...link} pathname={pathname} />
                            ))}
                        </nav>
                    </div>

                    {/* Social */}
                    <div>
                        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400/80">
                            Connect
                        </p>
                        <p className="text-sm leading-6 text-slate-400">
                            Stay connected for product updates, fleet news, and new platform features.
                        </p>

                        <div className="mt-5 flex items-center gap-2">
                            {socialLinks.map(({ label, href, icon: Icon }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 text-slate-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300"
                                >
                                    <Icon size={15} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 flex flex-col gap-3 border-t border-slate-800/80 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                    <p>© {new Date().getFullYear()} DriveFleet. All rights reserved.</p>
                    <p className="text-slate-600">Built for a smoother rental experience.</p>
                </div>
            </div>
        </footer>
    );
}
