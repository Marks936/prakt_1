let cart = [];

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.closest('.food-item');
        const name = item.querySelector('h3').textContent.split(' ')[0];
        const price = parseFloat(item.dataset.price);
        cart.push({ name, price });
        updateCart();
    });
});

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');

    cartItems.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.price.toFixed(2)}€`;
        cartItems.appendChild(li);
        subtotal += item.price;
    });

    cartCount.textContent = cart.length;
    subtotalEl.textContent = subtotal.toFixed(2) + '€';
    totalEl.textContent = (subtotal * 1.21).toFixed(2) + '€';
}

function toggleCart() {
    const cartPopup = document.getElementById('cart-popup');
    cartPopup.style.display = cartPopup.style.display === 'block' ? 'none' : 'block';
}

document.getElementById('order-button').addEventListener('click', () => {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();

    if (!name || !phone || !address) {
        alert('Lūdzu, aizpildi visus piegādes laukus!');
        return;
    }

    alert(`Paldies par pasūtījumu, ${name}! Mēs drīz sazināsimies.`);
    cart = [];
    updateCart();
    toggleCart();
    document.getElementById('delivery-form').reset();
});
