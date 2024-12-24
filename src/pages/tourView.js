import React, { useEffect, useState } from "react";
import useAuth from "@/hook/useAuth";
import Modal from "@/utils/Modal";
import CreateTour from "@/components/CreateTours";
import { toast } from "react-toastify";
// import LazyLoadImage from "@/utils/lazyImageLoading";
import { formatDate, formatPrice, formatTimestamp, truncateDescription } from "@/utils/utilsConverter";
import EditTour from "@/components/EditTours";
import useTourData from "@/hook/useTourData";

function TourView() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTour, setEditingTour] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const { token } = useAuth();
    const { tours, deleteTour, fetchTours } = useTourData(token);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOpenEditModal = (uid) => {
        const tourToEdit = tours[uid];
        setEditingTour(tourToEdit);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingTour(null);
    };

    const handleDeleteAgent = async (uid) => {
        try {
            await deleteTour(`group-tour/`, uid);
            setRefreshKey((prevKey) => prevKey + 1);
            toast.success("Tour is deleted");
        } catch (error) {
            console.error("Error deleting agent:", error);
            toast.error("Error deleting the tour");
        }
    };

    useEffect(() => {
        fetchTours('group-tour/get');
    }, [])

    return (
        <>
            <button onClick={handleOpenModal}>Create Group Tour</button>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <CreateTour title='Group Tour' url='group-tour/add-group-tour' onSuccess={refreshKey} />
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal}>
                {editingTour && (
                    <EditTour
                        title="Group Tour"
                        url="group-tour"
                        tourData={editingTour}
                        onSuccess={refreshKey}
                    />
                )}
            </Modal>

            {tours ? (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Tour Date</th>
                            {/* <th>Image</th> */}
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(tours).map((uid) => { 
                            const isFutureBooking = new Date(formatTimestamp(tours[uid].startDate)) < new Date().setHours(0, 0, 0, 0);
                            return (
                            <tr key={uid} className={`${isFutureBooking ? 'disabledRow' : ''}`}>
                                <td>{tours[uid].name}</td>
                                <td>{tours[uid].category}</td>
                                <td>{formatPrice(tours[uid].price)}</td>
                                <td style={{ backgroundColor: isFutureBooking ? '#F0EFF5' : '' }}>{formatDate(tours[uid].startDate)}</td>
                                {/* <td style={{ width: '100px', height: '100px' }}><LazyLoadImage src={`https://tripwayholidays.in//tour-image/${tours[uid].imageUrl}`} alt={tours[uid].imageUrl} /></td> */}
                                <td style={{ maxWidth: '200px' }}>{truncateDescription(tours[uid].description)}</td>
                                <td style={{ display: 'flex', border: 'none', borderTop: '1px solid #ddd' }}>
                                    <button
                                        onClick={() => handleOpenEditModal(uid)}
                                        className={`editbtn tablebutton`}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteAgent(tours[uid].id)}
                                        className={`deletebtn tablebutton`}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            ) : (
                <p>Data Loading ...</p>
            )}
        </>
    );
}

export default TourView;
