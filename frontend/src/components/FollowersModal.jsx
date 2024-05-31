import { Link, useParams } from "react-router-dom";
import useThemeStore from "../store/useTheme";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../api/user";
import useAuthStore from "../store/useAuth";

const FollowersModal = () => {
	const { id } = useParams();
	const { token } = useAuthStore();
	const { theme } = useThemeStore();

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["user", id, token],
		queryFn: () => getUser(id, token),
		enabled: !!id && !!token,
	});

	return (
		<dialog id="followers_modal" className="modal">
			<div
				className={`modal-box ${
					theme === "dark" ? "bg-customGray" : "bg-customWhite"
				}`}
			>
				<h2 className="text-center font-semibold text-xl">Followers</h2>
				<div className="max-h-96 min-h-96 overflow-y-auto flex flex-col gap-3 items-center mt-3 xl:gap-0">
					{isLoading ? (
						<p>Loading...</p>
					) : isError ? (
						<p>Error: {error}</p>
					) : data && data.followers.length > 0 ? (
						data.followers.map((user) => (
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
						<p>No followers</p>
					)}
				</div>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>
	);
};

export default FollowersModal;
