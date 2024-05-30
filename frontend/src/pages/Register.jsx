import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateRegistrationForm } from "../helpers/formValidation";
import toast from "react-hot-toast";
import { useRegisterUserMutation } from "../mutation/auth";

const Register = () => {
	const [email, setEmail] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [userName, setUserName] = useState("");
	const [password, setPassword] = useState("");

	const [emailError, setEmailError] = useState("");
	const [firstNameError, setFirstNameError] = useState("");
	const [lastNameError, setLastNameError] = useState("");
	const [userNameError, setUserNameError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const registerUserMutation = useRegisterUserMutation();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (
			!validateRegistrationForm(
				email,
				setEmailError,
				firstName,
				setFirstNameError,
				lastName,
				setLastNameError,
				userName,
				setUserNameError,
				password,
				setPasswordError
			)
		)
			return;

		const toastId = toast.loading("Loading...");

		try {
			registerUserMutation.mutate(
				{
					email,
					firstName,
					lastName,
					userName,
					password,
				},
				{
					onSuccess: (data) => {
						toast.success(data.message, { id: toastId });
						navigate("/login");
					},
					onError: () => {
						toast.error("An error occurred", { id: toastId });
						console.log("Registration Error: ", error);
					},
				}
			);
		} catch (error) {
			toast.error(error.response.data.message);
			console.log("Registration Error: ", error.response.data.message);
		}
	};

	return (
		<main className="h-screen flex items-center justify-center">
			<form
				onSubmit={handleSubmit}
				className="w-80 flex flex-col gap-1 p-5 rounded-sm bg-customWhite text-customBlack xl:w-96"
			>
				<h2 className="text-center text-2xl font-semibold">Register</h2>
				<label htmlFor="email">Email</label>
				<input
					type="text"
					name="email"
					id="email"
					value={email}
					onChange={(e) => {
						setEmail(e.target.value);
						setEmailError("");
					}}
					className="p-2 border-2 bg-customWhite"
				/>
				{emailError && (
					<p className="text-red-500 text-xs font-semibold">
						{emailError}
					</p>
				)}
				<label htmlFor="firstName">First Name</label>
				<input
					type="text"
					name="firstName"
					id="firstName"
					value={firstName}
					onChange={(e) => {
						setFirstName(e.target.value);
						setFirstNameError("");
					}}
					className="p-2 border-2 bg-customWhite"
				/>
				{firstNameError && (
					<p className="text-red-500 text-xs font-semibold">
						{firstNameError}
					</p>
				)}
				<label htmlFor="lastName">Last Name</label>
				<input
					type="text"
					name="lastName"
					id="lastName"
					value={lastName}
					onChange={(e) => {
						setLastName(e.target.value);
						setLastNameError("");
					}}
					className="p-2 border-2 bg-customWhite"
				/>
				{lastNameError && (
					<p className="text-red-500 text-xs font-semibold">
						{lastNameError}
					</p>
				)}
				<label htmlFor="userName">Username</label>
				<input
					type="text"
					name="userName"
					id="userName"
					value={userName}
					onChange={(e) => {
						setUserName(e.target.value);
						setUserNameError("");
					}}
					className="p-2 border-2 bg-customWhite"
				/>
				{userNameError && (
					<p className="text-red-500 text-xs font-semibold">
						{userNameError}
					</p>
				)}
				<label htmlFor="password">Password</label>
				<input
					type="password"
					name="password"
					id="password"
					value={password}
					onChange={(e) => {
						setPassword(e.target.value);
						setPasswordError("");
					}}
					className="p-2 border-2 bg-customWhite"
				/>
				{passwordError && (
					<p className="text-red-500 text-xs font-semibold">
						{passwordError}
					</p>
				)}
				<input
					type="submit"
					value="Submit"
					className="p-2 border my-2 rounded-sm bg-customBlack text-customWhite cursor-pointer"
				/>
				<div className="w-full flex justify-center gap-2">
					<p>Already have an account?</p>
					<Link to="/login" className="hover:underline text-blue-500">
						<p>Login</p>
					</Link>
				</div>
			</form>
		</main>
	);
};

export default Register;
