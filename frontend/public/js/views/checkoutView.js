// ========================================
// CHECKOUT VIEW - Order Placement Page
// ========================================

import { ShopModel } from '../models/shopModel.js';

export function renderCheckoutPage(container) {
  const shopModel = new ShopModel();

  container.innerHTML = `
    <!-- Checkout Hero Section -->
    <section class="shop-hero">
      <div class="container">
        <div class="about-hero-content animate-fade-up">
          <h1 class="about-title">Checkout</h1>
          <p class="about-subtitle">Review your order and confirm shipping details.</p>
        </div>
      </div>
    </section>

    <!-- Checkout Content -->
    <section class="shop-section" style="padding: 3rem 0;">
      <div class="container">
        <div id="checkout-content">
          <div class="shop-loading">
            <div class="spinner"></div>
            <p>Loading cart...</p>
          </div>
        </div>
      </div>
    </section>
  `;

  async function loadCheckout() {
    const checkoutContent = container.querySelector('#checkout-content');

    try {
      const cartData = await shopModel.getCart();

      if (!cartData.items || cartData.items.length === 0) {
        checkoutContent.innerHTML = `
          <div class="shop-empty" style="padding: 4rem 1rem; text-align: center;">
            <p>Your cart is empty. Add items before checking out.</p>
            <button class="shop-add-to-cart-btn" style="margin-top: 1rem; width: auto;" onclick="window.location.hash='shop'">Browse Products</button>
          </div>
        `;
        return;
      }

      renderCheckoutForm(cartData);
    } catch (err) {
      if (err.message === 'Not authenticated') {
        window.location.hash = 'login';
        return;
      }
      checkoutContent.innerHTML = `
        <div class="shop-error">
          <p>Failed to load checkout. Please try again.</p>
          <button class="shop-add-to-cart-btn" style="margin-top: 1rem; width: auto;" onclick="window.location.hash='shop'">Back to Shop</button>
        </div>
      `;
      console.error('Failed to load checkout:', err);
    }
  }

  function renderCheckoutForm(cartData) {
    const checkoutContent = container.querySelector('#checkout-content');

    checkoutContent.innerHTML = `
      <div class="shop-checkout-container">
        <div class="shop-checkout-form">
          <!-- Order Summary -->
          <div class="shop-checkout-order-summary">
            <h3 style="font-size: 1.1rem; font-weight: 600; color: var(--dark-navy); margin-bottom: 1rem;">Order Summary</h3>
            <table class="shop-cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${cartData.items.map(item => `
                  <tr>
                    <td>
                      <div class="shop-cart-item-info">
                        <span class="shop-cart-item-name">${item.product_name}</span>
                      </div>
                    </td>
                    <td>RM ${Number(item.product_price).toFixed(2)}</td>
                    <td>${item.quantity}</td>
                    <td>RM ${Number(item.subtotal).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="shop-cart-summary-row shop-cart-summary-total" style="margin-top: 1rem;">
              <span class="shop-cart-summary-label">Total</span>
              <span class="shop-cart-summary-value">RM ${Number(cartData.total_price).toFixed(2)}</span>
            </div>
          </div>

          <!-- Shipping Address -->
          <div style="margin-top: 2rem;">
            <label for="shipping-address">Shipping Address</label>
            <textarea id="shipping-address" name="shipping_address" rows="4" placeholder="Enter your full shipping address..." required></textarea>
          </div>

          <!-- Place Order Button -->
          <button class="shop-checkout-btn" id="place-order-btn" style="margin-top: 1.5rem;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Place Order — RM ${Number(cartData.total_price).toFixed(2)}
          </button>
        </div>
      </div>
    `;

    // --- Place Order Event ---
    const placeOrderBtn = checkoutContent.querySelector('#place-order-btn');
    placeOrderBtn.addEventListener('click', async () => {
      const shippingAddress = checkoutContent.querySelector('#shipping-address').value.trim();

      if (!shippingAddress) {
        alert('Please enter a shipping address.');
        return;
      }

      placeOrderBtn.textContent = 'Placing Order...';
      placeOrderBtn.disabled = true;

      try {
        const orderData = await shopModel.checkout(shippingAddress);

        // Success — show confirmation and redirect
        checkoutContent.innerHTML = `
          <div class="shop-checkout-container" style="text-align: center; padding: 4rem 1rem;">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 1rem;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <h2 style="font-size: 1.5rem; font-weight: 700; color: #10b981; margin-bottom: 0.5rem;">Order Placed Successfully!</h2>
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">Order #${orderData.id} — Status: ${orderData.status}</p>
            <p style="color: var(--text-secondary); margin-bottom: 2rem;">Total: RM ${Number(orderData.total_price).toFixed(2)}</p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
              <button class="shop-add-to-cart-btn" style="width: auto;" onclick="window.location.hash='shop'">Continue Shopping</button>
              <button class="shop-add-to-cart-btn" style="width: auto; background: var(--text-secondary);" onclick="window.location.hash='orders'">View Orders</button>
            </div>
          </div>
        `;
      } catch (err) {
        alert(err.message || 'Failed to place order.');
        placeOrderBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Place Order — RM ${Number(cartData.total_price).toFixed(2)}`;
        placeOrderBtn.disabled = false;
      }
    });
  }

  // --- INITIAL LOAD ---
  loadCheckout();
}