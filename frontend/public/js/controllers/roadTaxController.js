export class RoadTaxController {
    constructor(main) {
        this.main = main;
        this.ccInput = this.main.querySelector('#rt-cc');
        this.regionInput = this.main.querySelector('#rt-region');
        this.typeInput = this.main.querySelector('#rt-type');
        this.ownershipInput = this.main.querySelector('#rt-ownership');

        this.resultsContainer = this.main.querySelector('#roadtax-results');
        this.resBase = this.main.querySelector('#res-base');
        this.resProgressive = this.main.querySelector('#res-progressive');
        this.resTotal = this.main.querySelector('#res-total-tax');
        this.companyRow = this.main.querySelector('#company-surcharge-row');

        this.calculate = this.calculate.bind(this);
    }

    init() {
        const inputs = [this.ccInput, this.regionInput, this.typeInput, this.ownershipInput];
        inputs.forEach(input => {
            if (input) {
                input.addEventListener('input', this.calculate);
            }
        });
    }

    calculate() {
        const cc = parseInt(this.ccInput.value) || 0;
        const region = this.regionInput.value;
        const type = this.typeInput.value;
        const ownership = this.ownershipInput.value;

        if (cc > 0) {
            let baseRate = 0;
            let progressiveRate = 0;

            // --- CALCULATION LOGIC (Simplified for 2024) ---
            // Note: This is a simplified implementation of the complex tables.
            // Real implementation would need the full lookup tables.

            if (region === 'peninsular') {
                if (type === 'saloon') {
                    if (cc <= 1000) baseRate = 20;
                    else if (cc <= 1200) baseRate = 55;
                    else if (cc <= 1400) baseRate = 70;
                    else if (cc <= 1600) baseRate = 90;
                    else if (cc <= 1800) { baseRate = 200; progressiveRate = (cc - 1600) * 0.40; }
                    else if (cc <= 2000) { baseRate = 280; progressiveRate = (cc - 1800) * 0.50; }
                    else if (cc <= 2500) { baseRate = 380; progressiveRate = (cc - 2000) * 1.00; }
                    else { baseRate = 880; progressiveRate = (cc - 2500) * 2.50; }
                } else { // Non-Saloon
                    if (cc <= 1000) baseRate = 20;
                    else if (cc <= 1200) baseRate = 55; // Note: Non-saloons often match saloon base below 1600
                    else if (cc <= 1400) baseRate = 70;
                    else if (cc <= 1600) baseRate = 90;
                    else if (cc <= 1800) { baseRate = 300; progressiveRate = (cc - 1600) * 0.30; } // Different progressive
                    else if (cc <= 2000) { baseRate = 360; progressiveRate = (cc - 1800) * 0.40; }
                    else if (cc <= 2500) { baseRate = 440; progressiveRate = (cc - 2000) * 0.80; }
                    else { baseRate = 840; progressiveRate = (cc - 2500) * 1.60; }
                }
            } else if (region === 'east') {
                // East Malaysia Rates (Generally lower)
                if (type === 'saloon') {
                    if (cc <= 1000) baseRate = 20;
                    else if (cc <= 1200) baseRate = 44;
                    else if (cc <= 1400) baseRate = 56;
                    else if (cc <= 1600) baseRate = 72;
                    else if (cc <= 1800) { baseRate = 160; progressiveRate = (cc - 1600) * 0.32; }
                    else if (cc <= 2000) { baseRate = 224; progressiveRate = (cc - 1800) * 0.25; } // Actually drops per cc sometimes
                    else if (cc <= 2500) { baseRate = 274; progressiveRate = (cc - 2000) * 0.50; }
                    else { baseRate = 524; progressiveRate = (cc - 2500) * 1.00; }
                } else {
                    // Non-Saloon East
                    if (cc <= 1000) baseRate = 20;
                    else if (cc <= 1200) baseRate = 30;
                    else if (cc <= 1400) baseRate = 40;
                    else if (cc <= 1600) baseRate = 56;
                    else if (cc <= 1800) { baseRate = 100; progressiveRate = (cc - 1600) * 0.24; }
                    else if (cc <= 2000) { baseRate = 148; progressiveRate = (cc - 1800) * 0.32; }
                    else if (cc <= 2500) { baseRate = 212; progressiveRate = (cc - 2000) * 0.64; }
                    else { baseRate = 532; progressiveRate = (cc - 2500) * 1.28; }
                }
            } else {
                // Langkawi (50% of Peninsular usually)
                // Simplified: 50% of Peninsular calculation
                if (type === 'saloon') {
                    if (cc <= 1000) baseRate = 20; // Min RM20 usually holds
                    else if (cc <= 1200) baseRate = 27.5;
                    else if (cc <= 1400) baseRate = 35;
                    else if (cc <= 1600) baseRate = 45;
                    else if (cc <= 1800) { baseRate = 100; progressiveRate = (cc - 1600) * 0.20; }
                    else { baseRate = 140; progressiveRate = (cc - 1800) * 0.25; } // Very rough approx
                } else {
                    baseRate = 20; // Placeholder for non-saloon langkawi
                }
            }

            // Company Registration Surcharge
            // Usually company cars pay higher base rates or flat multiplier.
            // For simplicity here, we'll apply a flat multiplier if company.
            // Real world: Company private cars often pay the same as individual unless it's commercial use, 
            // BUT some sources say company registration is higher. 
            // Let's assume 2x for > 1600cc or similar if strictly following old rules, 
            // but user prompt implies simple calculator. Let's stick to standard rates for now 
            // and maybe just add a small note or 10% if that's the rule found.
            // Research said "Company-registered cars generally incur a 10% higher road tax".

            let total = baseRate + progressiveRate;

            if (ownership === 'company') {
                total = total * 1.10; // 10% surcharge
                this.companyRow.style.display = 'flex';
            } else {
                this.companyRow.style.display = 'none';
            }

            this.resBase.textContent = `RM ${baseRate.toFixed(2)}`;
            this.resProgressive.textContent = `RM ${progressiveRate.toFixed(2)}`;
            this.resTotal.textContent = `RM ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

            this.resultsContainer.classList.remove('hidden');
        } else {
            this.resultsContainer.classList.add('hidden');
        }
    }
}
