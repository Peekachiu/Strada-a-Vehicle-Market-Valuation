// public/js/views/heroView.js
// Renders the full home "hero + features + how it works + CTA" sections

export function renderHero(container) {
  container.insertAdjacentHTML('beforeend', `
    <section class="new-hero container" id="home-hero">
      <div class="new-hero-grid">
        <div class="new-hero-left">
          <div class="new-trusted-pill">Trusted by 50,000+ car owners</div>
          <h1 class="new-hero-title">Get Your Vehicle's True<br/>Market Value</h1>
          <p class="new-hero-sub">Instant, accurate valuations powered by real-time market data. Know your car's worth in seconds, backed by comprehensive analysis.</p>

          <div class="new-hero-ctas">
            <!-- Updated: data-navigate attribute -->
            <button id="cta-get" class="btn btn-primary btn-lg" data-navigate="valuation">
              Get Free Valuation
              <svg class="icon-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
            <!-- Updated: data-navigate attribute -->
            <button id="cta-learn" class="btn btn-ghost btn-lg" data-navigate="about">
              Learn More
            </button>
          </div>

          <div class="new-metrics-row">
            <div class="new-metric"><div class="new-metric-num">50K+</div><div class="new-metric-label">Valuations Done</div></div>
            <div class="new-metric"><div class="new-metric-num">98%</div><div class="new-metric-label">Accuracy Rate</div></div>
            <div class="new-metric"><div class="new-metric-num">24/7</div><div class="new-metric-label">Available</div></div>
          </div>
        </div>

        <div class="new-hero-right">
          <div class="new-image-card-blur"></div>
          <div class="new-image-card">
            <img src="static/assets/images/car.JPEG" alt="Luxury car" class="new-image-card-img" 
                 onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'image-card-placeholder\\'>🚗</div>'"/>
          </div>
        </div>
      </div>
    </section>

    <!-- Why choose Strada (feature cards) -->
    <section class="new-features container" id="why">
      <div class="new-section-header">
        <h2 class="new-section-title">Why Choose Strada?</h2>
        <p class="new-section-sub">We provide the most accurate and comprehensive vehicle valuations in the market</p>
      </div>

      <div class="new-features-grid">
        <article class="new-feature-card">
          <div class="new-feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <h3 class="new-feature-title">Instant Results</h3>
          <p class="new-feature-desc">Get your vehicle valuation in seconds, no waiting required</p>
        </article>
        <article class="new-feature-card">
          <div class="new-feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="4"></line><polyline points="6 10 12 4 18 10"></polyline></svg>
          </div>
          <h3 class="new-feature-title">Market Trends</h3>
          <p class="new-feature-desc">Real-time data and historical trends to understand market movements</p>
        </article>
        <article class="new-feature-card">
          <div class="new-feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          </div>
          <h3 class="new-feature-title">Accurate & Reliable</h3>
          <p class="new-feature-desc">98% accuracy backed by comprehensive market data analysis</p>
        </article>

        <article class="new-feature-card">
          <div class="new-feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
          </div>
          <h3 class="new-feature-title">Detailed Analysis</h3>
          <p class="new-feature-desc">Comprehensive breakdown of factors affecting your vehicle's value</p>
        </article>
        <article class="new-feature-card">
          <div class="new-feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9L1.4 16.1c-.5 1.1.3 2.4 1.6 2.4H4c.6 0 1-.4 1-1v-1c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v1c0 .6.4 1 1 1h2c1.1 0 2.1-.8 2.1-1.9 0-.8-.5-1.5-1.2-1.8zM2 12v-1c0-.6.4-1 1-1h4v1H2zm14 0v-1c0-.6.4-1 1-1h4v1h-5zM6 6h4c.6 0 1 .4 1 1v3H6V6zM14 6h4c.6 0 1 .4 1 1v3h-5V6z"></path><circle cx="6.5" cy="17.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>
          </div>
          <h3 class="new-feature-title">Compare Vehicles</h3>
          <p class="new-feature-desc">See how your vehicle compares to similar models in the market</p>
        </article>
        <article class="new-feature-card">
          <div class="new-feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <h3 class="new-feature-title">Free Service</h3>
          <p class="new-feature-desc">No hidden fees, completely free vehicle valuation service</p>
        </article>
      </div>
    </section>

    <!-- How it works -->
    <section class="new-how-it-works container" id="how">
      <div class="new-section-header">
        <h2 class="new-section-title">How It Works</h2>
        <p class="new-section-sub">Get your vehicle valuation in three simple steps</p>
      </div>

      <div class="new-steps-grid">
        <div class="new-step">
          <div class="new-step-num">1</div>
          <h3 class="new-step-title">Enter Details</h3>
          <p class="new-step-desc">Provide your vehicle's make, model, year, mileage, and condition</p>
        </div>
        <div class="new-step">
          <div class="new-step-num">2</div>
          <h3 class="new-step-title">Instant Analysis</h3>
          <p class="new-step-desc">Our algorithm analyzes market data and calculates your vehicle's value</p>
        </div>
        <div class="new-step">
          <div class="new-step-num">3</div>
          <h3 class="new-step-title">Get Results</h3>
          <p class="new-step-desc">View detailed valuation with market trends and comparisons</p>
        </div>
      </div>
    </section>

    <!-- Dark CTA Banner -->
    <section class="new-cta-section container">
      <div class="new-cta-card">
        <h2 class="new-cta-title">Ready to Know Your Car's Worth?</h2>
        <p class="new-cta-sub">Join thousands of satisfied users who trust Strada for accurate vehicle valuations</p>
        <div class="cta-actions">
          <!-- Updated: data-navigate attribute -->
          <button id="banner-start" class="btn btn-secondary btn-lg" data-navigate="valuation">
            Get Started Now
            <svg class="icon-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
      </div>
    </section>
  `);
}