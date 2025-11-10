export function renderHero(container) {
  container.insertAdjacentHTML('beforeend', `
    <section class="hero container">
      <div class="hero-inner">
        <div class="hero-copy">
          <h1>Fast, accurate vehicle valuation</h1>
          <p class="lead">Upload details, get a data-driven valuation with explainable output.</p>
          <div class="cta-row">
            <button id="cta-try" class="btn btn-primary">Try Free</button>
            <button id="cta-learn" class="btn btn-ghost">Learn more</button>
          </div>
        </div>
        <div class="hero-image">
          <div class="device-mockup" aria-hidden="true">[Design preview]</div>
        </div>
      </div>
    </section>
  `);
}
