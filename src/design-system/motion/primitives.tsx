import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem } from "../motion";

interface MotionRevealProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
}

/** Animate children into view on mount */
export function MotionReveal({
  children,
  delay = 0,
  className,
  ...props
}: MotionRevealProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface MotionStaggerProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
}

/** Stagger animate direct children */
export function MotionStagger({ children, className, ...props }: MotionStaggerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionStaggerItem({
  children,
  className,
  ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div variants={staggerItem} className={className} {...props}>
      {children}
    </motion.div>
  );
}

interface MotionHoverLiftProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
}

/** Floating surface hover interaction */
export function MotionHoverLift({
  children,
  className,
  ...props
}: MotionHoverLiftProps) {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      whileTap={{ scale: 0.99 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
