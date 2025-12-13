export function renderAbout(container) {
  container.innerHTML = `
    <!-- About Hero Section -->
    <section class="about-hero">
      <div class="container">
        <div class="about-hero-content animate-fade-up">
          <h1 class="about-title">About Strada</h1>
          <p class="about-subtitle">Empowering car owners with accurate, instant vehicle valuations since our inception</p>
        </div>
      </div>
    </section>

    <!-- Mission & Vision -->
    <section class="mission-section">
      <div class="container">
        <div class="mission-grid">
          <div class="mission-card reveal-on-scroll stagger-1">
            <div class="mission-icon">🎯</div>
            <h2>Our Mission</h2>
            <p>To provide transparent, accurate, and instant vehicle valuations that empower car owners to make informed decisions about their assets.</p>
          </div>
          <div class="mission-card reveal-on-scroll stagger-2">
            <div class="mission-icon">👁️</div>
            <h2>Our Vision</h2>
            <p>To become the most trusted vehicle valuation platform globally, setting the standard for accuracy and reliability in the automotive industry.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Story Section -->
    <section class="story-section">
      <div class="container">
        <div class="story-content">
          <div class="story-text reveal-on-scroll">
            <h2 class="section-heading-left">Our Story</h2>
            <p>Strada was born from a simple observation: car owners deserve better tools to understand their vehicle's worth. Too often, people rely on outdated pricing guides or biased dealer quotes.</p>
            <p>We set out to change that by building a platform powered by real-time market data and comprehensive analysis. Today, over 50,000 car owners trust Strada for accurate valuations.</p>
            <p>Our team combines expertise in automotive markets, data science, and user experience to deliver valuations you can trust. We're constantly improving our algorithms and expanding our data sources to serve you better.</p>
          </div>
          <div class="story-image reveal-on-scroll stagger-2">
            <div class="story-placeholder">
              <img src="/images/IMG_0190.JPEG" alt="Our Team" style="width: 100%; height: auto; border-radius: 12px; object-fit: cover;">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="values-section">
      <div class="container">
        <h2 class="section-heading reveal-on-scroll">Our Core Values</h2>
        <p class="section-sub reveal-on-scroll">The principles that guide everything we do</p>
        
        <div class="values-grid">
          <div class="value-card reveal-on-scroll stagger-1">
            <div class="value-icon">🔍</div>
            <h3>Transparency</h3>
            <p>We believe in clear, honest communication about how we calculate valuations and what factors influence your car's worth.</p>
          </div>
          
          <div class="value-card reveal-on-scroll stagger-2">
            <div class="value-icon">⚡</div>
            <h3>Speed</h3>
            <p>Your time matters. We deliver instant results without compromising on accuracy or detail.</p>
          </div>
          
          <div class="value-card reveal-on-scroll stagger-3">
            <div class="value-icon">🎯</div>
            <h3>Accuracy</h3>
            <p>Our 98% accuracy rate isn't just a number—it's our commitment to providing valuations you can rely on.</p>
          </div>
          
          <div class="value-card reveal-on-scroll stagger-1">
            <div class="value-icon">🤝</div>
            <h3>Trust</h3>
            <p>We've built our reputation on reliability. Over 50,000 users trust us because we consistently deliver on our promises.</p>
          </div>
          
          <div class="value-card reveal-on-scroll stagger-2">
            <div class="value-icon">📈</div>
            <h3>Innovation</h3>
            <p>We constantly refine our algorithms and data sources to stay ahead of market trends and serve you better.</p>
          </div>
          
          <div class="value-card reveal-on-scroll stagger-3">
            <div class="value-icon">💚</div>
            <h3>Customer First</h3>
            <p>Every feature we build and every decision we make starts with one question: How does this benefit our users?</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item reveal-on-scroll stagger-1">
            <div class="stat-number">50,000+</div>
            <div class="stat-label">Happy Users</div>
          </div>
          <div class="stat-item reveal-on-scroll stagger-2">
            <div class="stat-number">98%</div>
            <div class="stat-label">Accuracy Rate</div>
          </div>
          <div class="stat-item reveal-on-scroll stagger-3">
            <div class="stat-number">100K+</div>
            <div class="stat-label">Valuations Done</div>
          </div>
          <div class="stat-item reveal-on-scroll stagger-4">
            <div class="stat-number">24/7</div>
            <div class="stat-label">Always Available</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="team-section">
      <div class="container">
        <h2 class="section-heading reveal-on-scroll">Meet Our Team</h2>
        <p class="section-sub reveal-on-scroll">Passionate experts dedicated to serving you</p>
        
        <div class="team-grid">
          <div class="team-card reveal-on-scroll stagger-1">
            <div class="team-photo" style="width: 120px; height: 120px; margin: 0 auto 1rem;">
              <img src="/images/ivan_profile.jpg" alt="Ivan Neoh" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; background-color: #e5e7eb;">
            </div>
            <h3>Ivan Neoh</h3>
            <p class="team-role">CEO & Founder</p>
            <p class="team-bio">Former automotive analyst with 15+ years of experience in vehicle valuation and market analysis.</p>
          </div>
          
          <div class="team-card reveal-on-scroll stagger-2">
            <div class="team-photo" style="width: 120px; height: 120px; margin: 0 auto 1rem;">
              <img src="/images/profile_pic.jpeg" alt="Edwin Neoh" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; background-color: #e5e7eb;">
            </div>
            <h3>Edwin Neoh</h3>
            <p class="team-role">CTO</p>
            <p class="team-bio">Data scientist and engineer specializing in machine learning and automotive market prediction.</p>
          </div>
          
          <div class="team-card reveal-on-scroll stagger-3">
            <div class="team-photo" style="width: 120px; height: 120px; margin: 0 auto 1rem;">
              <img src="/images/team/emily.jpg" alt="Emily Rodriguez" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; background-color: #e5e7eb;">
            </div>
            <h3>Emily Rodriguez</h3>
            <p class="team-role">Head of Customer Success</p>
            <p class="team-bio">Dedicated to ensuring every user has an exceptional experience with our platform.</p>
          </div>
          
          <div class="team-card reveal-on-scroll stagger-4">
            <div class="team-photo" style="width: 120px; height: 120px; margin: 0 auto 1rem;">
              <img src="assets/images/team/david.jpg" alt="David Kumar" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; background-color: #e5e7eb;">
            </div>
            <h3>David Kumar</h3>
            <p class="team-role">Lead Data Analyst</p>
            <p class="team-bio">Expert in automotive market trends with deep knowledge of pricing dynamics across regions.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="about-cta-section">
      <div class="container">
        <div class="about-cta-content">
          <h2>Ready to Get Your Car's Value?</h2>
          <p>Join thousands of satisfied users who trust Strada for accurate vehicle valuations</p>
          <button id="about-cta-btn" class="btn btn-primary btn-lg">Get Free Valuation →</button>
        </div>
      </div>
    </section>
  `;

  // Add click handler for CTA button
  const ctaBtn = document.getElementById('about-cta-btn');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
      // Navigate to home and scroll to valuation
      window.location.hash = 'home';
      setTimeout(() => {
        const valuationEl = document.getElementById('valuation-root');
        if (valuationEl) {
          valuationEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    });
  }
}