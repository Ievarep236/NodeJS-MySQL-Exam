const token = Cookies.get('token');
const group = Cookies.get('group');
console.log(group);

document.addEventListener('DOMContentLoaded', async (e) => {
	await getGroupBills();
});

if (!token) {
	window.location.replace('./login.html');
}

const API_BASE = 'http://localhost:8080';

const getGroupBills = async () => {
	try {
		const response = await fetch(`${API_BASE}/bills/${group}`, {
			headers: {
				Authorization: `Bearer ${Cookies.get('token')}`,
			},
		});
		data = await response.json();
		renderBills(data);
		return data;
	} catch (err) {
		console.log(err);
	}
};

const table = document.querySelector('table');

const renderBills = (data) => {
	table.replaceChildren('');

	data.forEach((iteam) => {
		const tr = document.createElement('tr');
		const idTh = document.createElement('th');
		const descritionTh = document.createElement('th');
		const amountTh = document.createElement('th');

		idTh.textContent = iteam.id;
		descritionTh.textContent = iteam.description;
		amountTh.textContent = iteam.amount;

		tr.append(idTh, descritionTh, amountTh);
		table.append(tr);
	});
};

const addBill = async (payload) => {
	try {
		const response = await fetch(`${API_BASE}/bills`, {
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

const form = document.querySelector('form');
console.log(form);

form.addEventListener('submit', async (e) => {
	e.preventDefault();
	let amount = document.querySelector('#amount');
	let description = document.querySelector('#descrition');
	const payload = {
		group_id: group,
		amount: amount.value,
		description: description.value,
	};
	await addBill(payload);

	await getGroupBills();
	amount.value = '';
	description.value = '';
});

document.getElementById('logOut').addEventListener('click', () => {
	Cookies.remove('token');
	window.location.replace('../html/login.html');
});
