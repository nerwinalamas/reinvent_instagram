import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

import axios from "axios";
import moment from "moment";

const Explore = () => {
	const navigate = useNavigate();
	const [exploreData, setExploreData] = useState([]);
	const [postData, setPostData] = useState({});
	const theme = useSelector((state) => state.themeReducer.theme)

	useEffect(() => {
		if (!localStorage.getItem("token")) {
			navigate("/login");
		}
	}, []);

	const getPosts = async () => {
		try {
			const response = await axios.get(
				"http://localhost:5000/post/explore/random",
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
				}
			);
			console.log("response sa explore: ", response);
			setExploreData(response.data.data);
		} catch (error) {
			console.log("Explore Page Error: ", error);
		}
	};

	useEffect(() => {
		getPosts();
	}, []);

	console.log("setpostdata: ", postData);

	return (
		<ResponsiveMasonry
			columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
			className="h-auto overflow-y-auto p-5 xl:px-40 xl:max-w-screen-2xl xl:mx-auto"
		>
			<Masonry columnsCount={3} gutter="10px">
				{exploreData.length > 0 ? (
					exploreData.map((image, i) => (
						<img
							key={i}
							src={`http://localhost:5000/uploads/${image.postPicture}`}
							style={{ width: "100%", display: "block" }}
							// onClick={() =>
							// 	console.log("image: ", image + " " + i)
							// }
							onClick={() => {
								document
									.getElementById("my_modal_4")
									.showModal();
								setPostData(image);
							}}
						/>
					))
				) : (
					<p>No Post Data</p>
				)}
			</Masonry>

			<dialog id="my_modal_4" className="modal">
				<div className={`modal-box w-11/12 max-w-5xl ${theme === "dark" ? "bg-customBlack" : "bg-slate-100" }`}>
					<form method="dialog">
						<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
							✕
						</button>
					</form>
					<div className="modal-action">
						{postData && postData.postedBy && (
							<div className="w-full flex flex-col gap-5 md:w-full">
								<div className="w-full flex items-center gap-5">
									<Link
										to={`/profile/${postData.postedBy._id}`}
									>
										{postData.postedBy.profilePicture ? (
											<div className="w-11 h-11 rounded-full flex flex-col bg-customBlack items-center justify-center">
												<img
													src={`http://localhost:5000/uploads/${postData.postedBy.profilePicture}`}
													alt=""
													className="w-full h-full rounded-full object-contain"
												/>
											</div>
										) : (
											<div className="w-11 h-11 rounded-full bg-customWhite text-customBlack  flex items-center justify-center">
												<p className="capitalize font-bold text-xl">
													{postData.postedBy
														.firstName &&
														postData.postedBy.firstName.charAt(
															0
														)}
												</p>
											</div>
										)}
									</Link>
									<div>
										<Link to={`/profile/${postData.postedBy._id}`}>
											<p className="capitalize hover:underline">
												{postData.postedBy.firstName}{" "}
												{postData.postedBy.lastName}
											</p>
										</Link>
										<p className="text-slate-400 text-xs">
											{moment(
												postData.postedBy.createdAt
											).fromNow()}
										</p>
									</div>
								</div>
								<img
									src={`http://localhost:5000/uploads/${postData.postPicture}`}
									alt="Sample Image"
									className={`md:max-h-[500px] object-contain rounded-md ${theme === "dark" ? "bg-black" : "bg-slate-200" }`}
								/>
							</div>
						)}
					</div>
				</div>
			</dialog>
		</ResponsiveMasonry>
	);
};

export default Explore;
