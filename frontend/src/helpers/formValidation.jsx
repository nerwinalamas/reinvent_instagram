const validateEmail = (email) => {
	return String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/
		);
};

export const validateLoginForm = (
	email,
	setEmailError,
	password,
	setPasswordError
) => {
	let valid = true;

	if (!email) {
		setEmailError("Email is required");
		valid = false;
	} else if (!validateEmail(email)) {
		setEmailError("Invalid email format");
		valid = false;
	}

	if (!password) {
		setPasswordError("Password is required");
		valid = false;
	}

	return valid;
};

export const validateRegistrationForm = (
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
) => {
	let valid = true;

	if (!email) {
		setEmailError("Email is required");
		valid = false;
	} else if (!validateEmail(email)) {
		setEmailError("Invalid email format");
		valid = false;
	}

	if (!firstName) {
		setFirstNameError("First Name is required");
		valid = false;
	}

	if (!lastName) {
		setLastNameError("Last Name is required");
		valid = false;
	}

	if (!userName) {
		setUserNameError("Username is required");
		valid = false;
	}

	if (!password) {
		setPasswordError("Password is required");
		valid = false;
	}

	return valid;
};

export const validatePost = (
	postContent,
	setPostContentError,
	postPicture,
	setPostPictureError
) => {
	let valid = true;

	if (!postContent) {
		setPostContentError("Post content is required");
		valid = false;
	}

	if (!postPicture) {
		setPostPictureError("Post photo is required");
		valid = false;
	}

	return valid;
};
