import React, { useState } from "react";
import CreatePerson from "@/components/CreatePerson";
import Modal from "@/utils/Modal";
import useAuth from "@/hook/useAuth";
import useAuthorizedRequest from "@/hook/useAuthorizedRequest";
import { useViewData } from "@/hook/useViewData";
import { useDeleteData } from "@/hook/useDeleteData";
import EditPersonData from "@/components/EditPerson";

function UserView() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const { token } = useAuth();
    const { makeRequest } = useAuthorizedRequest();
    const { persons } = useViewData(token, makeRequest, 'users/get', refreshKey);
    const { deleteData, loading: deleteLoading, error: deleteError } = useDeleteData(token, makeRequest);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOpenEditModal = (uid) => {
        const userToEdit = persons[uid];
        setEditingUser(userToEdit);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingUser(null);
    };

    const handleDeleteUser = async (uid) => {
        try {
            await deleteData('users', uid);
            setRefreshKey((prevKey) => prevKey + 1);
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    if (deleteLoading) return <p>Loading...</p>;
    // if (error) return <p>Error: {error.message}</p>;

    return (
        <>
            <button onClick={handleOpenModal}>Create User</button>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            <CreatePerson title={'User'} url={'users/add-user'} />
            </Modal>
            <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal}>
                {editingUser && (
                    <EditPersonData
                    person={editingUser}
                        onCancel={handleCloseEditModal}
                        url={'users'}
                    />
                )}
            </Modal>
            {persons && !deleteError ? (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(persons).map((uid) => (
                            <tr key={uid}>
                                <td>{persons[uid].name}</td>
                                <td>{persons[uid].email}</td>
                                <td>{persons[uid].phoneNumber}</td>
                                <td>
                                <button
                                        onClick={() => handleOpenEditModal(uid)}
                                        className={`editbtn tablebutton`}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUser(uid)}
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
                <p>{deleteError}</p>
            )}
        </>
    );
}

export default UserView;