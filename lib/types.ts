export interface Material {
  id: string;
  name: string;
  type: 'standard' | 'technical';
  pricePerKg: number;
  density: number; // g/cm³
  color: string;
  properties: string[];
  wearFactor?: number; // Factor de desgaste para materiales abrasivos (CF, GF)
}

export interface PrintQuality {
  id: string;
  name: string;
  speedMultiplier: number; // 1 = normal, 0.5 = slower/better, 2 = faster/draft
  description: string;
}

export interface QuoteCalculation {
  // Inputs
  materialId: string;
  weight: number; // gramos TOTALES de la impresión (incluye tasa de fallo)
  printTime: number; // horas TOTALES de la impresión
  quantity: number; // número de piezas producidas en esa impresión
  qualityId: string;
  postProcessing: string[];
  hasLogo?: boolean;
  usageType?: 'decorative' | 'functional'; // Tipo de uso de la pieza

  // Costos calculados
  materialCost: number;
  electricityCost: number;
  machineCost: number;
  laborCost: number;
  postProcessingCost: number;
  logoCost?: number;
  failureRate: number;

  // Total
  subtotal: number;
  profitMargin: number;
  total: number;
}

export interface PostProcessingOption {
  id: string;
  name: string;
  costPerPiece: number;
  timeHours: number;
}
