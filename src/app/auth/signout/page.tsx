'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { WelcomeIllustration } from '@/components/illustrations';

export default function SignOutPage() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Sign out error:', error);
      setSigningOut(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cp-cream px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Illustration - hidden on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="hidden md:flex justify-center"
          >
            <WelcomeIllustration />
          </motion.div>

          {/* Confirmation card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4, type: "spring" }}
                className="mx-auto w-16 h-16 bg-cp-olive-light rounded-full flex items-center justify-center mb-4"
              >
                <svg
                  className="w-8 h-8 text-cp-crimson"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </motion.div>
              <h1 className="text-2xl font-bold text-cp-text mb-2">
                See You Soon!
              </h1>
              <p className="text-cp-text-muted">
                Are you sure you want to sign out?
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <motion.button
                onClick={handleSignOut}
                disabled={signingOut}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-cp-crimson text-white py-3 px-4 rounded-lg hover:bg-cp-crimson-dark font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {signingOut ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Signing Out...
                  </span>
                ) : (
                  'Yes, Sign Out'
                )}
              </motion.button>
              <motion.button
                onClick={handleCancel}
                disabled={signingOut}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-cp-cream-dark text-cp-text py-3 px-4 rounded-lg hover:bg-cp-border font-medium transition-all disabled:opacity-50"
              >
                Cancel
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
