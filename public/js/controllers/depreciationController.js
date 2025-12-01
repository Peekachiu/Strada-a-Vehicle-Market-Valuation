import { renderDepreciationPage, renderDepreciationResults } from '../views/depreciationView.js';

export class DepreciationController {
    constructor(main) {
        this.main = main;
        this.calculate = this.calculate.bind(this);
    }

    init() {
        renderDepreciationPage(this.main);

        this.form = document.getElementById('depreciation-form');
        this.resultsContainer = document.getElementById('depreciation-results-container');

        if (this.form) {
            this.form.addEventListener('submit', this.calculate);
        }
    }

    calculate(e) {
        e.preventDefault();

        // 1. Get Inputs
        const currentPrice = parseFloat(document.getElementById('dep-price').value);
        const type = document.getElementById('dep-type').value;
        const period = parseInt(document.getElementById('dep-period').value);

        if (!currentPrice || currentPrice < 1000) {
            alert("Please enter a valid Market Price (min RM 1,000).");
            return;
        }

        // 2. Define Depreciation Rates
        // Standard: Year 1: 15%, Year 2: 10%, Year 3+: 8%
        // Luxury: Year 1: 20%, Year 2: 15%, Year 3+: 10%
        let rates = [];
        if (type === 'luxury') {
            rates = [0.20, 0.15, 0.10]; // Year 1, 2, 3+
        } else {
            rates = [0.15, 0.10, 0.08]; // Year 1, 2, 3+
        }

        // 3. Calculate Curve
        const labels = [];
        const dataPoints = [];
        let value = currentPrice;

        // Year 0 (Now)
        labels.push('Now');
        dataPoints.push(value);

        for (let i = 1; i <= period; i++) {
            let rate = 0;
            if (i === 1) rate = rates[0];
            else if (i === 2) rate = rates[1];
            else rate = rates[2];

            value = value * (1 - rate);

            labels.push(`Year ${i}`);
            dataPoints.push(Math.round(value));
        }

        const futureValue = dataPoints[dataPoints.length - 1];
        const totalLoss = currentPrice - futureValue;

        // 4. Render Results
        const resultData = {
            futureValue,
            totalLoss,
            period
        };

        renderDepreciationResults(this.resultsContainer, resultData);

        // 5. Render Chart
        setTimeout(() => {
            this.renderChart(labels, dataPoints);
        }, 0);
    }

    renderChart(labels, data) {
        const ctx = document.getElementById('depreciationChart');
        if (!ctx) return;

        // Destroy existing chart if any (simple way: check if property exists)
        // In a real app, we'd track the chart instance. For now, assuming fresh render.

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Estimated Market Value (RM)',
                    data: data,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 3,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#2563eb',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#1f2937',
                        padding: 12,
                        titleFont: { size: 13 },
                        bodyFont: { size: 13 },
                        displayColors: false,
                        callbacks: {
                            label: function (context) {
                                return 'RM ' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: '#f3f4f6'
                        },
                        ticks: {
                            callback: function (value) {
                                return 'RM ' + (value / 1000) + 'k';
                            },
                            font: {
                                size: 11
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    }
                }
            }
        });
    }
}
