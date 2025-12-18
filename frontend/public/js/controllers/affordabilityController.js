import { renderAffordabilityPage, renderAffordabilityResults } from '../views/affordabilityView.js';

export class AffordabilityController {
    constructor(main) {
        this.main = main;
        this.calculate = this.calculate.bind(this);
    }

    init() {
        renderAffordabilityPage(this.main);

        this.form = document.getElementById('affordability-form');
        this.resultsContainer = document.getElementById('affordability-results-container');

        if (this.form) {
            this.form.addEventListener('submit', this.calculate);
        }

        // Add Live Validation Listeners
        const inputs = this.main.querySelectorAll('#aff-budget, #aff-downpayment, #aff-term, #aff-rate');
        inputs.forEach(input => {
            input.addEventListener('input', this.calculate);
        });
    }

    calculate(e) {
        e.preventDefault();

        // 1. Get Inputs
        const monthlyBudget = parseFloat(document.getElementById('aff-budget').value);
        const downPaymentPercent = parseFloat(document.getElementById('aff-downpayment').value);
        let termYears = parseInt(document.getElementById('aff-term').value);
        let interestRate = parseFloat(document.getElementById('aff-rate').value);

        // Apply Caps & Visual Update
        if (termYears > 9) {
            termYears = 9;
            document.getElementById('aff-term').value = 9;
        }
        if (interestRate > 20) {
            interestRate = 20;
            document.getElementById('aff-rate').value = 20;
        }

        if (!monthlyBudget || monthlyBudget < 100) {
            alert("Please enter a valid Monthly Budget (min RM 100).");
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
