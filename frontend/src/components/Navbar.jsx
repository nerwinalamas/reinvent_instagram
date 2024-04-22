import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import CreatePost from "./CreatePost";
import More from "./More";

import { Bell, Menu, MessageCircleMore, Plus, Search } from "lucide-react";
import axios from "axios";
import { setSearchResults } from "../_actions/searchAction";

const Navbar = () => {
	const user = useSelector((state) => state.userReducer.user);
	const [isOpen, setIsOpen] = useState(false);
	const [isSearching, setIsSearching] = useState("")
	const theme = useSelector((state) => state.themeReducer.theme)

	const navigate = useNavigate();
	const dispatch = useDispatch()

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	};

	const handleItemClick = () => {
		setIsOpen(!isOpen);
	};

	const handleSubmit = async (e) => { 
		e.preventDefault()

		if (!isSearching) return

		try {
			const response = await axios.get(`http://localhost:5000/search/users?query=${isSearching}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			})
			if (response) {
				dispatch(setSearchResults(response.data.data))
				navigate(`/search/${isSearching}`);
				setIsSearching("");
			}
		} catch (error) {
			console.log("Search Error: ", error);
		}
	}

	return (
		<nav className="flex items-center justify-between p-5 md:px-10 md:py-7 xl:px-10 xl:max-w-screen-2xl xl:mx-auto">
			{/* LOGO */}
			<Link to="/">
				<h1 className="text-2xl font-semibold">Instagram</h1>
			</Link>

			{/* HAMBURGER ICON - MOBILE VIEW */}
			<div className="flex items-center justify-center md:hidden">
				<div className="drawer drawer-end">
					<input
						id="my-drawer-4"
						type="checkbox"
						className="drawer-toggle"
						onClick={() => setIsOpen(true)}
					/>
					<div
						className="drawer-content"
					>
						<label htmlFor="my-drawer-4" className="drawer-button">
							<Menu />
						</label>
					</div>
					{isOpen && (
						<div className="drawer-side z-10">
							<label
								htmlFor="my-drawer-4"
								aria-label="close sidebar"
								className="drawer-overlay"
							></label>
							<ul className="menu p-4 w-80 min-h-full bg-customBlack text-customWhite flex flex-col gap-3 items-center justify-center text-base">
								<Link to="/" onClick={() => {
									handleItemClick()
									console.log("item click")
								}}>
									<li>
										<a>Home</a>
									</li>
								</Link>
								{/* <li>
								<a>Search</a>
							</li> */}
								<Link to="/explore" onClick={handleItemClick}>
									<li>
										<a>Explore</a>
									</li>
								</Link>
								<Link to="/posts/saved" onClick={handleItemClick}>
									<li>
										<a>Saved Posts</a>
									</li>
								</Link>
								{/* <Link to="/reels" onClick={handleItemClick}>
									<li>
										<a>Reels</a>
									</li>
								</Link> */}
								<Link to="/messages" onClick={handleItemClick}>
									<li>
										<a>Messages</a>
									</li>
								</Link>
								{/* <li>
								<a>Notifications</a>
							</li> */}
								{/* <li>
								<a>Create</a>
							</li> */}
								<Link
									to={`/profile/${user._id}`}
									onClick={handleItemClick}
								>
									<li>
										<a>Profile</a>
									</li>
								</Link>
								<li onClick={handleItemClick}>
									<a>Light Mode</a>
								</li>
								<li
									onClick={() => {
										handleLogout();
										handleItemClick();
									}}
								>
									<a>Logout</a>
								</li>
							</ul>
						</div>
					)}
				</div>
			</div>

			{/* SEARCH */}
			<form onSubmit={handleSubmit} className="hidden xl:flex xl:relative">
				<input
					type="text"
					name="search"
					id="search"
					value={isSearching}
					onChange={e => setIsSearching(e.target.value)}
					className={`w-96 pl-12 pr-2 py-3 rounded-lg border-2 outline-none bg-customWhite text-customBlack`}
				/>
				<Search className="absolute top-3 left-3 text-customBlack" />
			</form>

			{/* NAV ICONS - TABLET & DESKTOP VIEW*/}
			<div className="hidden md:flex md:gap-5 md:items-center">
				<div className="w-11 h-11 rounded-full bg-customWhite text-customBlack flex items-center justify-center">
					<Plus
						className="cursor-pointer"
						title="Create Post"
						onClick={() =>
							document.getElementById("my_modal_3").showModal()
						}
					/>
					<CreatePost />
				</div>

				<div className="dropdown dropdown-bottom dropdown-end cursor-pointer">
					<div
						tabIndex={0}
						className="w-11 h-11 rounded-full bg-customWhite text-customBlack flex items-center justify-center"
					>
						<Bell className="cursor-pointer" />
					</div>
					<div
						tabIndex={0}
						className={`dropdown-content border z-[1] menu m-3 p-2 shadow rounded-box w-96 h-[600px] FLEX items-center justify-center  ${theme === "dark" ? "bg-customGray" : "bg-customWhite"}`}
					>
						<h3>Notifications</h3>
					</div>
				</div>
				<Link
					to="/messages"
					className="w-11 h-11 rounded-full bg-customWhite text-customBlack flex items-center justify-center"
				>
					<MessageCircleMore />
				</Link>
				<More />
			</div>
		</nav>
	);
};

export default Navbar;
