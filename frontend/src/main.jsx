import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import store from "./_store/store.jsx";
import { Provider } from "react-redux";
import { SocketProvider } from "./context/SocketContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<Provider store={store}>
				<SocketProvider>
					<App />
				</SocketProvider>
			</Provider>
		</QueryClientProvider>
	</React.StrictMode>
);
