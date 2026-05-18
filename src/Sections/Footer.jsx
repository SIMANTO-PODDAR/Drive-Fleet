import Image from "next/image";
import Logo from '../../public/drivefleet-logo.png';
import { BsTwitterX } from "react-icons/bs";
import { CiFacebook, CiYoutube } from "react-icons/ci";

const Footer = () => {
    return (
        <div className="mt-10">
            <footer className="footer footer-horizontal footer-center bg-linear-to-r from-[#0D0D33]/60 to-[#0033FF]/60 text-[#0D0D33] p-5">
                <Image src={Logo} alt="drivefleet-logo" height={100} />
                <div className="footer sm:footer-horizontal items-baseline grid grid-cols-1 sm:grid-cols-3 sm:justify-around gap-4">
                    <nav>
                        <h6 className="footer-title">Links</h6> {/* Useful Links  */}
                        <a className="link-hover font-bold  text-[#0D0D33]">Explore Cars</a>
                        <a className="link-hover font-bold  text-[#0D0D33]">Add Car</a>
                        <a className="link-hover font-bold  text-[#0D0D33]">My Bookings</a>
                        <a className=" w-48 h-0.5"></a>
                    </nav>
                    <nav>
                        <h6 className="footer-title">Contact</h6> {/* Contact Information  */}
                        <a className="text-[#0D0D33] link-hover font-bold">Phone: 0123456789</a>
                        <a className="text-[#0D0D33] link-hover font-bold">Whatsapp: 0123456789</a>
                        <a className="text-[#0D0D33] link-hover font-bold">Email: drivefleet@gmail.com</a>
                        <a className=" w-48 h-0.5"></a>
                    </nav>
                    <nav>
                        <h6 className="footer-title">Social</h6> {/* Social Icons  */}
                        <div className="flex gap-4">
                            <a className="text-xl btn rounded-2xl bg-linear-to-r from-[#0D0D33]/60 to-[#0033FF]/60 text-white p-3"><BsTwitterX /></a>
                            <a className="text-xl btn rounded-2xl bg-linear-to-r from-[#0D0D33]/60 to-[#0033FF]/60 text-white p-3"><CiFacebook /></a>
                            <a className="text-xl btn rounded-2xl bg-linear-to-r from-[#0D0D33]/60 to-[#0033FF]/60 text-white p-3"><CiYoutube /></a>
                        </div>
                        <a className=" w-48 h-0.5"></a>
                    </nav>
                </div>

                <aside>
                    <p>Copyright © {new Date().getFullYear()} - All right reserved by DriveFleet</p>
                </aside>
            </footer>
        </div>
    );
};

export default Footer;