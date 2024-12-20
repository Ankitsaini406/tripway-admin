import React, { useEffect, useState } from "react";
import useAuth from "@/hook/useAuth";
import Modal from "@/utils/Modal";
import EditPersonData from "@/components/EditPerson";
import CreatePerson from "@/components/CreatePerson";
import { toast } from "react-toastify";
import useAgentData from "@/hook/useAgentData";

function AgentView() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingAgent, setEditingAgent] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const { token } = useAuth();
    const { viewData, deleteData, data, loading, response, error } = useAgentData(token, 'users/get', refreshKey);

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
            await deleteData(`/agents/${uid}`);
            toast.info(response?.message || "Agent deleted successfully");
            setRefreshKey((prevKey) => prevKey + 1);
        } catch (error) {
            console.log("Error deleting agent:", error);
            toast.error(error?.message || "Failed to delete agent");
        }
    };

    useEffect(() => {
        viewData('agents/get');
    }, [viewData])

    if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error: {error.message}</p>;

    return (
        <>
            <button onClick={handleOpenModal}>Create Agent</button>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <CreatePerson title={'Agent'} url={'agents/add-agent'} />
            </Modal>
            <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal}>
                {editingAgent && (
                    <EditPersonData
                        person={editingAgent}
                        onCancel={handleCloseEditModal}
                        url={'agents'}
                    />
                )}
            </Modal>
            {data && !error ? (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Agent Code</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(data).map((uid) => (
                            <tr key={uid}>
                                <td>{data[uid].name}</td>
                                <td>{data[uid].email}</td>
                                <td>{data[uid].phoneNumber}</td>
                                <td>{data[uid].agentCode}</td>
                                <td>
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
                <p>{error}</p>
            )}
        </>
    );
}

export default AgentView;