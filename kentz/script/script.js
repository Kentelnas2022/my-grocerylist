// Toggle the visibility of the menu
function toggleMenu() {
    const menu = document.getElementById('nav-menu');
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

// Close the menu when an item is clicked
function closeMenu() {
    const menu = document.getElementById('nav-menu');
    menu.style.display = 'none';
}

// Save or update a product in local storage
function saveProduct(product, index = null) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    if (index !== null) {
        products[index] = product; // Update existing product
    } else {
        products.push(product); // Add new product
    }
    
    localStorage.setItem('products', JSON.stringify(products));
}

// Handle form submission on the Add Product page
document.getElementById('add-product-form')?.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    
    const productName = document.getElementById('product-name').value;
    const brand = document.getElementById('brand').value;
    const price = parseFloat(document.getElementById('price').value);
    const weight = document.getElementById('weight').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const store = document.getElementById('store').value;
    const image = document.getElementById('image').files[0]; // Get the file input
    const category = document.getElementById('category').value; // Get the category input
    
    if (productName && brand && price && weight && quantity && store) {
        const reader = new FileReader();
        
        reader.onloadend = function() {
            const product = {
                name: productName,
                brand: brand,
                price: price,
                weight: weight,
                quantity: quantity,
                store: store,
                image: reader.result,
                category: category
            };
            
            saveProduct(product);
            showNotification('Product added successfully!');
            window.location.href = 'index.html';
        };
        
        if (image) {
            reader.readAsDataURL(image); // Convert image file to base64 string
        } else {
            const product = {
                name: productName,
                brand: brand,
                price: price,
                weight: weight,
                quantity: quantity,
                store: store,
                image: '', // No image provided
                category: category
            };
            
            saveProduct(product);
            showNotification('Product added successfully!');
            window.location.href = 'index.html';
        }
    } else {
        alert('Please fill in all required fields.');
    }
});

// Show a notification message
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// Filter products by category and search query
function filterProducts() {
    const category = document.getElementById('category-select').value;
    const searchQuery = document.getElementById('search-input').value.toLowerCase();
    const productList = document.getElementById('product-list');
    const products = JSON.parse(localStorage.getItem('products')) || [];

    productList.innerHTML = ''; // Clear the current list

    const filteredProducts = products.filter(product => {
        const matchesCategory = category === '' || product.category === category;
        const matchesSearch = searchQuery === '' || product.name.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    filteredProducts.forEach((product, index) => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.dataset.category = product.category; // Add data-category attribute for filtering

        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>Brand: ${product.brand}</p>
            <p>Price: ${product.price}</p>
            <p>Weight/Volume: ${product.weight}</p>
            <p>Quantity: ${product.quantity}</p>
            <p>Store: ${product.store}</p>
            <div class="product-actions">
                <button onclick="addToCart(${index})">Add to Cart</button>
            </div>
        `;

        productList.appendChild(productItem);
    });
}


// Show the action menu for editing or deleting a product
function showActionMenu(index) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products[index];
    
    const menu = document.createElement('div');
    menu.className = 'action-menu';
    menu.innerHTML = `
        <button onclick="editProduct(${index})">Edit</button>
        <button onclick="deleteProduct(${index})">Delete</button>
    `;
    
    document.querySelectorAll('.product-actions').forEach(actionMenu => actionMenu.innerHTML = ''); // Clear previous menus
    document.querySelectorAll('.product-item')[index].querySelector('.product-actions').appendChild(menu);
}

// Add product to cart
function addToCart(index) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products[index];

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));

    showNotification('Product added to cart!');
}

// Edit a product
function editProduct(index) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products[index];
    
    // Redirect to edit product page or open a modal
    // For this example, we'll redirect to 'edit-product.html' and pass the index as a query parameter
    window.location.href = `edit-product.html?index=${index}`;
}

// Delete a product
function deleteProduct(index) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products.splice(index, 1); // Remove the product
    localStorage.setItem('products', JSON.stringify(products));
    filterProducts(); // Refresh the product list
}

// Load products on page load
window.onload = function() {
    const categorySelect = document.getElementById('category-select');
    const searchInput = document.getElementById('search-input');
    
    if (categorySelect && searchInput) {
        filterProducts();
        categorySelect.addEventListener('change', filterProducts);
        searchInput.addEventListener('input', filterProducts);
    }
}
