import React from 'react';
import { calculateTheoreticalStock, calculateReorderSuggestion, Ingredient, StockMovement } from '@/lib/formulas';
import { AlertCircle, ArrowDown, ArrowUp, Link, Filter } from 'lucide-react';

// DUMMY DATA FOR DEMONSTRATION
const dummyIngredients: Ingredient[] = [
  { id: '1', name: 'Flour Type 45', baseUnit: 'g', minStock: 5000, maxStock: 20000, initialStock: 10000 },
  { id: '2', name: 'Olive Oil', baseUnit: 'ml', minStock: 2000, maxStock: 10000, initialStock: 5000 },
  { id: '3', name: 'Beef Tenderloin', baseUnit: 'g', minStock: 3000, maxStock: 15000, initialStock: 8000 },
];

const dummyMovements: StockMovement[] = [
  { ingredientId: '1', type: 'IN', quantity: 10000 }, // Purchase
  { ingredientId: '1', type: 'OUT', quantity: 18000 }, // Sales / Recipes usage -> Overdrafting here to show alert
  { ingredientId: '2', type: 'OUT', quantity: 2000 },
  { ingredientId: '3', type: 'OUT', quantity: 1000 },
];

export default function StockPage() {
  const stockLevels = dummyIngredients.map(ing => {
    const theoretical = calculateTheoreticalStock(ing, dummyMovements);
    const reorder = calculateReorderSuggestion(ing, theoretical);

    return {
      ...ing,
      theoretical,
      reorder
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-luxury-900">Current Stock</h1>
          <p className="text-sm text-luxury-600">Theoretical stock based on purchases and POS sales.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-luxury-200 text-luxury-700 px-4 py-2 rounded-lg flex items-center transition-colors shadow-sm hover:bg-luxury-50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-luxury-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-luxury-50 border-b border-luxury-100 text-sm font-medium text-luxury-600">
            <tr>
              <th className="p-4 uppercase">Ingredient</th>
              <th className="p-4 uppercase">Current Stock</th>
              <th className="p-4 uppercase">Status</th>
              <th className="p-4 uppercase">Suggested Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-luxury-100">
            {stockLevels.map(item => (
              <tr key={item.id} className="hover:bg-luxury-50">
                <td className="p-4 text-luxury-900 font-medium">
                  {item.name}
                  <span className="text-xs ml-2 text-luxury-400">({item.baseUnit})</span>
                </td>
                <td className="p-4">
                  <span className={`text-lg font-semibold ${item.reorder.shouldReorder ? 'text-red-600' : 'text-green-600'}`}>
                    {item.theoretical.toLocaleString()}
                  </span>
                </td>
                <td className="p-4">
                  {item.reorder.shouldReorder ? (
                    <span className="inline-flex items-center px-2 py-1 bg-red-50 text-red-700 rounded-md text-xs font-semibold">
                      <ArrowDown className="w-3 h-3 mr-1" />
                      Low Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs font-semibold">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      Healthy
                    </span>
                  )}
                </td>
                <td className="p-4">
                  {item.reorder.shouldReorder ? (
                    <span className="text-sm text-luxury-700 font-medium flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1 text-amber-500" />
                      Reorder {item.reorder.reorderQuantity} {item.baseUnit}
                    </span>
                  ) : (
                    <span className="text-sm text-luxury-400">No action</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
