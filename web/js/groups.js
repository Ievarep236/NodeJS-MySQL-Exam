const token = Cookies.get('token');

if (!token) {
	window.location.replace('./login.html');
}

const API_BASE = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', async (e) => {
	await getUserGroups();
});

const getUserGroups = async () => {
	try {
		const response = await fetch(`${API_BASE}/accounts`, {
			headers: {
				Authorization: `Bearer ${Cookies.get('token')}`,
			},
		});
		data = await response.json();
		renderGroups(data);
		console.log(data);
		return await data;
	} catch (err) {
		console.log(err);
	}
};

const container = document.querySelector('#groups');
console.log(container);

const renderGroups = (groups) => {
	container.replaceChildren('');
	groups.forEach((iteam) => {
		const a = document.createElement('button');
		const p1 = document.createElement('p');
		const p2 = document.createElement('p');

		p1.textContent = `id:${iteam.groups_id}`;
		p2.textContent = iteam.name;
		a.className = 'groupContainer';
		p1.className = 'id';
		p2.className = 'name';

		console.log(iteam.group_id);

		a.addEventListener('click', (e) => {
			document.cookie = `group=${iteam.groups_id}`;
			console.log(iteam.group_id);
			window.location.replace('../html/bills.html');
		});

		a.append(p2, p1);
		container.append(a);
	});
};

const form = document.querySelector('#add');
console.log(form);

const addGroup = async (payload) => {
	try {
		const response = await fetch(`${API_BASE}/accounts`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${Cookies.get('token')}`,
			},
			body: JSON.stringify(payload),
		});

		return await response.json();
	} catch (err) {
		return Promise.reject();
	}
};

form.addEventListener('submit', async (e) => {
	e.preventDefault();
	const payload = {
		group_id: e.target.groupID.value,
	};
	await addGroup(payload);
	await getUserGroups();
	e.target.groupID.value = '';
});

const form2 = document.querySelector('#create');

form2.addEventListener('submit', async (e) => {
	e.preventDefault();
	let groupName = document.querySelector('#groupName').value;
	payload = {
		name: groupName,
	};

	const addedGroup = await postToGroups(payload);

	const payloadAccount = {
		group_id: await addedGroup.insertId,
	};
	await postToAccounts(payloadAccount);
	await getUserGroups();
	document.querySelector('#groupName').value = '';
});

const postToGroups = async (payload) => {
	try {
		const response = await fetch(`${API_BASE}/groups`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${Cookies.get('token')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		});

		return await response.json();
	} catch (err) {
		return Promise.reject();
	}
};

const postToAccounts = async (payload) => {
	try {
		const response = await fetch(`${API_BASE}/accounts`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${Cookies.get('token')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		});

		return await response.json();
	} catch (err) {
		return Promise.reject();
	}
};

document.getElementById('logOut').addEventListener('click', () => {
	Cookies.remove('token');
	window.location.replace('../html/login.html');
});
