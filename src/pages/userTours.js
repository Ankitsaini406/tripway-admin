import React from "react";
import useTourUserData from "@/hook/useTourUserData";
import { formatDate, formatPrice } from "@/utils/utilsConverter";

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
                    {Object.keys(userTours).map((uid) => (
                        <tr key={uid}>
                            <td>{userTours[uid].tourName}</td>
                            <td>{userTours[uid].userName}</td>
                            <td>{userTours[uid].userFrom}</td>
                            <td>{userTours[uid].userPhoneNumber}</td>
                            <td>{userTours[uid].userEmail}</td>
                            <td>{userTours[uid].passenger}</td>
                            <td>{formatPrice(userTours[uid].passenger * userTours[uid].price)}</td>
                            <td>{formatDate(userTours[uid].startDate)}</td>
                        </tr>
                    ))}
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