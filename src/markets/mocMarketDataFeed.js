// PROPRIETARY TECHNOLOGY OF REALITY PROTOCOL LLC
// PATENT PENDING: MARKET-DRIVEN WAVELENGTH VISUALIZATION SYSTEM
// © 2025 Reality Protocol LLC. All Rights Reserved.

export class MockMarketDataFeed {
    constructor() {
        this.subscribers = [];
    }

    subscribe(callback) {
        this.subscribers.push(callback);
    }

    start() {
        // Simulate market data updates every second
        setInterval(() => {
            const marketData = {
                btc: {
                    price: 30000 + Math.random() * 1000,
                    change: (Math.random() - 0.5) * 10 // -5% to +5%
                },
                eth: {
                    price: 2000 + Math.random() * 100,
                    change: (Math.random() - 0.5) * 8
                },
                sol: {
                    price: 100 + Math.random() * 10,
                    change: (Math.random() - 0.5) * 12
                }
            };
            this.subscribers.forEach(callback => callback(marketData));
        }, 1000);
    }
}
