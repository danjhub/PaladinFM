document.addEventListener('DOMContentLoaded', function() {
    const cartBox = document.createElement('div');
    cartBox.classList.add('cart-box');
    cartBox.innerHTML = `
        <table class="cart-table">
            <thead>
                <tr>
                    <th class="item-column">Item</th>
                    <th class="qty-column">QTY</th>
                    <th class="ip-column">IP</th>
                    <th class="tp-column">TP</th>
                </tr>
            </thead>
            <tbody id="cart-items"></tbody>
        </table>
        <div class="cart-total" id="cart-total">Total: $0.00</div>
        <div class="cart-actions">
            <button id="clear-cart">Clear Cart</button>
            <button id="checkout">Checkout</button>
        </div>
    `;
    document.body.appendChild(cartBox);

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCart();

    function addToCart(product, quantity) {
        const existingProduct = cart.find(item => item.name === product.name);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.push({ ...product, quantity });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }

    function updateCart() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        cartItems.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const totalPrice = item.quantity * parseFloat(item.price.replace('$', ''));
            total += totalPrice;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price}</td>
                <td>$${totalPrice.toFixed(2)}</td>
            `;
            cartItems.appendChild(row);
        });
        cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    }

    document.getElementById('clear-cart').addEventListener('click', () => {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    });

    document.getElementById('checkout').addEventListener('click', () => {
        if (cart.length > 0) {
            redirectToAmazonCart(cart);
        }
    });

    function toggleCart() {
        const showCartButton = document.querySelector('.shop-tab.active');
        const rect = showCartButton.getBoundingClientRect();
        cartBox.style.top = `${rect.top + window.scrollY}px`;
        cartBox.style.left = `${rect.right + window.scrollX}px`;
        cartBox.classList.toggle('show');
        if (cartBox.classList.contains('show')) {
            showCartButton.textContent = 'Close Cart';
        } else {
            showCartButton.textContent = 'Show Cart';
        }
    }

    function redirectToAmazonCart(cart) {
        // This function should call your server-side code to generate the Amazon cart URL
        fetch('/generate-amazon-cart-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cart })
        })
        .then(response => response.json())
        .then(data => {
            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error('Failed to generate Amazon cart URL');
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Initially hide the cart box
    cartBox.classList.add('hide');
});