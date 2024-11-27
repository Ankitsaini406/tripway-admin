import React, { useState } from "react";
import useAuth from "@/hook/useAuth";
import { useViewData } from "@/hook/useViewData";
import Modal from "@/utils/Modal";
import EditPersonData from "@/components/EditPerson";
import CreateTour from "@/components/CreateTours";
import Image from "next/image";
import { toast } from "react-toastify";
import LazyLoadImage from "@/utils/lazyImageLoading";

function TourView() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingAgent, setEditingAgent] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const { token } = useAuth();
    const { data } = useViewData(token, 'group-tour/get', refreshKey);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOpenEditModal = (uid) => {
        const tourToEdit = data[uid];
        setEditingAgent(tourToEdit);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingAgent(null);
    };

    const handleDeleteAgent = async (uid) => {
        try {
            // await deleteData(uid);
            setRefreshKey((prevKey) => prevKey + 1);
            toast.success("Tour is deleted");
        } catch (error) {
            console.error("Error deleting agent:", error);
            toast.error("Error deleting the tour");
        }
    };

    return (
        <>
            <button onClick={handleOpenModal}>Create Group Tour</button>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <CreateTour title='Group Tour' url='group-tour/add-group-tour' />
            </Modal>

            {/* Edit Tour Modal */}
            <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal}>
                {editingAgent && (
                    <EditPersonData
                        person={editingAgent}
                        onCancel={handleCloseEditModal}
                        url='group-tour'
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
                                <td><LazyLoadImage src={`https://tripwayholidays.in//tour-image/${data[uid].imageUrl}`} alt={data[uid].imageUrl} /></td>
                                <td>{data[uid].description}</td>
                                <td style={{ display: 'flex', border: 'none', borderTop: '1px solid #ddd' }}>
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
