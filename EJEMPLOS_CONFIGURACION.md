# Ejemplos de Configuración

Este documento muestra cómo personalizar el cotizador para diferentes tipos de negocios.

## Escenario 1: Taller de Prototipos

**Perfil:** Enfocado en prototipos rápidos para diseñadores y empresas

### Configuración Recomendada (`lib/config.ts`)

```typescript
// Ajustar costos para volumen medio-alto
export const ELECTRICITY_COST_PER_KWH = 1.50; // Tarifa industrial
export const CONFIG = {
  laborCostPerHour: 80,           // Menor que profesional
  failureRate: 0.02,              // Baja tasa de fallo (experiencia)
  supportsWastePercentage: 0.15,  // Optimizado para menos soportes
  defaultProfitMargin: 0.25,      // Margen competitivo 25%

  volumeDiscounts: [
    { minQuantity: 5, discount: 0.05 },   // Descuentos desde 5 piezas
    { minQuantity: 15, discount: 0.10 },
    { minQuantity: 30, discount: 0.15 },
    { minQuantity: 50, discount: 0.20 },
  ],
};
```

### Materiales Principales
- PLA (mayoría de prototipos)
- PETG (prototipos funcionales)
- ABS (pruebas de resistencia térmica)

---

## Escenario 2: Servicio Premium

**Perfil:** Alta calidad, piezas funcionales y técnicas

### Configuración Recomendada

```typescript
export const ELECTRICITY_COST_PER_KWH = 2.00; // Incluye overhead
export const CONFIG = {
  laborCostPerHour: 150,          // Mano de obra especializada
  failureRate: 0.01,              // Muy baja (control de calidad estricto)
  supportsWastePercentage: 0.20,  // Soportes premium
  defaultProfitMargin: 0.45,      // Margen premium 45%

  volumeDiscounts: [
    { minQuantity: 20, discount: 0.05 },  // Descuentos solo grandes volúmenes
    { minQuantity: 50, discount: 0.10 },
    { minQuantity: 100, discount: 0.15 },
  ],
};
```

### Post-Procesamiento Premium

```typescript
export const POST_PROCESSING_OPTIONS: PostProcessingOption[] = [
  {
    id: 'sanding',
    name: 'Lijado Profesional',
    costPerPiece: 100,    // Mayor costo
    timeHours: 1.0,       // Más tiempo
  },
  {
    id: 'painting',
    name: 'Pintura Automotriz',
    costPerPiece: 300,
    timeHours: 2.0,
  },
  {
    id: 'vapor-smoothing',
    name: 'Alisado Químico',
    costPerPiece: 150,
    timeHours: 0.5,
  },
  {
    id: 'cnc-finishing',
    name: 'Acabado CNC',
    costPerPiece: 500,
    timeHours: 2.0,
  },
];
```

---

## Escenario 3: Producción en Serie

**Perfil:** Fabricación de grandes cantidades, precio competitivo

### Configuración Recomendada

```typescript
export const ELECTRICITY_COST_PER_KWH = 1.20; // Tarifa de alto consumo
export const CONFIG = {
  laborCostPerHour: 100,
  failureRate: 0.02,
  supportsWastePercentage: 0.15,
  defaultProfitMargin: 0.20,      // Margen bajo, volumen alto

  volumeDiscounts: [
    { minQuantity: 10, discount: 0.05 },
    { minQuantity: 50, discount: 0.15 },
    { minQuantity: 100, discount: 0.25 },
    { minQuantity: 500, discount: 0.35 },
    { minQuantity: 1000, discount: 0.45 }, // Descuentos agresivos
  ],
};
```

### Optimización de Slider de Cantidad

Para producción en serie, modifica `components/QuoteCalculator.tsx`:

```typescript
<Slider
  id="quantity"
  min={1}
  max={1000}  // Aumentar máximo
  step={10}   // Incrementos de 10
  value={[inputs.quantity]}
  onValueChange={([value]) => setInputs({ ...inputs, quantity: value })}
  className="w-full"
/>
```

---

## Escenario 4: Materiales Técnicos Especializados

**Perfil:** Solo materiales de alto rendimiento (CF, GF, Nylon)

### Configuración de Materiales

Modifica `lib/config.ts` para enfocarte solo en materiales técnicos:

```typescript
export const MATERIALS: Material[] = [
  // Eliminar materiales estándar o marcarlos como "bajo pedido"

  // Expandir materiales técnicos
  {
    id: 'cf-nylon-pa12',
    name: 'Nylon PA12 CF',
    type: 'technical',
    pricePerKg: 1500,
    density: 1.20,
    color: '#000000',
    properties: ['Aeroespacial', 'Ultra resistente', 'Certificado'],
  },
  {
    id: 'peek',
    name: 'PEEK',
    type: 'technical',
    pricePerKg: 3500,
    density: 1.31,
    color: '#8B4513',
    properties: ['Grado médico', '260°C', 'Biocompatible'],
  },
  {
    id: 'pei-ultem',
    name: 'PEI (Ultem)',
    type: 'technical',
    pricePerKg: 2800,
    density: 1.27,
    color: '#CD853F',
    properties: ['FST rated', 'Aeroespacial', 'Alta temperatura'],
  },
];
```

### Costos Ajustados

```typescript
export const CONFIG = {
  laborCostPerHour: 200,          // Especialización técnica
  failureRate: 0.05,              // Mayor riesgo con materiales caros
  supportsWastePercentage: 0.25,  // Materiales difíciles
  defaultProfitMargin: 0.50,      // Margen alto por especialización
};
```

---

## Escenario 5: Educación/Maker Space

**Perfil:** Precios accesibles para estudiantes y makers

### Configuración Recomendada

```typescript
export const MACHINE = {
  name: 'Bambu Lab H2D',
  price: 66876.32,
  lifespan: 15000, // Mayor vida útil esperada (uso más cuidadoso)
  powerConsumption: 0.35,
};

export const ELECTRICITY_COST_PER_KWH = 1.00; // Tarifa subsidiada
export const CONFIG = {
  laborCostPerHour: 50,           // Solo costos básicos
  failureRate: 0.05,              // Mayor tasa (usuarios menos experimentados)
  supportsWastePercentage: 0.25,  // Soporte completo
  defaultProfitMargin: 0.10,      // Mínimo margen, casi a costo

  volumeDiscounts: [
    { minQuantity: 3, discount: 0.05 },
    { minQuantity: 5, discount: 0.10 },
    { minQuantity: 10, discount: 0.15 },
  ],
};
```

---

## Configuraciones Específicas por Región

### México (Configuración Actual)
```typescript
export const ELECTRICITY_COST_PER_KWH = 1.50; // Promedio CFE
export const CONFIG = {
  laborCostPerHour: 100,          // Salario promedio técnico
  defaultProfitMargin: 0.35,
};
```

### Tarifa de Alto Consumo (DAC)
```typescript
export const ELECTRICITY_COST_PER_KWH = 3.50; // Tarifa DAC penalizada
```

### Tarifa Industrial
```typescript
export const ELECTRICITY_COST_PER_KWH = 1.20; // Tarifa industrial negociada
```

---

## Modificaciones Avanzadas

### Agregar Certificaciones

```typescript
export const CERTIFICATIONS = [
  {
    id: 'iso-9001',
    name: 'Certificación ISO 9001',
    costPerProject: 500,
    description: 'Control de calidad certificado',
  },
  {
    id: 'material-certificate',
    name: 'Certificado de Material',
    costPerPiece: 50,
    description: 'Certificado del fabricante del filamento',
  },
];
```

### Agregar Tiempos de Entrega

```typescript
export const DELIVERY_OPTIONS = [
  {
    id: 'standard',
    name: 'Entrega Estándar (5-7 días)',
    multiplier: 1.0,
  },
  {
    id: 'express',
    name: 'Entrega Express (2-3 días)',
    multiplier: 1.3,
  },
  {
    id: 'urgent',
    name: 'Entrega Urgente (24h)',
    multiplier: 1.8,
  },
];
```

### Calcular Múltiples Máquinas

```typescript
export const MACHINES = [
  {
    id: 'bambu-h2d',
    name: 'Bambu Lab H2D',
    price: 66876.32,
    lifespan: 10000,
    powerConsumption: 0.35,
    maxVolume: { x: 250, y: 250, z: 250 },
  },
  {
    id: 'bambu-x1c',
    name: 'Bambu Lab X1C',
    price: 25000,
    lifespan: 8000,
    powerConsumption: 0.30,
    maxVolume: { x: 256, y: 256, z: 256 },
  },
];
```

---

## Testing de Configuraciones

### Script de Prueba

Crea un archivo `test-config.ts`:

```typescript
import { calculateQuote } from './lib/calculator';

// Prueba 1: Prototipo básico
const test1 = calculateQuote({
  materialId: 'pla',
  weight: 30,
  printTime: 2,
  quantity: 1,
  infillPercentage: 20,
  needsSupports: false,
  qualityId: 'normal',
  postProcessing: [],
});

console.log('Prototipo PLA:', test1.total);

// Prueba 2: Pieza técnica
const test2 = calculateQuote({
  materialId: 'cf-nylon',
  weight: 150,
  printTime: 8,
  quantity: 10,
  infillPercentage: 60,
  needsSupports: true,
  qualityId: 'high',
  postProcessing: ['sanding', 'primer'],
});

console.log('Pieza Técnica (10x):', test2.total);
console.log('Por pieza:', test2.total / test2.quantity);
```

Ejecuta con:
```bash
npx tsx test-config.ts
```

---

## Checklist de Configuración

Antes de lanzar tu cotizador personalizado:

- [ ] Actualizar precios de materiales según tus proveedores
- [ ] Configurar tarifa eléctrica correcta
- [ ] Ajustar costo de mano de obra según tu región
- [ ] Definir margen de ganancia objetivo
- [ ] Configurar descuentos por volumen
- [ ] Personalizar opciones de post-procesamiento
- [ ] Probar con cotizaciones reales
- [ ] Comparar con tus cotizaciones manuales previas
- [ ] Ajustar según feedback de clientes
- [ ] Revisar trimestralmente y actualizar precios

---

¡Personaliza el cotizador según las necesidades específicas de tu negocio!
