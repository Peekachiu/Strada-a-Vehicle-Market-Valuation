export function renderGallery(container) {
    container.innerHTML = `
    <!-- Gallery Hero Section -->
    <section class="about-hero">
      <div class="container">
        <div class="about-hero-content animate-fade-up">
          <h1 class="about-title">Our Gallery</h1>
          <p class="about-subtitle">A glimpse into the world of Strada and the vehicles we value.</p>
        </div>
      </div>
    </section>

    <!-- Gallery Grid Section -->
    <section class="gallery-section" style="padding: 4rem 0;">
      <div class="container">
        <div class="gallery-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem;">
          <!-- Gallery Items -->
          <div class="gallery-item reveal-on-scroll stagger-1">
            <img src="assets/images/IMG_0190.JPEG" alt="Gallery Image 1" style="width: 100%; height: 250px; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
          </div>
          <div class="gallery-item reveal-on-scroll stagger-2">
            <img src="assets/images/IMG_0191.JPEG" alt="Gallery Image 2" style="width: 100%; height: 250px; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
          </div>
          <div class="gallery-item reveal-on-scroll stagger-3">
            <img src="assets/images/IMG_0192.JPEG" alt="Gallery Image 3" style="width: 100%; height: 250px; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
          </div>
          <div class="gallery-item reveal-on-scroll stagger-1">
            <img src="assets/images/IMG_0193.JPEG" alt="Gallery Image 4" style="width: 100%; height: 250px; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
          </div>
          <div class="gallery-item reveal-on-scroll stagger-2">
            <img src="assets/images/IMG_0194.JPEG" alt="Gallery Image 5" style="width: 100%; height: 250px; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
          </div>
          <div class="gallery-item reveal-on-scroll stagger-3">
            <img src="assets/images/IMG_0195.JPEG" alt="Gallery Image 6" style="width: 100%; height: 250px; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
          </div>
           <div class="gallery-item reveal-on-scroll stagger-1">
            <img src="assets/images/IMG_0196.JPEG" alt="Gallery Image 7" style="width: 100%; height: 250px; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
          </div>
           <div class="gallery-item reveal-on-scroll stagger-2">
            <img src="assets/images/car.JPEG" alt="Gallery Image 8" style="width: 100%; height: 250px; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
          </div>
        </div>
      </div>
    </section>
  `;

    // Add hover effect via JS or assume CSS handles it (inline styles added for simplicity)
    const items = container.querySelectorAll('.gallery-item img');
    items.forEach(img => {
        img.addEventListener('mouseenter', () => img.style.transform = 'scale(1.05)');
        img.addEventListener('mouseleave', () => img.style.transform = 'scale(1)');
    });
}
