import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import Peer from "simple-peer";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { getConversation } from "../api/message";
import useAuthStore from "../store/useAuth";
import useChatStore from "../store/useChat";

const MessageSection = () => {
    const { token, user } = useAuthStore();
    const { chat } = useChatStore();

    let userId = chat && chat._id
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["conversation", userId, token],
        queryFn: () => getConversation(userId, token),
        enabled: !!userId && !!token,
    });

    const navigate = useNavigate();

    const {
        socket,
        connectionRef,
        userVideo,
        stream,
        setCallAccepted,
        caller,
        callerSignal,
        receivingCall,
        callAccepted,
        callEnded,
    } = useSocket();

    const containerRef = useRef(null);

    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        if (socket) {
            socket.on("mensahe", async (data) => {
                try {
                    await refetch();
                } catch (error) {
                    console.log("Error Refetching Conversation: ", error);
                }
            });
        }

        return () => {
            if (socket) {
                socket.off("mensahe");
            }
        };
    }, [refetch, user && user._id, socket]);

    useEffect(() => {
        if (data && data?.messages) {
            scrollToBottom();
        }
    }, [data && data?.messages, receivingCall]);

    const answerCall = (id) => {
        setCallAccepted(true);
        const peer = new Peer({ initiator: false, trickle: false, stream });
        peer.on("signal", (data) => {
            socket.emit("answerCall", { signal: data, to: caller });
        });
        peer.on("stream", (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });
        peer.signal(callerSignal);
        connectionRef.current = peer;
        navigate(`/calling/${id}`);
    };

    return (
        <div
            ref={containerRef}
            className="h-[53vh] md:h-[670px] xl:h-[85%] overflow-y-auto px-1 pt-2 mt-2 md:mt-3 flex flex-col gap-2"
        >
            {isLoading ? (
                <p>Loading...</p>
            ) : isError ? (
                <p>Error: {error}</p>
            ) : data && data.messages.length > 0 ? (
                data.messages.map((convo) => (
                    <div
                        key={convo._id}
                        className={`chat ${
                            convo.messageBy !== user._id
                                ? "chat-start"
                                : "chat-end"
                        }`}
                    >
                        <div
                            className={`chat-bubble flex flex-col gap-1 text-sm xl:text-sm ${
                                convo.messageBy === user._id
                                    ? "chat-bubble-info"
                                    : ""
                            }`}
                        >
                            {convo.message}
                            <time className="text-xs opacity-50 xl:text-xs">
                                {moment(convo.createdAt).fromNow()}
                            </time>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center">No message yet</p>
            )}
            {receivingCall && !callAccepted && !callEnded ? (
                <div className="flex flex-col justify-center gap-2 mt-2">
                    <h1 className="text-sm lg:text-base">
                        {/* changes */}
                        <span className="capitalize">
                            {chat.firstName}
                        </span>{" "}
                        is calling...
                    </h1>
                    <button
                        onClick={() => answerCall(chat._id)}
                        className="w-max rounded-md bg-green-500 text-customWhite p-2"
                    >
                        Answer
                    </button>
                </div>
            ) : null}
        </div>
    );
};

export default MessageSection;
