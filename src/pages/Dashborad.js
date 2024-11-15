import { useState } from "react";
import useAuth from "../hook/useAuth";
import useAuthorizedRequest from "../hook/useAuthorizedRequest";
import { useViewData } from "../hook/useViewData";

function Dashboard() {
    const { token } = useAuth();
    const { makeRequest } = useAuthorizedRequest();
    const [refreshKey, setRefreshKey] = useState(0);
    const { data: agents, loading: loadingAgents, error: errorAgents } = useViewData(token, makeRequest, 'agents/get', refreshKey);
    const { data: users, loading: loadingUsers, error: errorUsers } = useViewData(token, makeRequest, 'users/get', refreshKey);

    return (
        <>
            <section>
                <h2>Agents</h2>
                {loadingAgents && <p>Loading agents...</p>}
                {errorAgents && !loadingAgents && <p>Error loading agents: {errorAgents.message}</p>}
                {!loadingAgents && !errorAgents && agents !== null ? (
                    <h4>{Object.entries(agents).length} Agents found</h4>
                ) : (
                    !loadingAgents && !errorAgents && <p>No Agents found.</p>
                )}
            </section>

            <section>
                <h2>Users</h2>
                {loadingUsers && <p>Loading Users...</p>}
                {loadingUsers && !loadingUsers && <p>Error loading Users: {errorUsers.message}</p>}
                {!loadingUsers && !errorUsers && users !== null ? (
                    <h4>{Object.entries(users).length} Users found</h4>) : (
                    !loadingUsers && !errorUsers && <p>No Users found.</p>
                )}
            </section>
        </>
    )
}

export default Dashboard;