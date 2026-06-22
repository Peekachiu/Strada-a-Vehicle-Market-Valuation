// ========================================
// CART VIEW - Shopping Cart Page
// ========================================

import { ShopModel } from '../models/shopModel.js';

export function renderCartPage(container) {
  const shopModel = new ShopModel();

  container.innerHTML = `
    <!-- Cart Hero Section -->
    <section class="shop-hero">
      <div class="container">
        <div class="about-hero-content animate-fade-up">
          <h1 class="about-title">Shopping Cart</h1>
          <p class="about-subtitle">Review your items and proceed to checkout.</p>
        </div>
      </div>
    </section>

    <!-- Cart Content -->
    <section class="shop-section" style="padding: 3rem 0;">
      <div class="container">
        <div id="cart-content">
          <div class="shop-loading">
            <div class="spinner"></div>
            <p>Loading cart...</p>
          </div>
        </div>
      </div>
    </section>
  `;

  async function loadCart() {
    const cartContent = container.querySelector('#cart-content');

    try {
      const data = await shopModel.getCart();

      if (!data.items || data.items.length === 0) {
        cartContent.innerHTML = `
          <div class="shop-empty" style="padding: 4rem 1rem; text-align: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted); margin: 0 auto 1rem;"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <p>Your cart is empty.</p>
            <button class="shop-add-to-cart-btn" style="margin-top: 1rem; width: auto;" onclick="window.location.hash='shop'">Browse Products</button>
          </div>
        `;
        return;
      }

      renderCart(data);
    } catch (err) {
      if (err.message === 'Not authenticated') {
        window.location.hash = 'login';
        return;
      }
      cartContent.innerHTML = `
        <div class="shop-error">
          <p>Failed to load cart. Please try again.</p>
          <button class="shop-add-to-cart-btn" style="margin-top: 1rem; width: auto;" onclick="window.location.hash='shop'">Back to Shop</button>
        </div>
      `;
      console.error('Failed to load cart:', err);
    }
  }

  function renderCart(cartData) {
    const cartContent = container.querySelector('#cart-content');

    cartContent.innerHTML = `
      <div class="shop-cart-container">
        <table class="shop-cart-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="cart-items-tbody">
          </tbody>
        </table>

        <div class="shop-cart-summary" id="cart-summary">
        </div>
      </div>
    `;

    const tbody = cartContent.querySelector('#cart-items-tbody');

    tbody.innerHTML = cartData.items.map(item => `
      <tr data-item-id="${item.id}">
        <td>
          <div class="shop-cart-item-info">
            <span class="shop-cart-item-name">${item.product_name}</span>
            <span class="shop-cart-item-brand">Brand: ${item.product_brand || 'N/A'}</span>
          </div>
        </td>
        <td>RM ${Number(item.product_price).toFixed(2)}</td>
        <td>
          <div class="shop-cart-qty-controls">
            <button class="shop-cart-qty-btn" data-action="decrease" data-item-id="${item.id}">&minus;</button>
            <span class="shop-cart-qty-value">${item.quantity}</span>
            <button class="shop-cart-qty-btn" data-action="increase" data-item-id="${item.id}">&plus;</button>
          </div>
        </td>
        <td>RM ${Number(item.subtotal).toFixed(2)}</td>
        <td>
          <button class="shop-cart-remove-btn" data-item-id="${item.id}">&times; Remove</button>
        </td>
      </tr>
    `).join('');

    // Summary
    const summary = cartContent.querySelector('#cart-summary');
    summary.innerHTML = `
      <div class="shop-cart-summary-row">
        <span class="shop-cart-summary-label">Items (${cartData.item_count})</span>
        <span class="shop-cart-summary-value">RM ${Number(cartData.total_price).toFixed(2)}</span>
      </div>
      <div class="shop-cart-summary-row shop-cart-summary-total">
        <span class="shop-cart-summary-label">Total</span>
        <span class="shop-cart-summary-value">RM ${Number(cartData.total_price).toFixed(2)}</span>
      </div>
      <button class="shop-continue-shopping-btn" onclick="window.location.hash='shop'">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        Continue Shopping
      </button>
      <button class="shop-checkout-btn" id="checkout-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="22" y2="10"/></svg>
        Proceed to Checkout
      </button>
    `;

    // --- EVENT LISTENERS ---
    // Quantity controls
    cartContent.addEventListener('click', async (e) => {
      const qtyBtn = e.target.closest('.shop-cart-qty-btn');
      if (qtyBtn) {
        const itemId = qtyBtn.dataset.itemId;
        const action = qtyBtn.dataset.action;
        const qtySpan = qtyBtn.parentElement.querySelector('.shop-cart-qty-value');
        let newQty = parseInt(qtySpan.textContent);

        if (action === 'increase') newQty++;
        else if (action === 'decrease' && newQty > 1) newQty--;

        try {
          await shopModel.updateCartItem(itemId, newQty);
          loadCart(); // Reload entire cart
        } catch (err) {
          alert(err.message || 'Failed to update quantity.');
        }
      }

      // Remove item
      const removeBtn = e.target.closest('.shop-cart-remove-btn');
      if (removeBtn) {
        const itemId = removeBtn.dataset.itemId;
        try {
          await shopModel.removeCartItem(itemId);
          loadCart(); // Reload
        } catch (err) {
          alert(err.message || 'Failed to remove item.');
        }
      }
    });

    // Checkout button
    const checkoutBtn = cartContent.querySelector('#checkout-btn');
    checkoutBtn.addEventListener('click', () => {
      window.location.hash = 'checkout';
    });
  }

  // --- INITIAL LOAD ---
  loadCart();
}