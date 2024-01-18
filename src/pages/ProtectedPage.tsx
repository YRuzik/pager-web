import profile from "../data/mobx/profile.ts";
import {Outlet} from "react-router-dom";
import MockAuth from "./MockAuth.tsx";

const ProtectedPage = () => {
    return <>
        {profile.userId.length > 0 ? <Outlet/> : <MockAuth/>}
    </>
}

export default ProtectedPage