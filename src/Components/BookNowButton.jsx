"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Modal, Button } from "@heroui/react";
import toast from "react-hot-toast";
import {
  IoCarSportOutline,
  IoCheckmarkCircle,
  IoCheckmark,
} from "react-icons/io5";
import { FaUserTie } from "react-icons/fa6";
import { FiMessageSquare } from "react-icons/fi";

const BookNowButton = ({ car }) => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [driverChoice, setDriverChoice] = useState("");

  const Booking = async (event) => {
    event.preventDefault();
    const LoadingToast = toast.loading("Processing your request...");

    if (!user) {
      toast.error("Please login and try again.", {
        id: LoadingToast,
      });
      return;
    }

    if (car.Status === "Unavailable") {
      toast.error(
        `Oops! This car is currently unavailable.\nPlease choose another available car.`,
        { id: LoadingToast }
      );
      return;
    }

    const driverValue = event.target.Driver?.value || driverChoice;
    if (!driverValue) {
      toast.error("Please select whether a driver is needed.", {
        id: LoadingToast,
      });
      return;
    }

    setIsSubmitting(true);

    const Data = {
      // Booking data
      CarName: car.Name,
      TotalPrice: car.RentPrice,
      BookingDate: new Date(),
      CarId: car._id,

      // User data
      userId: user?.id,

      // Form data (Driver & Note fields preserved)
      DriverNeeded: driverValue,
      SpecialNote: event.target.Note.value,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/all-bookings`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(Data),
        }
      );

      if (res.ok) {
        toast.success("Booking successful!", {
          id: LoadingToast,
        });

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error("Something went wrong! Try again.", {
          id: LoadingToast,
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("Network error! Please try again.", {
        id: LoadingToast,
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <Modal>
        <Button
          isDisabled={car?.Status === "Unavailable"}
          className="btn w-full py-3.5 px-6 font-bold text-white bg-linear-to-r from-[#0D0D33] to-[#0033FF] hover:opacity-95 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all duration-300 rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IoCarSportOutline className="text-xl" />
          <span>
            {car?.Status === "Unavailable"
              ? "Currently Unavailable"
              : "Book Now"}
          </span>
        </Button>

        <Modal.Backdrop>
          <Modal.Container placement="center">
            <Modal.Dialog className="sm:max-w-lg w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden p-0 my-auto">
              <Modal.CloseTrigger />

              {/* Modal Header */}
              <Modal.Header className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 flex items-center justify-center text-[#0033FF] shadow-xs shrink-0">
                    <IoCarSportOutline className="w-5 h-5" />
                  </div>
                  <div>
                    <Modal.Heading className="text-xl font-bold text-[#0D0D33] dark:text-white">
                      Reserve Vehicle
                    </Modal.Heading>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Complete the details below to finalize your booking
                    </p>
                  </div>
                </div>
              </Modal.Header>

              <Modal.Body className="p-6">
                <form onSubmit={Booking} className="space-y-5">
                  {/* Vehicle Quick Summary Card */}
                  <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
                    <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0 border border-slate-200 dark:border-slate-600">
                      {car?.ImgURL ? (
                        <img
                          src={car.ImgURL}
                          alt={car?.Name || "Car preview"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <IoCarSportOutline className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-sm text-[#0D0D33] dark:text-white truncate">
                          {car?.Name}
                        </h4>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 border ${
                            car?.Status === "Available"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                              : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800"
                          }`}
                        >
                          {car?.Status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                        {car?.Type && (
                          <span className="font-semibold bg-slate-200/70 dark:bg-slate-700/70 px-2 py-0.5 rounded-md text-slate-700 dark:text-slate-300">
                            {car.Type}
                          </span>
                        )}
                        <span>
                          Daily Rate:{" "}
                          <strong className="text-[#0D0D33] dark:text-white font-bold">
                            ${car?.RentPrice}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Field 1: Driver Needed (Tick Boxes) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <FaUserTie className="text-[#0033FF] text-sm" />
                        <span>
                          Driver Needed <span className="text-red-500">*</span>
                        </span>
                      </label>
                      <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/60">
                        {driverChoice ? "Selected" : "Select one option *"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Tick Box Option: Yes */}
                      <label
                        htmlFor="driver-yes"
                        className={`relative flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all duration-200 select-none ${
                          driverChoice === "Yes"
                            ? "border-[#0033FF] bg-blue-50/70 dark:bg-blue-950/40 shadow-sm shadow-blue-500/10 ring-2 ring-blue-500/20"
                            : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800"
                        }`}
                      >
                        <input
                          type="radio"
                          id="driver-yes"
                          name="Driver"
                          value="Yes"
                          checked={driverChoice === "Yes"}
                          onChange={() => setDriverChoice("Yes")}
                          required
                          className="sr-only"
                        />
                        {/* Custom Tick Box */}
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all shrink-0 ${
                            driverChoice === "Yes"
                              ? "bg-[#0033FF] border-[#0033FF] text-white shadow-xs"
                              : "border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-900"
                          }`}
                        >
                          {driverChoice === "Yes" && (
                            <IoCheckmark className="text-sm font-bold stroke-[2.5]" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold text-[#0D0D33] dark:text-white flex items-center gap-1.5">
                            <span>Yes</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            I need a professional driver
                          </p>
                        </div>
                      </label>

                      {/* Tick Box Option: No */}
                      <label
                        htmlFor="driver-no"
                        className={`relative flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all duration-200 select-none ${
                          driverChoice === "No"
                            ? "border-[#0033FF] bg-blue-50/70 dark:bg-blue-950/40 shadow-sm shadow-blue-500/10 ring-2 ring-blue-500/20"
                            : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800"
                        }`}
                      >
                        <input
                          type="radio"
                          id="driver-no"
                          name="Driver"
                          value="No"
                          checked={driverChoice === "No"}
                          onChange={() => setDriverChoice("No")}
                          required
                          className="sr-only"
                        />
                        {/* Custom Tick Box */}
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all shrink-0 ${
                            driverChoice === "No"
                              ? "bg-[#0033FF] border-[#0033FF] text-white shadow-xs"
                              : "border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-900"
                          }`}
                        >
                          {driverChoice === "No" && (
                            <IoCheckmark className="text-sm font-bold stroke-[2.5]" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold text-[#0D0D33] dark:text-white flex items-center gap-1.5">
                            <span>No</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            I will drive the car myself
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Field 2: Special Note */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="Note"
                      className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                    >
                      <FiMessageSquare className="text-[#0033FF] text-sm" />
                      <span>
                        Special Note <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <textarea
                      id="Note"
                      name="Note"
                      required
                      rows={3}
                      placeholder="Write any special requests or instructions (e.g. pickup time, child seat, route preferences)..."
                      className="w-full p-3.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none shadow-xs"
                    />
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Provide any extra requests or handover preferences.
                    </p>
                  </div>

                  {/* Actions / Footer */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <Button
                      type="button"
                      slot="close"
                      variant="tertiary"
                      isDisabled={isSubmitting}
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      isDisabled={isSubmitting || car?.Status === "Unavailable"}
                      className="font-bold text-white bg-linear-to-r from-[#0D0D33] to-[#0033FF] hover:opacity-95 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl px-5 py-2.5 flex items-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <IoCheckmarkCircle className="text-lg" />
                          <span>Confirm Booking</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
};

export default BookNowButton;
