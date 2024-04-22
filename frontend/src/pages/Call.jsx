import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import * as process from "process";

window.global = window;
window.process = process;
window.Buffer = [];

import SampleImg from "../assets/images/user.jpg";
import axios from "axios";

const Call = () => {
	const { id } = useParams()
	const [user, setUser] = useState({})

	const [toggleVideo, setToggleVideo] = useState(false);
	const [toggleAudio, setToggleAudio] = useState(true);
	const [autoPlay, setAutoPlay] = useState(true);
	const navigate = useNavigate();
	const {
		socket,
		connectionRef,
		// setCall,
		userVideo,
		setStream,
		myVideo,
		setCallEnded,
		setCaller,
		setReceivingCall,
		setName,
		setCallerSignal,
		receivingCall,
		callAccepted,
		stream,
	} = useSocket();

	const getUser = async (id) => { 
		try {
			const response = await axios.get(`http://localhost:5000/user/${id}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem(
						"token"
					)}`,
				},
			})
			console.log("response sa call page: ", response)
			setUser(response.data.data)
		} catch (error) {
			console.log("Call page get user error: ", error);
		}
	}

	useEffect(() => {
		getUser(id);
	}, [])

	const handleVideo = () => {
		const newToggleState = !toggleVideo;
		setToggleVideo(newToggleState);
		socket.emit("camera_state_change", newToggleState);

		if (myVideo.current) {
			myVideo.current.srcObject = toggleVideo ? null : stream;
		}
	};

	useEffect(() => {
		socket.on("camera_state_change", (data) => {
			if (data.userId !== socket.id) {
				setToggleVideo(data.newState);
			}
		});

		return () => {
			socket.off("camera_state_change");
		};
	}, [socket]);

	const handleAudio = () => {
		setToggleAudio((prev) => !prev);
	};

	const handleEndCall = () => {
		setCallEnded(true);
		connectionRef.current.destroy();
		navigate("/");
		setInterval(() => {
			window.location.reload();
		}, 1000);
	};

	useEffect(() => {
		if (stream && myVideo.current && userVideo.current) {
			myVideo.current.srcObject = toggleVideo ? stream : null;
			userVideo.current.srcObject = stream;
		}
	}, [stream, toggleVideo]);

	useEffect(() => {
		const initMediaStream = async () => {
			try {
				const currentStream = await navigator.mediaDevices.getUserMedia(
					{ video: true, audio: true }
				);
				setStream(currentStream);
				myVideo.current.srcObject = currentStream;
			} catch (error) {
				console.error("Error accessing media devices:", error);
			}
		};

		initMediaStream();

		socket.on("callUser", (data) => {
			setReceivingCall(true);
			setCaller(data.from);
			setName(data.name);
			setCallerSignal(data.signal);
		});

		return () => {
			if (stream) {
				stream.getTracks().forEach((track) => track.stop());
			}
		};
	}, []);

	// console.log("stream: ", stream);
	// console.log("receivingCall: ", receivingCall);
	// console.log("callAccepted: ", callAccepted);
	// console.log("myVideo: ", myVideo);

	// console.log("myVideo.current: ", myVideo.current);
	// console.log("userVideo.current", userVideo.current);

	return (
		<div className="w-full h-[89vh] flex flex-col items-center justify-center relative pb-40 lg:flex-row lg:gap-10">
			{/* OTHER USER CAMERA */}
			{callAccepted && (
				<div className="w-full flex items-center justify-center lg:w-96 lg:rounded-lg bg-customGray">
					<video
						playsInline
						muted={toggleAudio}
						ref={userVideo}
						autoPlay
						className="w-full h-full object-contain"
					/>
				</div>
			)}

			{/* LOGGED IN USER CAMERA */}
			{receivingCall && callAccepted && (
				<>
					{toggleVideo ? (
						<div className="absolute right-2 top-2 w-32 h-44 bg-customGray flex items-center justify-center md:w-48 md:h-60 md:right-5 md:top-5 lg:w-96 lg:h-72 lg:rounded-lg lg:static ">
							<video
								playsInline
								muted={toggleAudio}
								ref={myVideo}
								autoPlay
								className="w-full h-full object-contain"
							/>
						</div>
					) : (
						<div className="absolute right-2 top-2 w-32 h-44 bg-customGray flex items-center justify-center md:w-48 md:h-60 md:right-5 md:top-5 lg:w-96 lg:h-72 lg:rounded-lg lg:static ">
							Camera Off
						</div>
					)}
				</>
			)}

			{/*INCOMMING CALL NOT ACCEPTED YET */}
			{receivingCall && !callAccepted && (
				<div className="w-80 flex flex-col items-center justify-center gap-4">
					{/* <div className="w-24 h-24 rounded-full flex flex-col bg-customBlack items-center justify-center">
						<img
							src={`http://localhost:5000/uploads/${user.profilePicture}`}
							alt={user.firstName + " photo"}
							className="w-full h-full rounded-full object-contain"
						/>
					</div> */}
					<div
						className={`w-32 h-32 rounded-full flex  items-center justify-center relative ${
							user.profilePicture
								? "bg-customBlack"
								: "bg-customWhite text-customBlack "
						}`}
					>
						{user.profilePicture ? (
							<img
								src={`http://localhost:5000/uploads/${user.profilePicture}`}
								alt=""
								className="w-full h-full rounded-full object-contain"
							/>
						) : (
							<p className="capitalize font-semibold text-5xl">
								{user.firstName && user.firstName.charAt(0)}
							</p>
						)}
					</div>
					<div className="text-center">
						<h2 className="capitalize">{user.firstName} {user.lastName}</h2>
						<p>Calling...</p>
					</div>
				</div>
			)}

			<div className="absolute bottom-10 p-2 w-80 flex items-center justify-evenly rounded-full bg-customGray">
				{toggleVideo ? (
					<Video
						title="Video"
						onClick={handleVideo}
						className="cursor-pointer"
					/>
				) : (
					<VideoOff
						title="Video"
						onClick={handleVideo}
						className="cursor-pointer"
					/>
				)}
				{toggleAudio ? (
					<MicOff
						title="Mic"
						onClick={handleAudio}
						className="cursor-pointer"
					/>
				) : (
					<Mic
						title="Mic"
						onClick={handleAudio}
						className="cursor-pointer"
					/>
				)}

				<div
					onClick={handleEndCall}
					title="End Call"
					className="w-11 h-11 p-3 flex items-center justify-center rounded-full cursor-pointer bg-red-600"
				>
					<PhoneOff />
				</div>
			</div>
		</div>
	);
};

export default Call;
