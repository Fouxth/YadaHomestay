// YadaHomestay Frontend JavaScript
// Shared data with admin system via localStorage

// Initialize data if not exists
function initData() {
  if (!localStorage.getItem('yada_rooms')) {
    const defaultRooms = [
      { id: '1', number: '101', name: 'ห้องมาตรฐาน 101', type: 'standard', status: 'available', pricePerNight: 1200, capacity: 2, amenities: ['แอร์', 'ทีวี', 'ตู้เย็น', 'ไวไฟ'], floor: 1, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600' },
      { id: '2', number: '102', name: 'ห้องมาตรฐาน 102', type: 'standard', status: 'available', pricePerNight: 1200, capacity: 2, amenities: ['แอร์', 'ทีวี', 'ตู้เย็น', 'ไวไฟ'], floor: 1, image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600' },
      { id: '3', number: '103', name: 'ห้องมาตรฐาน 103', type: 'standard', status: 'available', pricePerNight: 1200, capacity: 2, amenities: ['แอร์', 'ทีวี', 'ตู้เย็น', 'ไวไฟ'], floor: 1, image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600' },
      { id: '4', number: '201', name: 'ห้องดีลักซ์ 201', type: 'deluxe', status: 'available', pricePerNight: 1800, capacity: 2, amenities: ['แอร์', 'ทีวี', 'ตู้เย็น', 'ไวไฟ', 'อ่างอาบน้ำ', 'ระเบียง'], floor: 2, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600' },
      { id: '5', number: '202', name: 'ห้องดีลักซ์ 202', type: 'deluxe', status: 'available', pricePerNight: 1800, capacity: 2, amenities: ['แอร์', 'ทีวี', 'ตู้เย็น', 'ไวไฟ', 'อ่างอาบน้ำ', 'ระเบียง'], floor: 2, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600' },
      { id: '6', number: '301', name: 'ห้องแฟมิลี่ 301', type: 'family', status: 'available', pricePerNight: 2800, capacity: 4, amenities: ['แอร์', 'ทีวี', 'ตู้เย็น', 'ไวไฟ', 'ห้องนั่งเล่น', 'ครัวเล็ก'], floor: 3, image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600' },
      { id: '7', number: '302', name: 'ห้องแฟมิลี่ 302', type: 'family', status: 'available', pricePerNight: 2800, capacity: 4, amenities: ['แอร์', 'ทีวี', 'ตู้เย็น', 'ไวไฟ', 'ห้องนั่งเล่น', 'ครัวเล็ก'], floor: 3, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600' },
      { id: '8', number: '303', name: 'ห้องแฟมิลี่ 303', type: 'family', status: 'available', pricePerNight: 2800, capacity: 4, amenities: ['แอร์', 'ทีวี', 'ตู้เย็น', 'ไวไฟ', 'ห้องนั่งเล่น', 'ครัวเล็ก'], floor: 3, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600' }
    ];
    localStorage.setItem('yada_rooms', JSON.stringify(defaultRooms));
  }
  
  if (!localStorage.getItem('yada_bookings')) {
    localStorage.setItem('yada_bookings', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('yada_products')) {
    const defaultProducts = [
      { id: '1', code: 'P001', name: 'น้ำดื่ม', category: 'beverage', price: 20, stock: 100, unit: 'ขวด', isActive: true },
      { id: '2', code: 'P002', name: 'โค้ก', category: 'beverage', price: 25, stock: 50, unit: 'กระป๋อง', isActive: true },
      { id: '3', code: 'P003', name: 'เบียร์สิงห์', category: 'alcohol', price: 70, stock: 30, unit: 'กระป๋อง', isActive: true },
      { id: '4', code: 'P004', name: 'เบียร์ช้าง', category: 'alcohol', price: 75, stock: 25, unit: 'กระป๋อง', isActive: true },
      { id: '5', code: 'P005', name: 'มาม่า', category: 'snack', price: 15, stock: 80, unit: 'ซอง', isActive: true },
      { id: '6', code: 'P006', name: 'ขนมปัง', category: 'snack', price: 25, stock: 20, unit: 'ชิ้น', isActive: true }
    ];
    localStorage.setItem('yada_products', JSON.stringify(defaultProducts));
  }
  
  if (!localStorage.getItem('yada_orders')) {
    localStorage.setItem('yada_orders', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('yada_users')) {
    const defaultUsers = [
      { id: '1', username: 'admin', name: 'เจ้าของรีสอร์ท', role: 'admin', phone: '081-234-5678', email: 'admin@yadahomestay.com', isActive: true },
      { id: '2', username: 'staff1', name: 'พนักงาน คนที่ 1', role: 'staff', phone: '082-345-6789', isActive: true },
      { id: '3', username: 'staff2', name: 'พนักงาน คนที่ 2', role: 'staff', phone: '083-456-7890', isActive: true }
    ];
    localStorage.setItem('yada_users', JSON.stringify(defaultUsers));
  }
}

// Get data from localStorage
function getRooms() {
  return JSON.parse(localStorage.getItem('yada_rooms') || '[]');
}

function getBookings() {
  return JSON.parse(localStorage.getItem('yada_bookings') || '[]');
}

function saveBooking(booking) {
  const bookings = getBookings();
  bookings.push(booking);
  localStorage.setItem('yada_bookings', JSON.stringify(bookings));
}

function updateRoomStatus(roomId, status) {
  const rooms = getRooms();
  const room = rooms.find(r => r.id === roomId);
  if (room) {
    room.status = status;
    localStorage.setItem('yada_rooms', JSON.stringify(rooms));
  }
}

// Utility functions
function formatCurrency(amount) {
  return '฿' + amount.toLocaleString('th-TH');
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
}

function generateBookingCode() {
  const bookings = getBookings();
  const count = bookings.length + 1;
  return 'BK' + String(count).padStart(3, '0');
}

// Check room availability
function isRoomAvailable(roomId, checkIn, checkOut) {
  const bookings = getBookings();
  const room = getRooms().find(r => r.id === roomId);
  
  if (!room || room.status === 'maintenance') return false;
  
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  // Check for overlapping bookings
  const overlapping = bookings.filter(b => {
    if (b.roomId !== roomId) return false;
    if (b.status === 'cancelled') return false;
    
    const bCheckIn = new Date(b.checkInDate);
    const bCheckOut = new Date(b.checkOutDate);
    
    return (checkInDate < bCheckOut && checkOutDate > bCheckIn);
  });
  
  return overlapping.length === 0;
}

// Get available rooms for date range
function getAvailableRooms(checkIn, checkOut, guests) {
  const rooms = getRooms();
  return rooms.filter(room => {
    if (room.capacity < guests) return false;
    return isRoomAvailable(room.id, checkIn, checkOut);
  });
}

// Booking state
let bookingState = {
  checkIn: null,
  checkOut: null,
  nights: 0,
  adults: 2,
  children: 0,
  selectedRoom: null,
  guestInfo: {}
};

// Render rooms section
function renderRooms() {
  const rooms = getRooms();
  const container = document.getElementById('rooms-grid');
  if (!container) return;
  
  const typeLabels = {
    standard: 'มาตรฐาน',
    deluxe: 'ดีลักซ์',
    family: 'แฟมิลี่'
  };
  
  container.innerHTML = rooms.map(room => `
    <div class="room-card bg-white rounded-2xl shadow-lg overflow-hidden card-hover scroll-reveal">
      <div class="relative h-48 overflow-hidden">
        <img src="${room.image}" alt="${room.name}" class="w-full h-full object-cover">
        <div class="absolute top-4 left-4">
          <span class="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium">${typeLabels[room.type]}</span>
        </div>
        <div class="room-overlay absolute inset-0 bg-black/50 opacity-0 transition-opacity flex items-center justify-center">
          <button onclick="scrollToBooking('${room.id}')" class="bg-white text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition-colors">
            จองเลย
          </button>
        </div>
      </div>
      <div class="p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-2">${room.name}</h3>
        <div class="flex flex-wrap gap-2 mb-4">
          ${room.amenities.slice(0, 4).map(a => `<span class="px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-600">${a}</span>`).join('')}
        </div>
        <div class="flex items-center justify-between">
          <div>
            <span class="text-2xl font-bold text-primary">${formatCurrency(room.pricePerNight)}</span>
            <span class="text-gray-500 text-sm">/คืน</span>
          </div>
          <div class="text-sm text-gray-500">
            <i class="fas fa-user mr-1"></i>${room.capacity} ท่าน
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// Scroll to booking section with room pre-selected
function scrollToBooking(roomId) {
  const room = getRooms().find(r => r.id === roomId);
  if (room) {
    bookingState.selectedRoom = room;
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    // If already on step 2, refresh
    if (document.getElementById('step-2').classList.contains('active')) {
      renderAvailableRooms();
    }
  }
}

// Booking flow
function goToStep(step) {
  // Validate current step
  if (step === 2) {
    const checkIn = document.getElementById('checkin-date').value;
    const checkOut = document.getElementById('checkout-date').value;
    
    if (!checkIn || !checkOut) {
      showToast('กรุณาเลือกวันที่เข้าพักและวันที่ออก', 'error');
      return;
    }
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (checkOutDate <= checkInDate) {
      showToast('วันที่ออกต้องมากกว่าวันที่เข้าพัก', 'error');
      return;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkInDate < today) {
      showToast('วันที่เข้าพักต้องไม่ย้อนหลัง', 'error');
      return;
    }
    
    bookingState.checkIn = checkIn;
    bookingState.checkOut = checkOut;
    bookingState.nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    bookingState.adults = parseInt(document.getElementById('adults').value);
    bookingState.children = parseInt(document.getElementById('children').value);
    
    renderAvailableRooms();
  }
  
  if (step === 3) {
    if (!bookingState.selectedRoom) {
      showToast('กรุณาเลือกห้องพัก', 'error');
      return;
    }
    updateSummary();
  }
  
  // Update UI
  document.querySelectorAll('.booking-step').forEach(el => el.classList.remove('active'));
  document.getElementById(`step-${step}`).classList.add('active');
  
  // Update step indicators
  document.querySelectorAll('.step-indicator').forEach(el => {
    const stepNum = parseInt(el.dataset.step);
    if (stepNum <= step) {
      el.classList.remove('bg-gray-200', 'text-gray-500');
      el.classList.add('bg-primary', 'text-white');
    } else {
      el.classList.remove('bg-primary', 'text-white');
      el.classList.add('bg-gray-200', 'text-gray-500');
    }
  });
  
  document.querySelectorAll('.step-line').forEach(el => {
    const lineNum = parseInt(el.dataset.line);
    if (lineNum < step) {
      el.classList.remove('bg-gray-200');
      el.classList.add('bg-primary');
    } else {
      el.classList.remove('bg-primary');
      el.classList.add('bg-gray-200');
    }
  });
}

// Render available rooms for booking
function renderAvailableRooms() {
  const container = document.getElementById('available-rooms');
  if (!container) return;
  
  const availableRooms = getAvailableRooms(
    bookingState.checkIn,
    bookingState.checkOut,
    bookingState.adults + bookingState.children
  );
  
  if (availableRooms.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-gray-500">
        <i class="fas fa-calendar-times text-5xl mb-4"></i>
        <p>ไม่มีห้องว่างในช่วงวันที่เลือก</p>
        <p class="text-sm">กรุณาเลือกวันอื่นหรือติดต่อเรา</p>
      </div>
    `;
    return;
  }
  
  const typeLabels = {
    standard: 'มาตรฐาน',
    deluxe: 'ดีลักซ์',
    family: 'แฟมิลี่'
  };
  
  container.innerHTML = availableRooms.map(room => {
    const isSelected = bookingState.selectedRoom && bookingState.selectedRoom.id === room.id;
    const totalPrice = room.pricePerNight * bookingState.nights;
    
    return `
      <div class="room-option border-2 ${isSelected ? 'border-primary bg-primary/5' : 'border-gray-200'} rounded-xl p-4 cursor-pointer hover:border-primary transition-colors"
           onclick="selectRoom('${room.id}')">
        <div class="flex items-center gap-4">
          <img src="${room.image}" alt="${room.name}" class="w-24 h-24 object-cover rounded-lg">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <h4 class="font-bold text-lg">${room.name}</h4>
              <span class="px-2 py-1 bg-gray-100 rounded text-xs">${typeLabels[room.type]}</span>
            </div>
            <p class="text-sm text-gray-500 mb-2">
              <i class="fas fa-user mr-1"></i>${room.capacity} ท่าน | 
              ${room.amenities.slice(0, 3).join(', ')}
            </p>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500">${bookingState.nights} คืน</span>
              <span class="text-xl font-bold text-primary">${formatCurrency(totalPrice)}</span>
            </div>
          </div>
          <div class="w-6 h-6 rounded-full border-2 ${isSelected ? 'border-primary bg-primary' : 'border-gray-300'} flex items-center justify-center">
            ${isSelected ? '<i class="fas fa-check text-white text-xs"></i>' : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  document.getElementById('btn-step-3').disabled = !bookingState.selectedRoom;
}

// Select room
function selectRoom(roomId) {
  const room = getRooms().find(r => r.id === roomId);
  if (room) {
    bookingState.selectedRoom = room;
    renderAvailableRooms();
  }
}

// Update booking summary
function updateSummary() {
  document.getElementById('summary-room').textContent = bookingState.selectedRoom.name;
  document.getElementById('summary-checkin').textContent = formatDate(bookingState.checkIn);
  document.getElementById('summary-checkout').textContent = formatDate(bookingState.checkOut);
  document.getElementById('summary-nights').textContent = bookingState.nights + ' คืน';
  document.getElementById('summary-guests').textContent = `${bookingState.adults} ผู้ใหญ่ ${bookingState.children > 0 ? bookingState.children + ' เด็ก' : ''}`;
  document.getElementById('summary-total').textContent = formatCurrency(bookingState.selectedRoom.pricePerNight * bookingState.nights);
}

// Submit booking
function submitBooking() {
  const name = document.getElementById('guest-name').value.trim();
  const phone = document.getElementById('guest-phone').value.trim();
  const email = document.getElementById('guest-email').value.trim();
  const note = document.getElementById('guest-note').value.trim();
  
  if (!name || !phone) {
    showToast('กรุณากรอกชื่อและเบอร์โทรศัพท์', 'error');
    return;
  }
  
  const bookingCode = generateBookingCode();
  
  const booking = {
    id: Date.now().toString(),
    bookingCode: bookingCode,
    guestName: name,
    guestPhone: phone,
    guestEmail: email,
    guestNote: note,
    roomId: bookingState.selectedRoom.id,
    roomNumber: bookingState.selectedRoom.number,
    roomName: bookingState.selectedRoom.name,
    checkInDate: bookingState.checkIn,
    checkOutDate: bookingState.checkOut,
    nights: bookingState.nights,
    adults: bookingState.adults,
    children: bookingState.children,
    status: 'pending',
    paymentStatus: 'pending',
    roomPrice: bookingState.selectedRoom.pricePerNight,
    totalAmount: bookingState.selectedRoom.pricePerNight * bookingState.nights,
    paidAmount: 0,
    createdAt: new Date().toISOString()
  };
  
  // Save booking
  saveBooking(booking);
  
  // Update room status to reserved
  updateRoomStatus(bookingState.selectedRoom.id, 'reserved');
  
  // Show success modal
  document.getElementById('booking-code').textContent = bookingCode;
  document.getElementById('success-modal').classList.remove('hidden');
  document.getElementById('success-modal').classList.add('flex');
  
  // Reset form
  resetBookingForm();
}

// Reset booking form
function resetBookingForm() {
  document.getElementById('checkin-date').value = '';
  document.getElementById('checkout-date').value = '';
  document.getElementById('adults').value = '2';
  document.getElementById('children').value = '0';
  document.getElementById('guest-name').value = '';
  document.getElementById('guest-phone').value = '';
  document.getElementById('guest-email').value = '';
  document.getElementById('guest-note').value = '';
  
  bookingState = {
    checkIn: null,
    checkOut: null,
    nights: 0,
    adults: 2,
    children: 0,
    selectedRoom: null,
    guestInfo: {}
  };
  
  goToStep(1);
}

// Close success modal
function closeSuccessModal() {
  document.getElementById('success-modal').classList.add('hidden');
  document.getElementById('success-modal').classList.remove('flex');
}

// Toast notification
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg text-white ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} fade-in`;
  toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2"></i>${message}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Set minimum date for date inputs
function setMinDates() {
  const today = new Date().toISOString().split('T')[0];
  const checkInInput = document.getElementById('checkin-date');
  const checkOutInput = document.getElementById('checkout-date');
  
  if (checkInInput) checkInInput.min = today;
  if (checkOutInput) checkOutInput.min = today;
  
  // Update checkout min when checkin changes
  if (checkInInput) {
    checkInInput.addEventListener('change', () => {
      if (checkOutInput) {
        const checkIn = new Date(checkInInput.value);
        checkIn.setDate(checkIn.getDate() + 1);
        checkOutInput.min = checkIn.toISOString().split('T')[0];
      }
    });
  }
}

// Navbar scroll effect
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.remove('bg-transparent');
      navbar.classList.add('bg-primary/95', 'backdrop-blur-lg', 'shadow-lg');
    } else {
      navbar.classList.add('bg-transparent');
      navbar.classList.remove('bg-primary/95', 'backdrop-blur-lg', 'shadow-lg');
    }
  });
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

// Scroll reveal animation
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
}

// Contact form
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('ส่งข้อความสำเร็จ เราจะติดต่อกลับเร็วๆ นี้');
      form.reset();
    });
  }
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) mobileMenu.classList.add('hidden');
      }
    });
  });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  initData();
  renderRooms();
  setMinDates();
  initNavbar();
  initScrollReveal();
  initContactForm();
  initSmoothScroll();
});