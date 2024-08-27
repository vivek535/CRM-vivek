document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (token) {
        // Fetch and display customer list on dashboard
        if (window.location.pathname === '/dashboard') {
            fetch('/api/customers/list', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                .then(response => response.json())
                .then(data => {
                    const customerList = document.getElementById('customerList');
                    data.forEach(customer => {
                        customerList.innerHTML += `<div>
              <p>Name: ${customer.name}</p>
              <p>Email: ${customer.email}</p>
              <p>Phone: ${customer.phone}</p>
              <p>Preference: ${customer.preference}</p>
              <button onclick="deleteCustomer('${customer._id}')">Delete</button>
              <button onclick="window.location.href='/add-customer?id=${customer._id}'">Edit</button>
            </div>`;
                    });
                });
        }
        // Fetch and display purchase history
        if (window.location.pathname === '/purchase-history') {
            fetch('/api/purchases/list', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                .then(response => response.json())
                .then(data => {
                    const purchaseTableBody = document.querySelector('#purchaseTable tbody');
                    data.forEach(purchase => {
                        purchaseTableBody.innerHTML += `<tr>
          <td>${purchase.caratType}</td>
          <td>${purchase.hallmarkNumber}</td>
          <td>${purchase.weight}</td>
          <td>${purchase.price}</td>
          <td>${new Date(purchase.date).toLocaleDateString()}</td>
        </tr>`;
                    });
                });
        }

        // Add purchase form submission
        const addPurchaseForm = document.getElementById('addPurchaseForm');
        if (addPurchaseForm) {
            addPurchaseForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const caratType = document.getElementById('caratType').value;
                const hallmarkNumber = document.getElementById('hallmarkNumber').value;
                const weight = document.getElementById('weight').value;
                const price = document.getElementById('price').value;

                fetch('/api/purchases/add', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({ caratType, hallmarkNumber, weight, price })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.message) {
                            alert(data.message);
                            window.location.href = '/purchase-history';
                        } else {
                            alert(data.error);
                        }
                    });
            });
        }
        // Fetch and display feedback
        if (window.location.pathname === '/view-feedback') {
            fetch('/api/feedback/list', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                .then(response => response.json())
                .then(data => {
                    const feedbackTableBody = document.querySelector('#feedbackTable tbody');
                    data.forEach(feedback => {
                        feedbackTableBody.innerHTML += `<tr>
              <td>${feedback.customerId.name}</td>
              <td>${feedback.feedback}</td>
              <td>${new Date(feedback.date).toLocaleDateString()}</td>
            </tr>`;
                    });
                });
        }

        // Feedback form submission
        const feedbackForm = document.getElementById('feedbackForm');
        if (feedbackForm) {
            feedbackForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const customerId = document.getElementById('customerId').value;
                const feedback = document.getElementById('feedback').value;

                fetch('/api/feedback/add', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ customerId, feedback })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.message) {
                            alert(data.message);
                            window.location.href = '/dashboard';
                        } else {
                            alert(data.error);
                        }
                    });
            });
        }

    }

    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.token) {
                        localStorage.setItem('token', data.token);
                        window.location.href = '/dashboard';
                    } else {
                        alert(data.error);
                    }
                });
        });
    }

    // Registration form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.message) {
                        alert(data.message);
                        window.location.href = '/';
                    } else {
                        alert(data.error);
                    }
                });
        });
    }

    // Add customer form submission
    const addCustomerForm = document.getElementById('addCustomerForm');
    if (addCustomerForm) {
        addCustomerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const preference = document.getElementById('preference').value;
            const id = new URLSearchParams(window.location.search).get('id');
            const url = id ? `/api/customers/update/${id}` : '/api/customers/add';

            fetch(url, {
                    method: id ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ name, email, phone, preference })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.message) {
                        alert(data.message);
                        window.location.href = '/dashboard';
                    } else {
                        alert(data.error);
                    }
                });
        });
    }
});

// Function to delete a customer
function deleteCustomer(id) {
    fetch(`/api/customers/delete/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                window.location.href = '/dashboard';
            } else {
                alert(data.error);
            }
        });
}