import { motion } from "framer-motion";

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="w-full mx-auto max-w-3xl px-14 md:mt-24"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex flex-col gap-1 leading-relaxed text-left">
        <p className="text-white font-semibold text-3xl">
          Project Eve 
        </p>
        <p className="text-gray-400 font-normal text-xl">
          by Yasser Ali
        </p>
      </div>
    </motion.div>
  );
};
