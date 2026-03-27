'use client';

import Link from 'next/link';
import { 
  LayoutDashboard, 
  Apple, 
  Truck, 
  ShoppingCart, 
  Utensils, 
  BookOpen, 
  Receipt, 
  Package, 
  ClipboardList, 
  AlertTriangle 
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Stock', href: '/stock', icon: Package },
  { name: 'Ingredients', href: '/ingredients', icon: Apple },
  { name: 'Suppliers', href: '/suppliers', icon: Truck },
  { name: 'Purchases', href: '/purchases', icon: ShoppingCart },
  { name: 'Menu Items', href: '/menu-items', icon: Utensils },
  { name: 'Recipes', href: '/recipes', icon: BookOpen },
  { name: 'Sales', href: '/sales', icon: Receipt },
  { name: 'Inventory Counts', href: '/inventory-counts', icon: ClipboardList },
  { name: 'Reorders', href: '/reorders', icon: AlertTriangle },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-luxury-900 text-luxury-50 shadow-xl flex flex-col h-full">
      <div className="p-6 border-b border-luxury-800 flex flex-col items-center text-center">
        <div className="w-32 mb-2 bg-white/10 p-2 rounded-lg backdrop-blur-sm">
           <img 
             src="/assets/logo.png" 
             alt="La Terrasse Logo" 
             className="w-full h-auto"
             onError={(e) => {
               (e.target as HTMLImageElement).style.display = 'none';
             }}
           />
        </div>
        <h1 className="text-xl font-serif text-luxury-300">La Terrasse</h1>
        <p className="text-[10px] text-luxury-400 mt-1 tracking-[0.2em] uppercase">Inventory Control</p>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link 
                  href={item.href}
                  className="flex items-center px-6 py-3 text-sm font-medium hover:bg-luxury-800 transition-colors"
                >
                  <Icon className="w-5 h-5 mr-3 text-luxury-400" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-6 border-t border-luxury-800 text-xs text-luxury-500">
        &copy; {new Date().getFullYear()} La Terrasse
      </div>
    </div>
  );
}
