import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);

	const [callAccepted, setCallAccepted] = useState(false);
	const [callEnded, setCallEnded] = useState(false);
	const [stream, setStream] = useState();
	const [call, setCall] = useState({});
	const myVideo = useRef();
	const userVideo = useRef();
	const connectionRef = useRef();

	const [ receivingCall, setReceivingCall ] = useState(false)
	const [ caller, setCaller ] = useState("")
	const [ name, setName ] = useState("")
	const [ callerSignal, setCallerSignal ] = useState()

	useEffect(() => {
		const newSocket = io("http://localhost:5000");
		setSocket(newSocket);

		return () => {
			newSocket.disconnect();
		};
	}, []);

	return (
		<SocketContext.Provider
			value={{
				socket,
				callAccepted,
				setCallAccepted,
				callEnded,
				setCallEnded,
				stream,
				setStream,
				call,
				setCall,
				myVideo,
				userVideo,
				connectionRef,
				receivingCall,
				setReceivingCall,
				caller,
				setCaller,
				name,
				setName,
				callerSignal,
				setCallerSignal
			}}
		>
			{children}
		</SocketContext.Provider>
	);
};
