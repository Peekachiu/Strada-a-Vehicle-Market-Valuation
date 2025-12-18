import { renderInsurancePage, renderInsuranceResults } from '../views/insuranceView.js';

export class InsuranceController {
    constructor(main) {
        this.main = main;
        this.calculate = this.calculate.bind(this);
    }

    init() {
        renderInsurancePage(this.main);

        this.form = document.getElementById('insurance-form');
        this.resultsContainer = document.getElementById('insurance-results-container');

        if (this.form) {
            this.form.addEventListener('submit', this.calculate);
        }

        // Add Live Validation Listeners
        const inputs = this.main.querySelectorAll('#ins-market-value, #ins-location, #ins-ncd, #ins-cc');
        inputs.forEach(input => {
            input.addEventListener('input', this.calculate);
        });
    }

    calculate(e) {
        e.preventDefault();

        // 1. Get Inputs
        let marketValue = parseFloat(document.getElementById('ins-market-value').value);
        const location = document.getElementById('ins-location').value;
        const ncd = parseFloat(document.getElementById('ins-ncd').value);
        let cc = parseInt(document.getElementById('ins-cc').value);

        // Apply Caps & Visual Update
        if (marketValue > 10000000) {
            marketValue = 10000000;
            document.getElementById('ins-market-value').value = 10000000;
        }
        if (cc > 7000) {
            cc = 7000;
            document.getElementById('ins-cc').value = 7000;
        }

        if (!marketValue || marketValue < 10000) {
            alert("Please enter a valid Market Value (min RM 10,000).");
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
