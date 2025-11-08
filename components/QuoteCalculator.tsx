'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { calculateQuote, QuoteInputs, calculateWeightFromVolume, estimatePrintTime } from '@/lib/calculator';
import { QuoteCalculation } from '@/lib/types';
import { MATERIALS, PRINT_QUALITIES, POST_PROCESSING_OPTIONS, MACHINE, CONFIG } from '@/lib/config';
import { Printer, Zap, Clock, Package, DollarSign, TrendingUp, Download, Calculator } from 'lucide-react';

export default function QuoteCalculator() {
  const [inputs, setInputs] = useState<QuoteInputs>({
    materialId: 'petg',
    materialPricePerKg: undefined, // undefined usa el precio del material
    weight: 50,
    printTime: 2,
    quantity: 1,
    qualityId: 'balanced',
    postProcessing: [],
    hasLogo: false,
    usageType: 'decorative',
    profitMargin: 0.40, // Fijo en 40%
    projectName: '',
    clientName: '',
    clientContact: '',
  });

  const [quote, setQuote] = useState<QuoteCalculation | null>(null);
  const [volumeInput, setVolumeInput] = useState({ volume: 0, layerHeight: 0.2 });
  const [useVolumeCalculator, setUseVolumeCalculator] = useState(false);
  const [customPrice, setCustomPrice] = useState<string>(''); // para el input de precio personalizado

  useEffect(() => {
    try {
      const calculated = calculateQuote(inputs);
      setQuote(calculated);
    } catch (error) {
      console.error('Error calculating quote:', error);
    }
  }, [inputs]);

  useEffect(() => {
    if (useVolumeCalculator && volumeInput.volume > 0) {
      const estimatedWeight = calculateWeightFromVolume(
        volumeInput.volume,
        inputs.materialId
      );
      const estimatedTime = estimatePrintTime(volumeInput.volume, volumeInput.layerHeight, inputs.qualityId);

      setInputs((prev) => ({
        ...prev,
        weight: estimatedWeight,
        printTime: estimatedTime,
      }));
    }
  }, [volumeInput, inputs.materialId, inputs.qualityId, useVolumeCalculator]);

  // Actualizar precio personalizado cuando cambie el material
  useEffect(() => {
    const material = MATERIALS.find((m) => m.id === inputs.materialId);
    if (material) {
      // Actualizar el precio solo si no hay precio personalizado
      setCustomPrice(material.pricePerKg.toString());
      setInputs((prev) => ({
        ...prev,
        materialPricePerKg: material.pricePerKg,
      }));
    }
  }, [inputs.materialId]);

  const selectedMaterial = MATERIALS.find((m) => m.id === inputs.materialId);
  const selectedQuality = PRINT_QUALITIES.find((q) => q.id === inputs.qualityId);

  // Handler para cambio de precio personalizado
  const handlePriceChange = (value: string) => {
    setCustomPrice(value);
    const numValue = parseFloat(value);
    setInputs((prev) => ({
      ...prev,
      materialPricePerKg: isNaN(numValue) || numValue <= 0 ? undefined : numValue,
    }));
  };

  const handlePostProcessingToggle = (ppId: string) => {
    setInputs((prev) => ({
      ...prev,
      postProcessing: prev.postProcessing.includes(ppId)
        ? prev.postProcessing.filter((id) => id !== ppId)
        : [...prev.postProcessing, ppId],
    }));
  };

  const exportToPDF = async () => {
    if (quote) {
      const { exportQuoteToPDF } = await import('@/lib/pdf-export');
      exportQuoteToPDF(quote, inputs);
    }
  };

  const getVolumeDiscount = () => {
    const discount = CONFIG.volumeDiscounts
      .reverse()
      .find((d) => inputs.quantity >= d.minQuantity);
    return discount ? discount.discount * 100 : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-2 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Prazis Print
          </h1>
          <p className="text-slate-600 text-sm md:text-base px-4">
            Cotizador profesional de impresión 3D con {MACHINE.name}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Panel de Configuración */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Material Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Package className="h-4 w-4 md:h-5 md:w-5" />
                  Selección de Material
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">Elige el material adecuado para tu proyecto</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="standard" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 text-xs md:text-sm">
                    <TabsTrigger value="standard" className="text-xs md:text-sm">Estándar</TabsTrigger>
                    <TabsTrigger value="technical" className="text-xs md:text-sm">Técnicos</TabsTrigger>
                  </TabsList>
                  <TabsContent value="standard" className="space-y-3 md:space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                      {MATERIALS.filter((m) => m.type === 'standard').map((material) => (
                        <Card
                          key={material.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            inputs.materialId === material.id
                              ? 'ring-2 ring-blue-600 bg-blue-50'
                              : 'hover:bg-slate-50'
                          }`}
                          onClick={() => setInputs({ ...inputs, materialId: material.id })}
                        >
                          <CardContent className="p-3 md:p-4">
                            <div className="flex items-start gap-2 md:gap-3">
                              <div
                                className="w-3 h-3 md:w-4 md:h-4 rounded-full mt-1"
                                style={{ backgroundColor: material.color }}
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm md:text-base truncate">{material.name}</h3>
                                <p className="text-xs md:text-sm text-slate-600">${material.pricePerKg}/kg</p>
                                <div className="flex flex-wrap gap-1 mt-1 md:mt-2">
                                  {material.properties.slice(0, 2).map((prop) => (
                                    <Badge key={prop} variant="secondary" className="text-[10px] md:text-xs px-1 py-0">
                                      {prop}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="technical" className="space-y-3 md:space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                      {MATERIALS.filter((m) => m.type === 'technical').map((material) => (
                        <Card
                          key={material.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            inputs.materialId === material.id
                              ? 'ring-2 ring-blue-600 bg-blue-50'
                              : 'hover:bg-slate-50'
                          }`}
                          onClick={() => setInputs({ ...inputs, materialId: material.id })}
                        >
                          <CardContent className="p-3 md:p-4">
                            <div className="flex items-start gap-2 md:gap-3">
                              <div
                                className="w-3 h-3 md:w-4 md:h-4 rounded-full mt-1"
                                style={{ backgroundColor: material.color }}
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm md:text-base truncate">{material.name}</h3>
                                <p className="text-xs md:text-sm text-slate-600">${material.pricePerKg}/kg</p>
                                <div className="flex flex-wrap gap-1 mt-1 md:mt-2">
                                  {material.properties.slice(0, 2).map((prop) => (
                                    <Badge key={prop} variant="secondary" className="text-[10px] md:text-xs px-1 py-0">
                                      {prop}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Input de Precio Personalizado */}
                <div className="mt-3 md:mt-4 p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Label htmlFor="material-price" className="text-xs md:text-sm font-semibold text-blue-900">
                    Precio del Material ($/kg)
                  </Label>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-base md:text-lg font-bold text-blue-600">$</span>
                    <Input
                      id="material-price"
                      type="number"
                      value={customPrice}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      min="0"
                      step="10"
                      className="font-semibold text-sm md:text-base"
                      placeholder={selectedMaterial?.pricePerKg.toString()}
                    />
                    <span className="text-xs md:text-sm text-slate-600">/kg</span>
                  </div>
                  <p className="text-[10px] md:text-xs text-slate-600 mt-2">
                    Precio de referencia: ${selectedMaterial?.pricePerKg}/kg
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Configuración de Impresión */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Calculator className="h-4 w-4 md:h-5 md:w-5" />
                  Parámetros de Impresión
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-sm">Peso TOTAL (gramos)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={inputs.weight}
                      onChange={(e) => {
                        const newWeight = parseFloat(e.target.value) || 0;
                        setInputs({ ...inputs, weight: newWeight });
                      }}
                      min="0"
                      step="1"
                      className="text-sm md:text-base"
                    />
                    <p className="text-[10px] md:text-xs text-slate-500">Peso total de toda la impresión</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="print-time" className="text-sm">Tiempo TOTAL (horas)</Label>
                    <Input
                      id="print-time"
                      type="number"
                      value={inputs.printTime}
                      onChange={(e) => {
                        const newTime = parseFloat(e.target.value) || 0;
                        setInputs({ ...inputs, printTime: newTime });
                      }}
                      min="0"
                      step="0.1"
                      className="text-sm md:text-base"
                    />
                    <p className="text-[10px] md:text-xs text-slate-500">Tiempo total de la impresión</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quality">Calidad de Impresión</Label>
                  <Select value={inputs.qualityId} onValueChange={(value) => setInputs({ ...inputs, qualityId: value })}>
                    <SelectTrigger id="quality">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {PRINT_QUALITIES.map((quality) => (
                        <SelectItem key={quality.id} value={quality.id}>
                          {quality.name} - {quality.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Selector de tipo funcional/decorativa */}
                <div className="space-y-2">
                  <Label htmlFor="usage-type">Tipo de Uso</Label>
                  <Select
                    value={inputs.usageType}
                    onValueChange={(value: 'decorative' | 'functional') => setInputs({ ...inputs, usageType: value })}
                  >
                    <SelectTrigger id="usage-type">
                      <SelectValue placeholder="Seleccionar tipo de uso" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="decorative">Decorativa (precio estándar)</SelectItem>
                      <SelectItem value="functional">Funcional (+25% por mayor exigencia)</SelectItem>
                    </SelectContent>
                  </Select>
                  {inputs.usageType === 'functional' && (
                    <p className="text-xs text-amber-600 font-medium">
                      ⚠ Las piezas funcionales tienen un 25% de recargo por mayor precisión y calidad requerida
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="quantity">Número de Piezas Producidas</Label>
                    {getVolumeDiscount() > 0 && (
                      <Badge variant="default" className="bg-green-600">
                        {getVolumeDiscount()}% Descuento
                      </Badge>
                    )}
                  </div>
                  <Input
                    id="quantity"
                    type="number"
                    value={inputs.quantity}
                    onChange={(e) => {
                      const newQuantity = parseInt(e.target.value) || 1;
                      setInputs({ ...inputs, quantity: Math.max(1, newQuantity) });
                    }}
                    min="1"
                    max="1000"
                    step="1"
                    className="text-lg font-semibold"
                  />
                  <p className="text-xs text-slate-500">¿Cuántas piezas salieron en esta impresión?</p>
                </div>

                <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <input
                    type="checkbox"
                    id="hasLogo"
                    checked={inputs.hasLogo}
                    onChange={(e) => setInputs({ ...inputs, hasLogo: e.target.checked })}
                    className="rounded w-5 h-5 text-purple-600"
                  />
                  <Label htmlFor="hasLogo" className="cursor-pointer">
                    Incluye Logo/Personalización
                    {inputs.hasLogo && (
                      <span className="ml-2 text-sm text-purple-600 font-semibold">
                        ($200 total)
                      </span>
                    )}
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Información del Cliente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  Datos del Proyecto y Cliente
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">Para generar la cotización</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name" className="text-sm">Nombre del Proyecto</Label>
                  <Input
                    id="project-name"
                    type="text"
                    value={inputs.projectName || ''}
                    onChange={(e) => setInputs({ ...inputs, projectName: e.target.value })}
                    placeholder="Ej: Prototipo carcasa iPhone"
                    className="text-sm md:text-base"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-name" className="text-sm">Nombre del Cliente</Label>
                    <Input
                      id="client-name"
                      type="text"
                      value={inputs.clientName || ''}
                      onChange={(e) => setInputs({ ...inputs, clientName: e.target.value })}
                      placeholder="Ej: Juan Pérez"
                      className="text-sm md:text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-contact" className="text-sm">Teléfono o Email</Label>
                    <Input
                      id="client-contact"
                      type="text"
                      value={inputs.clientContact || ''}
                      onChange={(e) => setInputs({ ...inputs, clientContact: e.target.value })}
                      placeholder="Ej: 55-1234-5678 o cliente@mail.com"
                      className="text-sm md:text-base"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Post-Procesamiento */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Post-Procesamiento</CardTitle>
                <CardDescription className="text-xs md:text-sm">Servicios adicionales opcionales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {POST_PROCESSING_OPTIONS.map((pp) => (
                    <Card
                      key={pp.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        inputs.postProcessing.includes(pp.id)
                          ? 'ring-2 ring-blue-600 bg-blue-50'
                          : 'hover:bg-slate-50'
                      }`}
                      onClick={() => handlePostProcessingToggle(pp.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{pp.name}</h3>
                            <p className="text-sm text-slate-600">${pp.costPerPiece}/pieza</p>
                            <p className="text-xs text-slate-500 mt-1">~{pp.timeHours}h por pieza</p>
                          </div>
                          {inputs.postProcessing.includes(pp.id) && (
                            <Badge variant="default">Seleccionado</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panel de Resumen */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              <Card id="quote-summary">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Resumen de Cotización
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {quote && (
                    <>
                      {/* Información del Material */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: selectedMaterial?.color }}
                          />
                          <span className="font-semibold">{selectedMaterial?.name}</span>
                        </div>
                        <div className="text-sm text-slate-600">
                          <div className="flex justify-between">
                            <span>Calidad:</span>
                            <span className="font-medium">{selectedQuality?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tipo:</span>
                            <span className="font-medium">
                              {quote.usageType === 'functional' ? 'Funcional (+25%)' : 'Decorativa'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Piezas producidas:</span>
                            <span className="font-medium">{quote.quantity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Peso total:</span>
                            <span className="font-medium">{quote.weight.toFixed(1)}g</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tiempo total:</span>
                            <span className="font-medium">{quote.printTime.toFixed(1)}h</span>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Desglose de Costos */}
                      <div className="space-y-2 text-sm">
                        <h3 className="font-semibold text-base mb-3">Desglose de Costos</h3>

                        <div className="flex justify-between">
                          <span className="text-slate-600">Material:</span>
                          <span className="font-medium">${quote.materialCost.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-slate-600 flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            Electricidad:
                          </span>
                          <span className="font-medium">${quote.electricityCost.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-slate-600 flex items-center gap-1">
                            <Printer className="h-3 w-3" />
                            Uso de Máquina:
                          </span>
                          <span className="font-medium">${quote.machineCost.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-slate-600 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Mano de Obra:
                          </span>
                          <span className="font-medium">${quote.laborCost.toFixed(2)}</span>
                        </div>

                        {quote.postProcessingCost > 0 && (
                          <div className="flex justify-between">
                            <span className="text-slate-600">Post-Proceso:</span>
                            <span className="font-medium">${quote.postProcessingCost.toFixed(2)}</span>
                          </div>
                        )}

                        {quote.logoCost && quote.logoCost > 0 && (
                          <div className="flex justify-between">
                            <span className="text-slate-600 text-purple-600">Logo/Personalización:</span>
                            <span className="font-medium text-purple-600">${quote.logoCost.toFixed(2)}</span>
                          </div>
                        )}
                      </div>

                      <Separator className="border-2" />

                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-slate-900">TOTAL:</span>
                          <span className="text-2xl font-bold text-green-700">
                            ${quote.total.toFixed(2)} MXN
                          </span>
                        </div>
                        <div className="text-sm text-slate-600 mt-2 text-right">
                          {inputs.quantity > 1 ? (
                            <span>${(quote.total / inputs.quantity).toFixed(2)} por pieza ({inputs.quantity} piezas)</span>
                          ) : (
                            <span>Precio por 1 pieza</span>
                          )}
                        </div>
                      </div>

                      {/* Información de la Máquina */}
                      <Separator />
                      <div className="text-xs text-slate-500 space-y-1">
                        <div className="font-semibold text-slate-700">Información de Equipo</div>
                        <div>Impresora: {MACHINE.name}</div>
                        <div>Valor: ${MACHINE.price.toLocaleString()} MXN</div>
                        <div>Consumo: {MACHINE.powerConsumption} kWh</div>
                      </div>

                      {/* Botones de Acción */}
                      <div className="space-y-2 pt-4">
                        <Button onClick={exportToPDF} className="w-full" variant="default">
                          <Download className="h-4 w-4 mr-2" />
                          Exportar Cotización
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Información adicional */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Información</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-slate-600 space-y-2">
                  <p>✓ Incluye tasa de fallo del 3%</p>
                  <p>✓ Costos de electricidad incluidos</p>
                  <p>✓ Amortización de equipo calculada</p>
                  <p>✓ Descuentos por volumen automáticos</p>
                  {getVolumeDiscount() > 0 && (
                    <p className="text-green-600 font-semibold">
                      ✓ Descuento del {getVolumeDiscount()}% aplicado!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
