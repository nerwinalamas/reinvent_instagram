import { getChatmates } from "../api/message";
import { useQuery } from "@tanstack/react-query";
import useAuthStore from "../store/useAuth";
import useThemeStore from "../store/useTheme";
import useChatStore from "../store/useChat";

const ChatHeads = () => {
    const { token } = useAuthStore();
    const { theme } = useThemeStore();
    const { setChat } = useChatStore();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["conversation", token],
        queryFn: () => getChatmates(token),
        enabled: !!token,
    });

    return (
        <>
            {/* LEFT SIDE - MOBILE VIEW */}
            {/* CHAT HEADS - MOBILE VIEW */}
            <div
                className={`h-full flex flex-col gap-2 p-2 rounded-md md:hidden ${
                    theme === "dark" ? "bg-customGray" : "bg-slate-100"
                }`}
            >
                <div className="h-full overflow-y-auto flex flex-col gap-3">
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : isError ? (
                        <p>Error: {error}</p>
                    ) : (
                        data.length > 0 &&
                        data.map((chatItem) => (
                            <div
                                onClick={() => {
                                    setChat(chatItem);
                                }}
                                key={chatItem._id}
                                className="flex items-center gap-5 cursor-pointer p-2 hover:bg-slate-100 hover:bg-opacity-40 rounded-md"
                            >
                                {chatItem.profilePicture ? (
                                    <div className="w-11 h-11 rounded-full flex flex-col bg-customBlack items-center justify-center">
                                        <img
                                            src={chatItem.profilePicture}
                                            alt={chatItem.firstName + " Photo"}
                                            className="w-full h-full rounded-full object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-11 h-11 rounded-full bg-customWhite text-customBlack flex items-center justify-center">
                                        <p className="capitalize font-bold text-xl">
                                            {chatItem.firstName &&
                                                chatItem.firstName.charAt(0)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* LEFT SIDE - TABLET AND DESKTOP VIEW */}
            {/* CHAT HEADS WITH NAME - TABLET AND DESKTOP VIEW */}
            <div
                className={`hidden md:h-[89vh] md:w-64 md:flex md:flex-col md:gap-5 md:p-5 md:rounded-md xl:w-80 xl:h-[650px] xl:gap-3 ${
                    theme === "dark" ? "md:bg-customGray" : "md:bg-slate-100"
                } `}
            >
                <h3 className="text-lg font-bold">Messages</h3>
                <div className="h-full overflow-y-auto flex flex-col gap-5 xl:gap-2">
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : isError ? (
                        <p>Error: {error}</p>
                    ) : (
                        data &&
                        data.length > 0 &&
                        data.map((chatItem) => (
                            <div
                                onClick={() => {
                                    setChat(chatItem);
                                }}
                                key={chatItem._id}
                                className={`flex items-center gap-5 cursor-pointer p-2 hover:bg-opacity-40 rounded-md ${
                                    theme === "dark"
                                        ? "hover:bg-slate-100"
                                        : "hover:bg-slate-300"
                                }`}
                            >
                                {chatItem.profilePicture ? (
                                    <div className="w-11 h-11 rounded-full flex flex-col bg-customBlack items-center justify-center">
                                        <img
                                            src={chatItem.profilePicture}
                                            alt={chatItem.firstName + " Photo"}
                                            className="w-full h-full rounded-full object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-11 h-11 rounded-full bg-customWhite text-customBlack flex items-center justify-center">
                                        <p className="capitalize font-bold text-xl">
                                            {chatItem.firstName &&
                                                chatItem.firstName.charAt(0)}
                                        </p>
                                    </div>
                                )}
                                <p className="text-sm capitalize">
                                    {chatItem && chatItem.firstName} {chatItem && chatItem.lastName}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default ChatHeads;
