"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };
const interactions = { whileHover: { y: -1 }, whileTap: { scale: 0.96 } };

/**
 * Press-feedback wrapper: a tiny hover lift + scale-down on tap.
 *
 * Two modes:
 *  - default — renders a real <button> (forward type/onClick/aria-* via ...rest).
 *  - `asChild` — renders an inline-flex <span> wrapper so it can decorate a
 *    <Link>/<a> without turning it into a button. The child stays the real
 *    interactive element; the wrapper just carries the animation.
 *
 * MotionConfig (see MotionProvider) suppresses the motion under reduced-motion.
 */
export type TapScaleProps =
  | ({ asChild: true } & HTMLMotionProps<"span">)
  | ({ asChild?: false } & HTMLMotionProps<"button">);

export function TapScale(props: TapScaleProps) {
  if (props.asChild) {
    const { asChild: _asChild, className, children, ...rest } = props;
    void _asChild;
    return (
      <motion.span
        {...interactions}
        transition={spring}
        className={cn("inline-flex", className)}
        {...rest}
      >
        {children}
      </motion.span>
    );
  }

  const { asChild: _asChild, className, children, ...rest } = props;
  void _asChild;
  return (
    <motion.button {...interactions} transition={spring} className={className} {...rest}>
      {children}
    </motion.button>
  );
}

export default TapScale;
