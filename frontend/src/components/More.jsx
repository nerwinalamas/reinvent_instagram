import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Bookmark, Compass, Home, LogOut, Moon, Sun } from "lucide-react";
import { setTheme } from "../_actions/themeAction";

const More = () => {
	const user = useSelector((state) => state.userReducer.user);
	const [isOpen, setIsOpen] = useState(false);
	const theme = useSelector((state) => state.themeReducer.theme);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	};

	const handleItemClick = () => {
		setIsOpen(false);
	};

	const toggleTheme = () => {
		const newTheme = theme === "dark" ? "light" : "dark";
		dispatch(setTheme(newTheme));
		localStorage.setItem("theme", newTheme);
	};

	return (
		<div className="dropdown dropdown-bottom dropdown-end cursor-pointer">
			{user.profilePicture ? (
				<div
					onClick={() => setIsOpen((prev) => !prev)}
					tabIndex={0}
					className="w-11 h-11 rounded-full flex flex-col bg-customBlack items-center justify-center"
				>
					<img
						src={user.profilePicture}
						alt={user.firstName + " Photo"}
						className="w-full h-full rounded-full object-contain"
					/>
				</div>
			) : (
				<div
					onClick={() => setIsOpen((prev) => !prev)}
					tabIndex={0}
					className="w-11 h-11 rounded-full bg-customWhite text-customBlack flex items-center justify-center"
				>
					<p className="capitalize font-bold text-xl">
						{user.firstName && user.firstName.charAt(0)}
					</p>
				</div>
			)}
			{isOpen && (
				<ul
					tabIndex={0}
					className={`dropdown-content border z-[1] menu m-3 p-2 shadow rounded-box w-96 h-[600px] ${
						theme === "dark" ? "bg-customGray" : "bg-slate-100"
					}`}
				>
					<li>
						<Link
							to="/"
							onClick={handleItemClick}
							className="flex gap-5"
						>
							<div className="w-11 h-11 rounded-full bg-customWhite text-customBlack flex items-center justify-center">
								<Home className="cursor-pointer" />
							</div>
							Home
						</Link>
					</li>
					<li>
						<Link
							to={`/profile/${user._id}`}
							onClick={handleItemClick}
							className="flex gap-5"
						>
							{user.profilePicture ? (
								<div
									onClick={() => setIsOpen((prev) => !prev)}
									tabIndex={0}
									className="w-11 h-11 rounded-full flex flex-col bg-customBlack items-center justify-center"
								>
									<img
										src={user.profilePicture}
										alt={user.firstName + " Photo"}
										className="w-full h-full rounded-full object-contain"
									/>
								</div>
							) : (
								<div
									onClick={() => setIsOpen((prev) => !prev)}
									tabIndex={0}
									className="w-11 h-11 rounded-full bg-customWhite text-customBlack flex items-center justify-center"
								>
									<p className="capitalize font-bold text-xl">
										{user.firstName &&
											user.firstName.charAt(0)}
									</p>
								</div>
							)}
							Profile
						</Link>
					</li>
					<li>
						<Link
							to="/explore"
							onClick={handleItemClick}
							className="flex gap-5"
						>
							<div className="w-11 h-11 rounded-full bg-customWhite text-customBlack flex items-center justify-center">
								<Compass className="cursor-pointer" />
							</div>
							Explore
						</Link>
					</li>
					<li>
						<Link
							to="/posts/saved"
							onClick={handleItemClick}
							className="flex gap-5"
						>
							<div className="w-11 h-11 rounded-full bg-customWhite text-customBlack flex items-center justify-center">
								<Bookmark className="cursor-pointer" />
							</div>
							Saved Posts
						</Link>
					</li>
					<li
						onClick={() => {
							handleItemClick();
							toggleTheme();
						}}
					>
						<a className="flex gap-5">
							<div className="w-11 h-11 rounded-full bg-customWhite text-customBlack flex items-center justify-center">
								{theme === "dark" ? (
									<Sun className="cursor-pointer" />
								) : (
									<Moon className="cursor-pointer" />
								)}
							</div>
							Change theme to{" "}
							{theme === "dark" ? "Light Mode" : "Dark mode"}
						</a>
					</li>
					<li
						onClick={() => {
							handleLogout();
							handleItemClick();
						}}
					>
						<a className="flex gap-5">
							<div className="w-11 h-11 rounded-full bg-customWhite text-customBlack flex items-center justify-center">
								<LogOut className="cursor-pointer" />
							</div>
							Logout
						</a>
					</li>
				</ul>
			)}
		</div>
	);
};

export default More;
