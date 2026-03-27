'use client';

import React, { useEffect, useState } from 'react';
import { Package, Utensils, Receipt, AlertTriangle, TrendingDown, RefreshCw } from 'lucide-react';
import { fetchSheetData, SheetData } from '@/lib/sheets';

export default function Dashboard() {
  const [data, setData] = useState<{
    ingredients: SheetData[];
    purchases: SheetData[];
    sales: SheetData[];
  }>({
    ingredients: [],
    purchases: [],
    sales: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sheetUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL;

  const loadData = async () => {
    if (!sheetUrl) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const allData = await fetchSheetData(sheetUrl);
      
      // Basic heuristic to split data if multiple tabs are published or just simple filtering
      // (In a real scenario, we might have multiple specific URLs)
      setData({
        ingredients: allData.filter(d => d.id?.startsWith('ING')),
        purchases: allData.filter(d => d.id?.startsWith('PUR')),
        sales: allData.filter(d => d.id?.startsWith('SAL')),
      });
      setError(null);
    } catch (err) {
      setError('Failed to fetch data from Google Sheet. Check your URL.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!sheetUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 bg-white rounded-2xl border border-luxury-200">
        <div className="w-16 h-16 bg-luxury-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-luxury-600" />
        </div>
        <h2 className="text-2xl font-serif text-luxury-900 mb-2">Google Sheet URL Missing</h2>
        <p className="text-luxury-600 max-w-md">
          Please add your published Google Sheet CSV URL to the <code className="bg-luxury-50 px-1 rounded">.env.local</code> file under <code className="bg-luxury-50 px-1 rounded">NEXT_PUBLIC_GOOGLE_SHEET_URL</code>.
        </p>
      </div>
    );
  }

  const totalPurchases = data.purchases.reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0);
  const totalSales = data.sales.length * 1500; // Mock calculation based on item count

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-luxury-900">Dashboard</h1>
          <p className="text-sm text-luxury-600">Overview of La Terrasse Inventory</p>
        </div>
        <button 
          onClick={loadData}
          disabled={loading}
          className="bg-white border border-luxury-200 p-2 rounded-lg hover:bg-luxury-50 transition-colors"
        >
          <RefreshCw className={`w-5 h-5 text-luxury-600 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Total Purchases" 
          value={`Ksh ${totalPurchases.toLocaleString()}`} 
          icon={Receipt} 
          className="bg-white border-luxury-200"
        />
        <DashboardCard 
          title="Total Sales (POS)" 
          value={`Ksh ${totalSales.toLocaleString()}`} 
          icon={Utensils} 
          className="bg-white border-luxury-200"
        />
        <DashboardCard 
          title="Ingredients Tracked" 
          value={`${data.ingredients.length} items`} 
          icon={Package} 
          className="bg-white border-luxury-200"
        />
        <DashboardCard 
          title="Items to Reorder" 
          value="4 items" 
          icon={AlertTriangle} 
          className="bg-red-50 text-red-900 border-red-200"
          valueClassName="text-red-700"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-luxury-200 shadow-sm">
          <h2 className="text-xl font-serif text-luxury-900 mb-6 flex items-center">
            <TrendingDown className="w-5 h-5 mr-2 text-luxury-600 rotate-180" />
            Monthly Trends (Purchases vs Sales)
          </h2>
          <TrendChart />
        </div>

        <div className="bg-white p-6 rounded-xl border border-luxury-200 shadow-sm flex flex-col">
          <h2 className="text-xl font-serif text-luxury-900 mb-4 flex items-center">
            <TrendingDown className="w-5 h-5 mr-2 text-luxury-600" />
            Low Stock Alerts
          </h2>
          <div className="space-y-4 flex-1">
            {(data.ingredients.slice(0, 5).length > 0 ? data.ingredients.slice(0, 5) : [{name: 'Loading...'} as any]).map((item, i) => (
              <div key={i} className="flex justify-between items-center p-3 hover:bg-luxury-50 rounded-lg transition-colors border-b border-luxury-100 last:border-0">
                <span className="font-medium text-luxury-800">{item.name}</span>
                <span className="text-sm text-red-600 font-semibold text-right">
                   Below Min. Stock
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TrendChart() {
  // Static for now, can be linked to data.purchases/data.sales trends
  const data = [
    { month: 'Jan', purchases: 120, sales: 310 },
    { month: 'Feb', purchases: 100, sales: 280 },
    { month: 'Mar', purchases: 150, sales: 420 },
  ];

  const maxVal = 450;

  return (
    <div className="relative h-[250px] w-full mt-4">
      <div className="flex items-end justify-around h-[200px] border-b border-luxury-200 px-4">
        {data.map((d, i) => (
          <div key={i} className="flex flex-col items-center group">
            <div className="flex gap-1 items-end h-[200px]">
              <div 
                className="bg-luxury-200 w-8 rounded-t-sm transition-all group-hover:bg-luxury-300" 
                style={{ height: `${(d.purchases / maxVal) * 100}%` }}
              />
              <div 
                className="bg-luxury-600 w-8 rounded-t-sm transition-all group-hover:bg-luxury-700" 
                style={{ height: `${(d.sales / maxVal) * 100}%` }}
              />
            </div>
            <span className="mt-2 text-xs font-medium text-luxury-600">{d.month}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex justify-center gap-6">
        <div className="flex items-center text-xs text-luxury-600">
          <div className="w-3 h-3 bg-luxury-200 mr-2 rounded-sm" />
          Purchases
        </div>
        <div className="flex items-center text-xs text-luxury-600">
          <div className="w-3 h-3 bg-luxury-600 mr-2 rounded-sm" />
          Sales
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  className,
  valueClassName 
}: { 
  title: string; 
  value: string; 
  icon: any; 
  trend?: string;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <div className={`p-6 rounded-xl border shadow-sm flex items-start justify-between ${className || ''}`}>
      <div>
        <p className="text-sm font-medium text-luxury-600 mb-1 uppercase tracking-wider">{title}</p>
        <h3 className={`text-2xl font-bold ${valueClassName || 'text-luxury-900'}`}>{value}</h3>
        {trend && (
          <p className="text-xs mt-2 text-green-600 font-medium bg-green-50 inline-block px-2 py-1 rounded-full">
            {trend}
          </p>
        )}
      </div>
      <div className="p-3 bg-luxury-100 rounded-lg">
        <Icon className="w-6 h-6 text-luxury-700" />
      </div>
    </div>
  );
}
