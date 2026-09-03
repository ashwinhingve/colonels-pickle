"use client"

import React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Shield } from "lucide-react"

export interface Certification {
  name: string;
  description: string;
  image?: string;
  icon?: React.ReactNode;
}

export interface CertificationBadgeProps {
  certification: Certification;
  className?: string;
}

export const CertificationBadge: React.FC<CertificationBadgeProps> = ({
  certification,
  className = "",
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 ${className}`}
    >
      {/* Icon or Image */}
      <div className="flex justify-center mb-4">
        {certification.image ? (
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-cp-olive-light to-cp-gold/20 p-2">
            <Image
              src={certification.image}
              alt={certification.name}
              width={96}
              height={96}
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cp-olive to-cp-olive-dark flex items-center justify-center shadow-md ring-4 ring-cp-gold/25">
            {certification.icon || <Shield className="w-12 h-12 text-white" />}
          </div>
        )}
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold text-cp-text text-center mb-2">
        {certification.name}
      </h3>
      <p className="text-sm text-cp-text-muted text-center leading-relaxed">
        {certification.description}
      </p>
    </motion.div>
  )
}
