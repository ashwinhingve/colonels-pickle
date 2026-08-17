'use client';

import { MotionConfig } from 'framer-motion';

/**
 * Global framer-motion configuration.
 *
 * `reducedMotion="user"` makes EVERY framer-motion animation honour the OS
 * "reduce motion" setting — transform/opacity animations are suppressed for
 * users who ask for it. The CSS `@media (prefers-reduced-motion)` block in
 * globals.css only reaches CSS animations/transitions; it cannot stop
 * framer-motion's inline transform animations, so this provider closes that
 * accessibility gap for the whole app.
 */
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
