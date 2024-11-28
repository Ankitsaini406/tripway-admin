import React, { useState } from "react";
import Modal from "@/utils/Modal";
import useAuth from "@/hook/useAuth";
import { useViewData } from "@/hook/useViewData";

function UserView() {
    const [refreshKey, setRefreshKey] = useState(0);
    const { token } = useAuth();
    const { data } = useViewData(token, 'users/get', refreshKey);

    return (
        <>
            {data ? (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(data).map((uid) => (
                            <tr key={uid}>
                                <td>{data[uid].name}</td>
                                <td>{data[uid].email}</td>
                                <td>{data[uid].phoneNumber}</td>
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