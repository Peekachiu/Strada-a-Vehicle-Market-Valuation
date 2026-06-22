// ========================================
// E-COMMERCE SHOP MODEL
// ========================================

const API_BASE = '/api/shop';

export class ShopModel {
  /**
   * Fetch all product categories.
   */
  async getCategories() {
    const res = await fetch(`${API_BASE}/categories/`);
    if (!res.ok) throw new Error('Failed to load categories');
    return res.json();
  }

  /**
   * Fetch products with optional filters.
   * @param {Object} params - { category, brand, search, min_price, max_price, ordering, page }
   */
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') query.set(key, val);
    });
    const res = await fetch(`${API_BASE}/products/?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to load products');
    return res.json();
  }

  /**
   * Fetch a single product by ID.
   */
  async getProduct(id) {
    const res = await fetch(`${API_BASE}/products/${id}/`);
    if (!res.ok) throw new Error('Failed to load product');
    return res.json();
  }

  /**
   * Get the current user's cart.
   */
  async getCart() {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_BASE}/cart/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to load cart');
    return res.json();
  }

  /**
   * Add item to cart.
   * @param {number} productId
   * @param {number} quantity
   */
  async addToCart(productId, quantity = 1) {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_BASE}/cart/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ product: productId, quantity })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to add to cart');
    }
    return res.json();
  }

  /**
   * Update cart item quantity.
   * @param {number} itemId - CartItem ID
   * @param {number} quantity
   */
  async updateCartItem(itemId, quantity) {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_BASE}/cart/items/${itemId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ quantity })
    });
    if (!res.ok) throw new Error('Failed to update cart item');
    return res.json();
  }

  /**
   * Remove item from cart.
   * @param {number} itemId - CartItem ID
   */
  async removeCartItem(itemId) {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_BASE}/cart/items/${itemId}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to remove cart item');
  }

  /**
   * Get orders list.
   */
  async getOrders() {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_BASE}/orders/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to load orders');
    return res.json();
  }

  /**
   * Get a single order detail.
   */
  async getOrder(orderId) {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_BASE}/orders/${orderId}/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to load order');
    return res.json();
  }

  /**
   * Place an order (checkout).
   * @param {string} shippingAddress
   */
  async checkout(shippingAddress) {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_BASE}/checkout/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ shipping_address: shippingAddress })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Checkout failed');
    }
    return res.json();
  }

  /**
   * Cancel a pending order.
   */
  async cancelOrder(orderId) {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_BASE}/orders/${orderId}/cancel/`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to cancel order');
    }
    return res.json();
  }
}