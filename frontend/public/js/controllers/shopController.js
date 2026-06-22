// ========================================
// SHOP CONTROLLER - Handles shop navigation
// ========================================

export class ShopController {
    constructor(main) {
        this.main = main;
    }

    init() {
        // Handle View Cart button navigation
        this.main.addEventListener('click', (e) => {
            const viewCartBtn = e.target.closest('.shop-view-cart-btn');
            if (viewCartBtn) {
                const target = viewCartBtn.dataset.navigate;
                if (target) {
                    window.location.hash = target;
                }
            }
        });
    }
}