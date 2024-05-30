import { Link } from "react-router-dom";
import useThemeStore from "../store/useTheme";
import useUserProfileStore from "../store/useUserProfileStore";

const FollowingModal = () => {
	const { otherUser } = useUserProfileStore();
	const { theme } = useThemeStore();

	return (
		<dialog id="following_modal" className="modal">
			<div
				className={`modal-box ${
					theme === "dark" ? "bg-customGray" : "bg-customWhite"
				}`}
			>
				<h2 className="text-center font-semibold text-xl">Following</h2>
				<div className="max-h-96 min-h-96 overflow-y-auto flex flex-col gap-3 items-center mt-3 xl:gap-0">
					{otherUser && otherUser.following && otherUser.following.length > 0 ? (
						otherUser.following.map((user) => (
							<div
								key={user._id}
								className={`w-full flex items-center gap-5 rounded-lg py-3 px-5 xl:mb-3 ${
									theme === "dark"
										? "bg-gray-800"
										: "bg-slate-200"
								}`}
							>
								<Link to={`/profile/${user._id}`}>
									{user.profilePicture ? (
										<div className="w-11 h-11 rounded-full flex flex-col bg-customBlack items-center justify-center">
											<img
												src={user.profilePicture}
												alt={user.firstName + " Photo"}
												className="w-full h-full rounded-full object-contain"
											/>
										</div>
									) : (
										<div className="w-11 h-11 rounded-full bg-customWhite text-customBlack flex items-center justify-center">
											<p className="capitalize font-bold text-xl">
												{user.firstName &&
													user.firstName.charAt(0)}
											</p>
										</div>
									)}
								</Link>
								<div className="flex flex-col gap-1 text-sm">
									<Link to={`/profile/${user._id}`}>
										<p className="capitalize hover:underline font-medium">
											{user.firstName} {user.lastName}
										</p>
									</Link>
									<p
										className={` text-xs ${
											theme === "dark"
												? "text-slate-400"
												: "text-customBlack"
										}`}
									>
										{user.userName}
									</p>
								</div>
							</div>
						))
					) : (
						<p>No following</p>
					)}
				</div>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>
	);
};

export default FollowingModal;
