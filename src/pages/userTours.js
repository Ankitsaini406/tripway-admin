import React from "react";
import useTourUserData from "@/hook/useTourUserData";
import { formatDate, formatPrice, formatTimestamp } from "@/utils/utilsConverter";

function UserViewTour() {

    const { userTours, loading, error } = useTourUserData();

    return (
        <>
        {
            userTours ? (
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
                    {Object.keys(userTours).map((uid) => { 
                        const isFutureBooking = new Date(formatTimestamp(userTours[uid].startDate)) < new Date().setHours(0, 0, 0, 0);
                        return (
                        <tr key={uid} className={`${isFutureBooking ? 'disabledRow' : ''}`}>
                            <td>{userTours[uid].tourName}</td>
                            <td>{userTours[uid].userName}</td>
                            <td>{userTours[uid].userFrom}</td>
                            <td>{userTours[uid].userPhoneNumber}</td>
                            <td>{userTours[uid].userEmail}</td>
                            <td>{userTours[uid].passenger}</td>
                            <td>{formatPrice(userTours[uid].passenger * userTours[uid].price)}</td>
                            <td style={{ backgroundColor: isFutureBooking ? '#F0EFF5' : '' }}>{formatDate(userTours[uid].startDate)}</td>
                        </tr>
                    )})}
                </tbody>
            </table>
            ) : loading ? (
                <div>Loading...</div>
            ) : (
                <div>{error}</div>
            )
        }
        </>
    )
};

export default UserViewTour;