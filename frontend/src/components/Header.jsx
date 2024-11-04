import React, { useEffect, useState } from "react";
import { AiOutlineDown, AiOutlineRight } from "react-icons/ai";
import { FaBell, FaHome, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import user from "../assets/images/user.png";
import { useBreadcrumb } from "../context/BreadcrumbContext";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
      when: "beforeChildren"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, },
  visible: { opacity: 1, transition: { type: "tween" } }
};

const Header = ({ activeMenu }) => {
  const { breadcrumb } = useBreadcrumb();
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Fetch the token from localStorage
    const token = localStorage.getItem("token");
    console.log(token)
    if (token) {
      try {
        // Decode the token to get the user data
        const decoded = jwtDecode(token);
        setUserName(`${decoded.firstName} ${decoded.lastName}`);
        setUserRole(decoded.role);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  return (
    <motion.div
      className="flex items-center justify-between bg-white shadow-md p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Profile Setting Path */}
      <motion.div className="flex items-center bg-gray-100 px-4 py-2 rounded-full space-x-2" variants={itemVariants}>
        <Link to={"/patient/patient-dashboard"}>
          <FaHome className="text-gray-500 text-lg" />
        </Link>
        {breadcrumb.map((item, index) => (
          <React.Fragment key={index}>
            <AiOutlineRight className="text-gray-400 text-sm" />
            <Link
              to={item.path}
              className="pro-text-color font-medium text-customBlue"
            >
              {item.label}
            </Link>
          </React.Fragment>
        ))}
      </motion.div>

      {/* Right Side - Search, Notification, and Profile */}
      <div className="flex items-center space-x-4">
        {/* Search Bar with Icon */}
        <motion.div className="flex items-center bg-gray-100 rounded-full px-4 py-2 space-x-2" variants={itemVariants}>
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Quick Search"
            className="bg-gray-100 focus:outline-none w-full"
          />
          <AiOutlineDown className="text-gray-500" />
        </motion.div>

        {/* Notification Icon */}
        <motion.div className="relative rounded-full bg-gray-100 p-3" variants={itemVariants}>
          <FaBell className="text-gray-700" />
        </motion.div>

        {/* User Profile */}
        <motion.div className="flex items-center space-x-2" variants={itemVariants}>
          <img src={user} alt="user1" className="w-12 h-12 rounded-full" />
          <div>
            <span className="font-semibold text-sm">{userName}</span>
            <span className="block text-gray-500 text-xs">{userRole}</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Header;