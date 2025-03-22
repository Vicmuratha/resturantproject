const datePreset = document.getElementById('datePreset');
const customDate = document.querySelector('.custom-date');
const startDate = document.getElementById('start-date');
const endDate = document.getElementById('end-date');
const userTableBody = document.getElementById('user-table-body');
const addUserBtn = document.querySelector('.add-user-btn');
const deleteUserBtn = document.getElementById('delete-user-btn');
const userForm = document.getElementById('user-details-form');
const feedback = document.getElementById('feedback');
const userFormTitle = document.getElementById('user-form-title');
const sidebarLinks = document.querySelectorAll('.sidebar a');
const sections = document.querySelectorAll('.report-section');

function getDateRange() {
    const today = new Date();
    let start, end;
    switch(datePreset.value) {
        case 'today': start = end = today; break;
        case 'week': start = new Date(today); start.setDate(today.getDate() - 7); end = today; break;
        case 'month': start = new Date(today); start.setMonth(today.getMonth() - 1); end = today; break;
        case 'custom': start = startDate.value ? new Date(startDate.value) : null; end = endDate.value ? new Date(endDate.value) : null; break;
    }
    return { start, end };
}

datePreset.addEventListener('change', function() {
    customDate.style.display = this.value === 'custom' ? 'flex' : 'none';
    if (this.value !== 'custom') { startDate.value = ''; endDate.value = ''; fetchReportData(); }
});

[startDate, endDate].forEach(input => {
    input.addEventListener('change', () => {
        if (datePreset.value === 'custom' && startDate.value && endDate.value) fetchReportData();
    });
});

function showLoading() {
    const metrics = ['total-sales', 'avg-order-value', 'top-selling-item', 'orders-processed', 'total-items', 'low-stock-items', 'most-used-item', 'stock-value'];
    metrics.forEach(metric => document.getElementById(metric).innerHTML = '<i class="fas fa-spinner fa-spin"></i>');
}

function updateReportData(data) {
    document.getElementById('total-sales').textContent = data.sales.total || '';
    document.getElementById('avg-order-value').textContent = data.sales.avgOrder || '';
    document.getElementById('top-selling-item').textContent = data.sales.topItem || '';
    document.getElementById('orders-processed').textContent = data.sales.orders || '';
    document.getElementById('total-items').textContent = data.inventory.total || '';
    document.getElementById('low-stock-items').textContent = data.inventory.lowStock || '';
    document.getElementById('most-used-item').textContent = data.inventory.mostUsed || '';
    document.getElementById('stock-value').textContent = data.inventory.value || '';
}

async function fetchReportData() {
    showLoading();
    try {
        const { start, end } = getDateRange();
        if (start && end && start > end) { console.error('Start date must be before end date'); return; }
        const response = await fetch('/api/reports', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ start, end })
        });
        const data = await response.json();
        updateReportData(data);
    } catch (error) {
        console.error('Error fetching report data:', error);
    }
}

document.querySelectorAll('.export-btn').forEach(btn => {
    btn.addEventListener('click', async function() {
        const format = this.textContent.includes('PDF') ? 'pdf' : 'csv';
        showLoading();
        try {
            const { start, end } = getDateRange();
            await fetch(`/api/export/${format}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ start, end })
            });
            console.log(`Successfully exported to ${format.toUpperCase()}`);
            fetchReportData();
        } catch (error) {
            console.error('Export failed:', error);
        }
    });
});

function showSection(sectionId) {
    sections.forEach(section => {
        section.style.display = section.id === `${sectionId}-section` ? 'block' : 'none';
    });
    sidebarLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
    });
    
    if (sectionId === 'user-management') loadUsers();
    else if (sectionId === 'overview') fetchReportData();
}

sidebarLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const sectionId = this.getAttribute('href').substring(1);
        showSection(sectionId);
    });
});

function showFeedback(element, message, type) {
    element.textContent = message;
    element.className = `feedback-message ${type}`;
    element.classList.add('visible');
    setTimeout(() => element.classList.remove('visible'), 3000);
}

async function loadUsers() {
    try {
        const response = await fetch('/api/users');
        const users = await response.json();
        userTableBody.innerHTML = '';
        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.name}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <button class="edit-btn" data-id="${user.id}"><i class="fas fa-edit"></i> Edit</button>
                </td>
            `;
            userTableBody.appendChild(tr);
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => editUser(btn.dataset.id));
        });
    } catch (error) {
        console.error('Error loading users:', error);
        showFeedback(feedback, 'Failed to load users', 'error');
    }
}

async function editUser(userId) {
    showSection('user-details');
    userFormTitle.textContent = 'Edit User';
    deleteUserBtn.style.display = 'inline-flex';
    document.getElementById('user-id').value = userId;

    try {
        const response = await fetch(`/api/users/${userId}`);
        const user = await response.json();
        document.getElementById('user-name').value = user.name || '';
        document.getElementById('user-username').value = user.username || '';
        document.getElementById('user-email').value = user.email || '';
        document.getElementById('user-phone').value = user.phone || '';
        document.getElementById('user-gender').value = user.gender || '';
        document.getElementById('user-role').value = user.role || 'admin';
    } catch (error) {
        console.error('Error loading user:', error);
        showFeedback(feedback, 'Failed to load user details', 'error');
    }
}

function createNewUser() {
    showSection('user-details');
    userFormTitle.textContent = 'Add New User';
    deleteUserBtn.style.display = 'none';
    userForm.reset();
    document.getElementById('user-id').value = '';
}

async function saveUserDetails(e) {
    e.preventDefault();
    const userId = document.getElementById('user-id').value;
    const userData = {
        name: document.getElementById('user-name').value,
        username: document.getElementById('user-username').value,
        email: document.getElementById('user-email').value,
        phone: document.getElementById('user-phone').value,
        gender: document.getElementById('user-gender').value,
        role: document.getElementById('user-role').value
    };
    
    const saveBtn = userForm.querySelector('.save-btn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

    try {
        const url = userId ? `/api/users/${userId}` : '/api/users';
        const method = userId ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) throw new Error(`${userId ? 'Update' : 'Create'} failed`);
        
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        saveBtn.disabled = false;
        showFeedback(feedback, `User ${userId ? 'updated' : 'created'} successfully!`, 'success');
        
        if (!userId) {
            userForm.reset();
        }
        loadUsers();
    } catch (error) {
        console.error(`Error ${userId ? 'updating' : 'creating'} user:`, error);
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        saveBtn.disabled = false;
        showFeedback(feedback, `Failed to ${userId ? 'update' : 'create'} user`, 'error');
    }
}

async function deleteUser() {
    const userId = document.getElementById('user-id').value;
    if (!userId) return;
    
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    deleteUserBtn.disabled = true;
    deleteUserBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';
    
    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Delete failed');
        
        deleteUserBtn.disabled = false;
        deleteUserBtn.innerHTML = '<i class="fas fa-trash"></i> Delete User';
        showFeedback(feedback, 'User deleted successfully!', 'success');
        userForm.reset();
        showSection('user-management');
        loadUsers();
    } catch (error) {
        console.error('Error deleting user:', error);
        deleteUserBtn.disabled = false;
        deleteUserBtn.innerHTML = '<i class="fas fa-trash"></i> Delete User';
        showFeedback(feedback, 'Failed to delete user', 'error');
    }
}

addUserBtn.addEventListener('click', createNewUser);
deleteUserBtn.addEventListener('click', deleteUser);
userForm.addEventListener('submit', saveUserDetails);

showSection('overview');
fetchReportData();