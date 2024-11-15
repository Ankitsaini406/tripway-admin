import React, { useState } from "react";
import Modal from "@/utils/Modal";
import useAuth from "@/hook/useAuth";
import useAuthorizedRequest from "@/hook/useAuthorizedRequest";
import { useViewData } from "@/hook/useViewData";

function UserView() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const { token } = useAuth();
    const { makeRequest } = useAuthorizedRequest();
    const { persons } = useViewData(token, makeRequest, 'users/get', refreshKey);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // if (error) return <p>Error: {error.message}</p>;

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            </Modal>
            {persons ? (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            {/* <th>Actions</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(persons).map((uid) => (
                            <tr key={uid}>
                                <td>{persons[uid].name}</td>
                                <td>{persons[uid].email}</td>
                                <td>{persons[uid].phoneNumber}</td>
                                {/* <td>
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
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p> Loading... </p>
            )}
        </>
    );
}

export default UserView;