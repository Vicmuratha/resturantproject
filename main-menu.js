// Tab Navigation
const tabs = document.querySelectorAll('.tab-link');
const tabContents = document.querySelectorAll('.tab-content');

function switchTab (targetTab) {
  tabs.forEach(t => t.classList.remove('active'));
  tabContents.forEach(content => content.classList.remove('active'));

  const tabElement = document.querySelector(`.tab-link[data-tab="${targetTab}"]`);
  const contentElement = document.getElementById(targetTab);

  tabElement.classList.add('active');
  contentElement.classList.add('active');
}

tabs.forEach(tab => {
  tab.addEventListener('click', (e) => {
    e.preventDefault();
    const targetTab = tab.getAttribute('data-tab');
    switchTab(targetTab);
  });
});

// Menu Search Functionality
const searchInput = document.getElementById('menuSearch');
const productGrid = document.getElementById('productGrid');
const products = Array.from(document.querySelectorAll('.product'));

searchInput.addEventListener('input', function (e) {
  const searchTerm = e.target.value.toLowerCase();

  const filteredProducts = products
    .filter(product => {
      const productName = product.getAttribute('data-name').toLowerCase();
      return productName.includes(searchTerm);
    })
    .sort((a, b) => {
      const nameA = a.getAttribute('data-name').toLowerCase();
      const nameB = b.getAttribute('data-name').toLowerCase();
      return nameA.localeCompare(nameB);
    });

  productGrid.innerHTML = '';
  filteredProducts.forEach(product => {
    productGrid.appendChild(product.cloneNode(true));
  });

  addCartListeners();
});

// Add to Cart Functionality
const cartItemsContainer = document.getElementById('cartItems');
const totalPriceElement = document.getElementById('totalPrice');
const cart = [];
let totalPrice = 0;

function addCartListeners () {
  const addToCartButtons = document.querySelectorAll('.product button');
  addToCartButtons.forEach(button => {
    button.removeEventListener('click', handleAddToCart);
    button.addEventListener('click', handleAddToCart);
  });
}

function handleAddToCart () {
  const productElement = this.parentElement;
  const productName = productElement.getAttribute('data-name');
  const productPrice = parseFloat(productElement.getAttribute('data-price'));

  const existingItem = cart.find(item => item.name === productName);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name: productName, price: productPrice, quantity: 1 });
  }
  totalPrice += productPrice;
  updateCart();
}

addCartListeners();

function updateCart () {
  cartItemsContainer.innerHTML = '';
  cart.forEach((item, index) => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <span>${item.name} - KSH ${item.price.toFixed(2)}</span>
      <div class="quantity">
        <button onclick="changeQuantity(${index}, -1)">-</button>
        <span>${item.quantity}</span>
        <button onclick="changeQuantity(${index}, 1)">+</button>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
    `;
    cartItemsContainer.appendChild(cartItem);
  });

  totalPriceElement.textContent = `Total: KSH ${totalPrice.toFixed(2)}`;
}

function changeQuantity (index, change) {
  const item = cart[index];
  item.quantity += change;
  totalPrice += change * item.price;
  if (item.quantity <= 0) {
    cart.splice(index, 1);
  }
  updateCart();
}

function removeFromCart (index) {
  totalPrice -= cart[index].price * cart[index].quantity;
  cart.splice(index, 1);
  updateCart();
}

// Placeholder Functions
function updateDashboardStats () {
  console.log('Stats updated');
}

function updateRecentActivities () {
  console.log('Activities updated');
}

document.querySelector('.logout-btn').addEventListener('click', () => {
  alert('Logged out!');
});

document.querySelector('.checkout-btn').addEventListener('click', () => {
  alert('Proceeding to checkout!');
});
