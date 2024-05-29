import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat } from "../_actions/convoAction";
import { getChatmates } from "../api/message";
import { useQuery } from "@tanstack/react-query";

const ChatHeads = () => {
	const theme = useSelector((state) => state.themeReducer.theme);
	const dispatch = useDispatch();

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["conversation"],
		queryFn: getChatmates,
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
						data.map((follow) => (
							<div
								onClick={() =>
									dispatch(setSelectedChat(follow))
								}
								key={follow._id}
								className="flex items-center gap-5 cursor-pointer p-2 hover:bg-slate-100 hover:bg-opacity-40 rounded-md"
							>
								{follow.profilePicture ? (
									<div className="w-11 h-11 rounded-full flex flex-col bg-customBlack items-center justify-center">
										<img
											src={follow.profilePicture}
											alt={follow.firstName + " Photo"}
											className="w-full h-full rounded-full object-contain"
										/>
									</div>
								) : (
									<div className="w-11 h-11 rounded-full bg-customWhite text-customBlack flex items-center justify-center">
										<p className="capitalize font-bold text-xl">
											{follow.firstName &&
												follow.firstName.charAt(0)}
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
						data.map((follow) => (
							<div
								onClick={() =>
									dispatch(setSelectedChat(follow))
								}
								key={follow._id}
								className={`flex items-center gap-5 cursor-pointer p-2 hover:bg-opacity-40 rounded-md ${
									theme === "dark"
										? "hover:bg-slate-100"
										: "hover:bg-slate-300"
								}`}
							>
								{follow.profilePicture ? (
									<div className="w-11 h-11 rounded-full flex flex-col bg-customBlack items-center justify-center">
										<img
											src={follow.profilePicture}
											alt={follow.firstName + " Photo"}
											className="w-full h-full rounded-full object-contain"
										/>
									</div>
								) : (
									<div className="w-11 h-11 rounded-full bg-customWhite text-customBlack flex items-center justify-center">
										<p className="capitalize font-bold text-xl">
											{follow.firstName &&
												follow.firstName.charAt(0)}
										</p>
									</div>
								)}
								<p className="text-sm capitalize">
									{follow.firstName} {follow.lastName}
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
