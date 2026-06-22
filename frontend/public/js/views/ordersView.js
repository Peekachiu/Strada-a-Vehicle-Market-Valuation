// ========================================
// ORDERS VIEW - Order History Page
// ========================================

import { ShopModel } from '../models/shopModel.js';

export function renderOrdersPage(container) {
  const shopModel = new ShopModel();

  container.innerHTML = `
    <!-- Orders Hero Section -->
    <section class="shop-hero">
      <div class="container">
        <div class="about-hero-content animate-fade-up">
          <h1 class="about-title">My Orders</h1>
          <p class="about-subtitle">Track and manage your orders.</p>
        </div>
      </div>
    </section>

    <!-- Orders Content -->
    <section class="shop-section" style="padding: 3rem 0;">
      <div class="container">
        <div id="orders-content">
          <div class="shop-loading">
            <div class="spinner"></div>
            <p>Loading orders...</p>
          </div>
        </div>
      </div>
    </section>
  `;

  async function loadOrders() {
    const ordersContent = container.querySelector('#orders-content');

    try {
      const data = await shopModel.getOrders();

      if (!data.results || data.results.length === 0) {
        ordersContent.innerHTML = `
          <div class="shop-empty" style="padding: 4rem 1rem; text-align: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted); margin: 0 auto 1rem;"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="22" y2="10"/></svg>
            <p>No orders yet.</p>
            <button class="shop-add-to-cart-btn" style="margin-top: 1rem; width: auto;" onclick="window.location.hash='shop'">Browse Products</button>
          </div>
        `;
        return;
      }

      renderOrders(data.results);
    } catch (err) {
      if (err.message === 'Not authenticated') {
        window.location.hash = 'login';
        return;
      }
      ordersContent.innerHTML = `
        <div class="shop-error"><p>Failed to load orders. Please try again.</p></div>
      `;
      console.error('Failed to load orders:', err);
    }
  }

  function renderOrders(orders) {
    const ordersContent = container.querySelector('#orders-content');

    ordersContent.innerHTML = `
      <div class="shop-order-list">
        ${orders.map(order => `
          <div class="shop-order-card reveal-on-scroll" data-order-id="${order.id}">
            <div class="shop-order-info">
              <div>
                <h3 style="font-size: 1.1rem; font-weight: 600; color: var(--dark-navy); margin-bottom: 0.25rem;">Order #${order.id}</h3>
                <p style="font-size: 0.85rem; color: var(--text-secondary);">${new Date(order.created_at).toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.25rem;">${order.items.length} item(s) — Shipping: ${order.shipping_address.substring(0, 60)}${order.shipping_address.length > 60 ? '...' : ''}</p>
              </div>
              <div style="text-align: right;">
                <span class="shop-order-status ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                <p style="font-size: 1.1rem; font-weight: 700; color: var(--dark-navy); margin-top: 0.25rem;">RM ${Number(order.total_price).toFixed(2)}</p>
              </div>
            </div>
            ${order.status === 'pending' ? `
              <div style="margin-top: 0.75rem; display: flex; gap: 0.5rem; justify-content: flex-end;">
                <button class="shop-cancel-order-btn" data-order-id="${order.id}" style="padding: 0.4rem 0.75rem; border: 1px solid #ef4444; border-radius: 0.375rem; background: none; color: #ef4444; font-size: 0.8rem; font-weight: 500; cursor: pointer; transition: background 0.2s ease, color 0.2s ease;">Cancel Order</button>
              </div>
            ` : ''}
            <div style="margin-top: 0.5rem; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 0.75rem;">
              <p style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.5rem;">Order Items:</p>
              ${order.items.map(item => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.25rem 0; font-size: 0.85rem;">
                  <span style="color: var(--dark-navy);">${item.product_name}</span>
                  <span style="color: var(--text-secondary);">${item.quantity}x @ RM ${Number(item.price).toFixed(2)}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Trigger scroll animations
    if (window.initScrollAnimations) {
      setTimeout(window.initScrollAnimations, 100);
    }

    // Cancel order delegation
    ordersContent.addEventListener('click', async (e) => {
      const cancelBtn = e.target.closest('.shop-cancel-order-btn');
      if (!cancelBtn) return;

      const orderId = cancelBtn.dataset.orderId;
      if (!confirm('Are you sure you want to cancel this order?')) return;

      cancelBtn.textContent = 'Cancelling...';
      cancelBtn.disabled = true;

      try {
        await shopModel.cancelOrder(orderId);
        loadOrders(); // Reload orders
      } catch (err) {
        alert(err.message || 'Failed to cancel order.');
        cancelBtn.textContent = 'Cancel Order';
        cancelBtn.disabled = false;
      }
    });
  }

  // --- INITIAL LOAD ---
  loadOrders();
}