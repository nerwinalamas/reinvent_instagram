import React from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

const CallUser = ({ user, action }) => {
	const { callEnded } = useSocket();
    const navigate = useNavigate();

    const handleNavigate = () => { 
        navigate("/");
        setInterval(() => {
            window.location.reload();
        }, 1000);
    }

	return (
		<div className="w-80 flex flex-col items-center justify-center gap-4">
			<div
				className={`w-32 h-32 rounded-full flex  items-center justify-center relative ${
					user?.profilePicture
						? "bg-customBlack"
						: "bg-customWhite text-customBlack "
				}`}
			>
				{user?.profilePicture ? (
					<img
						src={`http://localhost:5000/uploads/${user?.profilePicture}`}
						alt=""
						className="w-full h-full rounded-full object-contain"
					/>
				) : (
					<p className="capitalize font-semibold text-5xl">
						{user?.firstName.charAt(0)}
					</p>
				)}
			</div>
			<div className="text-center">
				<h2 className="capitalize">
					{user?.firstName} {user?.lastName}
				</h2>
				<p>{action}</p>
			</div>
			{callEnded && (
				<button
					className="px-5 py-2 rounded-full font-semibold cursor-pointer bg-green-500"
                    onClick={handleNavigate}
				>
					Go to home
				</button>
			)}
		</div>
	);
};

export default CallUser;
