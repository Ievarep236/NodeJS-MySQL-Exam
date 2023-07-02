const API_BASE = 'http://localhost:8080';

const form = document.querySelector('form');

const registerUser = async (payload) => {
	try {
		const response = await fetch(`${API_BASE}/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		});

		return await response.json();
	} catch (err) {
		return Promise.reject();
	}
};

form.addEventListener('submit', async (event) => {
	event.preventDefault();

	const payload = {
		full_name: event.target.name.value,
		email: event.target.email.value,
		password: event.target.password.value,
		repeatedPassword: event.target.repeatedPassword.value,
	};

	const data = await registerUser(payload);

	if (data.token) {
		Cookies.set('token', data.token);
		window.location.replace('../html/login.html');
	} else {
		alert(data.Error);
	}
});
