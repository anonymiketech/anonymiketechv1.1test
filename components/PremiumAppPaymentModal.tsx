"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Phone, AlertCircle, CheckCircle, Loader2 } from "lucide-react"

interface PremiumAppPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  appName: string
  appIcon: string
  price: number
}

type PaymentStep = "phone" | "pending" | "validate" | "success" | "error"

export default function PremiumAppPaymentModal({
  isOpen,
  onClose,
  appName,
  appIcon,
  price,
}: PremiumAppPaymentModalProps) {
  const [step, setStep] = useState<PaymentStep>("phone")
  const [phone, setPhone] = useState("")
  const [transactionCode, setTransactionCode] = useState("")
  const [checkoutRequestId, setCheckoutRequestId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [validationError, setValidationError] = useState("")

  const validatePhoneNumber = (phoneNumber: string): boolean => {
    // Accept Kenyan phone numbers in various formats
    const phoneRegex = /^(\+?254|0)?[67]\d{8}$/
    return phoneRegex.test(phoneNumber.replace(/\s+/g, ""))
  }

  const formatPhoneForAPI = (phoneNumber: string): string => {
    // Convert to Payflow format: 254XXXXXXXXX
    let formatted = phoneNumber.replace(/\s+/g, "")
    if (formatted.startsWith("+254")) {
      formatted = formatted.substring(1)
    } else if (formatted.startsWith("254")) {
      // Already correct format
    } else if (formatted.startsWith("0")) {
      formatted = "254" + formatted.substring(1)
    } else {
      formatted = "254" + formatted
    }
    return formatted
  }

  const handleInitiatePayment = async () => {
    setError("")
    setValidationError("")

    if (!phone.trim()) {
      setValidationError("Please enter your phone number")
      return
    }

    if (!validatePhoneNumber(phone)) {
      setValidationError("Please enter a valid Kenyan phone number")
      return
    }

    setLoading(true)

    try {
      const formattedPhone = formatPhoneForAPI(phone)
      const response = await fetch("/api/premium-apps/initiate-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formattedPhone,
          amount: price,
          appName: appName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to initiate payment. Please try again.")
        setStep("error")
      } else {
        setCheckoutRequestId(data.checkoutRequestId)
        setStep("pending")
        // Start polling for status after 3 seconds
        setTimeout(() => pollPaymentStatus(data.checkoutRequestId), 3000)
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.")
      setStep("error")
      console.error("[v0] Payment initiation error:", err)
    } finally {
      setLoading(false)
    }
  }

  const pollPaymentStatus = async (requestId: string) => {
    try {
      const response = await fetch("/api/premium-apps/check-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkoutRequestId: requestId }),
      })

      const data = await response.json()

      if (data.status === "success") {
        setStep("validate")
      } else if (data.status === "pending") {
        // Keep polling
        setTimeout(() => pollPaymentStatus(requestId), 2000)
      } else {
        setError("Payment failed. Please try again.")
        setStep("error")
      }
    } catch (err) {
      console.error("[v0] Status check error:", err)
      // Continue polling despite errors
      setTimeout(() => pollPaymentStatus(requestId), 2000)
    }
  }

  const handleValidateTransaction = async () => {
    setValidationError("")
    setError("")

    if (!transactionCode.trim()) {
      setValidationError("Please enter the transaction code")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/premium-apps/validate-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formatPhoneForAPI(phone),
          transactionCode: transactionCode,
          checkoutRequestId: checkoutRequestId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(
          data.error || "Failed to validate transaction. Please try again."
        )
        setStep("error")
      } else {
        setStep("success")
      }
    } catch (err) {
      setError("Validation error. Please try again.")
      setStep("error")
      console.error("[v0] Validation error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setStep("phone")
    setPhone("")
    setTransactionCode("")
    setCheckoutRequestId("")
    setError("")
    setValidationError("")
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md rounded-lg border border-green-500/30 bg-slate-900 p-6 shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-green-500 hover:text-green-400 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Header */}
            <div className="mb-6 text-center">
              <div className="mb-3 text-4xl">{appIcon}</div>
              <h2 className="text-xl font-bold text-white">Purchase {appName}</h2>
              <p className="mt-2 text-green-400 font-mono">
                Price: KSH {price}
              </p>
            </div>

            {/* Phone Input Step */}
            {step === "phone" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm text-green-400 mb-2 font-mono">
                    M-Pesa Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-green-500" size={18} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="254712345678 or 0712345678"
                      className="w-full pl-10 pr-4 py-2 rounded border border-green-500/30 bg-slate-800 text-white placeholder-slate-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </div>
                  {validationError && (
                    <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {validationError}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleInitiatePayment}
                  disabled={loading}
                  className="w-full rounded border border-green-500 bg-green-500/10 px-4 py-2 font-mono text-green-400 hover:bg-green-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Initiating...
                    </>
                  ) : (
                    "Initiate M-Pesa Payment"
                  )}
                </button>

                <p className="text-xs text-slate-400 text-center">
                  You will receive an M-Pesa STK prompt on your phone
                </p>
              </motion.div>
            )}

            {/* Pending Step */}
            {step === "pending" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 text-center"
              >
                <div className="flex justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="text-green-500" size={48} />
                  </motion.div>
                </div>
                <div>
                  <p className="text-green-400 font-mono mb-2">
                    Waiting for payment confirmation...
                  </p>
                  <p className="text-sm text-slate-400">
                    Please complete the M-Pesa STK prompt on your phone
                  </p>
                </div>
              </motion.div>
            )}

            {/* Validate Transaction Step */}
            {step === "validate" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="rounded border border-green-500/30 bg-green-500/5 p-3">
                  <p className="text-sm text-green-400 mb-2 flex items-center gap-2">
                    <CheckCircle size={16} />
                    Payment received! Now validate the transaction.
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-green-400 mb-2 font-mono">
                    Transaction Code
                  </label>
                  <input
                    type="text"
                    value={transactionCode}
                    onChange={(e) => setTransactionCode(e.target.value.toUpperCase())}
                    placeholder="Enter the transaction code from your M-Pesa confirmation"
                    className="w-full px-4 py-2 rounded border border-green-500/30 bg-slate-800 text-white placeholder-slate-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 font-mono"
                  />
                  {validationError && (
                    <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {validationError}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleValidateTransaction}
                  disabled={loading}
                  className="w-full rounded border border-green-500 bg-green-500/10 px-4 py-2 font-mono text-green-400 hover:bg-green-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Validating...
                    </>
                  ) : (
                    "Validate Transaction"
                  )}
                </button>
              </motion.div>
            )}

            {/* Success Step */}
            {step === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 text-center"
              >
                <div className="flex justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                  >
                    <CheckCircle className="text-green-500" size={64} />
                  </motion.div>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-400 mb-2">
                    Purchase Successful!
                  </p>
                  <p className="text-sm text-slate-400 mb-4">
                    {appName} is now available for download
                  </p>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full rounded border border-green-500 bg-green-500/10 px-4 py-2 font-mono text-green-400 hover:bg-green-500/20 transition-colors"
                >
                  Close
                </button>
              </motion.div>
            )}

            {/* Error Step */}
            {step === "error" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex justify-center">
                  <AlertCircle className="text-red-500" size={48} />
                </div>
                <div className="rounded border border-red-500/30 bg-red-500/5 p-3">
                  <p className="text-sm text-red-400">{error}</p>
                </div>

                <button
                  onClick={() => {
                    setStep("phone")
                    setError("")
                    setValidationError("")
                  }}
                  className="w-full rounded border border-green-500 bg-green-500/10 px-4 py-2 font-mono text-green-400 hover:bg-green-500/20 transition-colors"
                >
                  Try Again
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
