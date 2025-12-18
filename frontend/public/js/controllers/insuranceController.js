import { renderInsurancePage, renderInsuranceResults } from '../views/insuranceView.js';

export class InsuranceController {
    constructor(main) {
        this.main = main;
        this.valueInput = this.main.querySelector('#ins-market-value');
        this.locationInput = this.main.querySelector('#ins-location');
        this.ncdInput = this.main.querySelector('#ins-ncd');
        this.ccInput = this.main.querySelector('#ins-cc');
        this.resultsContainer = this.main.querySelector('#insurance-results-container');

        this.calculate = this.calculate.bind(this);
    }

    init() {
        renderInsurancePage(this.main);

        // Re-select after render
        this.valueInput = this.main.querySelector('#ins-market-value');
        this.locationInput = this.main.querySelector('#ins-location');
        this.ncdInput = this.main.querySelector('#ins-ncd');
        this.ccInput = this.main.querySelector('#ins-cc');
        this.resultsContainer = this.main.querySelector('#insurance-results-container');
        this.form = this.main.querySelector('#insurance-form');

        const inputs = [this.valueInput, this.locationInput, this.ncdInput, this.ccInput];
        inputs.forEach(input => {
            if (input) {
                input.addEventListener('input', this.calculate);
            }
        });

        if (this.form) {
            this.form.addEventListener('submit', this.calculate);
        }
    }

    calculate(e) {
        if (e) e.preventDefault();

        // 1. Get Inputs
        let marketValue = parseFloat(this.valueInput.value) || 0;
        const location = this.locationInput.value;
        const ncd = parseFloat(this.ncdInput.value) || 0;
        let cc = parseInt(this.ccInput.value) || 0;

        // Apply Caps & Visual Update
        if (marketValue > 10000000) {
            marketValue = 10000000;
            this.valueInput.value = 10000000;
        }
        if (cc > 7000) {
            cc = 7000;
            this.ccInput.value = 7000;
        }

        if (!marketValue || marketValue < 10000) {
            // Live validation check mostly silent or handled by UI hints
            return;
        }

        // 2. Determine Base Rate (Approximation)
        // West Malaysia: ~2.6%
        // East Malaysia: ~2.0%
        // Note: This is a simplified estimation. Actual tariff depends on CC bands.
        // We can add a small adjustment based on CC for better realism if needed, 
        // but for now we stick to the plan.
        let baseRate = location === 'west' ? 0.026 : 0.020;

        // 3. Calculate
        const grossPremium = marketValue * baseRate;
        const ncdAmount = grossPremium * (ncd / 100);
        const premiumAfterNcd = grossPremium - ncdAmount;
        const serviceTax = premiumAfterNcd * 0.08; // 8% SST
        const stampDuty = 10.00;
        const total = premiumAfterNcd + serviceTax + stampDuty;

        // 4. Render Results
        const resultData = {
            grossPremium,
            ncdPercent: ncd,
            ncdAmount,
            premiumAfterNcd,
            serviceTax,
            stampDuty,
            total
        };

        renderInsuranceResults(this.resultsContainer, resultData);
    }
}
