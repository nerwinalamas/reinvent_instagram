import React from "react";
import { useSelector } from "react-redux";

const ChatPlaceholder = () => {
	const theme = useSelector((state) => state.themeReducer.theme)

	return (
		<div className={`h-full w-full flex items-center justify-center gap-3 md:h-[89vh] xl:w-[60%] xl:h-[650px] ${theme === "dark" ? "bg-customGray" : "bg-slate-100"} `}>
			Select convo
		</div>
	);
};

export default ChatPlaceholder;
