# Cotizador Inteligente de Impresión 3D

Sistema profesional de cotización para impresión 3D con la impresora **Bambu Lab H2D**.

## Características

### Funcionalidades Principales

- **Selección de Materiales**
  - Materiales estándar: PLA, PETG, ABS, TPU
  - Materiales técnicos: Nylon, CF-PETG, CF-Nylon, GF-Nylon, PC, ASA
  - Precios y densidades específicos por material

- **Calculadora Inteligente**
  - Cálculo de peso desde volumen (cm³)
  - Estimación de tiempo según altura de capa
  - Ajuste automático según calidad de impresión
  - Ajuste por porcentaje de relleno

- **Configuración de Impresión**
  - 4 niveles de calidad: Borrador, Normal, Alta, Ultra
  - Control de porcentaje de relleno (5-100%)
  - Opción de soportes (+20% material)
  - Cantidades múltiples con descuentos automáticos

- **Costos Detallados**
  - Costo de material (ajustado por infill y soportes)
  - Costo de electricidad (basado en consumo real)
  - Amortización de máquina (costo por hora)
  - Mano de obra (preparación + supervisión)
  - Post-procesamiento opcional
  - Tasa de fallo incluida (3%)

- **Post-Procesamiento**
  - Lijado
  - Pintura
  - Alisado con vapor
  - Aplicación de primer
  - Ensamblaje

- **Descuentos Automáticos por Volumen**
  - 10+ piezas: 5% descuento
  - 25+ piezas: 10% descuento
  - 50+ piezas: 15% descuento
  - 100+ piezas: 20% descuento

- **Exportación a PDF**
  - Cotización profesional en formato PDF
  - Desglose completo de costos
  - Especificaciones técnicas
  - Lista para enviar a clientes

## Configuración de Costos

### Máquina
- **Modelo**: Bambu Lab H2D
- **Precio**: $66,876.32 MXN
- **Vida útil estimada**: 10,000 horas
- **Consumo eléctrico**: 0.35 kWh

### Costos Variables
- **Electricidad**: $1.50 MXN por kWh
- **Mano de obra**: $100 MXN por hora
- **Tasa de fallo**: 3%
- **Margen de ganancia predeterminado**: 35%

## Instalación

```bash
# Clonar el repositorio
git clone [url-del-repositorio]

# Instalar dependencias
cd cotizador-impresion-3d
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción
npm run build
npm start
```

## Uso

1. **Seleccionar Material**
   - Navega entre las pestañas "Estándar" y "Técnicos/Compuestos"
   - Haz clic en el material deseado

2. **Configurar Parámetros**
   - Opción A: Ingresa peso y tiempo manualmente
   - Opción B: Usa la calculadora de volumen
   - Ajusta calidad, relleno, cantidad, etc.

3. **Agregar Post-Procesamiento** (opcional)
   - Selecciona los procesos adicionales necesarios

4. **Revisar Cotización**
   - El panel derecho muestra el desglose completo
   - Ajusta el margen de ganancia si es necesario

5. **Exportar**
   - Haz clic en "Exportar Cotización" para generar el PDF

## Estructura del Proyecto

```
cotizador-impresion-3d/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Página principal
│   └── globals.css         # Estilos globales
├── components/
│   ├── ui/                 # Componentes shadcn/ui
│   └── QuoteCalculator.tsx # Componente principal
├── lib/
│   ├── types.ts           # Tipos TypeScript
│   ├── config.ts          # Configuración y datos
│   ├── calculator.ts      # Lógica de cálculos
│   ├── pdf-export.ts      # Exportación a PDF
│   └── utils.ts           # Utilidades
└── package.json
```

## Personalización

### Modificar Precios de Materiales

Edita `lib/config.ts`:

```typescript
{
  id: 'petg',
  name: 'PETG',
  type: 'standard',
  pricePerKg: 450, // <- Modificar aquí
  density: 1.27,
  color: '#10B981',
  properties: ['Resistente', 'Durable', 'Flexible'],
}
```

### Agregar Nuevos Materiales

En `lib/config.ts`, agrega un nuevo objeto al array `MATERIALS`:

```typescript
{
  id: 'nuevo-material',
  name: 'Nombre del Material',
  type: 'standard', // o 'technical'
  pricePerKg: 500,
  density: 1.25,
  color: '#FF0000',
  properties: ['Propiedad 1', 'Propiedad 2'],
}
```

### Modificar Costos Operacionales

En `lib/config.ts`:

```typescript
export const ELECTRICITY_COST_PER_KWH = 1.5; // Modificar costo eléctrico
export const CONFIG = {
  laborCostPerHour: 100,        // Costo de mano de obra
  failureRate: 0.03,            // Tasa de fallo
  supportsWastePercentage: 0.20, // Porcentaje de soportes
  defaultProfitMargin: 0.35,    // Margen predeterminado
};
```

### Modificar Descuentos por Volumen

En `lib/config.ts`:

```typescript
volumeDiscounts: [
  { minQuantity: 10, discount: 0.05 },  // 5%
  { minQuantity: 25, discount: 0.10 },  // 10%
  // Agregar más niveles aquí
]
```

## Tecnologías Utilizadas

- **Next.js 16** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **shadcn/ui** - Componentes UI
- **jsPDF** - Generación de PDFs
- **Lucide React** - Iconos

## Características Avanzadas Implementadas

1. **Calculadora de Volumen**: Convierte volumen en cm³ a peso estimado
2. **Ajuste de Tiempo**: Calcula tiempo según altura de capa y calidad
3. **Cálculo de Infill**: Ajusta material según porcentaje de relleno
4. **Sistema de Soportes**: Agrega automáticamente 20% de material extra
5. **Tasa de Fallo**: Incluye 3% de material adicional por fallos
6. **Amortización**: Calcula desgaste de máquina por hora de uso
7. **Electricidad**: Calcula consumo real según tiempo de impresión
8. **Mano de Obra**: Incluye tiempo de preparación y supervisión
9. **Descuentos Automáticos**: Aplica descuentos según cantidad
10. **Margen Ajustable**: Control manual del margen de ganancia

## Mejoras Futuras Recomendadas

- [ ] Integración con base de datos para historial de cotizaciones
- [ ] Sistema de usuarios y autenticación
- [ ] Calculadora automática desde archivos STL
- [ ] Integración con APIs de slicers (PrusaSlicer, Cura)
- [ ] Comparador de materiales lado a lado
- [ ] Gráficos de costos con Recharts
- [ ] Plantillas de cotización personalizables
- [ ] Sistema de notificaciones por email
- [ ] Modo oscuro
- [ ] Soporte multiidioma
- [ ] Calculadora de ROI (retorno de inversión)
- [ ] Integración con sistema de inventario

## Soporte

Para reportar bugs o sugerir mejoras, por favor abre un issue en el repositorio.

## Licencia

MIT License

---

Desarrollado con ❤️ para profesionales de impresión 3D
