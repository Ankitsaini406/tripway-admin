import React, { useState } from "react";
import useAuth from "@/hook/useAuth";
import useAuthorizedRequest from "@/hook/useAuthorizedRequest";
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
    const { token } = useAuth();
    const { makeRequest } = useAuthorizedRequest();
    const { data } = useViewData(token, makeRequest, 'tour/get', refreshKey);

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
            toast.success(error);
        }
    };

    // if (error) return <p>Error: {error.message}</p>;

    return (
        <>
            <button onClick={handleOpenModal}>Create Tour</button>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <CreateTour title={'Tour'} url={'tour/add-tour'} />
            </Modal>
            <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal}>
                {editingAgent && (
                    <EditPersonData
                    person={editingAgent}
                        onCancel={handleCloseEditModal}
                        url={'tour'}
                    />
                )}
            </Modal>
            {data ? (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Image</th>
                            <th>Descrption</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(data).map((uid) => (
                            <tr key={uid}>
                                <td>{data[uid].name}</td>
                                <td>{data[uid].category}</td>
                                <td>{data[uid].price}</td>
                                <td>{data[uid].imageUrl}</td>
                                <td><img width={200} height={200} src={'https://tripwayholidays.in/tour-image/csgoskins-avatar.jpg'} /></td>
                                <td>{data[uid].description}</td>
                                <td style={{ display: 'flex'}}>
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