// YadaHomestay Admin System
// Connected to frontend via localStorage

// State
let currentUser = null;
let currentPage = 'dashboard';
let cart = [];

// Utility Functions
function formatCurrency(amount) {
  return '฿' + amount.toLocaleString('th-TH');
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('th-TH');
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleString('th-TH');
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg text-white ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'} fade-in`;
  toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} mr-2"></i>${message}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Data Management
function getRooms() {
  return JSON.parse(localStorage.getItem('yada_rooms') || '[]');
}

function getBookings() {
  return JSON.parse(localStorage.getItem('yada_bookings') || '[]');
}

function getProducts() {
  return JSON.parse(localStorage.getItem('yada_products') || '[]');
}

function getOrders() {
  return JSON.parse(localStorage.getItem('yada_orders') || '[]');
}

function getUsers() {
  return JSON.parse(localStorage.getItem('yada_users') || '[]');
}

function saveRooms(rooms) {
  localStorage.setItem('yada_rooms', JSON.stringify(rooms));
}

function saveBookings(bookings) {
  localStorage.setItem('yada_bookings', JSON.stringify(bookings));
}

function saveProducts(products) {
  localStorage.setItem('yada_products', JSON.stringify(products));
}

function saveOrders(orders) {
  localStorage.setItem('yada_orders', JSON.stringify(orders));
}

function saveUsers(users) {
  localStorage.setItem('yada_users', JSON.stringify(users));
}

// Login
function initLogin() {
  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const users = getUsers();
    const user = users.find(u => u.username === username && u.isActive);
    
    if (user && password === '123456') {
      currentUser = user;
      document.getElementById('login-page').classList.add('hidden');
      document.getElementById('main-app').classList.remove('hidden');
      document.getElementById('user-name').textContent = user.name;
      document.getElementById('user-role').textContent = user.role === 'admin' ? 'เจ้าของ' : 'พนักงาน';
      document.getElementById('user-avatar').textContent = user.name.charAt(0);

      // Hide admin-only items for staff
      if (user.role !== 'admin') {
        document.querySelectorAll('.admin-only').forEach(el => el.classList.add('hidden'));
      }

      showToast(`ยินดีต้อนรับ ${user.name}`);
      loadPage('dashboard');
    } else {
      showToast('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง', 'error');
    }
  });
}

function logout() {
  currentUser = null;
  document.getElementById('main-app').classList.add('hidden');
  document.getElementById('login-page').classList.remove('hidden');
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
}

// Navigation
function initNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.dataset.page;
      loadPage(page);

      // Update active state
      document.querySelectorAll('.nav-item').forEach(nav => {
        nav.classList.remove('bg-primary', 'text-white');
        nav.classList.add('text-gray-600', 'hover:bg-gray-100');
      });
      item.classList.remove('text-gray-600', 'hover:bg-gray-100');
      item.classList.add('bg-primary', 'text-white');

      // Close mobile menu
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.add('-translate-x-full');
    });
  });

  // Mobile menu toggle
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const sidebar = document.getElementById('sidebar');
  
  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
      sidebar.classList.toggle('-translate-x-full');
    });
  }

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth < 1024) {
      if (!sidebar.contains(e.target) && !mobileBtn.contains(e.target)) {
        sidebar.classList.add('-translate-x-full');
      }
    }
  });
}

// Page Loaders
function loadPage(page) {
  currentPage = page;
  const contentArea = document.getElementById('content-area');

  switch(page) {
    case 'dashboard':
      contentArea.innerHTML = renderDashboard();
      break;
    case 'rooms':
      contentArea.innerHTML = renderRooms();
      break;
    case 'bookings':
      contentArea.innerHTML = renderBookings();
      break;
    case 'pos':
      contentArea.innerHTML = renderPOS();
      break;
    case 'bar':
      contentArea.innerHTML = renderBar();
      initBar();
      break;
    case 'reports':
      contentArea.innerHTML = renderReports();
      initReports();
      break;
    case 'users':
      contentArea.innerHTML = renderUsers();
      break;
    case 'settings':
      contentArea.innerHTML = renderSettings();
      break;
  }
}

// Dashboard
function renderDashboard() {
  const rooms = getRooms();
  const bookings = getBookings();
  const orders = getOrders();
  
  const today = new Date().toDateString();
  const todayCheckIns = bookings.filter(b => new Date(b.checkInDate).toDateString() === today && (b.status === 'confirmed' || b.status === 'checked_in'));
  const todayCheckOuts = bookings.filter(b => new Date(b.checkOutDate).toDateString() === today && (b.status === 'checked_in' || b.status === 'checked_out'));
  const todayRevenue = todayCheckIns.reduce((sum, b) => sum + b.paidAmount, 0);
  const todayBarRevenue = orders.filter(o => new Date(o.createdAt).toDateString() === today).reduce((sum, o) => sum + o.total, 0);

  return `
    <div class="fade-in">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">แดชบอร์ด</h1>
          <p class="text-gray-500">สรุปภาพรวมการทำงานวันนี้</p>
        </div>
        <div class="text-right">
          <p class="font-medium text-gray-800">${currentUser.name}</p>
          <p class="text-sm text-gray-500">${new Date().toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-2xl p-6 shadow-sm card-hover cursor-pointer" onclick="loadPage('rooms')">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-gray-500">ห้องว่าง</p>
              <p class="text-3xl font-bold text-gray-800">${rooms.filter(r => r.status === 'available').length}</p>
              <p class="text-xs text-gray-400">/ ${rooms.length}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <i class="fas fa-bed text-green-600 text-xl"></i>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-sm card-hover cursor-pointer" onclick="loadPage('rooms')">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-gray-500">ห้อง occupied</p>
              <p class="text-3xl font-bold text-gray-800">${rooms.filter(r => r.status === 'occupied').length}</p>
              <p class="text-xs text-gray-400">/ ${rooms.length}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <i class="fas fa-user-check text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-sm card-hover cursor-pointer" onclick="loadPage('pos')">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-gray-500">Check-in วันนี้</p>
              <p class="text-3xl font-bold text-gray-800">${todayCheckIns.length}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <i class="fas fa-sign-in-alt text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-sm card-hover cursor-pointer" onclick="loadPage('pos')">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-gray-500">Check-out วันนี้</p>
              <p class="text-3xl font-bold text-gray-800">${todayCheckOuts.length}</p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <i class="fas fa-sign-out-alt text-orange-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Revenue Cards -->
      <div class="grid md:grid-cols-3 gap-4 mb-8">
        <div class="bg-gradient-to-br from-primary to-green-800 rounded-2xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-white/70 text-sm">รายได้วันนี้ (รวม)</p>
              <p class="text-3xl font-bold mt-1">${formatCurrency(todayRevenue + todayBarRevenue)}</p>
            </div>
            <div class="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <i class="fas fa-chart-line text-2xl"></i>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">รายได้ห้องพัก</p>
              <p class="text-3xl font-bold text-gray-800 mt-1">${formatCurrency(todayRevenue)}</p>
            </div>
            <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <i class="fas fa-bed text-blue-600 text-2xl"></i>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">รายได้บาร์/มินิบาร์</p>
              <p class="text-3xl font-bold text-gray-800 mt-1">${formatCurrency(todayBarRevenue)}</p>
            </div>
            <div class="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
              <i class="fas fa-wine-glass text-purple-600 text-2xl"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Room Status & Activities -->
      <div class="grid lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-800">สถานะห้องพัก</h3>
            <button onclick="loadPage('rooms')" class="text-primary hover:underline text-sm">ดูทั้งหมด</button>
          </div>
          <div class="grid grid-cols-4 gap-3">
            ${rooms.slice(0, 8).map(room => `
              <div class="p-3 rounded-xl border hover:shadow-md transition-shadow cursor-pointer" onclick="loadPage('rooms')">
                <div class="flex items-center gap-2 mb-1">
                  <div class="w-3 h-3 rounded-full status-${room.status}"></div>
                  <span class="font-medium text-sm">${room.number}</span>
                </div>
                <p class="text-xs text-gray-500">${getStatusText(room.status)}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-800">กิจกรรมวันนี้</h3>
            <button onclick="loadPage('pos')" class="text-primary hover:underline text-sm">ไปที่ POS</button>
          </div>
          <div class="space-y-4">
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-2">Check-in วันนี้ (${todayCheckIns.length})</h4>
              ${todayCheckIns.length > 0 ? todayCheckIns.slice(0, 3).map(b => `
                <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p class="font-medium text-sm">${b.guestName}</p>
                    <p class="text-xs text-gray-500">ห้อง ${b.roomNumber} • ${b.nights} คืน</p>
                  </div>
                  <span class="px-2 py-1 text-xs rounded-full ${b.status === 'checked_in' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}">${b.status === 'checked_in' ? 'Checked-in' : 'รอ Check-in'}</span>
                </div>
              `).join('') : '<p class="text-sm text-gray-400 italic">ไม่มี Check-in วันนี้</p>'}
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-2">Check-out วันนี้ (${todayCheckOuts.length})</h4>
              ${todayCheckOuts.length > 0 ? todayCheckOuts.slice(0, 3).map(b => `
                <div class="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p class="font-medium text-sm">${b.guestName}</p>
                    <p class="text-xs text-gray-500">ห้อง ${b.roomNumber}</p>
                  </div>
                  <span class="px-2 py-1 text-xs rounded-full ${b.status === 'checked_out' ? 'bg-gray-500 text-white' : 'bg-gray-200 text-gray-700'}">${b.status === 'checked_out' ? 'Checked-out' : 'รอ Check-out'}</span>
                </div>
              `).join('') : '<p class="text-sm text-gray-400 italic">ไม่มี Check-out วันนี้</p>'}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getStatusText(status) {
  const texts = { available: 'ว่าง', occupied: 'มีผู้เข้าพัก', cleaning: 'กำลังทำความสะอาด', maintenance: 'ซ่อมบำรุง', reserved: 'จองแล้ว' };
  return texts[status] || status;
}

// Rooms Page
function renderRooms() {
  const rooms = getRooms();
  
  return `
    <div class="fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">จัดการห้องพัก</h1>
          <p class="text-gray-500">ดูและจัดการสถานะห้องพักทั้งหมด</p>
        </div>
        <button onclick="showAddRoomModal()" class="bg-primary hover:bg-green-800 text-white px-4 py-2 rounded-xl transition-colors">
          <i class="fas fa-plus mr-2"></i>เพิ่มห้องพัก
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        ${['available', 'occupied', 'cleaning', 'maintenance', 'reserved'].map(status => `
          <div class="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onclick="filterRooms('${status}')">
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full status-${status}"></div>
              <div>
                <p class="text-2xl font-bold">${rooms.filter(r => r.status === status).length}</p>
                <p class="text-xs text-gray-500">${getStatusText(status)}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Room Grid -->
      <div class="bg-white rounded-2xl p-6 shadow-sm">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" id="rooms-grid">
          ${rooms.map(room => `
            <div class="p-4 rounded-xl border hover:shadow-lg transition-all cursor-pointer" onclick="showRoomDetail('${room.id}')">
              <div class="flex items-center justify-between mb-2">
                <div class="w-3 h-3 rounded-full status-${room.status}"></div>
                <span class="text-xs text-gray-500">${room.type === 'standard' ? 'มาตรฐาน' : room.type === 'deluxe' ? 'ดีลักซ์' : 'แฟมิลี่'}</span>
              </div>
              <div class="text-center py-2">
                <i class="fas fa-bed text-3xl text-primary mb-2"></i>
                <p class="font-bold text-lg">${room.number}</p>
                <p class="text-xs text-gray-500 truncate">${room.name}</p>
              </div>
              <div class="mt-2 pt-2 border-t text-center">
                <p class="text-sm font-bold text-primary">${formatCurrency(room.pricePerNight)}</p>
                <p class="text-xs text-gray-500">ต่อคืน</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function filterRooms(status) {
  showToast(`กรองตามสถานะ: ${getStatusText(status)}`);
}

function showRoomDetail(roomId) {
  const rooms = getRooms();
  const room = rooms.find(r => r.id === roomId);
  if (!room) return;

  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-md w-full p-6 fade-in max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold">ห้อง ${room.number}</h3>
        <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
      <img src="${room.image}" alt="${room.name}" class="w-full h-48 object-cover rounded-xl mb-4">
      <div class="space-y-3">
        <div class="flex justify-between">
          <span class="text-gray-500">สถานะ</span>
          <span class="px-2 py-1 rounded-full text-xs text-white status-${room.status}">${getStatusText(room.status)}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">ประเภท</span>
          <span>${room.type === 'standard' ? 'มาตรฐาน' : room.type === 'deluxe' ? 'ดีลักซ์' : 'แฟมิลี่'}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">ราคา</span>
          <span class="font-bold text-primary">${formatCurrency(room.pricePerNight)} / คืน</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">ความจุ</span>
          <span>${room.capacity} คน</span>
        </div>
        <div>
          <span class="text-gray-500">สิ่งอำนวยความสะดวก</span>
          <div class="flex flex-wrap gap-2 mt-2">
            ${room.amenities.map(a => `<span class="px-2 py-1 bg-gray-100 rounded-lg text-xs">${a}</span>`).join('')}
          </div>
        </div>
      </div>
      <div class="mt-6 pt-4 border-t">
        <p class="text-sm text-gray-500 mb-3">เปลี่ยนสถานะห้อง</p>
        <div class="grid grid-cols-3 gap-2">
          ${['available', 'occupied', 'cleaning', 'maintenance', 'reserved'].map(s => `
            <button onclick="changeRoomStatus('${room.id}', '${s}')" class="px-3 py-2 rounded-lg text-sm border hover:bg-gray-50 ${room.status === s ? 'bg-primary text-white border-primary' : ''}">
              ${getStatusText(s)}
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

function changeRoomStatus(roomId, status) {
  const rooms = getRooms();
  const room = rooms.find(r => r.id === roomId);
  if (room) {
    room.status = status;
    saveRooms(rooms);
    showToast(`เปลี่ยนสถานะห้อง ${room.number} เป็น ${getStatusText(status)}`);
    loadPage('rooms');
  }
}

function showAddRoomModal() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-md w-full p-6 fade-in">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold">เพิ่มห้องพักใหม่</h3>
        <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
      <form id="add-room-form" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">หมายเลขห้อง *</label>
          <input type="text" id="room-number" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="เช่น 104" required>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อห้อง *</label>
          <input type="text" id="room-name" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="ชื่อห้อง" required>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ประเภท *</label>
          <select id="room-type" class="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
            <option value="standard">มาตรฐาน</option>
            <option value="deluxe">ดีลักซ์</option>
            <option value="family">แฟมิลี่</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ราคาต่อคืน *</label>
          <input type="number" id="room-price" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="1200" required>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ความจุ (คน) *</label>
          <input type="number" id="room-capacity" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="2" required>
        </div>
        <button type="submit" class="w-full bg-primary hover:bg-green-800 text-white font-semibold py-3 rounded-xl">
          <i class="fas fa-plus mr-2"></i>เพิ่มห้องพัก
        </button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('add-room-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const rooms = getRooms();
    const newRoom = {
      id: Date.now().toString(),
      number: document.getElementById('room-number').value,
      name: document.getElementById('room-name').value,
      type: document.getElementById('room-type').value,
      status: 'available',
      pricePerNight: parseInt(document.getElementById('room-price').value),
      capacity: parseInt(document.getElementById('room-capacity').value),
      amenities: ['แอร์', 'ทีวี', 'ตู้เย็น', 'ไวไฟ'],
      floor: parseInt(document.getElementById('room-number').value[0]),
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'
    };
    rooms.push(newRoom);
    saveRooms(rooms);
    showToast('เพิ่มห้องพักสำเร็จ');
    modal.remove();
    loadPage('rooms');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

// Bookings Page
function renderBookings() {
  const bookings = getBookings().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  return `
    <div class="fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">การจองทั้งหมด</h1>
          <p class="text-gray-500">จัดการและติดตามสถานะการจอง</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">ทั้งหมด ${bookings.length} รายการ</span>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        ${[['pending', 'รอดำเนินการ', 'bg-yellow-100 text-yellow-800'], ['confirmed', 'ยืนยันแล้ว', 'bg-blue-100 text-blue-800'], ['checked_in', 'Check-in แล้ว', 'bg-green-100 text-green-800'], ['checked_out', 'Check-out แล้ว', 'bg-gray-100 text-gray-800'], ['cancelled', 'ยกเลิก', 'bg-red-100 text-red-800']].map(([status, label, colorClass]) => `
          <div class="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onclick="filterBookings('${status}')">
            <p class="text-2xl font-bold">${bookings.filter(b => b.status === status).length}</p>
            <p class="text-xs text-gray-500">${label}</p>
          </div>
        `).join('')}
      </div>

      <!-- Bookings Table -->
      <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">รหัสจอง</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">ลูกค้า</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">ห้อง</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">วันที่</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">ยอดรวม</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">สถานะ</th>
                <th class="px-4 py-3 text-right text-sm font-medium text-gray-700">จัดการ</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              ${bookings.length === 0 ? `
                <tr>
                  <td colspan="7" class="px-4 py-8 text-center text-gray-500">
                    <i class="fas fa-inbox text-4xl mb-2"></i>
                    <p>ยังไม่มีการจอง</p>
                  </td>
                </tr>
              ` : bookings.map(booking => `
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-3">
                    <div class="font-medium">${booking.bookingCode}</div>
                    <div class="text-xs text-gray-500">${formatDateTime(booking.createdAt)}</div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">${booking.guestName.charAt(0)}</div>
                      <div>
                        <div class="font-medium">${booking.guestName}</div>
                        <div class="text-xs text-gray-500">${booking.guestPhone}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="font-medium">${booking.roomNumber}</div>
                    <div class="text-xs text-gray-500">${booking.roomName}</div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="text-sm">${formatDate(booking.checkInDate)}</div>
                    <div class="text-xs text-gray-500">${booking.nights} คืน</div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="font-medium">${formatCurrency(booking.totalAmount)}</div>
                    <div class="text-xs">
                      ${booking.paymentStatus === 'paid' ? '<span class="text-green-600">ชำระแล้ว</span>' : booking.paymentStatus === 'partial' ? '<span class="text-orange-600">ชำระบางส่วน</span>' : '<span class="text-red-600">ยังไม่ชำระ</span>'}
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <span class="px-2 py-1 rounded-full text-xs ${getBookingStatusClass(booking.status)}">${getBookingStatusText(booking.status)}</span>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button onclick="viewBooking('${booking.id}')" class="p-2 text-gray-400 hover:text-primary">
                        <i class="fas fa-eye"></i>
                      </button>
                      ${booking.status === 'pending' ? `
                        <button onclick="confirmBooking('${booking.id}')" class="p-2 text-green-600 hover:text-green-700">
                          <i class="fas fa-check"></i>
                        </button>
                        <button onclick="cancelBooking('${booking.id}')" class="p-2 text-red-600 hover:text-red-700">
                          <i class="fas fa-times"></i>
                        </button>
                      ` : ''}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function getBookingStatusClass(status) {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    checked_in: 'bg-green-100 text-green-800',
    checked_out: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return classes[status] || 'bg-gray-100';
}

function getBookingStatusText(status) {
  const texts = {
    pending: 'รอดำเนินการ',
    confirmed: 'ยืนยันแล้ว',
    checked_in: 'Check-in แล้ว',
    checked_out: 'Check-out แล้ว',
    cancelled: 'ยกเลิก'
  };
  return texts[status] || status;
}

function filterBookings(status) {
  showToast(`กรองตามสถานะ: ${getBookingStatusText(status)}`);
}

function viewBooking(bookingId) {
  const bookings = getBookings();
  const booking = bookings.find(b => b.id === bookingId);
  if (!booking) return;

  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-lg w-full p-6 fade-in max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold">รายละเอียดการจอง ${booking.bookingCode}</h3>
        <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
      <div class="space-y-3">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">ชื่อลูกค้า</p>
            <p class="font-medium">${booking.guestName}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">เบอร์โทร</p>
            <p>${booking.guestPhone}</p>
          </div>
        </div>
        <div>
          <p class="text-sm text-gray-500">ห้องพัก</p>
          <p class="font-medium">${booking.roomNumber} - ${booking.roomName}</p>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">เข้าพัก</p>
            <p class="font-medium">${formatDate(booking.checkInDate)}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">ออก</p>
            <p class="font-medium">${formatDate(booking.checkOutDate)}</p>
          </div>
        </div>
        <div>
          <p class="text-sm text-gray-500">จำนวนผู้เข้าพัก</p>
          <p>${booking.adults} ผู้ใหญ่ ${booking.children > 0 ? booking.children + ' เด็ก' : ''}</p>
        </div>
        ${booking.guestNote ? `
          <div>
            <p class="text-sm text-gray-500">หมายเหตุ</p>
            <p class="bg-gray-50 p-2 rounded">${booking.guestNote}</p>
          </div>
        ` : ''}
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="flex justify-between mb-2">
            <span class="text-gray-500">ยอดรวม</span>
            <span class="font-bold text-primary">${formatCurrency(booking.totalAmount)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">ชำระแล้ว</span>
            <span>${formatCurrency(booking.paidAmount)}</span>
          </div>
          ${booking.totalAmount > booking.paidAmount ? `
            <div class="flex justify-between text-red-600">
              <span>ค้างชำระ</span>
              <span class="font-bold">${formatCurrency(booking.totalAmount - booking.paidAmount)}</span>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

function confirmBooking(bookingId) {
  const bookings = getBookings();
  const booking = bookings.find(b => b.id === bookingId);
  if (booking) {
    booking.status = 'confirmed';
    saveBookings(bookings);
    showToast(`ยืนยันการจอง ${booking.bookingCode} สำเร็จ`);
    loadPage('bookings');
  }
}

function cancelBooking(bookingId) {
  const bookings = getBookings();
  const booking = bookings.find(b => b.id === bookingId);
  if (booking) {
    booking.status = 'cancelled';
    
    // Release room
    const rooms = getRooms();
    const room = rooms.find(r => r.id === booking.roomId);
    if (room) {
      room.status = 'available';
      saveRooms(rooms);
    }
    
    saveBookings(bookings);
    showToast(`ยกเลิกการจอง ${booking.bookingCode} สำเร็จ`);
    loadPage('bookings');
  }
}

// POS Page
function renderPOS() {
  const bookings = getBookings();
  const today = new Date().toDateString();
  const todayCheckIns = bookings.filter(b => new Date(b.checkInDate).toDateString() === today && (b.status === 'confirmed' || b.status === 'checked_in'));
  const todayCheckOuts = bookings.filter(b => new Date(b.checkOutDate).toDateString() === today && (b.status === 'checked_in' || b.status === 'checked_out'));
  const activeBookings = bookings.filter(b => b.status === 'checked_in' || b.status === 'confirmed');

  return `
    <div class="fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">POS / หน้าร้าน</h1>
          <p class="text-gray-500">จัดการ Check-in, Check-out และการจอง</p>
        </div>
        <button class="bg-primary hover:bg-green-800 text-white px-4 py-2 rounded-xl transition-colors" onclick="showWalkInModal()">
          <i class="fas fa-user-plus mr-2"></i>Walk-in / จองใหม่
        </button>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-xl p-4 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-sign-in-alt text-blue-600"></i>
            </div>
            <div>
              <p class="text-2xl font-bold">${todayCheckIns.length}</p>
              <p class="text-xs text-gray-500">Check-in วันนี้</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-sign-out-alt text-orange-600"></i>
            </div>
            <div>
              <p class="text-2xl font-bold">${todayCheckOuts.length}</p>
              <p class="text-xs text-gray-500">Check-out วันนี้</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-bed text-green-600"></i>
            </div>
            <div>
              <p class="text-2xl font-bold">${activeBookings.length}</p>
              <p class="text-xs text-gray-500">กำลังเข้าพัก</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-receipt text-purple-600"></i>
            </div>
            <div>
              <p class="text-2xl font-bold">${formatCurrency(todayCheckIns.reduce((sum, b) => sum + b.paidAmount, 0))}</p>
              <p class="text-xs text-gray-500">รายได้วันนี้</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-2xl shadow-sm">
        <div class="border-b">
          <div class="flex">
            <button class="pos-tab flex-1 py-4 text-center font-medium text-primary border-b-2 border-primary" data-tab="checkin" onclick="switchPOSTab('checkin')">Check-in วันนี้</button>
            <button class="pos-tab flex-1 py-4 text-center font-medium text-gray-500" data-tab="checkout" onclick="switchPOSTab('checkout')">Check-out วันนี้</button>
            <button class="pos-tab flex-1 py-4 text-center font-medium text-gray-500" data-tab="active" onclick="switchPOSTab('active')">กำลังเข้าพัก</button>
          </div>
        </div>
        <div class="p-6">
          <div id="pos-checkin" class="pos-content">
            ${renderCheckInList(todayCheckIns)}
          </div>
          <div id="pos-checkout" class="pos-content hidden">
            ${renderCheckOutList(todayCheckOuts)}
          </div>
          <div id="pos-active" class="pos-content hidden">
            ${renderActiveList(activeBookings)}
          </div>
        </div>
      </div>
    </div>
  `;
}

function switchPOSTab(tab) {
  document.querySelectorAll('.pos-tab').forEach(t => {
    t.classList.remove('text-primary', 'border-b-2', 'border-primary');
    t.classList.add('text-gray-500');
  });
  document.querySelector(`[data-tab="${tab}"]`).classList.add('text-primary', 'border-b-2', 'border-primary');
  document.querySelector(`[data-tab="${tab}"]`).classList.remove('text-gray-500');
  
  document.querySelectorAll('.pos-content').forEach(c => c.classList.add('hidden'));
  document.getElementById(`pos-${tab}`).classList.remove('hidden');
}

function renderCheckInList(bookings) {
  if (bookings.length === 0) {
    return `<div class="text-center py-12 text-gray-400"><i class="fas fa-calendar text-5xl mb-4"></i><p>ไม่มีรายการ Check-in วันนี้</p></div>`;
  }
  return `<div class="space-y-4">${bookings.map(booking => `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-xl">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">${booking.guestName.charAt(0)}</div>
        <div>
          <p class="font-bold">${booking.guestName}</p>
          <p class="text-sm text-gray-500">ห้อง ${booking.roomNumber} • ${booking.nights} คืน • ${booking.adults} ท่าน</p>
          <div class="flex items-center gap-2 mt-1">
            <span class="px-2 py-1 text-xs rounded-full ${getBookingStatusClass(booking.status)}">${getBookingStatusText(booking.status)}</span>
            <span class="px-2 py-1 text-xs rounded-full bg-gray-100">${formatCurrency(booking.totalAmount)}</span>
          </div>
        </div>
      </div>
      <div>
        ${booking.status === 'confirmed' ? `
          <button onclick="doCheckIn('${booking.id}')" class="bg-primary hover:bg-green-800 text-white px-4 py-2 rounded-lg">
            <i class="fas fa-check mr-2"></i>Check-in
          </button>
        ` : '<span class="px-3 py-2 bg-green-500 text-white rounded-lg text-sm">Checked-in แล้ว</span>'}
      </div>
    </div>
  `).join('')}</div>`;
}

function renderCheckOutList(bookings) {
  if (bookings.length === 0) {
    return `<div class="text-center py-12 text-gray-400"><i class="fas fa-calendar text-5xl mb-4"></i><p>ไม่มีรายการ Check-out วันนี้</p></div>`;
  }
  return `<div class="space-y-4">${bookings.map(booking => `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-xl">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">${booking.guestName.charAt(0)}</div>
        <div>
          <p class="font-bold">${booking.guestName}</p>
          <p class="text-sm text-gray-500">ห้อง ${booking.roomNumber} • เข้าพัก ${booking.nights} คืน</p>
          <div class="flex items-center gap-2 mt-1">
            ${booking.paymentStatus === 'paid' ? '<span class="text-green-600 text-sm">ชำระแล้ว</span>' : `<span class="text-red-600 text-sm">ค้างชำระ ${formatCurrency(booking.totalAmount - booking.paidAmount)}</span>`}
          </div>
        </div>
      </div>
      <div>
        ${booking.status === 'checked_in' ? `
          <button onclick="doCheckOut('${booking.id}')" class="border border-orange-500 text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-lg">
            <i class="fas fa-sign-out-alt mr-2"></i>Check-out
          </button>
        ` : '<span class="px-3 py-2 bg-gray-500 text-white rounded-lg text-sm">Checked-out แล้ว</span>'}
      </div>
    </div>
  `).join('')}</div>`;
}

function renderActiveList(bookings) {
  if (bookings.length === 0) {
    return `<div class="text-center py-12 text-gray-400"><i class="fas fa-bed text-5xl mb-4"></i><p>ไม่มีลูกค้ากำลังเข้าพัก</p></div>`;
  }
  return `<div class="space-y-4">${bookings.map(booking => `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-xl">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">${booking.guestName.charAt(0)}</div>
        <div>
          <p class="font-bold">${booking.guestName}</p>
          <p class="text-sm text-gray-500">ห้อง ${booking.roomNumber} • ${formatDate(booking.checkInDate)} - ${formatDate(booking.checkOutDate)}</p>
          <div class="flex items-center gap-2 mt-1">
            <span class="px-2 py-1 text-xs rounded-full ${getBookingStatusClass(booking.status)}">${getBookingStatusText(booking.status)}</span>
          </div>
        </div>
      </div>
    </div>
  `).join('')}</div>`;
}

function doCheckIn(bookingId) {
  const bookings = getBookings();
  const booking = bookings.find(b => b.id === bookingId);
  if (booking) {
    booking.status = 'checked_in';
    
    // Update room status
    const rooms = getRooms();
    const room = rooms.find(r => r.id === booking.roomId);
    if (room) {
      room.status = 'occupied';
      saveRooms(rooms);
    }
    
    saveBookings(bookings);
    showToast(`Check-in สำเร็จ: ${booking.guestName}`);
    loadPage('pos');
  }
}

function doCheckOut(bookingId) {
  const bookings = getBookings();
  const booking = bookings.find(b => b.id === bookingId);
  if (booking) {
    if (booking.totalAmount > booking.paidAmount) {
      showToast('ลูกค้ามียอดค้างชำระ กรุณารับเงินก่อน Check-out', 'error');
      return;
    }
    booking.status = 'checked_out';
    booking.paymentStatus = 'paid';
    
    // Update room status
    const rooms = getRooms();
    const room = rooms.find(r => r.id === booking.roomId);
    if (room) {
      room.status = 'cleaning';
      saveRooms(rooms);
    }
    
    saveBookings(bookings);
    showToast(`Check-out สำเร็จ: ${booking.guestName}`);
    loadPage('pos');
  }
}

function showWalkInModal() {
  const rooms = getRooms();
  const availableRooms = rooms.filter(r => r.status === 'available');
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-md w-full p-6 fade-in max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold">Walk-in / จองใหม่</h3>
        <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
      <form id="walkin-form" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อลูกค้า *</label>
          <input type="text" id="walkin-name" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="ชื่อ-นามสกุล" required>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์ *</label>
          <input type="tel" id="walkin-phone" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="0xx-xxx-xxxx" required>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ห้องพัก *</label>
          <select id="walkin-room" class="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
            <option value="">เลือกห้อง</option>
            ${availableRooms.map(r => `<option value="${r.id}">ห้อง ${r.number} - ${r.name} (${formatCurrency(r.pricePerNight)})</option>`).join('')}
          </select>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">เข้าพัก *</label>
            <input type="date" id="walkin-checkin" class="w-full px-4 py-2 border border-gray-300 rounded-lg" value="${today}" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ออก *</label>
            <input type="date" id="walkin-checkout" class="w-full px-4 py-2 border border-gray-300 rounded-lg" value="${tomorrow}" required>
          </div>
        </div>
        <button type="submit" class="w-full bg-primary hover:bg-green-800 text-white font-semibold py-3 rounded-xl">
          <i class="fas fa-check mr-2"></i>สร้างการจอง
        </button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('walkin-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const rooms = getRooms();
    const bookings = getBookings();
    
    const roomId = document.getElementById('walkin-room').value;
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    const checkIn = new Date(document.getElementById('walkin-checkin').value);
    const checkOut = new Date(document.getElementById('walkin-checkout').value);
    const nights = Math.ceil((checkOut - checkIn) / 86400000);

    const newBooking = {
      id: Date.now().toString(),
      bookingCode: 'BK' + String(bookings.length + 1).padStart(3, '0'),
      guestName: document.getElementById('walkin-name').value,
      guestPhone: document.getElementById('walkin-phone').value,
      guestEmail: '',
      guestNote: '',
      roomId: room.id,
      roomNumber: room.number,
      roomName: room.name,
      checkInDate: document.getElementById('walkin-checkin').value,
      checkOutDate: document.getElementById('walkin-checkout').value,
      nights,
      adults: 2,
      children: 0,
      status: 'confirmed',
      paymentStatus: 'pending',
      roomPrice: room.pricePerNight,
      totalAmount: room.pricePerNight * nights,
      paidAmount: 0,
      createdAt: new Date().toISOString()
    };

    bookings.push(newBooking);
    saveBookings(bookings);
    
    showToast('สร้างการจองสำเร็จ');
    modal.remove();
    loadPage('pos');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

// Bar Page
function renderBar() {
  const products = getProducts();
  const orders = getOrders();
  const today = new Date().toDateString();
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);

  return `
    <div class="fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">บาร์ / มินิบาร์</h1>
          <p class="text-gray-500">ขายเครื่องดื่มและของว่าง</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="px-4 py-2 bg-gray-100 rounded-full text-lg">
            <i class="fas fa-shopping-cart mr-2"></i>${cart.length} รายการ
          </span>
          <button onclick="showCheckoutModal()" class="bg-primary hover:bg-green-800 text-white px-4 py-2 rounded-xl ${cart.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}" ${cart.length === 0 ? 'disabled' : ''}>
            <i class="fas fa-receipt mr-2"></i>คิดเงิน ${formatCurrency(cart.reduce((sum, item) => sum + item.totalPrice, 0))}
          </button>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Products -->
        <div class="lg:col-span-2">
          <!-- Category Filter -->
          <div class="flex gap-2 mb-4 overflow-x-auto pb-2">
            <button onclick="filterBarProducts('all')" class="px-4 py-2 bg-primary text-white rounded-lg whitespace-nowrap">ทั้งหมด</button>
            <button onclick="filterBarProducts('beverage')" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg whitespace-nowrap">เครื่องดื่ม</button>
            <button onclick="filterBarProducts('alcohol')" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg whitespace-nowrap">แอลกอฮอล์</button>
            <button onclick="filterBarProducts('snack')" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg whitespace-nowrap">ของว่าง</button>
          </div>

          <!-- Products Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" id="bar-products">
            ${products.filter(p => p.isActive && p.stock > 0).map(product => `
              <div class="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-lg transition-shadow" onclick="addToCart('${product.id}')">
                <div class="flex items-center justify-between mb-2">
                  <i class="fas ${getCategoryIcon(product.category)} text-gray-400"></i>
                  ${cart.find(c => c.productId === product.id) ? `<span class="px-2 py-1 bg-primary text-white text-xs rounded-full">${cart.find(c => c.productId === product.id).quantity}</span>` : ''}
                </div>
                <p class="font-medium text-sm line-clamp-2">${product.name}</p>
                <p class="text-xs text-gray-500">${product.code}</p>
                <div class="mt-2 flex items-center justify-between">
                  <p class="font-bold text-primary">${formatCurrency(product.price)}</p>
                  <p class="text-xs text-gray-500">เหลือ ${product.stock}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Cart -->
        <div class="bg-white rounded-2xl shadow-sm p-6 h-fit">
          <h3 class="text-lg font-bold mb-4"><i class="fas fa-shopping-cart mr-2"></i>ตะกร้า (${cart.length})</h3>
          ${cart.length > 0 ? `
            <div class="space-y-3">
              ${cart.map(item => `
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div class="flex-1">
                    <p class="font-medium text-sm">${item.productName}</p>
                    <p class="text-xs text-gray-500">${formatCurrency(item.unitPrice)} x ${item.quantity}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <button onclick="updateCartQuantity('${item.id}', -1)" class="w-7 h-7 border rounded flex items-center justify-center hover:bg-gray-100">
                      <i class="fas fa-minus text-xs"></i>
                    </button>
                    <span class="w-8 text-center">${item.quantity}</span>
                    <button onclick="updateCartQuantity('${item.id}', 1)" class="w-7 h-7 border rounded flex items-center justify-center hover:bg-gray-100">
                      <i class="fas fa-plus text-xs"></i>
                    </button>
                    <button onclick="removeFromCart('${item.id}')" class="w-7 h-7 text-red-500 hover:bg-red-50 rounded">
                      <i class="fas fa-trash text-xs"></i>
                    </button>
                  </div>
                </div>
              `).join('')}
              <div class="pt-4 border-t">
                <div class="flex justify-between items-center">
                  <span class="text-lg font-bold">รวมทั้งสิ้น</span>
                  <span class="text-2xl font-bold text-primary">${formatCurrency(cart.reduce((sum, item) => sum + item.totalPrice, 0))}</span>
                </div>
                <button onclick="showCheckoutModal()" class="w-full mt-4 bg-primary hover:bg-green-800 text-white py-3 rounded-xl">
                  <i class="fas fa-receipt mr-2"></i>คิดเงิน
                </button>
              </div>
            </div>
          ` : `
            <div class="text-center py-8 text-gray-400">
              <i class="fas fa-shopping-cart text-5xl mb-4"></i>
              <p>ตะกร้าว่างเปล่า</p>
              <p class="text-sm">เลือกสินค้าเพื่อเพิ่มลงตะกร้า</p>
            </div>
          `}
        </div>
      </div>

      <!-- Today's Orders -->
      <div class="mt-8 bg-white rounded-2xl shadow-sm p-6">
        <h3 class="text-lg font-bold mb-4">ออเดอร์วันนี้ (${todayOrders.length})</h3>
        ${todayOrders.length > 0 ? `
          <div class="space-y-3">
            ${todayOrders.map(order => `
              <div class="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p class="font-medium">${order.orderCode}</p>
                  <p class="text-sm text-gray-500">${order.guestName || 'ลูกค้าทั่วไป'} • ${order.items.length} รายการ</p>
                </div>
                <div class="text-right">
                  <p class="font-bold">${formatCurrency(order.total)}</p>
                  <span class="px-2 py-1 text-xs rounded-full ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}">${order.status === 'completed' ? 'เสร็จสิ้น' : 'กำลังดำเนินการ'}</span>
                </div>
              </div>
            `).join('')}
          </div>
        ` : '<p class="text-gray-400 text-center py-4">ยังไม่มีออเดอร์วันนี้</p>'}
      </div>
    </div>
  `;
}

function initBar() {
  // Bar-specific initialization if needed
}

function getCategoryIcon(category) {
  const icons = { beverage: 'fa-coffee', alcohol: 'fa-wine-glass', snack: 'fa-cookie', other: 'fa-box' };
  return icons[category] || 'fa-box';
}

function filterBarProducts(category) {
  const products = getProducts();
  const container = document.getElementById('bar-products');
  const filtered = category === 'all' ? products.filter(p => p.isActive && p.stock > 0) : products.filter(p => p.isActive && p.stock > 0 && p.category === category);

  container.innerHTML = filtered.map(product => `
    <div class="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-lg transition-shadow" onclick="addToCart('${product.id}')">
      <div class="flex items-center justify-between mb-2">
        <i class="fas ${getCategoryIcon(product.category)} text-gray-400"></i>
        ${cart.find(c => c.productId === product.id) ? `<span class="px-2 py-1 bg-primary text-white text-xs rounded-full">${cart.find(c => c.productId === product.id).quantity}</span>` : ''}
      </div>
      <p class="font-medium text-sm line-clamp-2">${product.name}</p>
      <p class="text-xs text-gray-500">${product.code}</p>
      <div class="mt-2 flex items-center justify-between">
        <p class="font-bold text-primary">${formatCurrency(product.price)}</p>
        <p class="text-xs text-gray-500">เหลือ ${product.stock}</p>
      </div>
    </div>
  `).join('');
}

function addToCart(productId) {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.productId === productId);
  if (existingItem) {
    existingItem.quantity++;
    existingItem.totalPrice = existingItem.quantity * existingItem.unitPrice;
  } else {
    cart.push({
      id: Date.now().toString(),
      productId: product.id,
      productName: product.name,
      quantity: 1,
      unitPrice: product.price,
      totalPrice: product.price
    });
  }

  showToast(`เพิ่ม ${product.name} ลงตะกร้า`);
  loadPage('bar');
}

function updateCartQuantity(itemId, delta) {
  const item = cart.find(c => c.id === itemId);
  if (!item) return;

  item.quantity = Math.max(1, item.quantity + delta);
  item.totalPrice = item.quantity * item.unitPrice;
  loadPage('bar');
}

function removeFromCart(itemId) {
  cart = cart.filter(c => c.id !== itemId);
  loadPage('bar');
}

function showCheckoutModal() {
  if (cart.length === 0) return;

  const bookings = getBookings();
  const activeBookings = bookings.filter(b => b.status === 'checked_in');
  const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-md w-full p-6 fade-in">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold">คิดเงิน</h3>
        <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
      <div class="bg-gray-50 p-4 rounded-lg mb-4 max-h-40 overflow-y-auto">
        ${cart.map(item => `
          <div class="flex justify-between py-1">
            <span class="text-sm">${item.productName} x ${item.quantity}</span>
            <span class="text-sm font-medium">${formatCurrency(item.totalPrice)}</span>
          </div>
        `).join('')}
        <div class="border-t mt-2 pt-2 flex justify-between">
          <span class="font-bold">รวมทั้งสิ้น</span>
          <span class="font-bold text-primary">${formatCurrency(total)}</span>
        </div>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">คิดเงินเข้าห้อง (ถ้ามี)</label>
        <select id="checkout-room" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
          <option value="">ลูกค้าทั่วไป</option>
          ${activeBookings.map(b => `<option value="${b.roomId}">ห้อง ${b.roomNumber} - ${b.guestName}</option>`).join('')}
        </select>
      </div>
      <div class="mb-4" id="payment-method-container">
        <label class="block text-sm font-medium text-gray-700 mb-2">วิธีการชำระเงิน</label>
        <div class="grid grid-cols-3 gap-2">
          <button type="button" onclick="selectPaymentMethod('cash')" class="payment-btn px-3 py-2 border rounded-lg text-center hover:bg-gray-50 bg-primary text-white border-primary" data-method="cash">เงินสด</button>
          <button type="button" onclick="selectPaymentMethod('card')" class="payment-btn px-3 py-2 border rounded-lg text-center hover:bg-gray-50" data-method="card">บัตร</button>
          <button type="button" onclick="selectPaymentMethod('transfer')" class="payment-btn px-3 py-2 border rounded-lg text-center hover:bg-gray-50" data-method="transfer">โอน</button>
        </div>
      </div>
      <button onclick="processCheckout()" class="w-full bg-primary hover:bg-green-800 text-white py-3 rounded-xl">
        <i class="fas fa-receipt mr-2"></i>ยืนยันการขาย
      </button>
    </div>
  `;
  document.body.appendChild(modal);

  // Handle room selection
  const roomSelect = document.getElementById('checkout-room');
  const paymentContainer = document.getElementById('payment-method-container');
  roomSelect.addEventListener('change', (e) => {
    if (e.target.value) {
      paymentContainer.classList.add('hidden');
    } else {
      paymentContainer.classList.remove('hidden');
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

let selectedPaymentMethod = 'cash';

function selectPaymentMethod(method) {
  selectedPaymentMethod = method;
  document.querySelectorAll('.payment-btn').forEach(btn => {
    btn.classList.remove('bg-primary', 'text-white', 'border-primary');
    if (btn.dataset.method === method) {
      btn.classList.add('bg-primary', 'text-white', 'border-primary');
    }
  });
}

function processCheckout() {
  const orders = getOrders();
  const products = getProducts();
  
  const roomId = document.getElementById('checkout-room').value;
  const bookings = getBookings();
  const room = roomId ? bookings.find(b => b.roomId === roomId) : null;

  const newOrder = {
    id: Date.now().toString(),
    orderCode: 'ORD' + String(orders.length + 1).padStart(3, '0'),
    roomId: room?.roomId,
    roomNumber: room?.roomNumber,
    guestName: room?.guestName,
    items: [...cart],
    subtotal: cart.reduce((sum, item) => sum + item.totalPrice, 0),
    discount: 0,
    total: cart.reduce((sum, item) => sum + item.totalPrice, 0),
    status: 'completed',
    paymentMethod: roomId ? 'room_charge' : selectedPaymentMethod,
    createdAt: new Date().toISOString()
  };

  orders.push(newOrder);
  saveOrders(orders);

  // Update stock
  cart.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    if (product) product.stock -= item.quantity;
  });
  saveProducts(products);

  cart = [];
  showToast('บันทึกออเดอร์สำเร็จ');
  document.querySelector('.fixed.inset-0').remove();
  loadPage('bar');
}

// Reports Page
function renderReports() {
  const bookings = getBookings();
  const orders = getOrders();
  
  const today = new Date();
  const todayStr = today.toDateString();
  const todayRevenue = bookings.filter(b => new Date(b.checkInDate).toDateString() === todayStr).reduce((sum, b) => sum + b.paidAmount, 0);
  const todayBarRevenue = orders.filter(o => new Date(o.createdAt).toDateString() === todayStr).reduce((sum, o) => sum + o.total, 0);
  const totalRevenue = todayRevenue + todayBarRevenue;

  return `
    <div class="fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">รายงานและสถิติ</h1>
          <p class="text-gray-500">สรุปรายได้และสถิติการใช้งาน</p>
        </div>
        <div class="flex items-center gap-2">
          <select id="report-period" onchange="updateReportPeriod()" class="px-4 py-2 border border-gray-300 rounded-xl">
            <option value="today">วันนี้</option>
            <option value="week">สัปดาห์นี้</option>
            <option value="month">เดือนนี้</option>
          </select>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-money-bill-wave text-green-600"></i>
            </div>
            <span class="text-sm text-gray-500">รายได้รวม</span>
          </div>
          <p class="text-2xl font-bold">${formatCurrency(totalRevenue)}</p>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-bed text-blue-600"></i>
            </div>
            <span class="text-sm text-gray-500">รายได้ห้องพัก</span>
          </div>
          <p class="text-2xl font-bold">${formatCurrency(todayRevenue)}</p>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-wine-glass text-purple-600"></i>
            </div>
            <span class="text-sm text-gray-500">รายได้บาร์</span>
          </div>
          <p class="text-2xl font-bold">${formatCurrency(todayBarRevenue)}</p>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-users text-orange-600"></i>
            </div>
            <span class="text-sm text-gray-500">ลูกค้า</span>
          </div>
          <p class="text-2xl font-bold">${bookings.filter(b => new Date(b.checkInDate).toDateString() === todayStr).length}</p>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid lg:grid-cols-2 gap-6 mb-8">
        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <h3 class="text-lg font-bold mb-4">รายได้แยกตามประเภท</h3>
          <canvas id="revenue-chart" height="200"></canvas>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <h3 class="text-lg font-bold mb-4">สถานะห้องพัก</h3>
          <canvas id="room-status-chart" height="200"></canvas>
        </div>
      </div>

      <!-- Top Products -->
      <div class="bg-white rounded-2xl p-6 shadow-sm mb-8">
        <h3 class="text-lg font-bold mb-4">สินค้าขายดี</h3>
        <div class="space-y-3">
          ${getProducts().slice(0, 5).map((p, i) => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center gap-3">
                <span class="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm">${i + 1}</span>
                <div>
                  <p class="font-medium">${p.name}</p>
                  <p class="text-xs text-gray-500">${p.category === 'beverage' ? 'เครื่องดื่ม' : p.category === 'alcohol' ? 'แอลกอฮอล์' : 'ของว่าง'}</p>
                </div>
              </div>
              <p class="font-bold">${formatCurrency(p.price)}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="bg-white rounded-2xl p-6 shadow-sm">
        <h3 class="text-lg font-bold mb-4">ออเดอร์ล่าสุด</h3>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">รหัส</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">ลูกค้า/ห้อง</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">รายการ</th>
                <th class="px-4 py-3 text-right text-sm font-medium text-gray-700">ยอดรวม</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              ${orders.slice(-5).reverse().map(order => `
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-3 font-medium">${order.orderCode}</td>
                  <td class="px-4 py-3">${order.guestName || 'ลูกค้าทั่วไป'} ${order.roomNumber ? `(ห้อง ${order.roomNumber})` : ''}</td>
                  <td class="px-4 py-3">${order.items.length} รายการ</td>
                  <td class="px-4 py-3 text-right font-bold">${formatCurrency(order.total)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function initReports() {
  const rooms = getRooms();
  const bookings = getBookings();
  const orders = getOrders();
  
  // Revenue Chart
  const revenueCtx = document.getElementById('revenue-chart');
  if (revenueCtx) {
    new Chart(revenueCtx, {
      type: 'doughnut',
      data: {
        labels: ['ห้องพัก', 'บาร์/มินิบาร์'],
        datasets: [{
          data: [
            bookings.reduce((sum, b) => sum + b.paidAmount, 0),
            orders.reduce((sum, o) => sum + o.total, 0)
          ],
          backgroundColor: ['#2D5A4A', '#D4A574'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  // Room Status Chart
  const roomCtx = document.getElementById('room-status-chart');
  if (roomCtx) {
    new Chart(roomCtx, {
      type: 'bar',
      data: {
        labels: ['ว่าง', 'มีผู้เข้าพัก', 'กำลังทำความสะอาด', 'ซ่อมบำรุง', 'จองแล้ว'],
        datasets: [{
          label: 'จำนวนห้อง',
          data: [
            rooms.filter(r => r.status === 'available').length,
            rooms.filter(r => r.status === 'occupied').length,
            rooms.filter(r => r.status === 'cleaning').length,
            rooms.filter(r => r.status === 'maintenance').length,
            rooms.filter(r => r.status === 'reserved').length
          ],
          backgroundColor: ['#22c55e', '#3b82f6', '#eab308', '#ef4444', '#a855f7']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
      }
    });
  }
}

function updateReportPeriod() {
  const period = document.getElementById('report-period').value;
  showToast(`เปลี่ยนเป็นช่วงเวลา: ${period === 'today' ? 'วันนี้' : period === 'week' ? 'สัปดาห์นี้' : 'เดือนนี้'}`);
}

// Users Page
function renderUsers() {
  const users = getUsers();
  
  return `
    <div class="fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">จัดการพนักงาน</h1>
          <p class="text-gray-500">เพิ่ม แก้ไข และจัดการสิทธิ์ผู้ใช้งาน</p>
        </div>
        <button onclick="showAddUserModal()" class="bg-primary hover:bg-green-800 text-white px-4 py-2 rounded-xl transition-colors">
          <i class="fas fa-plus mr-2"></i>เพิ่มพนักงาน
        </button>
      </div>

      <!-- Users Table -->
      <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">ผู้ใช้</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">ตำแหน่ง</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">เบอร์โทร</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">สถานะ</th>
                <th class="px-4 py-3 text-right text-sm font-medium text-gray-700">จัดการ</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              ${users.map(user => `
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">${user.name.charAt(0)}</div>
                      <div>
                        <p class="font-medium">${user.name}</p>
                        <p class="text-xs text-gray-500">@${user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <span class="px-2 py-1 rounded-full text-xs ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}">
                      ${user.role === 'admin' ? 'เจ้าของ' : 'พนักงาน'}
                    </span>
                  </td>
                  <td class="px-4 py-3">${user.phone || '-'}</td>
                  <td class="px-4 py-3">
                    <span class="px-2 py-1 rounded-full text-xs ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                      ${user.isActive ? 'ใช้งาน' : 'ระงับ'}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button onclick="editUser('${user.id}')" class="p-2 text-gray-400 hover:text-primary">
                        <i class="fas fa-edit"></i>
                      </button>
                      ${user.id !== '1' ? `
                        <button onclick="toggleUserStatus('${user.id}')" class="p-2 ${user.isActive ? 'text-red-400 hover:text-red-600' : 'text-green-400 hover:text-green-600'}">
                          <i class="fas ${user.isActive ? 'fa-ban' : 'fa-check'}"></i>
                        </button>
                      ` : ''}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function showAddUserModal() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-md w-full p-6 fade-in">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold">เพิ่มพนักงานใหม่</h3>
        <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
      <form id="add-user-form" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ใช้ *</label>
          <input type="text" id="new-username" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="username" required>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล *</label>
          <input type="text" id="new-name" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="ชื่อพนักงาน" required>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน *</label>
          <input type="password" id="new-password" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="รหัสผ่าน" required>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ตำแหน่ง</label>
          <select id="new-role" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
            <option value="staff">พนักงาน</option>
            <option value="admin">เจ้าของ</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">เบอร์โทร</label>
          <input type="tel" id="new-phone" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="0xx-xxx-xxxx">
        </div>
        <button type="submit" class="w-full bg-primary hover:bg-green-800 text-white font-semibold py-3 rounded-xl">
          <i class="fas fa-plus mr-2"></i>เพิ่มพนักงาน
        </button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('add-user-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const users = getUsers();
    const newUser = {
      id: Date.now().toString(),
      username: document.getElementById('new-username').value,
      name: document.getElementById('new-name').value,
      role: document.getElementById('new-role').value,
      phone: document.getElementById('new-phone').value,
      isActive: true
    };
    users.push(newUser);
    saveUsers(users);
    showToast('เพิ่มพนักงานสำเร็จ');
    modal.remove();
    loadPage('users');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

function editUser(userId) {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return;

  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-md w-full p-6 fade-in">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold">แก้ไขพนักงาน</h3>
        <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
      <form id="edit-user-form" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
          <input type="text" id="edit-name" class="w-full px-4 py-2 border border-gray-300 rounded-lg" value="${user.name}" required>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">เบอร์โทร</label>
          <input type="tel" id="edit-phone" class="w-full px-4 py-2 border border-gray-300 rounded-lg" value="${user.phone || ''}">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ตำแหน่ง</label>
          <select id="edit-role" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
            <option value="staff" ${user.role === 'staff' ? 'selected' : ''}>พนักงาน</option>
            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>เจ้าของ</option>
          </select>
        </div>
        <button type="submit" class="w-full bg-primary hover:bg-green-800 text-white font-semibold py-3 rounded-xl">
          <i class="fas fa-save mr-2"></i>บันทึก
        </button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('edit-user-form').addEventListener('submit', (e) => {
    e.preventDefault();
    user.name = document.getElementById('edit-name').value;
    user.phone = document.getElementById('edit-phone').value;
    user.role = document.getElementById('edit-role').value;
    saveUsers(users);
    showToast('บันทึกสำเร็จ');
    modal.remove();
    loadPage('users');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

function toggleUserStatus(userId) {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (user) {
    user.isActive = !user.isActive;
    saveUsers(users);
    showToast(user.isActive ? 'เปิดใช้งานผู้ใช้แล้ว' : 'ระงับผู้ใช้แล้ว');
    loadPage('users');
  }
}

// Settings Page
function renderSettings() {
  return `
    <div class="fade-in">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-800">ตั้งค่าระบบ</h1>
        <p class="text-gray-500">กำหนดค่าต่างๆ ของระบบ</p>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <!-- General Settings -->
        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <h3 class="text-lg font-bold mb-4"><i class="fas fa-hotel mr-2 text-primary"></i>ข้อมูลรีสอร์ท</h3>
          <form id="resort-settings" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อรีสอร์ท</label>
              <input type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg" value="YadaHomestay">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ที่อยู่</label>
              <textarea class="w-full px-4 py-2 border border-gray-300 rounded-lg" rows="2">123 ถนนสุขุมวิท กรุงเทพฯ</textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">เบอร์โทร</label>
              <input type="tel" class="w-full px-4 py-2 border border-gray-300 rounded-lg" value="081-234-5678">
            </div>
            <button type="submit" class="w-full bg-primary hover:bg-green-800 text-white py-2 rounded-lg">
              <i class="fas fa-save mr-2"></i>บันทึก
            </button>
          </form>
        </div>

        <!-- Pricing Settings -->
        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <h3 class="text-lg font-bold mb-4"><i class="fas fa-tag mr-2 text-primary"></i>ราคาห้องพัก</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p class="font-medium">ห้องมาตรฐาน</p>
                <p class="text-xs text-gray-500">2 ท่าน</p>
              </div>
              <p class="font-bold text-primary">฿1,200</p>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p class="font-medium">ห้องดีลักซ์</p>
                <p class="text-xs text-gray-500">2 ท่าน</p>
              </div>
              <p class="font-bold text-primary">฿1,800</p>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p class="font-medium">ห้องแฟมิลี่</p>
                <p class="text-xs text-gray-500">4 ท่าน</p>
              </div>
              <p class="font-bold text-primary">฿2,800</p>
            </div>
            <button class="w-full border border-primary text-primary py-2 rounded-lg hover:bg-primary hover:text-white transition-colors">
              <i class="fas fa-edit mr-2"></i>แก้ไขราคา
            </button>
          </div>
        </div>

        <!-- Notification Settings -->
        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <h3 class="text-lg font-bold mb-4"><i class="fas fa-bell mr-2 text-primary"></i>การแจ้งเตือน</h3>
          <div class="space-y-3">
            <label class="flex items-center justify-between cursor-pointer">
              <span>แจ้งเตือนการจองใหม่</span>
              <input type="checkbox" checked class="w-5 h-5 text-primary rounded">
            </label>
            <label class="flex items-center justify-between cursor-pointer">
              <span>แจ้งเตือน Check-in</span>
              <input type="checkbox" checked class="w-5 h-5 text-primary rounded">
            </label>
            <label class="flex items-center justify-between cursor-pointer">
              <span>แจ้งเตือน Check-out</span>
              <input type="checkbox" checked class="w-5 h-5 text-primary rounded">
            </label>
            <label class="flex items-center justify-between cursor-pointer">
              <span>แจ้งเตือนสต็อกสินค้าต่ำ</span>
              <input type="checkbox" checked class="w-5 h-5 text-primary rounded">
            </label>
          </div>
        </div>

        <!-- System Settings -->
        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <h3 class="text-lg font-bold mb-4"><i class="fas fa-cog mr-2 text-primary"></i>ระบบ</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span>เวอร์ชัน</span>
              <span class="text-gray-500">1.0.0</span>
            </div>
            <div class="flex items-center justify-between">
              <span>ภาษา</span>
              <select class="px-3 py-1 border border-gray-300 rounded-lg">
                <option value="th">ไทย</option>
                <option value="en">English</option>
              </select>
            </div>
            <button onclick="resetData()" class="w-full border border-red-300 text-red-600 py-2 rounded-lg hover:bg-red-50 transition-colors">
              <i class="fas fa-trash mr-2"></i>รีเซ็ตข้อมูลทั้งหมด
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function resetData() {
  if (confirm('คุณแน่ใจหรือไม่ที่จะรีเซ็ตข้อมูลทั้งหมด? การกระทำนี้ไม่สามารถย้อนกลับได้')) {
    localStorage.removeItem('yada_rooms');
    localStorage.removeItem('yada_bookings');
    localStorage.removeItem('yada_products');
    localStorage.removeItem('yada_orders');
    localStorage.removeItem('yada_users');
    location.reload();
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initLogin();
  initNavigation();
});