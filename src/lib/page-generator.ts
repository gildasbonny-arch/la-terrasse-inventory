import React from 'react';

// Generates a simple page scaffold given a title
export const generatePage = (title: string, description: string) => {
  return `import React from 'react';
import { Plus } from 'lucide-react';

export default function ${title.replace(/\s/g, '')}Page() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-luxury-900">${title}</h1>
          <p className="text-sm text-luxury-600">${description}</p>
        </div>
        <button className="bg-luxury-800 hover:bg-luxury-900 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-luxury-200 overflow-hidden min-h-[400px] flex flex-col">
        <div className="p-4 border-b border-luxury-100 flex justify-between items-center bg-luxury-50">
          <input 
            type="text" 
            placeholder="Search ${title.toLowerCase()}..." 
            className="px-4 py-2 border border-luxury-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-500 w-64 bg-white"
          />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <div className="w-20 h-20 bg-luxury-100 rounded-full flex items-center justify-center mb-4">
             <Plus className="w-10 h-10 text-luxury-400" />
          </div>
          <h3 className="text-xl font-serif text-luxury-900 mb-2">No ${title.toLowerCase()} found</h3>
          <p className="text-luxury-500 max-w-xs mx-auto">
            Get started by adding your first ${title.toLowerCase()} or run the seed script to populate demo data.
          </p>
          <button className="mt-6 text-luxury-700 font-semibold hover:text-luxury-900 underline underline-offset-4">
            Learn how to import from CSV
          </button>
        </div>
      </div>
    </div>
  );
}
`;
};
