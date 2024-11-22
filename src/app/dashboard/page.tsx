"use client";
import Header from "@/components/Header";
import Confirm from "@/components/Confirm";
import { deleteQr, fetchDashboard } from "@/utils/apiHandlers";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { IoMdCreate, IoMdShare, IoMdTrash } from "react-icons/io";
import QRCodeStyling from "qr-code-styling";
import { motion } from "framer-motion";

const Dashboard: React.FC = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedQr, setSelectedQr] = useState<any>(null);
    const [recentActivities, setRecentActivities] = useState<any[]>([]);
    const qrCodeRefs = useRef<Array<HTMLDivElement | null>>([]);
    const [selectedQRCode, setSelectedQRCode] = useState<any>(null);

    const didFetchRef = useRef(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetchDashboard();
                setDashboardData(response?.dashboardData);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (didFetchRef.current) return;
        didFetchRef.current = true;
        fetchDashboardData();
    }, []);

    useEffect(() => {
        if (dashboardData?.qrCodes?.length > 0) {
            dashboardData.qrCodes.forEach((qrCode: any, index: number) => {
                const qrCodeInstance = new QRCodeStyling({
                    ...qrCode.qrOptions,
                    width: 100,
                    height: 100,
                });

                if (qrCodeRefs.current[index]) {
                    qrCodeInstance.append(qrCodeRefs.current[index]);
                }
                return () => {
                    if (qrCodeRefs.current[index]) {
                        qrCodeRefs.current[index]!.innerHTML = ""; // Clear the QR code DOM element
                    }
                };
            });
        }
        return () => {
            qrCodeRefs.current.forEach((ref) => {
                if (ref) {
                    ref.innerHTML = ""; // Clear the QR code from the DOM
                }
            });
        };
    }, [dashboardData]);

    const handleDelete = async (qrCode: any) => {
        try {
            console.log("Before deletion:", dashboardData.qrCodes);

            // Call the deleteQr function and pass the QR code ID
            const response = await deleteQr(qrCode._id);
            console.log("response delete : ", response)

            if (response?.success) {
                // Update state to remove the QR code from the list
                setDashboardData((prevData: any) => {
                    const updatedQrCodes = prevData.qrCodes.filter(
                        (item: any) => item._id !== qrCode._id
                    );
                    return { ...prevData, qrCodes: updatedQrCodes };
                });

                // Add the recent activity message
                setRecentActivities((prev) => [
                    ...prev,
                    { message: `Deleted QR Code: ${qrCode.title || "Untitled"}`, time: "Just now" },
                ]);

                // Close dropdown or reset selected QR code
                setSelectedQRCode(null);
            } else {
                console.error("Failed to delete QR code:", response?.message);
            }
        } catch (error) {
            console.error("Error deleting QR code:", error);
        }
    };


    const handleEdit = (qrCode: any) => {
        router.push(`/edit/${qrCode._id}`);
    };

    const handleViewDetails = (qrCode: any) => {
        router.push(`/details/${qrCode._id}`);
    };


    const handleShare = (qrCode: any) => {
        const shareUrl = qrCode?.targetUrl;
        if (navigator.share) {
            navigator
                .share({
                    title: "QR Code",
                    url: shareUrl,
                })
                .then(() => console.log("Shared successfully"))
                .catch((error) => console.error("Error sharing:", error));
        } else {
            // Fallback logic for unsupported browsers
            navigator?.clipboard?.writeText(shareUrl.toString());
            alert("URL copied to clipboard!");
        }
        setSelectedQRCode(null); // Close dropdown
    };

    const confirmDelete = () => {
        if (selectedQr) {
            setDashboardData((prevData: any) => ({
                ...prevData,
                qrCodes: prevData.qrCodes.filter(
                    (qrCode: any) => qrCode._id !== selectedQr._id
                ),
            }));
            setRecentActivities((prev) => [
                ...prev,
                { message: `Deleted QR Code: ${selectedQr.title || "Untitled"}`, time: "Just now" },
            ]);
        }
        setShowConfirm(false);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="min-h-screen relative bg-gray-100">
            <Header />
            <IoMdCreate
                onClick={() => router.push("/new")}
                className="fixed bottom-10 shadow-xl bg-white/50 backdrop-blur-sm rounded-full p-2 box-content right-4 text-3xl border border-blue-500 text-blue-500 cursor-pointer"
            />
            <main className="p-4 lg:p-8">
                {/* Welcome Section */}
                <section className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Welcome, {session?.user?.name ||
                            session?.user?.email
                                ?.split("@")[0]
                                .replace(/\d+/g, "") ||
                            "User"}
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Here's an overview of your QR Generator app.
                    </p>
                </section>

                {/* QR Codes Section */}
                <section className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {dashboardData.qrCodes.map((qrCode: any, index: number) => (
                        <div
                            key={qrCode._id}
                            className="bg-white shadow-md rounded-lg p-1 flex hover:shadow-lg transition-shadow duration-200 relative"
                        >
                            {/* QR Code on the Left */}
                            <div
                                ref={(el: any) => (qrCodeRefs.current[index] = el)}
                                className="qr-code-container flex-shrink-0"
                                style={{
                                    width: "100px",
                                    height: "100px",
                                }}
                            ></div>

                            {/* Details on the Right */}
                            <section className="ml-4 flex flex-col justify-center w-full">
                                {qrCode.showTitle && (
                                    <h3 className="text-sm font-medium text-gray-800 mb-1">
                                        title: {qrCode.title}
                                    </h3>
                                )}
                                <p className="text-gray-600 text-sm">Scans: {qrCode.scanCount}</p>
                                <p className="text-sm text-gray-500 truncate">
                                    Target URL:{" "}
                                    <a
                                        href={qrCode?.targetUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline"
                                    >
                                        {qrCode?.targetUrl || ""}
                                    </a>
                                </p>
                            </section>

                            {/* MoreVert Icon with Dropdown */}
                            <div className="absolute top-4 right-4">
                                <motion.button
                                    onClick={() =>
                                        setSelectedQRCode(
                                            selectedQRCode?._id === qrCode._id ? null : qrCode
                                        )
                                    } // Toggle dropdown
                                    className="text-gray-500 hover:text-gray-800"
                                >
                                    ⋮
                                </motion.button>
                                {selectedQRCode && selectedQRCode._id === qrCode._id && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded-lg z-10">
                                        <button
                                            onClick={() => handleShare(selectedQRCode)}
                                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                        >
                                            <IoMdShare className="text-lg" />
                                            <span>Share</span>
                                        </button>

                                        <button
                                            onClick={() => handleDelete(selectedQRCode)}
                                            className="w-full px-4 py-2 text-left text-red-500 hover:bg-red-100 flex items-center space-x-2"
                                        >
                                            <IoMdTrash className="text-lg" />
                                            <span>Delete</span>
                                        </button>
                                        {/* <button
                                            onClick={() => console.log("Edit clicked")}
                                            className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => console.log("View clicked")}
                                            className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                                        >
                                            View Details
                                        </button> */}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </section>


                {/* Recent Activity Section */}
                <section className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Recent Activity
                    </h2>
                    <ul className="space-y-4">
                        {recentActivities.map((activity, index) => (
                            <li
                                key={index}
                                className="bg-white shadow-md rounded-lg p-4"
                            >
                                <p className="text-gray-800 font-medium">
                                    {activity.message}
                                </p>
                                <p className="text-gray-600 text-sm">
                                    {activity.time}
                                </p>
                            </li>
                        ))}
                    </ul>
                </section>
            </main>

            {/* Confirmation Dialog */}
            <Confirm
                isOpen={showConfirm}
                onConfirm={confirmDelete}
                onCancel={() => setShowConfirm(false)}
                message={`Are you sure you want to delete the QR Code "${selectedQr?.title || "Untitled"}"?`}
            />
        </div>
    );
};

export default Dashboard;
