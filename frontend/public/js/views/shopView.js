// ========================================
// E-COMMERCE SHOP VIEW - Main Product Grid Page
// ========================================

import { ShopModel } from '../models/shopModel.js';

export function renderShopPage(container) {
  const shopModel = new ShopModel();

  container.innerHTML = `
    <!-- Shop Hero Section -->
    <section class="about-hero">
      <div class="container">
        <div class="about-hero-content animate-fade-up">
          <h1 class="about-title">Vehicle Products Shop</h1>
          <p class="about-subtitle">Everything your car needs. Quality products, competitive prices.</p>
        </div>
      </div>
    </section>

    <!-- Shop Content -->
    <section class="shop-section" style="padding: 3rem 0;">
      <div class="container">
        <!-- Filter Bar -->
        <div class="shop-filter-bar reveal-on-scroll stagger-1">
          <div class="shop-filter-group">
            <label class="shop-filter-label">Category</label>
            <select id="shop-category-filter" class="shop-filter-select">
              <option value="">All Categories</option>
            </select>
          </div>
          <div class="shop-filter-group">
            <label class="shop-filter-label">Brand</label>
            <select id="shop-brand-filter" class="shop-filter-select">
              <option value="">All Brands</option>
            </select>
          </div>
          <div class="shop-filter-group">
            <label class="shop-filter-label">Sort By</label>
            <select id="shop-sort-filter" class="shop-filter-select">
              <option value="-created_at">Newest First</option>
              <option value="created_at">Oldest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
              <option value="-name">Name: Z-A</option>
            </select>
          </div>
          <div class="shop-filter-group">
            <label class="shop-filter-label">Search</label>
            <input type="text" id="shop-search-input" class="shop-search-input" placeholder="Search products...">
          </div>
        </div>

        <!-- Products Grid -->
        <div id="shop-products-grid" class="shop-grid">
          <!-- Products will be injected here -->
          <div class="shop-loading">
            <div class="spinner"></div>
            <p>Loading products...</p>
          </div>
        </div>

        <!-- Pagination -->
        <div id="shop-pagination" class="shop-pagination" style="display: none;">
          <button id="shop-prev-page" class="shop-page-btn" disabled>Previous</button>
          <span id="shop-page-info" class="shop-page-info"></span>
          <button id="shop-next-page" class="shop-page-btn">Next</button>
        </div>

        <!-- View Cart Button -->
        <div id="shop-cart-actions" class="shop-cart-actions" style="text-align: center; padding: 1.5rem 0; display: none;">
          <button class="shop-view-cart-btn" data-navigate="cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            View Cart (<span id="shop-cart-count">0</span>)
          </button>
        </div>
      </div>
    </section>
  `;

  // --- STATE ---
  let currentPage = 1;
  let currentCategory = '';
  let currentBrand = '';
  let currentSort = '-created_at';
  let currentSearch = '';

  // --- LOAD CATEGORIES ---
  async function loadCategories() {
    try {
      const data = await shopModel.getCategories();
      const select = container.querySelector('#shop-category-filter');
      data.results.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.slug;
        option.textContent = cat.name;
        select.appendChild(option);
      });
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  }

  // --- LOAD BRANDS (from first page of products) ---
  async function loadBrands() {
    try {
      const data = await shopModel.getProducts({ page: 1, page_size: 100 });
      const brands = [...new Set(data.results.map(p => p.brand))];
      const select = container.querySelector('#shop-brand-filter');
      brands.sort().forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        select.appendChild(option);
      });
    } catch (err) {
      console.error('Failed to load brands:', err);
    }
  }

  // --- LOAD PRODUCTS ---
  async function loadProducts() {
    const grid = container.querySelector('#shop-products-grid');
    grid.innerHTML = `<div class="shop-loading"><div class="spinner"></div><p>Loading products...</p></div>`;

    try {
      const params = {
        page: currentPage,
        ordering: currentSort,
      };
      if (currentCategory) params.category = currentCategory;
      if (currentBrand) params.brand = currentBrand;
      if (currentSearch) params.search = currentSearch;

      const data = await shopModel.getProducts(params);
      renderProducts(data.results);

      // Pagination
      const pagination = container.querySelector('#shop-pagination');
      if (data.count > 12) {
        pagination.style.display = 'flex';
        container.querySelector('#shop-page-info').textContent = `Page ${currentPage}`;
        container.querySelector('#shop-prev-page').disabled = currentPage === 1;
      } else {
        pagination.style.display = 'none';
      }
    } catch (err) {
      grid.innerHTML = `<div class="shop-error"><p>Failed to load products. Please try again.</p></div>`;
      console.error('Failed to load products:', err);
    }
  }

  // --- RENDER PRODUCTS ---
  function renderProducts(products) {
    const grid = container.querySelector('#shop-products-grid');

    if (products.length === 0) {
      grid.innerHTML = `<div class="shop-empty"><p>No products found.</p></div>`;
      return;
    }

    grid.innerHTML = products.map(product => `
      <div class="shop-product-card reveal-on-scroll" data-product-id="${product.id}">
        <div class="shop-product-image">
          <img src="${product.image || '/images/car.JPEG'}" alt="${product.name}" loading="lazy">
          ${product.discount_percentage ? `<span class="shop-badge sale">-${product.discount_percentage}%</span>` : ''}
          ${!product.is_active ? '<span class="shop-badge out-of-stock">Out of Stock</span>' : ''}
        </div>
        <div class="shop-product-info">
          <span class="shop-product-category">${product.category_name}</span>
          <h3 class="shop-product-name">${product.name}</h3>
          <p class="shop-product-brand">${product.brand}</p>
          <div class="shop-product-pricing">
            ${product.original_price ? `<span class="shop-original-price">RM ${Number(product.original_price).toFixed(2)}</span>` : ''}
            <span class="shop-price">RM ${Number(product.price).toFixed(2)}</span>
          </div>
          ${product.stock > 0 && product.is_active ? `
          <button class="shop-add-to-cart-btn" data-product-id="${product.id}" data-product-name="${product.name}" data-product-price="${product.price}">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            Add to Cart
          </button>` : '<button class="shop-add-to-cart-btn disabled" disabled>Out of Stock</button>'}
        </div>
      </div>
    `).join('');

    // Trigger scroll animations
    if (window.initScrollAnimations) {
      setTimeout(window.initScrollAnimations, 100);
    }
  }

  // --- EVENT LISTENERS ---
  container.querySelector('#shop-category-filter').addEventListener('change', (e) => {
    currentCategory = e.target.value;
    currentPage = 1;
    loadProducts();
  });

  container.querySelector('#shop-brand-filter').addEventListener('change', (e) => {
    currentBrand = e.target.value;
    currentPage = 1;
    loadProducts();
  });

  container.querySelector('#shop-sort-filter').addEventListener('change', (e) => {
    currentSort = e.target.value;
    loadProducts();
  });

  let searchTimeout;
  container.querySelector('#shop-search-input').addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      currentSearch = e.target.value;
      currentPage = 1;
      loadProducts();
    }, 300);
  });

  container.querySelector('#shop-prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      loadProducts();
    }
  });

  container.querySelector('#shop-next-page').addEventListener('click', () => {
    currentPage++;
    loadProducts();
  });

  // Add to Cart Delegation
  container.addEventListener('click', async (e) => {
    const btn = e.target.closest('.shop-add-to-cart-btn:not(.disabled)');
    if (!btn) return;

    const productId = btn.dataset.productId;
    const productName = btn.dataset.productName;

    btn.textContent = 'Adding...';
    btn.disabled = true;

    try {
      await shopModel.addToCart(productId, 1);
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Added`;
      btn.classList.add('added');

      // Update cart badge if exists
      const cartBadge = document.querySelector('.cart-badge');
      if (cartBadge) {
        const currentCount = parseInt(cartBadge.textContent) || 0;
        cartBadge.textContent = currentCount + 1;
        cartBadge.style.display = 'inline-block';
      }

      // Show View Cart button with updated count
      const cartActions = container.querySelector('#shop-cart-actions');
      if (cartActions) {
        cartActions.style.display = 'block';
        const cartCount = cartActions.querySelector('#shop-cart-count');
        if (cartCount) {
          cartCount.textContent = parseInt(cartCount.textContent || '0') + 1;
        }
      }

      setTimeout(() => {
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> Add to Cart`;
        btn.disabled = false;
        btn.classList.remove('added');
      }, 2000);
    } catch (err) {
      alert(err.message || 'Failed to add to cart.');
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> Add to Cart`;
      btn.disabled = false;
    }
  });

  // --- INITIAL LOAD ---
  loadCategories();
  loadBrands();
  loadProducts();
}