export class CalculatorController {
    constructor(main) {
        this.main = main;
        this.priceInput = this.main.querySelector('#calc-price');
        this.downPercentInput = this.main.querySelector('#calc-down-percent');
        this.interestInput = this.main.querySelector('#calc-interest');
        this.termInput = this.main.querySelector('#calc-term');
        this.downAmountDisplay = this.main.querySelector('#calc-down-amount-display');
        this.resultsContainer = this.main.querySelector('#calculator-results');

        this.resMonthly = this.main.querySelector('#res-monthly');
        this.resInterest = this.main.querySelector('#res-interest');
        this.resTotal = this.main.querySelector('#res-total');

        this.calculate = this.calculate.bind(this);
    }

    init() {
        const inputs = [this.priceInput, this.downPercentInput, this.interestInput, this.termInput];
        inputs.forEach(input => {
            if (input) {
                input.addEventListener('input', this.calculate);
            }
        });
    }

    calculate() {
        let price = parseFloat(this.priceInput.value) || 0;
        const downPercent = parseFloat(this.downPercentInput.value) || 0;
        let interestRate = parseFloat(this.interestInput.value) || 0;
        let termYears = parseFloat(this.termInput.value) || 0;

        // Apply Caps & specific visual update
        if (price > 10000000) { price = 10000000; this.priceInput.value = 10000000; }
        if (interestRate > 20) { interestRate = 20; this.interestInput.value = 20; }
        if (termYears > 9) { termYears = 9; this.termInput.value = 9; }

        // Calculate Down Payment Amount
        const downPayment = price * (downPercent / 100);
        this.downAmountDisplay.textContent = `Down Payment Amount: RM ${downPayment.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

        if (price > 0 && termYears > 0) {
            const principal = price - downPayment;
            const totalInterest = principal * (interestRate / 100) * termYears;
            const totalPayment = principal + totalInterest;
            const monthlyPayment = totalPayment / (termYears * 12);

            this.resMonthly.textContent = `RM ${monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            this.resInterest.textContent = `RM ${totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            this.resTotal.textContent = `RM ${totalPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

            this.resultsContainer.classList.remove('hidden');
        } else {
            this.resultsContainer.classList.add('hidden');
        }
    }
}
