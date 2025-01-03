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
    const [searchQuery, setSearchQuery] = useState("");
    const [filterTours, setFilteredTours] = useState([]);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOpenEditModal = (tour) => {
        const tourToEdit = tour;
        console.log(`This is tour : `, tour);
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

    const handleSearch = (query) => {
        setSearchQuery(query);
        const filtered = Object.keys(tours).filter((uid) => {
            const tour = tours[uid];
            return (
                tour.name.toLowerCase().includes(query.toLowerCase()) ||
                tour.category.toLowerCase().includes(query.toLowerCase()) ||
                tour.price.toString().includes(query.toLowerCase()) ||
                tour.startDate.toString().includes(query.toLowerCase()) ||
                tour.description.toLowerCase().includes(query.toLowerCase())
            );
        });

        setFilteredTours(filtered.map((uid) => ({
            id: uid,
            ...tours[uid]
        })));
    };

    useEffect(() => {
        fetchTours('group-tour/get');
    }, []);

    useEffect(() => {
        setFilteredTours(Object.keys(tours).map((uid) => ({
            id: uid,
            ...tours[uid]
        })));
    }, [tours]);

    return (
        <>
            <button className="createButton" onClick={handleOpenModal}>Create Group Tour</button>
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
                <div>
                    <input
                        className='searchBar'
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search here..."
                    />
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Discount</th>
                                <th>Tour Date</th>
                                {/* <th>Image</th> */}
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            { filterTours.length > 0 ? (filterTours.map((tour) => {
                                const isFutureBooking = new Date(formatTimestamp(tour.startDate)) < new Date().setHours(0, 0, 0, 0);
                                return (
                                    <tr key={tour.name} className={`${isFutureBooking ? 'disabledRow' : ''}`}>
                                        <td>{tour.name}</td>
                                        <td>{tour.category}</td>
                                        <td>{formatPrice(tour.price)}</td>
                                        <td>{tour.discount}&nbsp;%off</td>
                                        <td style={{ backgroundColor: isFutureBooking ? '#F0EFF5' : '' }}>{formatDate(tour.startDate)}</td>
                                        {/* <td style={{ width: '100px', height: '100px' }}><LazyLoadImage src={`https://tripwayholidays.in//tour-image/${tours[uid].imageUrl}`} alt={tours[uid].imageUrl} /></td> */}
                                        <td style={{ maxWidth: '200px' }}>{truncateDescription(tour.description)}</td>
                                        <td style={{ display: 'flex', border: 'none', borderTop: '1px solid #ddd' }}>
                                            <button
                                                onClick={() => handleOpenEditModal(tour)}
                                                className={`editbtn tablebutton`}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAgent(tour.id)}
                                                className={`deletebtn tablebutton`}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })): (
                                <tr>
                                    <td colSpan="6">No Tour found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>Data Loading ...</p>
            )}
        </>
    );
}

export default TourView;
