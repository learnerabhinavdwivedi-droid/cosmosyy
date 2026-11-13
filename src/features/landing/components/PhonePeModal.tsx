import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, Copy, ExternalLink, ShieldCheck, Heart } from "lucide-react";
import { playBeep } from "../../../lib/gameAudio";

interface PhonePeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AMOUNTS = [10, 15, 20, 50, 100];
const UPI_ID = "8303536986-2@ibl";
const PAYEE_NAME = "Abhinav Dwivedi";

export function PhonePeModal({ isOpen, onClose }: PhonePeModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);

  const activeAmount = isCustom ? Number(customAmount) || 0 : selectedAmount;
  const isAmountValid = activeAmount >= 10;

  // Generate standardized Indian UPI deep link
  const upiUrl = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(
    PAYEE_NAME,
  )}&am=${encodeURIComponent(activeAmount.toString())}&cu=INR&tn=${encodeURIComponent(
    "Cosmosyy Space Exploration Support",
  )}`;

  // Dynamic QR code API URL, falls back to local user QR on error
  const dynamicQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=6&data=${encodeURIComponent(
    upiUrl,
  )}`;

  const handleSelectPreset = (amt: number) => {
    setSelectedAmount(amt);
    setIsCustom(false);
    setCustomAmount("");
    setImgError(false);
    playBeep(750, 0.08);
  };

  const handleCustomChange = (val: string) => {
    // Only allow numbers
    const clean = val.replace(/[^0-9]/g, "");
    setCustomAmount(clean);
    setIsCustom(true);
    setImgError(false);
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    playBeep(880, 0.1);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-space-950/85 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="phonepe-modal-title"
            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-purple-500/40 bg-gradient-to-b from-space-900 via-space-950 to-space-950 p-6 shadow-2xl shadow-purple-950/50 sm:p-7"
          >
            {/* Top Purple Brand Bar & Close Button */}
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
              <div className="flex items-center gap-2.5">
                {/* Official PhonePe Devanagari 'पे' Brand Circle */}
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5f259f] text-white shadow-md shadow-purple-600/40 font-bold text-sm select-none">
                  पे
                </div>
                <div>
                  <h3
                    id="phonepe-modal-title"
                    className="font-display text-lg font-bold text-white flex items-center gap-1.5"
                  >
                    Support via PhonePe / UPI
                    <Heart className="h-4 w-4 text-pink-500 fill-pink-500" />
                  </h3>
                  <p className="text-[11px] text-purple-300/80">
                    Direct instant donation to keep Cosmosyy free & open
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close PhonePe support dialog"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-space-700 bg-space-800 text-regolith-300 hover:text-white hover:border-space-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Amount Selector */}
            <div className="mt-5">
              <label className="text-xs font-semibold uppercase tracking-wider text-regolith-300 block mb-2">
                Select Amount (Min ₹10)
              </label>

              {/* Preset Buttons */}
              <div className="grid grid-cols-5 gap-2">
                {PRESET_AMOUNTS.map((amt) => {
                  const isSelected = !isCustom && selectedAmount === amt;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleSelectPreset(amt)}
                      className={`flex h-10 items-center justify-center rounded-xl font-display text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
                        isSelected
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30 scale-105 border border-purple-400"
                          : "border border-space-700 bg-space-900/90 text-regolith-200 hover:border-purple-500/50 hover:bg-space-800"
                      }`}
                    >
                      ₹{amt}
                    </button>
                  );
                })}
              </div>

              {/* Custom Amount Input */}
              <div className="mt-3 flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-display text-sm font-bold text-purple-400">
                    ₹
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Other amount (min ₹10)"
                    value={customAmount}
                    onChange={(e) => handleCustomChange(e.target.value)}
                    className="w-full rounded-xl border border-space-700 bg-space-900/90 py-2 pl-8 pr-3 text-sm font-medium text-white placeholder-regolith-400/60 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                {isCustom && customAmount && !isAmountValid && (
                  <span className="text-[11px] font-medium text-warn-500">
                    Min ₹10
                  </span>
                )}
              </div>
            </div>

            {/* Dynamic QR Code Box */}
            <div className="mt-5 flex flex-col items-center justify-center rounded-2xl border border-purple-500/30 bg-white/5 p-4 backdrop-blur">
              <div className="relative flex items-center justify-center rounded-xl bg-white p-3 shadow-inner">
                <img
                  src={imgError ? "/art/phonepe-qr.jpg" : dynamicQrUrl}
                  alt={`PhonePe UPI QR Code for ₹${activeAmount}`}
                  onError={() => setImgError(true)}
                  className="h-44 w-44 object-contain rounded-lg sm:h-48 sm:w-48"
                />
                {/* Center Badge if using dynamic QR */}
                {!imgError && (
                  <div className="pointer-events-none absolute flex h-9 w-9 items-center justify-center rounded-full bg-[#5f259f] text-white font-bold text-sm shadow-md border-2 border-white select-none">
                    पे
                  </div>
                )}
              </div>

              <div className="mt-3 text-center">
                <p className="font-display text-lg font-black text-white">
                  Pay ₹{isAmountValid ? activeAmount : 10}
                </p>
                <p className="text-[11px] text-regolith-300">
                  Scan using PhonePe, GPay, Paytm, or any UPI App
                </p>
              </div>
            </div>

            {/* Recipient & UPI Copy Section */}
            <div className="mt-4 rounded-xl border border-space-800 bg-space-900/80 p-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-regolith-300">
                  <ShieldCheck className="h-4 w-4 text-ok-400 shrink-0" />
                  <span>
                    Verified:{" "}
                    <strong className="text-white">{PAYEE_NAME}</strong>
                  </span>
                </div>
                <span className="rounded bg-purple-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-purple-300">
                  PhonePe UPI
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between rounded-lg bg-space-950 px-3 py-1.5 font-mono text-xs">
                <span className="text-regolith-200 select-all">{UPI_ID}</span>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="flex items-center gap-1 text-[11px] font-bold text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-ok-400" />
                      <span className="text-ok-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Action Buttons for Mobile Direct App Launch */}
            <div className="mt-5 flex flex-col gap-2">
              <a
                href={upiUrl}
                className={`flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 px-5 py-2.5 font-display text-sm font-bold text-white shadow-lg shadow-purple-600/30 transition-all hover:shadow-purple-600/50 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
                  !isAmountValid ? "opacity-60 pointer-events-none" : ""
                }`}
              >
                <span>Pay ₹{isAmountValid ? activeAmount : 10} via PhonePe / UPI App</span>
                <ExternalLink className="h-4 w-4" />
              </a>

              <p className="text-center text-[10px] text-regolith-400">
                Works directly on mobile! Tapping the button opens PhonePe automatically.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
