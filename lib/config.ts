import { Material, PrintQuality, PostProcessingOption } from './types';

// Configuración de la máquina
export const MACHINE = {
  name: 'Bambu Lab H2D',
  price: 66876.32,
  lifespan: 10000, // horas estimadas de vida útil
  powerConsumption: 0.35, // kWh
};

// Precio de electricidad en México (promedio)
export const ELECTRICITY_COST_PER_KWH = 1.5; // pesos

// Costo por hora de máquina (amortización)
export const MACHINE_COST_PER_HOUR = MACHINE.price / MACHINE.lifespan;

// Materiales disponibles - Precio es solo referencia, el usuario puede editarlo
export const MATERIALS: Material[] = [
  // Materiales Estándar
  {
    id: 'pla',
    name: 'PLA',
    type: 'standard',
    pricePerKg: 350,
    density: 1.24,
    color: '#3B82F6',
    properties: ['Fácil de imprimir', 'Biodegradable'],
  },
  {
    id: 'pla-plus',
    name: 'PLA+',
    type: 'standard',
    pricePerKg: 400,
    density: 1.24,
    color: '#2563EB',
    properties: ['Más resistente que PLA', 'Durable'],
  },
  {
    id: 'petg',
    name: 'PETG',
    type: 'standard',
    pricePerKg: 450,
    density: 1.27,
    color: '#10B981',
    properties: ['Resistente', 'Durable'],
  },
  {
    id: 'abs',
    name: 'ABS',
    type: 'standard',
    pricePerKg: 420,
    density: 1.04,
    color: '#F59E0B',
    properties: ['Resistente al calor', 'Post-procesable'],
  },
  {
    id: 'abs-gf',
    name: 'ABS con Fibra de Vidrio',
    type: 'technical',
    pricePerKg: 850,
    density: 1.15,
    color: '#EA580C',
    properties: ['Alta resistencia', 'Rigidez mejorada'],
    wearFactor: 2.5, // Desgasta 2.5x más el nozzle
  },
  {
    id: 'tpu',
    name: 'TPU',
    type: 'standard',
    pricePerKg: 550,
    density: 1.21,
    color: '#8B5CF6',
    properties: ['Flexible', 'Elástico'],
  },
  {
    id: 'tpu-95a',
    name: 'TPU 95A',
    type: 'standard',
    pricePerKg: 600,
    density: 1.22,
    color: '#7C3AED',
    properties: ['Semi-flexible', 'Mayor dureza'],
  },
  {
    id: 'pva',
    name: 'PVA (Soporte soluble)',
    type: 'standard',
    pricePerKg: 800,
    density: 1.23,
    color: '#F3F4F6',
    properties: ['Soluble en agua', 'Para soportes'],
  },
  {
    id: 'hips',
    name: 'HIPS',
    type: 'standard',
    pricePerKg: 450,
    density: 1.04,
    color: '#E5E7EB',
    properties: ['Soporte para ABS', 'Liviano'],
  },

  // Materiales Técnicos
  {
    id: 'nylon',
    name: 'Nylon (PA6/PA12)',
    type: 'technical',
    pricePerKg: 750,
    density: 1.14,
    color: '#EF4444',
    properties: ['Alta resistencia', 'Bajo fricción'],
  },
  {
    id: 'nylon-cf',
    name: 'Nylon con Fibra de Carbono',
    type: 'technical',
    pricePerKg: 1200,
    density: 1.18,
    color: '#111827',
    properties: ['Extremadamente resistente', 'Rigidez alta'],
    wearFactor: 3.0, // Desgasta 3x más el nozzle
  },
  {
    id: 'nylon-gf',
    name: 'Nylon con Fibra de Vidrio',
    type: 'technical',
    pricePerKg: 1100,
    density: 1.32,
    color: '#374151',
    properties: ['Resistente al calor', 'Dimensional estable'],
    wearFactor: 2.5, // Desgasta 2.5x más el nozzle
  },
  {
    id: 'petg-cf',
    name: 'PETG con Fibra de Carbono',
    type: 'technical',
    pricePerKg: 950,
    density: 1.30,
    color: '#1F2937',
    properties: ['Muy resistente', 'Rigidez mejorada'],
    wearFactor: 3.0, // Desgasta 3x más el nozzle
  },
  {
    id: 'pc',
    name: 'Policarbonato (PC)',
    type: 'technical',
    pricePerKg: 900,
    density: 1.20,
    color: '#6B7280',
    properties: ['Muy resistente al calor', 'Alta resistencia'],
  },
  {
    id: 'pc-cf',
    name: 'PC con Fibra de Carbono',
    type: 'technical',
    pricePerKg: 1300,
    density: 1.25,
    color: '#0F172A',
    properties: ['Ultra resistente', 'Alto rendimiento'],
    wearFactor: 3.5, // Desgasta 3.5x más el nozzle
  },
  {
    id: 'asa',
    name: 'ASA',
    type: 'technical',
    pricePerKg: 650,
    density: 1.07,
    color: '#DC2626',
    properties: ['Resistente UV', 'Para exteriores'],
  },
  {
    id: 'pp',
    name: 'Polipropileno (PP)',
    type: 'technical',
    pricePerKg: 700,
    density: 0.90,
    color: '#94A3B8',
    properties: ['Químicamente resistente', 'Flexible'],
  },
  {
    id: 'pps',
    name: 'PPS',
    type: 'technical',
    pricePerKg: 2000,
    density: 1.35,
    color: '#78350F',
    properties: ['Alta temperatura', 'Químicamente inerte'],
  },
  {
    id: 'pps-cf',
    name: 'PPS con Fibra de Carbono',
    type: 'technical',
    pricePerKg: 2500,
    density: 1.40,
    color: '#451A03',
    properties: ['Grado industrial', 'Máxima resistencia'],
    wearFactor: 4.0, // Desgasta 4x más el nozzle
  },
  {
    id: 'peek',
    name: 'PEEK',
    type: 'technical',
    pricePerKg: 3500,
    density: 1.31,
    color: '#92400E',
    properties: ['Grado médico', 'Alta temperatura'],
  },
  {
    id: 'pei-ultem',
    name: 'PEI (Ultem)',
    type: 'technical',
    pricePerKg: 2800,
    density: 1.27,
    color: '#B45309',
    properties: ['Aeroespacial', 'FST rated'],
  },
];

// Calidades de impresión
export const PRINT_QUALITIES: PrintQuality[] = [
  {
    id: 'standard',
    name: 'Standard',
    speedMultiplier: 0.8,
    description: 'Rápido y económico (0.28mm)',
  },
  {
    id: 'balanced',
    name: 'Balanced Quality',
    speedMultiplier: 1.0,
    description: 'Balance perfecto (0.20mm)',
  },
  {
    id: 'fine',
    name: 'Fine',
    speedMultiplier: 1.5,
    description: 'Alta calidad (0.12mm)',
  },
  {
    id: 'ultra-fine',
    name: 'Ultra Fine',
    speedMultiplier: 2.0,
    description: 'Máxima calidad (0.08mm)',
  },
];

// Opciones de post-procesamiento
export const POST_PROCESSING_OPTIONS: PostProcessingOption[] = [
  {
    id: 'sanding',
    name: 'Lijado',
    costPerPiece: 50,
    timeHours: 0.5,
  },
  {
    id: 'painting',
    name: 'Pintura',
    costPerPiece: 150,
    timeHours: 1.0,
  },
  {
    id: 'vapor-smoothing',
    name: 'Alisado con Vapor',
    costPerPiece: 80,
    timeHours: 0.3,
  },
  {
    id: 'primer',
    name: 'Aplicación de Primer',
    costPerPiece: 40,
    timeHours: 0.3,
  },
  {
    id: 'assembly',
    name: 'Ensamblaje',
    costPerPiece: 100,
    timeHours: 0.5,
  },
];

// Configuración de costos adicionales
export const CONFIG = {
  laborCostPerHour: 100, // pesos por hora de trabajo
  failureRate: 0.03, // 3% tasa de fallo
  supportsWastePercentage: 0.20, // 20% adicional si requiere soportes
  defaultProfitMargin: 0.35, // 35% margen de ganancia
  functionalMultiplier: 1.25, // 25% más de costo para piezas funcionales
  volumeDiscounts: [
    { minQuantity: 10, discount: 0.05 }, // 5% descuento
    { minQuantity: 25, discount: 0.10 }, // 10% descuento
    { minQuantity: 50, discount: 0.15 }, // 15% descuento
    { minQuantity: 100, discount: 0.20 }, // 20% descuento
  ],
};
