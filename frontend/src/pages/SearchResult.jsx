import { Link } from "react-router-dom";
import useThemeStore from "../store/useTheme";
import useSearchStore from "../store/useSearch";

const SearchResult = () => {
	const { search } = useSearchStore();
	const { theme } = useThemeStore();

	return (
		<div className="p-5 flex flex-col items-center">
			{search.length > 0 ? (
				search.map((result) => (
					<div key={result._id} className={`flex items-center gap-3  rounded-lg p-5 md:w-96 lg:w-[60vw] xl:mb-3 ${theme === "dark" ? "bg-customGray" : "bg-slate-200" }`}>
						<Link to={`/profile/${result._id}`}>
							{result.profilePicture ? (
								<div className="w-11 h-11 rounded-full flex flex-col bg-customBlack items-center justify-center">
									<img
										src={result.profilePicture}
										alt={result.firstName + " Photo"}
										className="w-full h-full rounded-full object-contain"
									/>
								</div>
							) : (
								<div className="w-11 h-11 rounded-full bg-customWhite text-customBlack flex items-center justify-center">
									<p className="capitalize font-bold text-xl">
										{result.firstName &&
											result.firstName.charAt(0)}
									</p>
								</div>
							)}
						</Link>
						<div className="flex flex-col gap-1 text-sm">
							<Link to={`/profile/${result._id}`}>
								<p className="capitalize hover:underline font-medium">
									{result.firstName}{" "}
									{result.lastName}
								</p>
							</Link>
							<p className={` text-xs ${theme === "dark" ? "text-slate-400" : "text-customBlack" }`}>
								{result.userName}
							</p>
						</div>
					</div>
				))
			) : (
				<p>No Results</p>
			)}
		</div>
	);
};

export default SearchResult;
