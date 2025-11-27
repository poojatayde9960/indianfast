
// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import Navbar from './Navbar';
// import Sidebar from './Sidebar';

// const Layout = () => {

//     return (
//         <div className="flex flex-col h-screen overflow-hidden">
//             <Navbar />
//             <div className="flex flex-1 items-stretch overflow-hidden">
//                 <div className="bg-indigo-900">
//                     <Sidebar />
//                 </div>
//                 <div className="flex-1 bg-white  overflow-auto">
//                     <Outlet />
//                 </div>
//             </div>
//         </div>

//     );
// };

// export default Layout;

// import React, { useState } from "react";
// import { Outlet } from "react-router-dom";
// import Navbar from "./Navbar";
// import Sidebar from "./Sidebar";

// const Layout = () => {
//     const [pageTitle, setPageTitle] = useState("Dashboard"); // <-- step 1

//     return (
//         <div className="flex flex-col h-screen overflow-hidden">
//             {/* Pass title to Navbar */}
//             <Navbar title={pageTitle} />

//             <div className="flex flex-1 items-stretch overflow-hidden">
//                 <div className="">
//                     {/* Pass function to Sidebar */}
//                     <Sidebar setPageTitle={setPageTitle} />
//                 </div>
//                 <div className="flex-1 bg-white overflow-auto">
//                     <Outlet />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Layout;
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const [pageTitle, setPageTitle] = useState("Dashboard");

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <Navbar title={pageTitle} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <div className="flex flex-1 items-stretch overflow-hidden">
                <Sidebar setPageTitle={setPageTitle} />
                <div className="flex-1 bg-white overflow-auto">
                    {/* ✅ Pass context here */}
                    {/* <Outlet context={{ setPageTitle }} /> */}
                    <Outlet context={{ setPageTitle, searchTerm, setSearchTerm }} />
                </div>
            </div>
        </div>
    );
};

export default Layout;
