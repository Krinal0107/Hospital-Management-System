import React from "react";
import { motion } from "framer-motion";
import logoBanner from "../assets/images/loginBanner.png";
import logo from "../assets/images/logo.png";
import vector1 from "../assets/images/Vector1.png";
import vector2 from "../assets/images/Vector2.png";
import vector3 from "../assets/images/Vector3.png";
import vector from "../assets/images/Vector.png";

const SidePanel = () => {
  return (
    <motion.div
      className="w-1/2 bg-gray-100 relative flex justify-center items-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Vectors */}
      <motion.img
        src={vector1}
        alt="Vector Top Left"
        className="absolute top-0 left-0 w-50 h-60"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.img
        src={vector2}
        alt="Vector Bottom Right"
        className="absolute bottom-0 right-0 w-50 h-60"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.img
        src={vector}
        alt="Vector Bottom Right"
        className="absolute top-0 right-0 w-40 h-30"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Banner Content */}
      <div className="text-center relative">
        <motion.img
          src={vector3}
          alt="Vector Bottom Right"
          className="absolute top-0 right-0 w-40 h-30"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.img
          src={logo}
          alt="Logo"
          className="mb-4 mx-auto w-60 h-30"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.img
          src={logoBanner}
          alt="Banner"
          className="w-full max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.h2
          className="text-4xl font-bold mt-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Hospital
        </motion.h2>
        <motion.p
          className="text-gray-600 mt-2 font-semibold"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          You Can stay your Hospital and Contact
          <br /> With Your Facility.
        </motion.p>
      </div>
    </motion.div>
  );
};

export default SidePanel;