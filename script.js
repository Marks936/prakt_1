const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartItemsList = document.getElementById('cart-items');
const subtotalElement = document.getElementById('subtotal');
const totalElement = document.getElementById('total');
const cartCountElement = document.getElementById('cart-count');
const orderButton = document.getElementById('order-button');
const deliveryForm = document.getElementById('delivery-form');

let cart = [];

// Функция для сохранения корзины в LocalStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Функция для загрузки корзины из LocalStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    } else {
        cart = [];
    }
}

// Показ/скрытие корзины
function toggleCart() {
    const overlay = document.getElementById('cart-overlay');
    const cartPopup = document.getElementById('cart-popup');

    if (overlay.classList.contains('show')) {
        overlay.classList.remove('show');
        cartPopup.classList.remove('show');
    } else {
        overlay.classList.add('show');
        cartPopup.classList.add('show');
    }
}

// Обновление содержимого корзины на странице
function updateCart() {
    cartItemsList.innerHTML = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
        subtotal += item.price * item.quantity;

        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${item.name}</strong> — ${item.price.toFixed(2)}€ x ${item.quantity}
            <button class="remove-item" data-index="${index}" type="button">❌</button>
        `;
        cartItemsList.appendChild(li);
    });

    subtotalElement.textContent = subtotal.toFixed(2) + '€';
    const totalWithVat = subtotal * 1.21;
    totalElement.textContent = totalWithVat.toFixed(2) + '€';

    cartCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Сохраняем изменения в LocalStorage
    saveCart();

    // Обработка кнопок удаления товаров
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', e => {
            const idx = e.target.getAttribute('data-index');
            removeFromCart(parseInt(idx));
        });
    });
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    updateCart();
}

function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        updateCart();
    }
}

addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const foodItem = button.closest('.food-item');
        const name = foodItem.querySelector('h3').textContent.trim().split(' ')[0];
        const price = parseFloat(foodItem.getAttribute('data-price'));

        addToCart(name, price);
    });
});

orderButton.addEventListener('click', () => {
    if (!deliveryForm.checkValidity()) {
        alert('Lūdzu, aizpildiet visus laukus pareizi.');
        return;
    }

    if (cart.length === 0) {
        alert('Jūsu grozs ir tukšs.');
        return;
    }

    alert('Paldies par pasūtījumu, ' + deliveryForm.name.value + '!\nJūsu pasūtījums tiks apstrādāts drīzumā.');

    cart = [];
    saveCart(); // Очистить localStorage после заказа
    updateCart();
    deliveryForm.reset();
    toggleCart();
});

// Загрузить корзину из LocalStorage при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    loadCart();
    updateCart();
});
