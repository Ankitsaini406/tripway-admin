import React, { useState } from "react";
import useCabsData from "@/hook/useCabData";
import Modal from "@/utils/Modal";
import EditPersonData from "@/components/EditPerson";
import CreateTour from "@/components/CreateTours";  // Assuming you will have a similar CreateCab component
import { toast } from "react-toastify";

function CabsView() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingAgent, setEditingAgent] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedSection, setSelectedSection] = useState("one-way"); // Track selected trip type

    // Adjust API based on the selected section (one-way, round-trip, or multi-city)
    const { data, loading, error } = useCabsData(selectedSection, refreshKey);

    console.log(data);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOpenEditModal = (uid) => {
        const agentToEdit = data[uid];
        setEditingAgent(agentToEdit);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingAgent(null);
    };

    const handleDeleteAgent = async (uid) => {
        try {
            // await deleteData(uid);
            // setRefreshKey((prevKey) => prevKey + 1);
            toast.success("Cab trip is deleted");
        } catch (error) {
            console.error("Error deleting agent:", error);
            toast.error("Error deleting the cab trip");
        }
    };

    // Switch between One-way, Round-trip, and Multi-city sections
    const handleSectionChange = (section) => {
        setSelectedSection(section);
        setRefreshKey((prevKey) => prevKey + 1); // Refresh data when switching sections
    };

    return (
        <>
            {/* Section selection buttons */}
            <div style={{ marginBottom: "20px" }}>
                <button onClick={() => handleSectionChange("one-way")} style={{ marginRight: "10px" }}>
                    One-way
                </button>
                <button onClick={() => handleSectionChange("round-trip")} style={{ marginRight: "10px" }}>
                    Round-trip
                </button>
                <button onClick={() => handleSectionChange("multi-city")}>
                    Multi-city
                </button>
            </div>

            {/* Create Cab Modal */}
            <button onClick={handleOpenModal}>Create {selectedSection === "one-way" ? "One-way" : selectedSection === "round-trip" ? "Round-trip" : "Multi-city"} Cab</button>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <CreateTour title={selectedSection === "one-way" ? 'One-way Cab' : selectedSection === "round-trip" ? 'Round-trip Cab' : 'Multi-city Cab'} url={selectedSection === "one-way" ? 'cab/add-one-way' : selectedSection === "round-trip" ? 'cab/add-round-trip' : 'cab/add-multi-city'} />
            </Modal>

            {/* Edit Cab Modal */}
            <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal}>
                {editingAgent && (
                    <EditPersonData
                        person={editingAgent}
                        onCancel={handleCloseEditModal}
                        url={selectedSection === "one-way" ? 'cab' : selectedSection === "round-trip" ? 'cab' : 'cab'}
                    />
                )}
            </Modal>

            {/* Data Display */}
            {loading ? (<p>Data Loading...</p>) : error ? (<p>Error : {error}</p>): (
                <table>
                    <thead>
                        <tr>
                            {/* Conditional Columns based on selected section */}
                            {selectedSection === "one-way" && (
                                <>
                                    <th>Booking From</th>
                                    <th>Email</th>
                                    <th>From</th>
                                    <th>Offer From</th>
                                    <th>Passenger</th>
                                    <th>Phone Number</th>
                                    <th>Select Car</th>
                                    <th>Start Date</th>
                                    <th>Time</th>
                                    <th>To</th>
                                    <th>Action</th>
                                </>
                            )}
                            {selectedSection === "round-trip" && (
                                <>
                                    <th>From</th>
                                    <th>Destination</th>
                                    <th>Email</th>
                                    <th>Passenger</th>
                                    <th>Phone Number</th>
                                    <th>Select Car</th>
                                    <th>Start Date</th>
                                    <th>Time</th>
                                    <th>Action</th>
                                </>
                            )}
                            {selectedSection === "multi-city" && (
                                <>
                                    <th>From</th>
                                    <th>Destination</th>
                                    <th>Email</th>
                                    <th>Passenger</th>
                                    <th>Phone Number</th>
                                    <th>Select Car</th>
                                    <th>Start Date</th>
                                    <th>Time</th>
                                    <th>Action</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(data).map((uid) => (
                            <tr key={uid}>
                                {/* Conditional Data rendering based on selected section */}
                                {selectedSection === "one-way" && (
                                    <>
                                        <td>{data[uid].bookingFrom}</td>
                                        <td>{data[uid].email}</td>
                                        <td>{data[uid].from}</td>
                                        <td>{data[uid].offerFrom}</td>
                                        <td>{data[uid].passenger}</td>
                                        <td>{data[uid].phoneNumber}</td>
                                        <td>{data[uid].selectCar}</td>
                                        <td>{data[uid].startDate}</td>
                                        <td>{data[uid].time}</td>
                                        <td>{data[uid].to}</td>
                                    </>
                                )}
                                {selectedSection === "round-trip" && (
                                    <>
                                        <td>{data[uid].from}</td>
                                        <td>{data[uid].destination}</td>
                                        <td>{data[uid].email}</td>
                                        <td>{data[uid].passenger}</td>
                                        <td>{data[uid].phoneNumber}</td>
                                        <td>{data[uid].selectCar}</td>
                                        <td>{data[uid].startDate}</td>
                                        <td>{data[uid].time}</td>
                                    </>
                                )}
                                {selectedSection === "multi-city" && (
                                    <>
                                        <td>{data[uid].from}</td>
                                        <td>{Array.isArray(data[uid]?.destination) ? data[uid].destination.join(", ") : data[uid]?.destination || "N/A"}</td>
                                        <td>{data[uid].email}</td>
                                        <td>{data[uid].passenger}</td>
                                        <td>{data[uid].phoneNumber}</td>
                                        <td>{data[uid].selectCar}</td>
                                        <td>{data[uid].startDate}</td>
                                        <td>{data[uid].time}</td>
                                    </>
                                )}
                                <td style={{ display: 'flex' }}>
                                    <button
                                        onClick={() => handleOpenEditModal(uid)}
                                        className={`editbtn tablebutton`}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteAgent(uid)}
                                        className={`deletebtn tablebutton`}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );
}

export default CabsView;
