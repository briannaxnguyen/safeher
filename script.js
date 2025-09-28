// Logout button redirects to home
document.getElementById('logout-btn').onclick = () => {
 window.location.href = "home.html";
};


// Pagination and Users
const USERS_PER_PAGE = 2;
let currentPage = 1;


// Users with profile pictures
const users = [
 { name: 'Alice', lat: 43.4727, lng: -80.5427, status: 'available', pic: 'bitmoji 1.png' },
 { name: 'Bella', lat: 43.4705, lng: -80.5432, status: 'available', pic: 'bitmoji 3.png' },
 { name: 'Chloe', lat: 43.4732, lng: -80.5455, status: 'unavailable', pic: 'bitmoji 4.jpg' },
 { name: 'Diana', lat: 43.4712, lng: -80.5460, status: 'available', pic: 'bitmoji 5.jpg' }
];


// Assign random destinations to users after buildings are defined
function assignUserDestinations() {
 users.forEach(user => {
   user.destination = buildings[Math.floor(Math.random() * buildings.length)].name;
 });
}


window.addEventListener('DOMContentLoaded', () => {
 assignUserDestinations();
 renderOtherUsers();
});


// Buildings
const buildings = [
 { name: 'Dana Porter Library', lat: 43.4726, lng: -80.5429 },
 { name: 'Student Life Centre', lat: 43.4715, lng: -80.5451 },
 { name: 'Engineering 5', lat: 43.4722, lng: -80.5442 },
 { name: 'Math & Computer', lat: 43.4720, lng: -80.5435 },
 { name: 'Health Services', lat: 43.4708, lng: -80.5430 },
 { name: 'Environment 3', lat: 43.4718, lng: -80.5420 },
 { name: 'Physical Activities Complex', lat: 43.4712, lng: -80.5470 },
 { name: 'South Campus Hall', lat: 43.4699, lng: -80.5437 },
 { name: 'Quantum-Nano Centre', lat: 43.4716, lng: -80.5458 },
 { name: 'Schneider Haus', lat: 43.4506, lng: -80.5007 }
];




// Render Other Users with Pagination
function renderOtherUsers(page = 1) {
 const container = document.getElementById('other-users-list');
 const pagination = document.getElementById('pagination-controls');
 if (!container) return;


 container.innerHTML = '';
 const totalUsers = users.length;
 const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);
 currentPage = Math.max(1, Math.min(page, totalPages));


 const startIdx = (currentPage - 1) * USERS_PER_PAGE;
 const endIdx = startIdx + USERS_PER_PAGE;


 users.slice(startIdx, endIdx).forEach(user => {
   const card = document.createElement('div');
   card.className = 'profile-card';
   card.innerHTML = `
     <img src="${user.pic}" alt="${user.name}" class="profile-pic">
     <h3>${user.name}</h3>
     <p>Status: <span class="status ${user.status}">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span></p>
 <button class="view-profile-btn btn" data-username="${user.name}" style="background: linear-gradient(90deg, #ff69b4 0%, #ff85c1 100%); color: #fff; border: none; border-radius: 8px; font-size: 1rem; font-weight: 400; margin-bottom: 0.5rem; cursor: pointer; box-shadow: 0 2px 8px rgba(99,102,241,0.08);">View Profile</button>
 <button class="add-friend-btn btn" data-username="${user.name}" style="background: linear-gradient(90deg, #ff69b4 0%, #ff85c1 100%); color: #fff; border: none; border-radius: 8px; font-size: 1rem; font-weight: 400; cursor: pointer; box-shadow: 0 2px 8px rgba(99,102,241,0.08);">Add Friend</button>
   `;
   card.querySelector('.view-profile-btn').onclick = function() {
     showUserProfile(user);
   };
   card.querySelector('.add-friend-btn').onclick = function() {
     addFriend(user);
   };
   container.appendChild(card);
 });


// Add Friend popup and logic
function addFriend(user) {
 let friends = JSON.parse(localStorage.getItem('myFriends') || '[]');
 if (!friends.find(f => f.name === user.name)) {
   friends.push(user);
   localStorage.setItem('myFriends', JSON.stringify(friends));
   showFriendPopup(`${user.name} added as a friend!`);
 } else {
   showFriendPopup(`${user.name} is already your friend.`);
 }
}


function showFriendPopup(msg) {
 let popup = document.getElementById('friend-popup');
 if (!popup) {
   popup = document.createElement('div');
   popup.id = 'friend-popup';
   popup.style.position = 'fixed';
   popup.style.top = '50%';
   popup.style.left = '50%';
   popup.style.transform = 'translate(-50%, -50%)';
   popup.style.background = '#fff';
   popup.style.padding = '1.5rem 2rem';
   popup.style.borderRadius = '12px';
   popup.style.boxShadow = '0 4px 24px rgba(0,0,0,0.12)';
   popup.style.zIndex = '2000';
   popup.style.textAlign = 'center';
   popup.style.fontSize = '1.1rem';
   document.body.appendChild(popup);
 }
 popup.textContent = msg;
 popup.style.display = 'block';
 setTimeout(() => { popup.style.display = 'none'; }, 1500);
}


 // Pagination buttons
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


// Map setup
const map = L.map('map').setView([43.4723, -80.5449], 16);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
 attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);


// User markers with pictures
users.forEach(user => {
 const marker = L.marker([user.lat, user.lng]).addTo(map);
 marker.bindPopup(`
   <b>${user.name}</b><br>
   Status: <span class="status ${user.status}">${user.status}</span><br>
   <img src="${user.pic}" alt="${user.name}" class="profile-pic" style="width:50px;height:50px;border-radius:50%;"><br>
   <button class='view-profile-btn' data-username='${user.name}'>View Profile</button>
 `);
 marker.on('popupopen', function() {
   setTimeout(() => {
     const btn = document.querySelector('.view-profile-btn[data-username="' + user.name + '"]');
     if (btn) btn.onclick = () => showUserProfile(user);
   }, 100);
 });
});


// Building markers
buildings.forEach(b => {
 const marker = L.marker([b.lat, b.lng], { icon: L.icon({
   iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
   iconSize: [32,32],
   iconAnchor: [16,32],
   popupAnchor: [0,-32]
 }) }).addTo(map);
 marker.bindPopup(`<b>${b.name}</b>`);
    // Add wheelchair icon marker next to Student Life Centre
   if (b.name === 'Student Life Centre') {
     // Use Unicode emoji ♿ as a custom divIcon
     const wheelchairEmojiIcon = L.divIcon({
       html: '<span style="font-size: 2rem;">♿</span>',
       iconSize: [32,32],
       className: ''
     });
     // Offset the emoji further right and a bit up
 const emojiMarker = L.marker([b.lat + 0.00048, b.lng + 0.00085], { icon: wheelchairEmojiIcon }).addTo(map);
 emojiMarker.bindPopup('<b>Accessibility Info</b><br>This path has accessibility features.');
   }
});


// Polyline path example
const path = L.polyline([
 [43.4727, -80.5427],
 [43.4726, -80.5429],
 [43.4715, -80.5451],
 [43.4712, -80.5460]
], { color:'blue', weight:4, opacity:0.6 }).addTo(map);
path.bindPopup('<span style="font-size:1.2em;">Accessibility Route ♿</span>');


// Helper: Haversine formula for distance (km)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
 const R = 6371; // Radius of the earth in km
 const dLat = (lat2 - lat1) * Math.PI / 180;
 const dLon = (lon2 - lon1) * Math.PI / 180;
 const a =
   Math.sin(dLat/2) * Math.sin(dLat/2) +
   Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
   Math.sin(dLon/2) * Math.sin(dLon/2);
 const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
 return R * c;
}


let myLocation = null;
if (navigator.geolocation) {
 navigator.geolocation.getCurrentPosition(pos => {
   myLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
 });
}


// User profile modal
function showUserProfile(user) {
 const modal = document.getElementById('user-profile-modal');
 const details = document.getElementById('user-profile-details');
 let locationInfo = '';
 let distanceInfo = '';
 if (user.status === 'available') {
   // Find nearest building
   let nearestBuilding = null;
   let minDist = Infinity;
   buildings.forEach(b => {
     const d = getDistanceFromLatLonInKm(user.lat, user.lng, b.lat, b.lng);
     if (d < minDist) {
       minDist = d;
       nearestBuilding = b.name;
     }
   });
   locationInfo = `<p>Location: ${nearestBuilding ? nearestBuilding : 'Unknown'}</p>`;
   if (myLocation) {
     const dist = getDistanceFromLatLonInKm(myLocation.lat, myLocation.lng, user.lat, user.lng);
     distanceInfo = `<p>Distance from you: ${dist.toFixed(2)} km</p>`;
   } else {
     distanceInfo = `<p>Distance from you: <em>Unknown (enable location)</em></p>`;
   }
 }
 details.innerHTML = `
   <div class="profile-card">
     <img src="${user.pic}" alt="${user.name}" class="profile-pic">
     <h3>${user.name}</h3>
     <p>Status: <span class="status ${user.status}">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span></p>
     ${locationInfo}
     ${distanceInfo}
     <p>Destination: <strong>${user.destination}</strong></p>
 <button disabled style="background: linear-gradient(90deg, #ff69b4 0%, #ff85c1 100%); color: #fff; border: none; border-radius: 8px; font-size: 1rem; font-weight: 400; margin-top: 0.7rem; cursor: not-allowed; box-shadow: 0 2px 8px rgba(99,102,241,0.08);">Message</button>
   </div>
 `;
 modal.style.display = 'block';
}


// Close modals
document.getElementById('close-profile-modal').onclick = () => {
 document.getElementById('user-profile-modal').style.display = 'none';
};
window.onclick = event => {
 const modal = document.getElementById('user-profile-modal');
 if(event.target === modal) modal.style.display='none';
};


// Edit profile modal
const editModal = document.getElementById('edit-profile-modal');
document.getElementById('edit-profile-btn').onclick = () => editModal.style.display='block';
document.getElementById('close-edit-modal').onclick = () => editModal.style.display='none';
window.onclick = event => {
 if(event.target === editModal) editModal.style.display='none';
};




// Save profile
document.getElementById('edit-profile-form').addEventListener('submit', e => {
 e.preventDefault();
 const firstName = document.getElementById('first-name').value;
 const lastName = document.getElementById('last-name').value;
 const mode = document.getElementById('mode-select').value;
 const status = document.getElementById('status-select').value;
 const fileInput = document.getElementById('profile-pic-input');


 document.getElementById('profile-name').textContent = firstName + ' ' + lastName;
 document.getElementById('profile-mode').textContent = mode;
 const statusSpan = document.getElementById('profile-status');
 statusSpan.textContent = status.charAt(0).toUpperCase() + status.slice(1);
 statusSpan.className = 'status ' + status;


 if(fileInput.files && fileInput.files[0]){
   const reader = new FileReader();
   reader.onload = function(e){
     document.getElementById('profile-pic-display').src = e.target.result;
   };
   reader.readAsDataURL(fileInput.files[0]);
 }
 editModal.style.display = 'none';
});


// Messaging
document.getElementById('message-form').addEventListener('submit', function(e){
 e.preventDefault();
 const input = this.querySelector('input');
 const msg = input.value.trim();
 if(msg){
   const msgDiv = document.createElement('div');
   msgDiv.textContent = `You: ${msg}`;
   document.querySelector('.messages-list').appendChild(msgDiv);
   input.value = '';


   // Fake responses
   const fakeReplies = [
     "Hey! How are you?",
     "I'm nearby, let me know if you need anything.",
     "Heading to the library now.",
     "Stay safe!",
     "I'll join you in 5 minutes.",
     "Which building are you at?",
     "Let me know your location.",
     "Great to hear from you!"
   ];
   const reply = fakeReplies[Math.floor(Math.random() * fakeReplies.length)];
   setTimeout(() => {
     const replyDiv = document.createElement('div');
     replyDiv.textContent = `Alice: ${reply}`;
     document.querySelector('.messages-list').appendChild(replyDiv);
   }, 900 + Math.random() * 1200);
 }
});


// Emergency button
document.getElementById('emergency-btn').addEventListener('click', () => {
 if (navigator.geolocation) {
   navigator.geolocation.getCurrentPosition(pos => {
     const { latitude, longitude } = pos.coords;
     alert(`Emergency detected! 911 notified!\nYour location: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
     L.marker([latitude, longitude], {icon: L.icon({
       iconUrl: 'https://cdn-icons-png.flaticon.com/512/564/564619.png',
       iconSize: [32,32],
       iconAnchor: [16,32],
     })}).addTo(map).bindPopup("Your Emergency Location").openPopup();
     map.setView([latitude, longitude], 16);
   });
 } else {
   alert("Geolocation not supported by your browser.");
 }
});


// Set destination
document.getElementById('set-destination-btn').addEventListener('click', () => {
 const dest = document.getElementById('destination-input').value.trim();
 if(dest){
   const building = buildings.find(b => b.name.toLowerCase().includes(dest.toLowerCase()));
   if(building){
     alert(`Route set to: ${building.name}`);
     L.marker([building.lat, building.lng], {icon: L.icon({
       iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
       iconSize: [32,32],
       iconAnchor: [16,32],
     })}).addTo(map).bindPopup(building.name).openPopup();
     map.setView([building.lat, building.lng], 16);
   } else {
     alert("Destination not found on map.");
   }
 } else {
   alert("Please enter a destination.");
 }
});
