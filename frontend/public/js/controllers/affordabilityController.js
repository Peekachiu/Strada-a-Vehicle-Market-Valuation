import { renderAffordabilityPage, renderAffordabilityResults } from '../views/affordabilityView.js';

export class AffordabilityController {
    constructor(main) {
        this.main = main;
        this.budgetInput = this.main.querySelector('#aff-budget');
        this.downPaymentInput = this.main.querySelector('#aff-downpayment');
        this.termInput = this.main.querySelector('#aff-term');
        this.rateInput = this.main.querySelector('#aff-rate');
        this.resultsContainer = this.main.querySelector('#affordability-results-container');

        this.calculate = this.calculate.bind(this);
    }

    init() {
        renderAffordabilityPage(this.main);

        // Re-select elements after render if necessary, but usually main.querySelector works if DOM is there.
        // Wait, renderAffordabilityPage injects HTML, so we must select AFTER rendering.
        this.budgetInput = this.main.querySelector('#aff-budget');
        this.downPaymentInput = this.main.querySelector('#aff-downpayment');
        this.termInput = this.main.querySelector('#aff-term');
        this.rateInput = this.main.querySelector('#aff-rate');
        this.resultsContainer = this.main.querySelector('#affordability-results-container');
        this.form = this.main.querySelector('#affordability-form');

        const inputs = [this.budgetInput, this.downPaymentInput, this.termInput, this.rateInput];
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
        let monthlyBudget = parseFloat(this.budgetInput.value) || 0;
        const downPaymentPercent = parseFloat(this.downPaymentInput.value) || 0;
        let termYears = parseInt(this.termInput.value) || 0;
        let interestRate = parseFloat(this.rateInput.value) || 0;

        // Apply Caps & Visual Update
        if (monthlyBudget > 100000) {
            monthlyBudget = 100000;
            this.budgetInput.value = 100000;
        }


        // Apply Caps & Visual Update
        if (termYears > 9) {
            termYears = 9;
            this.termInput.value = 9;
        }
        if (interestRate > 20) {
            interestRate = 20;
            this.rateInput.value = 20;
        }

        if (!monthlyBudget || monthlyBudget < 100) {
            // We can hide results or show error, but standard pattern just hides or does nothing if invalid-on-input
            // But for submit we surely alert. For live, maybe valid check?
            // Let's stick to simple: if missing, return. 
            // The original code alerted. Let's keep alert only if it's a submit event, but difficult to distinguish cleanly without more logic.
            // For live calc, better not to alert on every keypress.
            return;
        }

        // 2. Calculate Reverse Loan
        // Formula:
        // Total Repayment = Monthly * Months
        // Total Interest % = Rate * Years
        // Principal (Loan Amount) = Total Repayment / (1 + (Total Interest % / 100))
        // Max Price = Principal / (1 - (Down Payment % / 100))

        const totalMonths = termYears * 12;
        const totalRepayment = monthlyBudget * totalMonths;
        const totalInterestPercent = interestRate * termYears;

        // Principal = Total Repayment / (1 + InterestFactor)
        const principal = totalRepayment / (1 + (totalInterestPercent / 100));

        // Max Price = Principal / (1 - DownPaymentFactor)
        // If Down Payment is 0, Max Price = Principal
        // If Down Payment is 10%, Max Price = Principal / 0.9
        const maxPrice = principal / (1 - (downPaymentPercent / 100));

        const downPaymentAmount = maxPrice * (downPaymentPercent / 100);
        const totalInterest = principal * (totalInterestPercent / 100);

        // 3. Render Results
        const resultData = {
            maxPrice,
            loanAmount: principal,
            downPaymentPercent,
            downPaymentAmount,
            totalInterest
        };

        renderAffordabilityResults(this.resultsContainer, resultData);
    }
}
