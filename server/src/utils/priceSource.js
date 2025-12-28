import axios from 'axios';

const client = axios.create({
    baseURL: "https://api.coingecko.com",
    timeout: 5000,
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate, br",
        "connection": "keep-alive"
    }
});

export async function fetcgBTC() {
    try {
        const { data } = await client.get('/api/v3/simple/price', {
            params: {
                ids: "bitcoin",
                vs_currencies: "usd"
            }
        });
        
        return {
            coin: "BTC",
            price: data.bitcoin.usd,
            ts: new Date()
        };
    } catch (error) {
        console.error('CoinGecko API error:', error.message);
        return { coin: "BTC", price: null, error: 'Fetch failed', ts: new Date() };
    }
}
