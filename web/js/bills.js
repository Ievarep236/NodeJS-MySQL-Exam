const token = Cookies.get('token');
const group = Cookies.get('group');
console.log(group);

if (!token) {
	window.location.replace('./login.html');
}

document.addEventListener('DOMContentLoaded', async (e) => {
	await getGroupBills();
});

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
	const firsTr = document.createElement('tr');
	const fisridTh = document.createElement('th');
	const firsdescription = document.createElement('th');
	const firstamount = document.createElement('th');

	fisridTh.textContent = 'id';
	firsdescription.textContent = 'Descrition';
	firstamount.textContent = 'Amount';

	firsTr.append(fisridTh, firsdescription, firstamount);
	table.append(firsTr);

	data.forEach((iteam) => {
		const tr = document.createElement('tr');
		const idTd = document.createElement('td');
		const descritionTd = document.createElement('td');
		const amountTd = document.createElement('td');

		idTd.textContent = iteam.id;
		descritionTd.textContent = iteam.description;
		amountTd.textContent = `${iteam.amount} €`;

		tr.append(idTd, descritionTd, amountTd);
		table.append(tr);
	});
};

const addBill = async (payload) => {
	try {
		const response = await fetch(`${API_BASE}/bills`, {
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

document.getElementById('goBack').addEventListener('click', () => {
	window.location.replace('../html/groups.html');
});
