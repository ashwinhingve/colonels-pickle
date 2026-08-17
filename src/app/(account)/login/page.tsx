"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getSession, signIn, useSession } from "next-auth/react"
import { AnimatedSection } from "@/components/shared/AnimatedSection"
import { HoverLift } from "@/components/shared/HoverLift"
import { Button } from "@/components/ui/button"
import { Mail, ArrowLeft, Phone } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { WelcomeIllustration } from "@/components/illustrations"

type Tab = "google" | "email" | "mobile"
type OtpStep = "input" | "otp"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [activeTab, setActiveTab] = useState<Tab>("google")

  // Email OTP state
  const [emailOtpStep, setEmailOtpStep] = useState<OtpStep>("input")
  const [email, setEmail] = useState("")
  const [emailOtp, setEmailOtp] = useState("")
  const [emailCooldown, setEmailCooldown] = useState(0)

  // Mobile OTP state
  const [mobileOtpStep, setMobileOtpStep] = useState<OtpStep>("input")
  const [phone, setPhone] = useState("")
  const [mobileOtp, setMobileOtp] = useState("")
  const [mobileCooldown, setMobileCooldown] = useState(0)

  const getRedirectPath = useCallback((role?: string | null) => {
    const redirect = searchParams.get("redirect")

    if (redirect) {
      try {
        const target = new URL(redirect, window.location.origin)
        const isSameOrigin = target.origin === window.location.origin
        const isLoginPath = target.pathname === "/login"

        if (isSameOrigin && !isLoginPath) {
          return `${target.pathname}${target.search}${target.hash}`
        }
      } catch {
        // Ignore malformed redirect values and fall back by role.
      }
    }

    return role === "admin" ? "/admin/dashboard" : "/orders"
  }, [searchParams])

  const completeSignIn = async () => {
    const updatedSession = await getSession()
    router.replace(getRedirectPath(updatedSession?.user?.role))
    router.refresh()
  }

  // Handle redirection when user is already logged in or just logged in
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      router.replace(getRedirectPath(session.user.role))
    }
  }, [status, session, router, getRedirectPath])

  // Cooldown timers
  useEffect(() => {
    if (emailCooldown <= 0) return
    const t = setTimeout(() => setEmailCooldown(emailCooldown - 1), 1000)
    return () => clearTimeout(t)
  }, [emailCooldown])

  useEffect(() => {
    if (mobileCooldown <= 0) return
    const t = setTimeout(() => setMobileCooldown(mobileCooldown - 1), 1000)
    return () => clearTimeout(t)
  }, [mobileCooldown])

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    setError("")
  }

  // ── Google ──────────────────────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError("")
    try {
      const result = await signIn("google", {
        callbackUrl: getRedirectPath(session?.user?.role),
      })
      if (result?.error) {
        setError("Failed to sign in with Google. Please try again.")
        setIsLoading(false)
      }
    } catch {
      setError("An error occurred during sign in. Please try again.")
      setIsLoading(false)
    }
  }

  // ── Email OTP ────────────────────────────────────────────────────────────────
  const handleSendEmailOtp = async () => {
    if (!email) { setError("Please enter your email address."); return }
    setIsLoading(true); setError("")
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!res.ok && res.status === 400) {
        const data = await res.json()
        setError(data.message || "Invalid email address.")
        setIsLoading(false)
        return
      }
      setEmailOtpStep("otp")
      setEmailCooldown(60)
    } catch {
      setError("Failed to send OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyEmailOtp = async () => {
    if (!emailOtp || emailOtp.length !== 6) { setError("Please enter the 6-digit code."); return }
    setIsLoading(true); setError("")
    try {
      const result = await signIn("email-otp", {
        redirect: false,
        callbackUrl: getRedirectPath(session?.user?.role),
        email,
        otp: emailOtp,
      })
      if (result?.error) {
        setError(result.error)
        setIsLoading(false)
        return
      }
      await completeSignIn()
    } catch {
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  // ── Mobile OTP ───────────────────────────────────────────────────────────────
  const handleSendMobileOtp = async () => {
    if (!phone) { setError("Please enter your mobile number."); return }
    setIsLoading(true); setError("")
    try {
      const res = await fetch("/api/auth/send-sms-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || "Failed to send OTP.")
        setIsLoading(false)
        return
      }
      setMobileOtpStep("otp")
      setMobileCooldown(60)
    } catch {
      setError("Failed to send OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyMobileOtp = async () => {
    if (!mobileOtp || mobileOtp.length !== 6) { setError("Please enter the 6-digit code."); return }
    setIsLoading(true); setError("")
    try {
      const result = await signIn("mobile-otp", {
        redirect: false,
        callbackUrl: getRedirectPath(session?.user?.role),
        phone,
        otp: mobileOtp,
      })
      if (result?.error) {
        setError(result.error)
        setIsLoading(false)
        return
      }
      await completeSignIn()
    } catch {
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  // ── Loading state ────────────────────────────────────────────────────────────
  if (status === 'loading' || (status === 'authenticated' && isLoading)) {
    return (
      <div className="min-h-screen bg-cp-cream py-12 md:py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cp-crimson border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cp-cream py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Hero section with illustration */}
          <AnimatedSection direction="up" className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left: Illustration */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="hidden md:flex justify-center"
              >
                <WelcomeIllustration />
              </motion.div>

              {/* Right: Content */}
              <div className="text-center md:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Image
                    src="/logo.png"
                    alt="Colonel's Pickle by Ridhwika Agro Organics"
                    width={80}
                    height={80}
                    className="object-contain mx-auto md:mx-0 mb-3"
                  />
                  <p className="font-hindi text-base text-cp-brown mb-2">
                    माँ का प्यार, घर का अचार
                  </p>
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-cp-text mb-3">
                    Welcome Back
                  </h1>
                  <p className="text-cp-text-muted text-lg">
                    Sign in to your account and continue your journey with Colonel&apos;s Pickle
                  </p>
                </motion.div>
              </div>
            </div>
          </AnimatedSection>

          {/* Login card */}
          <AnimatedSection direction="up" delay={0.1} className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                {(["google", "email", "mobile"] as Tab[]).map((tab, idx) => (
                  <motion.button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    whileHover={{ backgroundColor: activeTab === tab ? undefined : "#f9fafb" }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 py-3 text-sm font-semibold transition-all ${
                      activeTab === tab
                        ? "text-cp-crimson border-b-2 border-cp-crimson bg-cp-crimson-light"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab === "google" ? "Google" : tab === "email" ? "Email OTP" : "Mobile OTP"}
                  </motion.button>
                ))}
              </div>

              <div className="p-10">
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-base"
                    >
                      {error}
                    </motion.div>
                  )}

                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                {/* ── Google Tab ── */}
                {activeTab === "google" && (
                  <motion.div
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full"
                  >
                    <Button
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                      className="w-full bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-gray-400 py-6 text-lg font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-3"
                    >
                        {isLoading ? (
                          <div className="flex items-center gap-3">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-6 h-6 border-3 border-gray-300 border-t-amber-600 rounded-full"
                            />
                            <span>Signing in...</span>
                          </div>
                        ) : (
                          <>
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span>Continue with Google</span>
                          </>
                        )}
                      </Button>
                  </motion.div>
                )}

                {/* ── Email OTP Tab ── */}
                {activeTab === "email" && emailOtpStep === "input" && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <motion.input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendEmailOtp()}
                        placeholder="you@example.com"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileFocus={{ boxShadow: "0 0 0 3px rgba(185, 28, 28, 0.1)" }}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-cp-crimson focus:outline-none text-gray-900 text-base transition-colors"
                        disabled={isLoading}
                      />
                    </div>
                    <motion.div
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full"
                    >
                      <Button
                          onClick={handleSendEmailOtp}
                          disabled={isLoading || !email}
                          className="w-full bg-cp-crimson hover:bg-cp-crimson-dark text-white py-6 text-lg font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-3"
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-3">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-6 h-6 border-3 border-amber-300 border-t-white rounded-full"
                              />
                              <span>Sending OTP...</span>
                            </div>
                          ) : (
                            <><Mail className="w-5 h-5" /><span>Send OTP</span></>
                          )}
                        </Button>
                    </motion.div>
                  </div>
                )}

                {activeTab === "email" && emailOtpStep === "otp" && (
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center mb-4"
                    >
                      <p className="text-sm text-gray-600">
                        We sent a 6-digit code to <strong>{email}</strong>
                      </p>
                    </motion.div>
                    <div>
                      <label htmlFor="emailOtp" className="block text-sm font-medium text-gray-700 mb-2">
                        Verification Code
                      </label>
                      <motion.input
                        id="emailOtp"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={emailOtp}
                        onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ""))}
                        onKeyDown={(e) => e.key === "Enter" && handleVerifyEmailOtp()}
                        placeholder="000000"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileFocus={{ boxShadow: "0 0 0 3px rgba(185, 28, 28, 0.1)", scale: 1.02 }}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-cp-crimson focus:outline-none text-gray-900 text-center text-2xl tracking-[0.3em] font-mono transition-all"
                        disabled={isLoading}
                        autoFocus
                      />
                    </div>
                    <motion.div
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full"
                    >
                      <Button
                          onClick={handleVerifyEmailOtp}
                          disabled={isLoading || emailOtp.length !== 6}
                          className="w-full bg-cp-crimson hover:bg-cp-crimson-dark text-white py-6 text-lg font-semibold shadow-lg transition-all duration-300"
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-3">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-6 h-6 border-3 border-amber-300 border-t-white rounded-full"
                              />
                              <span>Verifying...</span>
                            </div>
                          ) : "Verify & Login"}
                        </Button>
                    </motion.div>
                    <div className="flex items-center justify-between text-sm">
                      <button
                        onClick={() => { setEmailOtpStep("input"); setEmailOtp(""); setError("") }}
                        className="text-cp-crimson hover:text-cp-crimson-dark font-medium flex items-center gap-1"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Change email
                      </button>
                      <button
                        onClick={() => { if (emailCooldown > 0) return; setEmailOtp(""); setError(""); handleSendEmailOtp() }}
                        disabled={emailCooldown > 0}
                        className={`font-medium ${emailCooldown > 0 ? "text-gray-400 cursor-not-allowed" : "text-cp-crimson hover:text-cp-crimson-dark"}`}
                      >
                        {emailCooldown > 0 ? `Resend in ${emailCooldown}s` : "Resend OTP"}
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Mobile OTP Tab ── */}
                {activeTab === "mobile" && mobileOtpStep === "input" && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Number
                      </label>
                      <div className="flex">
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="inline-flex items-center px-3 border-2 border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-gray-600 text-sm font-medium"
                        >
                          +91
                        </motion.span>
                        <motion.input
                          id="phone"
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                          onKeyDown={(e) => e.key === "Enter" && handleSendMobileOtp()}
                          placeholder="98765 43210"
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileFocus={{ boxShadow: "0 0 0 3px rgba(185, 28, 28, 0.1)" }}
                          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-r-lg focus:border-cp-crimson focus:outline-none text-gray-900 text-base transition-colors"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full"
                    >
                      <Button
                          onClick={handleSendMobileOtp}
                          disabled={isLoading || phone.length !== 10}
                          className="w-full bg-cp-crimson hover:bg-cp-crimson-dark text-white py-6 text-lg font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-3"
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-3">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-6 h-6 border-3 border-amber-300 border-t-white rounded-full"
                              />
                              <span>Sending OTP...</span>
                            </div>
                          ) : (
                            <><Phone className="w-5 h-5" /><span>Send OTP</span></>
                          )}
                        </Button>
                    </motion.div>
                  </div>
                )}

                {activeTab === "mobile" && mobileOtpStep === "otp" && (
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center mb-4"
                    >
                      <p className="text-sm text-gray-600">
                        We sent a 6-digit code to <strong>+91 {phone}</strong>
                      </p>
                    </motion.div>
                    <div>
                      <label htmlFor="mobileOtp" className="block text-sm font-medium text-gray-700 mb-2">
                        Verification Code
                      </label>
                      <motion.input
                        id="mobileOtp"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={mobileOtp}
                        onChange={(e) => setMobileOtp(e.target.value.replace(/\D/g, ""))}
                        onKeyDown={(e) => e.key === "Enter" && handleVerifyMobileOtp()}
                        placeholder="000000"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileFocus={{ boxShadow: "0 0 0 3px rgba(185, 28, 28, 0.1)", scale: 1.02 }}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-cp-crimson focus:outline-none text-gray-900 text-center text-2xl tracking-[0.3em] font-mono transition-all"
                        disabled={isLoading}
                        autoFocus
                      />
                    </div>
                    <motion.div
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full"
                    >
                      <Button
                          onClick={handleVerifyMobileOtp}
                          disabled={isLoading || mobileOtp.length !== 6}
                          className="w-full bg-cp-crimson hover:bg-cp-crimson-dark text-white py-6 text-lg font-semibold shadow-lg transition-all duration-300"
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-3">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-6 h-6 border-3 border-amber-300 border-t-white rounded-full"
                              />
                              <span>Verifying...</span>
                            </div>
                          ) : "Verify & Login"}
                        </Button>
                    </motion.div>
                    <div className="flex items-center justify-between text-sm">
                      <button
                        onClick={() => { setMobileOtpStep("input"); setMobileOtp(""); setError("") }}
                        className="text-cp-crimson hover:text-cp-crimson-dark font-medium flex items-center gap-1"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Change number
                      </button>
                      <button
                        onClick={() => { if (mobileCooldown > 0) return; setMobileOtp(""); setError(""); handleSendMobileOtp() }}
                        disabled={mobileCooldown > 0}
                        className={`font-medium ${mobileCooldown > 0 ? "text-gray-400 cursor-not-allowed" : "text-cp-crimson hover:text-cp-crimson-dark"}`}
                      >
                        {mobileCooldown > 0 ? `Resend in ${mobileCooldown}s` : "Resend OTP"}
                      </button>
                    </div>
                  </div>
                )}

                  {/* Info Section */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8 p-4 bg-cp-cream-dark rounded-lg border border-cp-border"
                  >
                    <p className="text-sm text-center text-gray-700">
                      By signing in, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </AnimatedSection>

          {/* Features */}
          <AnimatedSection direction="up" delay={0.2} className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: "🔒", title: "Secure", desc: "Your data is safe with us" },
                { icon: "⚡", title: "Fast", desc: "Quick and easy sign in" },
                { icon: "✨", title: "Simple", desc: "No passwords to remember" },
              ].map((feature, idx) => (
                <HoverLift key={feature.title} lift={4} className="w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center p-6 bg-white rounded-lg shadow-md border border-cp-border transition-all"
                  >
                    <div className="text-4xl mb-3">{feature.icon}</div>
                    <h3 className="font-display text-lg font-bold text-gray-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </motion.div>
                </HoverLift>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
