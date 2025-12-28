import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area } from 'recharts';
import { useEffect, useState } from 'react';
import axios from 'axios';

const LiveChart = () => {
    const [data, setData] = useState([]);
    const [currentPrice, setCurrentPrice] = useState(0);  // ✅ Start with 0, never "Loading..."

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5678/prices');
                const chartData = res.data.map((d) => ({
                    time: new Date(d.ts).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                    price: Number(d.price),
                }));
                
                setData(chartData.slice(-25));
                // ✅ Always update price (even if 0)
                setCurrentPrice(chartData.length > 0 ? chartData[chartData.length - 1].price : currentPrice);
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ 
            width: '100%', 
            maxWidth: '1400px',
            background: 'linear-gradient(135deg, #1e1e2e 0%, #2a1e3d 100%)',
            padding: '32px', 
            borderRadius: '24px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
            margin: '0 auto'
        }}>
            <div style={{ 
                color: '#e2e8f0', 
                fontSize: '28px', 
                fontWeight: 'bold',
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <span>₿ Bitcoin Live Price</span>
                {/* ✅ ALWAYS SHOWS PRICE - top right, updates live */}
                <div style={{ 
                    fontSize: '36px', 
                    fontWeight: '800',
                    background: 'linear-gradient(90deg, #10b981, #34d399)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    ${currentPrice.toLocaleString()}
                </div>
            </div>

            <ResponsiveContainer width="100%" height={500}>
                <LineChart data={data} margin={{ top: 15, right: 25, left: 0, bottom: 15 }}>
                    <defs>
                        <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.4}/>
                            <stop offset="50%" stopColor="#059669" stopOpacity={0.3}/>
                            <stop offset="100%" stopColor="#047857" stopOpacity={0.1}/>
                        </linearGradient>
                    </defs>
                    
                    <Area type="monotone" dataKey="price" stroke="none" fillOpacity={1} fill="url(#priceGradient)"/>
                    <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={4} dot={false}
                          activeDot={{ r: 10, fill: '#10b981', stroke: '#fff', strokeWidth: 3 }}/>
                    
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={13} tickLine={false} axisLine={false}/>
                    <YAxis stroke="#94a3b8" fontSize={13} tickLine={false} axisLine={false}
                           tickFormatter={(value) => `$${value.toLocaleString()}`} width={80}/>
                    
                    <Tooltip 
                        contentStyle={{
                            background: 'rgba(30, 30, 46, 0.98)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: '16px',
                            color: '#e2e8f0',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                        }}
                        labelStyle={{ color: '#94a3b8', fontWeight: '600' }}
                        formatter={(value) => [`$${value.toLocaleString()}`, 'Price']}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LiveChart;
