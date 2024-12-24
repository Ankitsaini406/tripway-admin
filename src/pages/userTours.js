import React, { useState, useEffect } from "react";
import useTourUserData from "@/hook/useTourUserData";
import { formatDate, formatPrice, formatTimestamp } from "@/utils/utilsConverter";

function UserViewTour() {
    const { userTours, loading, error } = useTourUserData();
    const [searchQuery, setSearchQuery] = useState("");
    const [filterUsersTours, setFilteredTours] = useState([]);

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (userTours) {
            const filtered = Object.keys(userTours).filter((uid) => {
                const tour = userTours[uid];
                return (
                    tour.tourName.toLowerCase().includes(query.toLowerCase()) ||
                    tour.userName.toLowerCase().includes(query.toLowerCase()) ||
                    tour.userFrom.toLowerCase().includes(query.toLowerCase()) ||
                    tour.userPhoneNumber.toString().includes(query.toLowerCase()) ||
                    tour.userEmail.toLowerCase().includes(query.toLowerCase()) ||
                    tour.passenger.toString().includes(query.toLowerCase()) ||
                    tour.price.toString().includes(query.toLowerCase()) ||
                    tour.startDate.toString().includes(query.toLowerCase())
                );
            });

            setFilteredTours(filtered.map((uid) => ({
                id: uid,
                ...userTours[uid]
            })));
        }
    };

    useEffect(() => {
        if (userTours) {
            setFilteredTours(Object.keys(userTours).map((uid) => ({
                id: uid,
                ...userTours[uid]
            })));
        }
    }, [userTours]);

    return (
        <>
            <input
                className="searchBar"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search here..."
            />
            {userTours ? (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>User Name</th>
                                <th>From</th>
                                <th>Phone Number</th>
                                <th>Email</th>
                                <th>Passenger</th>
                                <th>Price</th>
                                <th>Tour Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filterUsersTours.length > 0 ? (
                                filterUsersTours.map((userTour) => {
                                    const isFutureBooking = new Date(formatTimestamp(userTour.startDate)) < new Date().setHours(0, 0, 0, 0);
                                    return (
                                        <tr key={userTour.id} className={`${isFutureBooking ? "disabledRow" : ""}`}>
                                            <td>{userTour.tourName}</td>
                                            <td>{userTour.userName}</td>
                                            <td>{userTour.userFrom}</td>
                                            <td>{userTour.userPhoneNumber}</td>
                                            <td>{userTour.userEmail}</td>
                                            <td>{userTour.passenger}</td>
                                            <td>{formatPrice(userTour.passenger * userTour.price)}</td>
                                            <td style={{ backgroundColor: isFutureBooking ? "#F0EFF5" : "" }}>
                                                {formatDate(userTour.startDate)}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="8">No User Tour found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </>
            ) : loading ? (
                <div>Loading...</div>
            ) : (
                <div>{error}</div>
            )}
        </>
    );
}

export default UserViewTour;
