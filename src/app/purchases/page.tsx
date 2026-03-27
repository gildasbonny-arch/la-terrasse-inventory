'use client';

import React, { useEffect, useState } from 'react';
import { Plus, ShoppingCart, Search, RefreshCw } from 'lucide-react';
import { fetchSheetData, SheetData } from '@/lib/sheets';

export default function PurchasesPage() {
  const [data, setData] = useState<SheetData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const sheetUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL;

  const loadData = async () => {
    if (!sheetUrl) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const allData = await fetchSheetData(sheetUrl);
      setData(allData.filter(d => d.id?.startsWith('PUR')));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-luxury-900">Purchases</h1>
          <p className="text-sm text-luxury-600">Stock IN transactions from your suppliers.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={loadData}
            className="p-2 border border-luxury-200 rounded-lg hover:bg-luxury-50 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 text-luxury-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button className="bg-luxury-800 hover:bg-luxury-900 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            New Purchase
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-luxury-200 overflow-hidden min-h-[400px] flex flex-col">
        <div className="p-4 border-b border-luxury-100 flex justify-between items-center bg-luxury-50">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-luxury-400" />
            <input 
              type="text" 
              placeholder="Search purchases..." 
              className="pl-10 pr-4 py-2 border border-luxury-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-500 w-64 bg-white"
            />
          </div>
        </div>
        
        {data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-luxury-50 border-b border-luxury-100 text-sm font-medium text-luxury-600">
                <tr>
                  <th className="p-4 uppercase">Date</th>
                  <th className="p-4 uppercase">Ingredient</th>
                  <th className="p-4 uppercase">Qty</th>
                  <th className="p-4 uppercase">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxury-100">
                {data.map(item => (
                  <tr key={item.id} className="hover:bg-luxury-50">
                    <td className="p-4 text-sm text-luxury-500">{item.date}</td>
                    <td className="p-4 font-medium text-luxury-900">{item.ingredient_id}</td>
                    <td className="p-4 text-luxury-600">{item.quantity} {item.unit}</td>
                    <td className="p-4 font-semibold text-luxury-900">Ksh {Number(item.cost).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 bg-luxury-100 rounded-full flex items-center justify-center mb-4 text-luxury-400">
               <ShoppingCart className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-serif text-luxury-900 mb-2">No purchases yet</h3>
            <p className="text-luxury-500 max-w-xs mx-auto">
              Ready to stock up? Recorded purchases will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
