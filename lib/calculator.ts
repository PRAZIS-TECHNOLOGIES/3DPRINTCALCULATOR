import { QuoteCalculation } from './types';
import {
  MATERIALS,
  PRINT_QUALITIES,
  POST_PROCESSING_OPTIONS,
  MACHINE_COST_PER_HOUR,
  ELECTRICITY_COST_PER_KWH,
  MACHINE,
  CONFIG,
} from './config';

export interface QuoteInputs {
  materialId: string;
  materialPricePerKg?: number; // precio personalizado por el usuario
  weight: number; // gramos TOTALES de la impresión completa (ya incluye soportes y relleno)
  printTime: number; // horas TOTALES de la impresión completa
  quantity: number; // número de piezas producidas en esa impresión
  qualityId: string;
  postProcessing: string[];
  hasLogo?: boolean; // si incluye logo/personalización
  usageType?: 'decorative' | 'functional'; // tipo de uso de la pieza
  profitMargin?: number; // opcional, usa default si no se especifica

  // Datos del proyecto y cliente
  projectName?: string; // nombre del proyecto/impresión
  clientName?: string; // nombre del cliente
  clientContact?: string; // teléfono o email del cliente
}

export function calculateQuote(inputs: QuoteInputs): QuoteCalculation {
  const material = MATERIALS.find((m) => m.id === inputs.materialId);
  const quality = PRINT_QUALITIES.find((q) => q.id === inputs.qualityId);

  if (!material || !quality) {
    throw new Error('Material o calidad no encontrados');
  }

  // Usar el tiempo exacto que ingresó el usuario (ya es el tiempo TOTAL de la impresión)
  const totalPrintTime = inputs.printTime;

  // 1. Costo de Material
  // El peso ya es el TOTAL de la impresión (incluye soportes y relleno)
  const materialWeight = inputs.weight;

  // Agregar material por tasa de fallo
  const totalMaterialWeight = materialWeight + (materialWeight * CONFIG.failureRate);

  // Usar precio personalizado si está disponible, sino el del material
  const materialPrice = inputs.materialPricePerKg ?? material.pricePerKg;

  const materialCost = (totalMaterialWeight / 1000) * materialPrice;

  // 2. Costo de Electricidad
  const electricityCost = totalPrintTime * MACHINE.powerConsumption * ELECTRICITY_COST_PER_KWH;

  // 3. Costo de Máquina (Amortización)
  // Aplicar factor de desgaste si el material tiene fibra (CF, GF)
  const wearFactor = material.wearFactor ?? 1.0;
  const machineCost = totalPrintTime * MACHINE_COST_PER_HOUR * wearFactor;

  // 4. Costo de Mano de Obra
  // Tiempo de preparación (slicing, configuración) + supervisión
  const preparationTime = 0.5; // 30 minutos por trabajo
  const supervisionTime = totalPrintTime * 0.1; // 10% del tiempo de impresión
  const laborCost = (preparationTime + supervisionTime) * CONFIG.laborCostPerHour;

  // 5. Costo de Post-Procesamiento
  let postProcessingCost = 0;
  let postProcessingTime = 0;

  inputs.postProcessing.forEach((ppId) => {
    const pp = POST_PROCESSING_OPTIONS.find((p) => p.id === ppId);
    if (pp) {
      postProcessingCost += pp.costPerPiece * inputs.quantity;
      postProcessingTime += pp.timeHours * inputs.quantity;
    }
  });

  // Agregar costo de mano de obra por post-procesamiento
  postProcessingCost += postProcessingTime * CONFIG.laborCostPerHour;

  // 6. Costo de Logo/Personalización (tarifa única)
  let logoCost = 0;
  if (inputs.hasLogo) {
    logoCost = 200; // Tarifa única de $200 por incluir logo/personalización
  }

  // 7. Costo por tasa de fallo
  const failureRate = materialCost * CONFIG.failureRate;

  // Subtotal base
  let subtotal =
    materialCost +
    electricityCost +
    machineCost +
    laborCost +
    postProcessingCost +
    logoCost;

  // 7. Aplicar multiplicador funcional si es pieza funcional
  const usageType = inputs.usageType ?? 'decorative';
  if (usageType === 'functional') {
    subtotal = subtotal * CONFIG.functionalMultiplier;
  }

  // 8. Aplicar descuentos por volumen
  let discount = 0;
  const applicableDiscount = CONFIG.volumeDiscounts
    .reverse()
    .find((d) => inputs.quantity >= d.minQuantity);

  if (applicableDiscount) {
    discount = subtotal * applicableDiscount.discount;
  }

  const subtotalWithDiscount = subtotal - discount;

  // 9. Margen de Ganancia
  const profitMarginPercent = inputs.profitMargin ?? CONFIG.defaultProfitMargin;
  const profitMargin = subtotalWithDiscount * profitMarginPercent;

  // Total
  const total = subtotalWithDiscount + profitMargin;

  return {
    materialId: inputs.materialId,
    weight: totalMaterialWeight,
    printTime: totalPrintTime,
    quantity: inputs.quantity,
    qualityId: inputs.qualityId,
    postProcessing: inputs.postProcessing,
    hasLogo: inputs.hasLogo,
    usageType: usageType,

    materialCost,
    electricityCost,
    machineCost,
    laborCost,
    postProcessingCost,
    logoCost,
    failureRate,

    subtotal: subtotalWithDiscount,
    profitMargin,
    total,
  };
}

// Función para calcular peso estimado desde volumen
export function calculateWeightFromVolume(
  volumeCm3: number,
  materialId: string
): number {
  const material = MATERIALS.find((m) => m.id === materialId);
  if (!material) return 0;

  // Asumimos un relleno estándar del 20%
  const infillFactor = 0.20;
  const effectiveDensity = material.density * (0.3 + infillFactor * 0.7);

  return volumeCm3 * effectiveDensity; // retorna en gramos
}

// Función para calcular tiempo estimado desde volumen y altura de capa
export function estimatePrintTime(
  volumeCm3: number,
  layerHeight: number,
  qualityId: string
): number {
  // Estimación simplificada: ~1 cm³ por minuto en calidad normal
  const quality = PRINT_QUALITIES.find((q) => q.id === qualityId);
  if (!quality) return 0;

  const baseTimeMinutes = volumeCm3 * 1.2; // 1.2 minutos por cm³
  const layerHeightFactor = 0.2 / layerHeight; // normalizado a 0.2mm

  return (baseTimeMinutes * layerHeightFactor) / 60; // convertir a horas
}
