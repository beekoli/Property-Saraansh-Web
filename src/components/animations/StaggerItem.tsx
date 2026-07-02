"use client";

import React from "react";
import { motion, HTMLMotionProps, Variants } from "framer-motion";

interface StaggerItemProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  yOffset?: number;
}

const itemVariants = (yOffset: number): Variants => ({
  hidden: { opacity: 0, y: yOffset },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
});

export default function StaggerItem({
  children,
  yOffset = 20,
  ...props
}: StaggerItemProps) {
  return (
    <motion.div variants={itemVariants(yOffset)} {...props}>
      {children}
    </motion.div>
  );
}
