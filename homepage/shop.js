document.addEventListener('DOMContentLoaded', function() {
    const shopContainer = document.getElementById('shop-container');
    const shopContent = document.getElementById('shop-content');

    // Create the shop bar
    const shopBar = document.createElement('div');
    shopBar.classList.add('shop-bar');

    // Create the shop tabs container
    const shopTabs = document.createElement('div');
    shopTabs.classList.add('shop-tabs');

    // Define the tabs to display
    const tabs = ['All', 'Office', 'Cleaning', 'PPE', 'Maintenance', 'Field', 'Shop on Amazon'];
    
    // Create tabs dynamically
    tabs.forEach((tab, index) => {
        const tabButton = document.createElement('div');
        tabButton.classList.add('shop-tab');
        tabButton.textContent = tab;
        tabButton.addEventListener('click', () => {
            document.querySelectorAll('.shop-tab').forEach(button => button.classList.remove('active'));
            tabButton.classList.add('active');
            loadTabContent(index);
        });
        if (index === 0) {
            tabButton.classList.add('active'); // Set "All" tab as active by default
        }
        shopTabs.appendChild(tabButton);
    });

    // Create the shop cart container
    const shopCartContainer = document.createElement('div');
    shopCartContainer.classList.add('shopcart-container');

    // Create the Show Cart button
    const showCartButton = document.createElement('button');
    showCartButton.classList.add('showcart-button');
    showCartButton.textContent = 'Show Cart (0)';
    showCartButton.addEventListener('click', toggleCart);
    shopCartContainer.appendChild(showCartButton);

    // Append shop tabs and shop cart container to the shop bar
    shopBar.appendChild(shopTabs);
    shopBar.appendChild(shopCartContainer);

    // Insert the shop bar into the shop container
    shopContainer.insertBefore(shopBar, shopContent);

    // Load initial content for "All" tab
    loadTabContent(0);

    // Function to load content based on the selected tab index
    function loadTabContent(index) {
        if (index === 6) {
            window.location.href = 'https://www.amazon.com/?tag=paladinfm-20';
        } else {
            // Load products for the selected tab
            shopContent.innerHTML = '';
            const jsonFiles = getJsonFilesForTab(index);
            const productPromises = jsonFiles.map(jsonFile => fetch(jsonFile).then(response => response.json()));
            Promise.all(productPromises)
                .then(productsArrays => {
                    const products = productsArrays.flat();
                    products.forEach(product => {
                        const productElement = document.createElement('div');
                        productElement.classList.add('shop-card');
                        productElement.innerHTML = `
                            <div class="item-display">
                                <img src="${product.image}" alt="${product.name}">
                                <p>${product.name}</p>
                                <p>${product.price}</p>
                            </div>
                            <div class="checkout-box">
                                <input type="number" value="1" min="1" class="quantity">
                                <button class="add-to-cart">Add to Cart</button>
                            </div>
                        `;
                        productElement.querySelector('.add-to-cart').addEventListener('click', () => {
                            const quantity = parseInt(productElement.querySelector('.quantity').value);
                            addToCart(product, quantity);
                        });
                        shopContent.appendChild(productElement);
                    });
                })
                .catch(error => {
                    console.error('Error loading products:', error);
                    shopContent.innerHTML = '<p>Failed to load products. Please try again later.</p>';
                });
        }
    }

    function getJsonFilesForTab(index) {
        // Return the paths to the JSON files for the selected tab
        switch (index) {
            case 0:
                return [
                    'amazonlistsjson/office.json',
                    'amazonlistsjson/cleaning.json',
                    'amazonlistsjson/ppe.json',
                    'amazonlistsjson/maintenance.json',
                    'amazonlistsjson/field.json'
                ];
            case 1:
                return ['amazonlistsjson/office.json'];
            case 2:
                return ['amazonlistsjson/cleaning.json'];
            case 3:
                return ['amazonlistsjson/ppe.json'];
            case 4:
                return ['amazonlistsjson/maintenance.json'];
            case 5:
                return ['amazonlistsjson/field.json'];
            default:
                return [];
        }
    }

    // Cart functionality
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
        console.log('Adding to cart:', product, quantity); // Debug log
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
        let itemCount = 0;
        cart.forEach(item => {
            if (!item.price || typeof item.price !== 'string') {
                console.error('Invalid price for item:', item);
                return;
            }
            const price = parseFloat(item.price.replace('$', ''));
            if (isNaN(price)) {
                console.error('Invalid price format for item:', item);
                return;
            }
            const totalPrice = item.quantity * price;
            total += totalPrice;
            itemCount += item.quantity;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="item-column">
                    <img src="${item.image}" alt="${item.name}">
                    ${item.name}
                </td>
                <td>${item.quantity}</td>
                <td>${item.price}</td>
                <td>$${totalPrice.toFixed(2)}</td>
            `;
            cartItems.appendChild(row);
        });
        cartTotal.textContent = `Total: $${total.toFixed(2)}`;
        showCartButton.textContent = `Show Cart (${itemCount})`;
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
        const rect = showCartButton.getBoundingClientRect();
        cartBox.style.top = `${rect.top + window.scrollY}px`;
        cartBox.style.left = `${rect.right + window.scrollX}px`;
        cartBox.classList.toggle('show');
        if (cartBox.classList.contains('show')) {
            showCartButton.textContent = `Close Cart (${cart.reduce((sum, item) => sum + item.quantity, 0)})`;
            showCartButton.classList.add('active');
        } else {
            showCartButton.textContent = `Show Cart (${cart.reduce((sum, item) => sum + item.quantity, 0)})`;
            showCartButton.classList.remove('active');
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