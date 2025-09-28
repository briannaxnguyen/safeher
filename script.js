
// Pagination for other users
const USERS_PER_PAGE = 2;
let currentPage = 1;

function renderOtherUsers(page = 1) {
	const container = document.getElementById('other-users-list');
	const pagination = document.getElementById('pagination-controls');
	if (!container) return;
	container.innerHTML = '';
	// Pagination logic
	const totalUsers = users.length;
	const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);
	currentPage = Math.max(1, Math.min(page, totalPages));
	const startIdx = (currentPage - 1) * USERS_PER_PAGE;
	const endIdx = startIdx + USERS_PER_PAGE;
	users.slice(startIdx, endIdx).forEach(user => {
		const card = document.createElement('div');
		card.className = 'profile-card';
		card.innerHTML = `
			<img src="https://placehold.co/100x100" alt="Profile Picture" class="profile-pic">
			<h3>${user.name}</h3>
			<p>Status: <span class="status ${user.status}">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span></p>
			<button class="view-profile-btn" data-username="${user.name}">View Profile</button>
		`;
		card.querySelector('.view-profile-btn').onclick = function() {
			showUserProfile(user);
		};
		container.appendChild(card);
	});
	// Render pagination controls
	if (pagination) {
		pagination.innerHTML = '';
		for (let i = 1; i <= totalPages; i++) {
			const btn = document.createElement('button');
			btn.textContent = i;
			if (i === currentPage) btn.classList.add('active');
			btn.disabled = (i === currentPage);
			btn.onclick = () => renderOtherUsers(i);
			pagination.appendChild(btn);
		}
	}
}

// Call on page load
window.addEventListener('DOMContentLoaded', () => renderOtherUsers(1));


// Initialize Leaflet map at University of Waterloo
const map = L.map('map').setView([43.4723, -80.5449], 16); // University of Waterloo
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Dummy data for users and buildings (Waterloo campus)
const users = [
	{ name: 'Alice', lat: 43.4727, lng: -80.5427, status: 'available' },
	{ name: 'Bella', lat: 43.4705, lng: -80.5432, status: 'unavailable' },
	{ name: 'Chloe', lat: 43.4732, lng: -80.5455, status: 'available' },
	{ name: 'Diana', lat: 43.4712, lng: -80.5460, status: 'available' }
];
const buildings = [
	{ name: 'Dana Porter Library', lat: 43.4726, lng: -80.5429 },
	{ name: 'Student Life Centre', lat: 43.4715, lng: -80.5451 },
	{ name: 'Engineering 5', lat: 43.4722, lng: -80.5442 }
];

// Add user markers with click to view profile
users.forEach(user => {
	const marker = L.marker([user.lat, user.lng]).addTo(map);
	marker.bindPopup(`<b>${user.name}</b><br>Status: <span class="status ${user.status}">${user.status}</span><br><button class='view-profile-btn' data-username='${user.name}'>View Profile</button>`);
	marker.on('popupopen', function() {
		// Add event listener to the button after popup opens
		setTimeout(() => {
			const btn = document.querySelector('.view-profile-btn[data-username="' + user.name + '"]');
			if (btn) {
				btn.onclick = function() {
					showUserProfile(user);
				};
			}
		}, 100);
	});
});

// Show user profile in modal
function showUserProfile(user) {
	const modal = document.getElementById('user-profile-modal');
	const details = document.getElementById('user-profile-details');
	details.innerHTML = `
		<div class="profile-card">
			<img src="https://placehold.co/100x100" alt="Profile Picture" class="profile-pic">
			<h3>${user.name}</h3>
			<p>Status: <span class="status ${user.status}">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span></p>
			<button disabled>Message</button>
		</div>
	`;
	modal.style.display = 'block';
}

// Close modal logic
document.getElementById('close-profile-modal').onclick = function() {
	document.getElementById('user-profile-modal').style.display = 'none';
};
window.onclick = function(event) {
	const modal = document.getElementById('user-profile-modal');
	if (event.target === modal) {
		modal.style.display = 'none';
	}
};

// Add building markers
buildings.forEach(b => {
	const marker = L.marker([b.lat, b.lng], { icon: L.icon({
		iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
		iconSize: [32, 32],
		iconAnchor: [16, 32],
		popupAnchor: [0, -32]
	}) }).addTo(map);
	marker.bindPopup(`<b>${b.name}</b>`);
});

// Placeholder for walking paths (draw a polyline)
const path = L.polyline([
	[43.4727, -80.5427],
	[43.4726, -80.5429],
	[43.4715, -80.5451],
	[43.4712, -80.5460]
], { color: 'blue', weight: 4, opacity: 0.6 }).addTo(map);

// Messaging form placeholder
document.getElementById('message-form').addEventListener('submit', function(e) {
	e.preventDefault();
	const input = this.querySelector('input');
	const msg = input.value.trim();
	if (msg) {
		const msgDiv = document.createElement('div');
		msgDiv.textContent = `You: ${msg}`;
		document.querySelector('.messages-list').appendChild(msgDiv);
		input.value = '';
	}
});


