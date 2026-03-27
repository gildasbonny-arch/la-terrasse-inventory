export type StockMovement = {
  ingredientId: string;
  type: 'IN' | 'OUT' | 'ADJ';
  quantity: number; // Base unit
};

export type Ingredient = {
  id: string;
  name: string;
  baseUnit: string;
  minStock: number;
  maxStock: number;
  initialStock: number;
};

export type PhysicalCount = {
  ingredientId: string;
  physicalQuantity: number;
};

/**
 * Calculates Theoretical Stock
 * Formula: initial + in - out + adjustments
 */
export function calculateTheoreticalStock(
  ingredient: Ingredient,
  movements: StockMovement[]
): number {
  const stockMods = movements
    .filter(m => m.ingredientId === ingredient.id)
    .reduce((acc, curr) => {
      if (curr.type === 'IN') return acc + curr.quantity;
      if (curr.type === 'OUT') return acc - curr.quantity;
      if (curr.type === 'ADJ') return acc + curr.quantity;
      return acc;
    }, 0);

  return ingredient.initialStock + stockMods;
}

/**
 * Calculates Reorder Suggestion Details
 * Suggests reordering if theoretical stock < minimum stock.
 * Quantity to reorder = maxStock - theoreticalStock
 */
export function calculateReorderSuggestion(
  ingredient: Ingredient,
  theoreticalStock: number
): { shouldReorder: boolean; reorderQuantity: number } {
  if (theoreticalStock < ingredient.minStock) {
    const required = ingredient.maxStock - theoreticalStock;
    return { shouldReorder: true, reorderQuantity: required > 0 ? required : 0 };
  }
  return { shouldReorder: false, reorderQuantity: 0 };
}

/**
 * Calculates Variance between Physical and Theoretical Stock
 * Variance = Physical - Theoretical
 * Variance % = (Physical - Theoretical) / Theoretical * 100
 */
export function calculateVariance(
  theoreticalQuantity: number,
  physicalQuantity: number
): { varianceAmount: number; variancePercentage: number } {
  const varianceAmount = physicalQuantity - theoreticalQuantity;
  const variancePercentage = theoreticalQuantity === 0 
    ? (physicalQuantity > 0 ? 100 : 0) 
    : (varianceAmount / theoreticalQuantity) * 100;
  
  return { varianceAmount, variancePercentage };
}

/**
 * Parses and Converts units (Dummy example logic)
 * Allows conversion from Kg/L to base units g/ml
 */
export function convertToBaseUnit(
  quantity: number, 
  fromUnit: string, 
  toUnit: string
): number {
  if (fromUnit.toLowerCase() === toUnit.toLowerCase()) return quantity;
  
  // Example conversions
  if (fromUnit.toLowerCase() === 'kg' && toUnit.toLowerCase() === 'g') {
    return quantity * 1000;
  }
  if (fromUnit.toLowerCase() === 'l' && toUnit.toLowerCase() === 'ml') {
    return quantity * 1000;
  }
  
  // Add other logic here
  return quantity;
}
