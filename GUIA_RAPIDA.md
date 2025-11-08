# Guía Rápida - Cotizador Inteligente 3D

## Acceso Rápido

El servidor está corriendo en: **http://localhost:3002**

(Nota: El puerto puede variar si el 3000 está en uso. Verifica la consola al ejecutar `npm run dev`)

## Características Principales

### 1. Selección de Materiales

**Materiales Estándar (más económicos):**
- PLA - $350/kg - Ideal para prototipos y piezas decorativas
- PETG - $450/kg - Resistente y duradero
- ABS - $420/kg - Resistente al calor
- TPU - $550/kg - Flexible y elástico

**Materiales Técnicos (alta resistencia):**
- Nylon (PA) - $750/kg - Alta resistencia mecánica
- PETG con Fibra de Carbono - $950/kg - Muy resistente y rígido
- Nylon con Fibra de Carbono - $1,200/kg - Extremadamente resistente
- Nylon con Fibra de Vidrio - $1,100/kg - Resistente al calor
- Policarbonato (PC) - $900/kg - Resistente al calor, transparente
- ASA - $650/kg - Resistente a UV, para exteriores

### 2. Calculadora Inteligente

**Opción A: Entrada Manual**
- Ingresa el peso estimado en gramos
- Ingresa el tiempo de impresión en horas

**Opción B: Calculadora de Volumen (Recomendado)**
1. Activa "Usar calculadora de volumen"
2. Ingresa el volumen de tu pieza en cm³
3. Selecciona la altura de capa (0.08mm - 0.28mm)
4. El sistema calcula automáticamente peso y tiempo

### 3. Configuración de Impresión

**Calidad de Impresión:**
- **Borrador** - Rápido, calidad visual reducida (0.6x tiempo)
- **Normal** - Balance perfecto (1.0x tiempo)
- **Alta Calidad** - Detalles finos (1.6x tiempo)
- **Ultra (0.08mm)** - Máxima calidad para piezas detalladas (2.2x tiempo)

**Porcentaje de Relleno:**
- 5-15%: Piezas decorativas, baja resistencia
- 20-40%: Uso general, buena resistencia
- 50-70%: Alta resistencia
- 80-100%: Máxima resistencia (casi sólido)

**Soportes:**
- Actívalo si tu pieza tiene voladizos > 45°
- Agrega automáticamente 20% de material extra

**Cantidad:**
- 1-9 piezas: Precio normal
- 10-24 piezas: 5% descuento automático
- 25-49 piezas: 10% descuento automático
- 50-99 piezas: 15% descuento automático
- 100+ piezas: 20% descuento automático

### 4. Post-Procesamiento

**Opciones disponibles:**
- **Lijado** - $50/pieza - Suaviza superficies (~0.5h)
- **Pintura** - $150/pieza - Acabado profesional (~1h)
- **Alisado con Vapor** - $80/pieza - Superficie ultra-lisa (~0.3h)
- **Primer** - $40/pieza - Base para pintura (~0.3h)
- **Ensamblaje** - $100/pieza - Unión de partes (~0.5h)

### 5. Desglose de Costos

El cotizador calcula automáticamente:

1. **Costo de Material**
   - Precio base del material × peso
   - Ajustado por porcentaje de relleno
   - Incluye material para soportes (si aplica)
   - Incluye 3% extra por tasa de fallo

2. **Costo de Electricidad**
   - Tiempo de impresión × 0.35 kWh × $1.50/kWh

3. **Amortización de Máquina**
   - $66,876.32 ÷ 10,000 horas = $6.69/hora
   - Tiempo de impresión × $6.69

4. **Mano de Obra**
   - Preparación (slicing, configuración): 0.5h
   - Supervisión: 10% del tiempo de impresión
   - Total × $100/hora

5. **Post-Procesamiento**
   - Costos de los procesos seleccionados
   - Mano de obra adicional incluida

6. **Margen de Ganancia**
   - Configurable (predeterminado: 35%)
   - Se aplica sobre el subtotal

## Casos de Uso Comunes

### Caso 1: Prototipo Rápido PLA
```
Material: PLA
Peso: 30g
Tiempo: 1.5h
Calidad: Borrador
Relleno: 15%
Soportes: No
Cantidad: 1
```
**Resultado aproximado:** $200-250 MXN

### Caso 2: Pieza Funcional PETG
```
Material: PETG
Peso: 100g
Tiempo: 4h
Calidad: Normal
Relleno: 40%
Soportes: Sí
Cantidad: 5
Post-proceso: Lijado
```
**Resultado aproximado:** $1,800-2,200 MXN (con descuento)

### Caso 3: Pieza Técnica CF-Nylon
```
Material: CF-Nylon
Peso: 150g
Tiempo: 6h
Calidad: Alta
Relleno: 60%
Soportes: Sí
Cantidad: 10
Post-proceso: Lijado + Primer
```
**Resultado aproximado:** $7,500-9,000 MXN (con 5% descuento)

## Tips para Cotizaciones Precisas

### 1. Estimar Peso Correctamente
- Usa tu slicer (Cura, PrusaSlicer) para obtener peso exacto
- O usa la calculadora de volumen con dimensiones reales
- Considera el porcentaje de relleno

### 2. Estimar Tiempo
- Siempre usa el tiempo que te da tu slicer
- La calculadora de volumen es solo una estimación

### 3. Seleccionar Material Adecuado
- **PLA**: Prototipos, decoración, piezas no funcionales
- **PETG**: Piezas funcionales de uso general
- **ABS**: Piezas que requieren resistencia al calor
- **TPU**: Piezas flexibles, sellos, amortiguadores
- **Nylon**: Alta resistencia mecánica
- **CF/GF**: Aplicaciones industriales, máxima resistencia

### 4. Ajustar Margen de Ganancia
- Proyectos simples: 25-35%
- Proyectos complejos o urgentes: 40-50%
- Producción en serie: 20-30%
- Clientes recurrentes: 25-35%

### 5. Descuentos por Volumen
- Los descuentos se aplican automáticamente
- Considera ofrecer descuentos adicionales para órdenes muy grandes
- Usa el slider de margen para ajustar precio final

## Exportación a PDF

1. Configura todos los parámetros de tu cotización
2. Revisa el resumen en el panel derecho
3. Haz clic en "Exportar Cotización"
4. Se generará un PDF profesional con:
   - Encabezado corporativo
   - Especificaciones completas del proyecto
   - Desglose detallado de costos
   - Total y precio por pieza
   - Notas y validez de cotización

## Atajos y Funcionalidades Ocultas

- **Cálculo en Tiempo Real**: Todos los cambios se reflejan instantáneamente
- **Indicador de Descuento**: Aparece automáticamente cuando calificas
- **Validación Automática**: El sistema previene valores inválidos
- **Responsive**: Funciona en desktop, tablet y móvil
- **Impresión**: El PDF también se puede imprimir directamente

## Personalización para tu Negocio

### Cambiar Precios de Materiales
Edita `lib/config.ts` línea 19-90

### Modificar Costos Operacionales
Edita `lib/config.ts` línea 13-14 (electricidad)
Edita `lib/config.ts` línea 131-136 (otros costos)

### Agregar Nuevos Materiales
Agrega nuevas entradas en el array MATERIALS en `lib/config.ts`

### Modificar Post-Procesamiento
Edita o agrega opciones en `lib/config.ts` línea 117-149

## Soporte

Para dudas o problemas:
1. Revisa el README.md principal
2. Verifica la configuración en lib/config.ts
3. Consulta los ejemplos en esta guía

---

¡Cotiza con confianza! Este sistema calcula todos los costos reales de tu negocio.
