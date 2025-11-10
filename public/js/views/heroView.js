// public/js/views/heroView.js
// Renders the full home "hero + features + how it works + CTA" sections

export function renderHero(container) {
  container.insertAdjacentHTML('beforeend', `
    <!-- Top navigation (still simple: you can keep your existing header if preferred) -->
    <div class="home-hero container" id="home-hero">
      <div class="hero-grid">
        <div class="hero-left">
          <div class="trusted-pill">Trusted by 50,000+ car owners</div>
          <h1 class="hero-title">Get Your Vehicle's True<br/>Market Value</h1>
          <p class="hero-sub">Instant, accurate valuations powered by real-time market data. Know your car's worth in seconds, backed by comprehensive analysis.</p>

          <div class="hero-ctas">
            <button id="cta-get" class="btn btn-primary">Get Free Valuation <span class="arrow">→</span></button>
            <button id="cta-learn" class="btn btn-ghost">Learn More</button>
          </div>

          <div class="metrics-row">
            <div class="metric"><div class="metric-num">50K+</div><div class="metric-label">Valuations Done</div></div>
            <div class="metric"><div class="metric-num">98%</div><div class="metric-label">Accuracy Rate</div></div>
            <div class="metric"><div class="metric-num">24/7</div><div class="metric-label">Available</div></div>
          </div>
        </div>

        <div class="hero-right">
          <div class="image-card">
            <img src="/assets/images/car.JPEG" alt="Car preview" class="image-card-img"/>
          </div>
        </div>
      </div>
    </div>

    <!-- Why choose Strada (feature cards) -->
    <section class="why container" id="why">
      <h2 class="section-heading">Why Choose Strada?</h2>
      <p class="section-sub">We provide the most accurate and comprehensive vehicle valuations in the market</p>

      <div class="features-grid">
        <article class="feature-card"><div class="icon-sq">⏱</div><h3>Instant Results</h3><p>Get your vehicle valuation in seconds, no waiting required</p></article>
        <article class="feature-card"><div class="icon-sq">📈</div><h3>Market Trends</h3><p>Real-time data and historical trends to understand market movements</p></article>
        <article class="feature-card"><div class="icon-sq">🔒</div><h3>Accurate & Reliable</h3><p>98% accuracy backed by comprehensive market data analysis</p></article>

        <article class="feature-card"><div class="icon-sq">📊</div><h3>Detailed Analysis</h3><p>Comprehensive breakdown of factors affecting your vehicle's value</p></article>
        <article class="feature-card"><div class="icon-sq">🚗</div><h3>Compare Vehicles</h3><p>See how your vehicle compares to similar models in the market</p></article>
        <article class="feature-card"><div class="icon-sq">✅</div><h3>Free Service</h3><p>No hidden fees, completely free vehicle valuation service</p></article>
      </div>
    </section>

    <!-- How it works -->
    <section class="how container" id="how">
      <h2 class="section-heading">How It Works</h2>
      <p class="section-sub">Get your vehicle valuation in three simple steps</p>

      <div class="steps-row">
        <div class="step"><div class="step-num">1</div><h4>Enter Details</h4><p>Provide your vehicle's make, model, year, mileage, and condition</p></div>
        <div class="step"><div class="step-num">2</div><h4>Instant Analysis</h4><p>Our algorithm analyzes market data and calculates your vehicle's value</p></div>
        <div class="step"><div class="step-num">3</div><h4>Get Results</h4><p>View detailed valuation with market trends and comparisons</p></div>
      </div>
    </section>

    <!-- Dark CTA Banner -->
    <section class="cta-banner">
      <div class="container cta-inner">
        <h2>Ready to Know Your Car's Worth?</h2>
        <p>Join thousands of satisfied users who trust Strada for accurate vehicle valuations</p>
        <div class="cta-actions">
          <button id="banner-start" class="btn btn-ghost cta-large">Get Started Now →</button>
        </div>
      </div>
    </section>
  `);

  // hook CTA to scroll to valuation form (if present)
  const ctaGet = document.getElementById('cta-get');
  ctaGet && ctaGet.addEventListener('click', () => {
    const el = document.getElementById('valuation-root');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // banner action scroll
  const bannerBtn = document.getElementById('banner-start');
  bannerBtn && bannerBtn.addEventListener('click', () => {
    const el = document.getElementById('valuation-root');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}
