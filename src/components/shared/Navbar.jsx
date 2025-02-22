import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { userContext } from "../../context/userContext";
import brandLogo from "/images/brand-logo.png"; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, removeUser } = useContext(userContext);

  const handleLogout = () => {
    removeUser();
    console.log(user)
    // Additional logout logic (e.g., redirect, API call) if needed
  };

  return (
    <nav className="w-full z-50 bg-white/80 backdrop-blur-md shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <img src={brandLogo} alt="Brand Logo" className="w-24 h-auto" />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium ${
                location.pathname === "/" ? "text-green-600" : "text-gray-600 hover:text-green-600"
              }`}
            >
              Home
            </Link>
            <Link
              to="/services"
              className={`text-sm font-medium ${
                location.pathname === "/services" ? "text-green-600" : "text-gray-600 hover:text-green-600"
              }`}
            >
              Services
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium ${
                location.pathname === "/about" ? "text-green-600" : "text-gray-600 hover:text-green-600"
              }`}
            >
              About
            </Link>

            {/* Conditionally Render Profile & Logout if User is Logged In */}
            {user ? (
              <>
                <Link
                  to="/profile"
                  className={`text-sm font-medium ${
                    location.pathname === "/profile" ? "text-green-600" : "text-gray-600 hover:text-green-600"
                  }`}
                >
                  Profile
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="text-sm font-medium text-gray-600 hover:text-green-600"
                >
                  Login
                </Link>
                {/* <Link
                  to="/auth"
                  className="text-sm font-medium text-gray-600 hover:text-green-600"
                >
                  Register
                </Link> */}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <motion.div animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className="w-full h-0.5 bg-gray-600 origin-left" />
              <motion.div animate={isOpen ? { opacity: 0 } : { opacity: 1 }} className="w-full h-0.5 bg-gray-600" />
              <motion.div animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className="w-full h-0.5 bg-gray-600 origin-left" />
            </div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
            >
              <div className="py-4 space-y-4">
                <Link
                  to="/"
                  className={`block px-4 py-2 text-sm font-medium ${
                    location.pathname === "/" ? "text-green-600" : "text-gray-600 hover:text-green-600"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/services"
                  className={`block px-4 py-2 text-sm font-medium ${
                    location.pathname === "/services" ? "text-green-600" : "text-gray-600 hover:text-green-600"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Services
                </Link>
                <Link
                  to="/about"
                  className={`block px-4 py-2 text-sm font-medium ${
                    location.pathname === "/about" ? "text-green-600" : "text-gray-600 hover:text-green-600"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>

                {/* Conditionally Render Profile & Logout if User is Logged In */}
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className={`block px-4 py-2 text-sm font-medium ${
                        location.pathname === "/profile" ? "text-green-600" : "text-gray-600 hover:text-green-600"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      Profile
                    </Link>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="w-full px-4 py-2 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      Logout
                    </motion.button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth"
                      className="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-green-600"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    {/* <Link
                      to="/auth"
                      className="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-green-600"
                      onClick={() => setIsOpen(false)}
                    >
                      Register
                    </Link> */}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
