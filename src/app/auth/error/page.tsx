'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { SpilledJarIllustration } from '@/components/illustrations';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return {
          title: 'Server Configuration Error',
          message: 'There is a problem with the server configuration. Please contact support.',
        };
      case 'AccessDenied':
        return {
          title: 'Access Denied',
          message: 'You do not have permission to sign in.',
        };
      case 'Verification':
        return {
          title: 'Verification Failed',
          message: 'The verification token has expired or has already been used.',
        };
      case 'OAuthSignin':
      case 'OAuthCallback':
      case 'OAuthCreateAccount':
      case 'EmailCreateAccount':
      case 'Callback':
        return {
          title: 'Authentication Error',
          message: 'There was a problem signing you in. Please try again.',
        };
      case 'OAuthAccountNotLinked':
        return {
          title: 'Account Already Exists',
          message: 'An account with this email already exists. Please sign in with the original method you used.',
        };
      case 'EmailSignin':
        return {
          title: 'Email Sign In Error',
          message: 'Unable to send sign in email. Please try again.',
        };
      case 'CredentialsSignin':
        return {
          title: 'Invalid Credentials',
          message: 'The email or password you entered is incorrect.',
        };
      case 'SessionRequired':
        return {
          title: 'Authentication Required',
          message: 'You must be signed in to access this page.',
        };
      default:
        return {
          title: 'Authentication Error',
          message: 'An unexpected error occurred. Please try again.',
        };
    }
  };

  const errorInfo = getErrorMessage(error);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-cp-cream px-4"
    >
      <div className="max-w-lg w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="hidden md:flex justify-center"
          >
            <SpilledJarIllustration />
          </motion.div>

          {/* Error card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 0.4, type: "spring" }}
                className="mx-auto w-16 h-16 bg-cp-terracotta-light rounded-full flex items-center justify-center mb-4"
              >
                <svg
                  className="w-8 h-8 text-cp-terracotta"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-cp-text mb-2"
              >
                {errorInfo.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-cp-text-muted"
              >
                {errorInfo.message}
              </motion.p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-cp-terracotta-light border border-cp-terracotta/25 rounded-lg p-4 mb-6"
              >
                <p className="text-sm text-cp-terracotta-deep">
                  <strong>Error Code:</strong> {error}
                </p>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="space-y-3"
            >
              <Link
                href="/login"
                className="block"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-cp-crimson text-white py-3 px-4 rounded-lg hover:bg-cp-crimson-dark font-medium text-center transition-all"
                >
                  Try Again
                </motion.button>
              </Link>
              <Link
                href="/"
                className="block"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 font-medium text-center transition-all"
                >
                  Go to Homepage
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-gray-600">
                Need help?{' '}
                <Link href="/contact" className="text-cp-crimson hover:text-cp-crimson-dark font-medium">
                  Contact Support
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
