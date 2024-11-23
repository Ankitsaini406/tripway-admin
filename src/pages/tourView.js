import React, { useState } from "react";
import useAuth from "@/hook/useAuth";
import { useViewData } from "@/hook/useViewData";
import Modal from "@/utils/Modal";
import EditPersonData from "@/components/EditPerson";
import CreateTour from "@/components/CreateTours";
import Image from "next/image";
import { toast } from "react-toastify";

function TourView() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingAgent, setEditingAgent] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedSection, setSelectedSection] = useState("tour"); // Track which section is selected (tour or group-tour)

    const { token } = useAuth();
    const { data } = useViewData(token, selectedSection === "tour" ? 'tour/get' : 'group-tour/get', refreshKey);

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
            toast.success("Tour is deleted");
        } catch (error) {
            console.error("Error deleting agent:", error);
            toast.error("Error deleting the tour");
        }
    };

    // Switch between Tour and Group Tour sections
    const handleSectionChange = (section) => {
        setSelectedSection(section);
        setRefreshKey((prevKey) => prevKey + 1); // Refresh data when switching sections
    };

    return (
        <>
            {/* Section selection buttons */}
            <div style={{ marginBottom: "20px" }}>
                <button onClick={() => handleSectionChange("tour")} style={{ marginRight: "10px" }}>
                    Tour
                </button>
                <button onClick={() => handleSectionChange("group-tour")}>
                    Group Tour
                </button>
            </div>

            {/* Create Tour Modal */}
            <button onClick={handleOpenModal}>Create {selectedSection === "tour" ? "Tour" : "Group Tour"}</button>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <CreateTour title={selectedSection === "tour" ? 'Tour' : 'Group Tour'} url={selectedSection === "tour" ? 'tour/add-tour' : 'group-tour/add-group-tour'} />
            </Modal>

            {/* Edit Tour Modal */}
            <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal}>
                {editingAgent && (
                    <EditPersonData
                        person={editingAgent}
                        onCancel={handleCloseEditModal}
                        url={selectedSection === "tour" ? 'tour' : 'group-tour'}
                    />
                )}
            </Modal>

            {/* Data Display */}
            {data ? (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Image</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(data).map((uid) => (
                            <tr key={uid}>
                                <td>{data[uid].name}</td>
                                <td>{data[uid].category}</td>
                                <td>{data[uid].price}</td>
                                <td>{data[uid].imageUrl}<img width={200} height={200} src={data[uid].imageUrl || 'https://tripwayholidays.in/tour-image/csgoskins-avatar.jpg'} alt={data[uid].name} /></td>
                                <td>{data[uid].description}</td>
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
            ) : (
                <p>Data Loading ...</p>
            )}
        </>
    );
}

export default TourView;
