"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface StaggerContainerProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  staggerChildren?: number;
  delayChildren?: number;
  viewportOnce?: boolean;
}

export default function StaggerContainer({
  children,
  staggerChildren = 0.1,
  delayChildren = 0,
  viewportOnce = true,
  ...props
}: StaggerContainerProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: viewportOnce, margin: "-50px" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
