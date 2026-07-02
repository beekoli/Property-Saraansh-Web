"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface SlideUpProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  yOffset?: number;
  viewportOnce?: boolean;
}

export default function SlideUp({
  children,
  duration = 0.6,
  delay = 0,
  yOffset = 30,
  viewportOnce = true,
  ...props
}: SlideUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: viewportOnce, margin: "-100px" }}
      transition={{ duration, delay, ease: [0.215, 0.61, 0.355, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
