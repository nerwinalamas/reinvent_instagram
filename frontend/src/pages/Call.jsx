import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import CallControls from "../components/CallControls";
import CallUser from "../components/CallUser";
import axios from "axios";
import * as process from "process";

window.global = window;
window.process = process;
window.Buffer = [];

const Call = () => {
	const { id } = useParams();
	const [user, setUser] = useState({});

	const [toggleVideo, setToggleVideo] = useState(false);
	const [toggleAudio, setToggleAudio] = useState(true);

	const {
		socket,
		userVideo,
		setStream,
		myVideo,
		setCaller,
		setReceivingCall,
		setName,
		setCallerSignal,
		receivingCall,
		callAccepted,
		stream,
		callEnded,
	} = useSocket();

	const getUser = async (id) => {
		try {
			const response = await axios.get(
				`http://localhost:5000/user/${id}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
				}
			);
			console.log("response sa call page: ", response);
			setUser(response.data.data);
		} catch (error) {
			console.log("Call page get user error: ", error);
		}
	};

	useEffect(() => {
		getUser(id);
	}, []);

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

	return (
		<div className="w-full h-[89vh] flex flex-col items-center justify-center relative pb-40 lg:flex-row lg:gap-10">
			{/* OTHER USER CAMERA */}
			{callAccepted && !callEnded && (
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
			{receivingCall && callAccepted && !callEnded && (
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
			{receivingCall && !callAccepted && <CallUser user={user} action="Calling..." />}

			{callEnded && callAccepted && <CallUser user={user} action="Call Ended" />}

			{receivingCall && !callEnded && <CallControls
				toggleAudio={toggleAudio}
				setToggleAudio={setToggleAudio}
				toggleVideo={toggleVideo}
				setToggleVideo={setToggleVideo}
			/>}
		</div>
	);
};

export default Call;
