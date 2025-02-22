import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useBreadcrumb } from "../../context/BreadcrumbContext";
import { FaCalendarAlt, FaTrashAlt, FaRedoAlt, FaEye } from "react-icons/fa";
import DoctorDetailsSidebar from "../../components/PatientPanel/DoctorDetailsSidebar";
import api from "../../api/api"; // Assuming Axios instance is configured
import { Link } from "react-router-dom";

import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
      when: "beforeChildren"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { type: "tween" } }
};


// Set the app element for the modal to prevent accessibility issues
Modal.setAppElement("#root");

const AppointmentBookingPage = () => {
  const { updateBreadcrumb } = useBreadcrumb();
  const [activeTab, setActiveTab] = useState("Scheduled");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false); // For button loading state

  const [isModalOpen, setIsModalOpen] = useState(false); // For modal
  const [appointmentToCancel, setAppointmentToCancel] = useState(null); // To store the appointment to be canceled

  useEffect(() => {
    updateBreadcrumb([
      { label: "Appointment Booking", path: "/patient/appointment-booking" },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get("/appointments");
        console.log("API Response:", response.data); // Log to check the response structure
        setAppointments(response.data.data || []); // Set to an empty array if data is undefined
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  // Function to filter appointments based on the selected tab
  const filteredAppointments = appointments.filter((appointment) => {
    if (activeTab === "Scheduled") {
      // Show all appointments in Scheduled tab excluding those that are canceled
      return appointment.status !== "Cancelled";
    } else if (activeTab === "Previous") {
      // Show only completed appointments
      return appointment.status === "Completed";
    } else if (activeTab === "Canceled") {
      // Show only canceled appointments
      return appointment.status === "Cancelled";
    } else if (activeTab === "Pending") {
      // Show only pending appointments
      return appointment.status === "Pending";
    }
    return false;
  });

  const handleViewDetails = (appointment) => {
    setSelectedDoctor(appointment);
    setIsSidebarVisible(true);
  };

  // Open modal to confirm cancellation
  const openCancelModal = (appointment) => {
    setAppointmentToCancel(appointment);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setAppointmentToCancel(null); // Reset the appointment to cancel
  };

  // Function to cancel an appointment
  const handleCancelAppointment = async () => {
    setLoading(true);
    try {
      const response = await api.patch(
        `/appointments/cancel/${appointmentToCancel.id}`
      );
      console.log("Cancel Response:", response.data);

      // Update the appointments after cancellation
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === appointmentToCancel.id
            ? { ...appointment, status: "Cancelled" }
            : appointment
        )
      );
      closeModal(); // Close the modal after canceling
    } catch (error) {
      console.error("Error canceling appointment:", error);
      alert("Failed to cancel appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-white p-6 rounded-lg shadow-lg m-6 h-full">
      {/* Tabs for Appointment Types */}
      <div className="flex space-x-4 border-b mb-4">
        {["Scheduled", "Previous", "Canceled", "Pending"].map((tab) => (
          <motion.button
            variants={itemVariants}
            key={tab}
            className={`py-2 px-4 focus:outline-none font-medium ${activeTab === tab
              ? "border-b-4 border-customBlue text-customBlue"
              : "text-gray-500"
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab} Appointment
          </motion.button>
        ))}
      </div>

      <motion.div variants={itemVariants} className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">My Appointment</h2>
        <Link
          to={"/patient/book-appointment"}
          className="flex items-center space-x-2 bg-customBlue text-white px-4 py-2 rounded"
        >
          <FaCalendarAlt />
          <span>Book Appointment</span>
        </Link>
      </motion.div>

      {/* Appointment List */}
      <div className="grid grid-cols-4 gap-4 overflow-y-auto custom-scroll">
        {filteredAppointments.map((appointment) => (
          <motion.div
            variants={itemVariants}
            key={appointment.id}
            className="border rounded-lg shadow-md bg-white"
          >
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-t-lg">
              <h4 className="font-semibold">
                {appointment.doctorName || "Doctor Name"}
              </h4>
              <div
                className="text-customBlue p-2 rounded-lg bg-white shadow cursor-pointer"
                onClick={() => handleViewDetails(appointment)}
              >
                <FaEye />
              </div>
            </div>
            {/* Card body with appointment details */}
            <div className="p-4 text-sm text-gray-700 space-y-1">
              <p className="flex justify-between items-center text-yellow-500 pb-2">
                <span className="font-semibold text-gray-500">
                  Appointment Type
                </span>
                {appointment.appointmentType}
              </p>
              <p className="flex justify-between items-center pb-2">
                <span className="font-semibold text-gray-500">Hospital Name</span>
                {appointment.hospitalName}
              </p>
              <p className="flex justify-between items-center pb-2">
                <span className="font-semibold text-gray-500">
                  Appointment Date
                </span>
                {new Date(appointment.appointmentDate).toLocaleDateString()}
              </p>
              <p className="flex justify-between items-center pb-2">
                <span className="font-semibold text-gray-500">
                  Appointment Time
                </span>
                {appointment.appointmentTime}
              </p>
              <p className="flex justify-between items-center pb-2">
                <span className="font-semibold text-gray-500">
                  Patient Issue
                </span>
                {appointment.diseaseName || "Not specified"}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex justify-between space-x-2 p-4 bg-white rounded-b-lg">
              {activeTab === "Scheduled" || activeTab === "Pending" ? (
                <>
                  <button
                    className="flex items-center justify-center space-x-1 border-2 px-3 py-2 rounded-md text-gray-600 w-1/2"
                    onClick={() => openCancelModal(appointment)}
                    disabled={loading}
                  >
                    <FaTrashAlt />
                    <span>{loading ? "Canceling..." : "Cancel"}</span>
                  </button>
                  <Link to='/patient/rescheduleA-appointment' className="flex items-center justify-center space-x-1 bg-customBlue px-3 py-2 rounded-md text-white w-1/2">
                    <FaRedoAlt />
                    <span>Reschedule</span>
                  </Link>
                </>
              ) : null}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Doctor Details Sidebar */}
      {selectedDoctor && (
        <DoctorDetailsSidebar
          doctor={selectedDoctor}
          isVisible={isSidebarVisible}
          onClose={() => setIsSidebarVisible(false)}
        />
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto my-20 border-t-4 border-red-500"
        overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center"
      >
        <div className="text-center">
          {/* Icon */}
          <div className="text-red-600 text-4xl mb-4">
            <FaTrashAlt />
          </div>

          {/* Modal Heading */}
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Cancel {appointmentToCancel?.appointmentType} Appointment?
          </h2>

          {/* Modal Description */}
          <p className="text-gray-600 mb-6">
            Are you sure you want to cancel this appointment?
          </p>

          {/* Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-md font-semibold hover:bg-gray-100"
              onClick={closeModal}
            >
              No
            </button>
            <button
              className="px-6 py-2 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600"
              onClick={handleCancelAppointment}
            >
              Yes
            </button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default AppointmentBookingPage;
