import type { Transition } from 'framer-motion';

export const primarySpring: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 20,
};

export const softSpring: Transition = {
  type: 'spring',
  stiffness: 250,
  damping: 25,
};

export const gridStaggerContainer = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const gridItemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: primarySpring,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15 },
  },
};
