import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Outlet,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Explore from "./pages/Explore";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Reels from "./pages/Reels";
import UpdatePost from "./pages/UpdatePost";
import UploadProfilePic from "./pages/UploadProfilePic";
import Call from "./pages/Call";
import SavedPost from "./pages/SavedPost";
import SearchResult from "./pages/SearchResult";
import { useSelector } from "react-redux";

const AppLayout = () => {
	return (
		<div>
			<Navbar />
			<Outlet />
		</div>
	);
};

const App = () => {
	const theme = useSelector((state) => state.themeReducer.theme)

	return (
		<div className={`w-screen h-auto font-poppins  xl:w-auto ${theme === "dark" ? "bg-customBlack text-customWhite" : "bg-customWhite text-customBlack" }`}>
			<Router>
				<Routes>
					<Route path="/" element={<AppLayout />}>
						<Route index element={<Home />} />
						<Route path="/profile/:id" element={<Profile />} />
						<Route path="/explore" element={<Explore />} />
						<Route path="/reels" element={<Reels />} />
						<Route path="/messages" element={<Messages />} />
						<Route path="/post/update/:id" element={<UpdatePost />} />
						<Route path="/edit/profile/:id" element={<UploadProfilePic />} />
						<Route path="/calling/:id" element={<Call />} />
						<Route path="/posts/saved" element={<SavedPost />} />
						<Route path="/search/:search" element={<SearchResult />} />
					</Route>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
				</Routes>
				<Toaster />
			</Router>
		</div>
	);
};

export default App;
