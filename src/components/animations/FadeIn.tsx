"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface FadeInProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  viewportOnce?: boolean;
}

export default function FadeIn({
  children,
  duration = 0.5,
  delay = 0,
  viewportOnce = true,
  ...props
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: viewportOnce, margin: "-100px" }}
      transition={{ duration, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
