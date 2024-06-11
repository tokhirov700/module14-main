document.addEventListener('DOMContentLoaded', () => {
    const apiURL = 'https://6662ac4162966e20ef097175.mockapi.io/api/products/products';
    const addProductBtn = document.querySelector('.add-product-btn');
    const productModal = document.getElementById('productModal');
    const closeModal = document.querySelector('.close-modal');
    const productForm = document.querySelector('.modal-form');
    const productIdInput = document.querySelector('.product-id');
    const productNameInput = document.querySelector('.product-name');
    const productPriceInput = document.querySelector('.product-price');
    const productImageInput = document.querySelector('.product-image');
    const modalTitle = document.querySelector('.modal-title');
    const productsContainer = document.querySelector('.products-container');

    const showModal = () => {
        productModal.style.display = 'block';
    };

    const hideModal = () => {
        productModal.style.display = 'none';
        productForm.reset();
        productIdInput.value = '';
    };

    closeModal.addEventListener('click', hideModal);

    window.addEventListener('click', (event) => {
        if (event.target === productModal) {
            hideModal();
        }
    });

    addProductBtn.addEventListener('click', () => {
        modalTitle.textContent = 'Yangi mahsulot qo\'shish';
        showModal();
    });

    const loadProducts = async () => {
        try {
            const response = await fetch(apiURL);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const products = await response.json();
            productsContainer.innerHTML = '';
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.price} so'm</p>
                    <button class="edit-btn" onclick="editProduct('${product.id}', '${product.name}', ${product.price}, '${product.image}')">Tahrirlash</button>
                `;
                productsContainer.appendChild(productCard);
            });
        } catch (error) {
            console.error('Error loading products:', error);
        }
    };

    window.editProduct = (id, name, price, image) => {
        console.log('id:', id);
        console.log('name:', name);
        console.log('price:', price);
        console.log('image:', image);
        productIdInput.value = id;
        productNameInput.value = name;
        productPriceInput.value = price;
        productImageInput.value = image;
        modalTitle.textContent = 'Mahsulotni tahrirlash';
        showModal();
    };

    productForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = productIdInput.value;
        const name = productNameInput.value;
        const price = productPriceInput.value;
        const image = productImageInput.value;
        const product = { name, price, image };

        try {
            let response;
            if (id) {
                response = await fetch(`${apiURL}/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(product),
                });
            } else {
                response = await fetch(apiURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(product),
                });
            }

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            hideModal();
            loadProducts();
        } catch (error) {
            console.error('Error saving product:', error);
        }
    });

    loadProducts();
});

