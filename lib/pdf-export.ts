import { jsPDF } from 'jspdf';
import { QuoteCalculation } from './types';
import { MATERIALS, PRINT_QUALITIES, POST_PROCESSING_OPTIONS, MACHINE } from './config';
import { QuoteInputs } from './calculator';

export function exportQuoteToPDF(quote: QuoteCalculation, inputs: QuoteInputs) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Colores corporativos de Prazis
  const primaryDark: [number, number, number] = [30, 58, 138]; // Azul oscuro
  const primaryLight: [number, number, number] = [6, 182, 212]; // Cyan
  const textDark: [number, number, number] = [30, 41, 59]; // Slate-800
  const textGray: [number, number, number] = [100, 116, 139]; // Slate-500
  const bgLight: [number, number, number] = [248, 250, 252]; // Slate-50

  let yPosition = 20;

  // ===== HEADER PROFESIONAL =====
  // Barra superior con gradiente (simulado con dos rectángulos)
  pdf.setFillColor(...primaryDark);
  pdf.rect(0, 0, pageWidth / 2, 50, 'F');
  pdf.setFillColor(...primaryLight);
  pdf.rect(pageWidth / 2, 0, pageWidth / 2, 50, 'F');

  // Logo PRAZIS PRINT (texto)
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PRAZIS PRINT', 20, 30);

  // Información de contacto (lado derecho)
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text('gibran@prazis.mx', pageWidth - 20, 25, { align: 'right' });
  pdf.text('www.prazis.com.mx', pageWidth - 20, 32, { align: 'right' });
  pdf.text(`Fecha: ${new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}`, pageWidth - 20, 39, { align: 'right' });

  yPosition = 60;

  // ===== TÍTULO DE COTIZACIÓN =====
  pdf.setTextColor(...primaryDark);
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.text('COTIZACIÓN', 20, yPosition);

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...textGray);
  pdf.text('Impresión 3D Profesional', 20, yPosition + 8);

  yPosition += 20;

  // ===== INFORMACIÓN DEL CLIENTE =====
  if (inputs.projectName || inputs.clientName || inputs.clientContact) {
    pdf.setFillColor(...bgLight);
    pdf.roundedRect(15, yPosition, pageWidth - 30, 30, 2, 2, 'F');

    pdf.setTextColor(...textDark);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');

    let clientYPos = yPosition + 8;

    if (inputs.projectName) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Proyecto:', 20, clientYPos);
      pdf.setFont('helvetica', 'normal');
      pdf.text(inputs.projectName, 50, clientYPos);
      clientYPos += 7;
    }

    if (inputs.clientName) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Cliente:', 20, clientYPos);
      pdf.setFont('helvetica', 'normal');
      pdf.text(inputs.clientName, 50, clientYPos);
      clientYPos += 7;
    }

    if (inputs.clientContact) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Contacto:', 20, clientYPos);
      pdf.setFont('helvetica', 'normal');
      pdf.text(inputs.clientContact, 50, clientYPos);
    }

    yPosition += 35;
  }

  // ===== ESPECIFICACIONES TÉCNICAS =====
  pdf.setTextColor(...primaryDark);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ESPECIFICACIONES TÉCNICAS', 20, yPosition);
  yPosition += 10;

  const material = MATERIALS.find((m) => m.id === quote.materialId);
  const quality = PRINT_QUALITIES.find((q) => q.id === quote.qualityId);

  pdf.setFontSize(10);
  pdf.setTextColor(...textDark);

  const specs = [
    ['Material:', material?.name || 'N/A'],
    ['Calidad:', quality?.name || 'N/A'],
    ['Tipo de Uso:', quote.usageType === 'functional' ? 'Funcional' : 'Decorativa'],
    ['Peso Total:', `${quote.weight.toFixed(1)}g`],
    ['Tiempo de Impresión:', `${quote.printTime.toFixed(1)} horas`],
    ['Piezas Producidas:', `${quote.quantity} piezas`],
  ];

  if (quote.hasLogo) {
    specs.push(['Logo/Personalización:', 'Incluido']);
  }

  specs.forEach(([label, value]) => {
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...textGray);
    pdf.text(label, 20, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...textDark);
    pdf.text(value, 75, yPosition);
    yPosition += 6;
  });

  // Post-procesamiento
  if (quote.postProcessing.length > 0) {
    yPosition += 3;
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...textGray);
    pdf.text('Post-Procesamiento:', 20, yPosition);
    yPosition += 6;

    quote.postProcessing.forEach((ppId) => {
      const pp = POST_PROCESSING_OPTIONS.find((p) => p.id === ppId);
      if (pp) {
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...textDark);
        pdf.text(`• ${pp.name}`, 25, yPosition);
        yPosition += 6;
      }
    });
  }

  yPosition += 8;

  // ===== DESGLOSE DE COSTOS =====
  pdf.setTextColor(...primaryDark);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DESGLOSE ECONÓMICO', 20, yPosition);
  yPosition += 10;

  // Tabla de costos con diseño limpio
  const costItems = [
    ['Material', quote.materialCost],
    ['Electricidad', quote.electricityCost],
    ['Uso de Máquina', quote.machineCost],
    ['Mano de Obra', quote.laborCost],
  ];

  if (quote.postProcessingCost > 0) {
    costItems.push(['Post-Procesamiento', quote.postProcessingCost]);
  }

  if (quote.logoCost && quote.logoCost > 0) {
    costItems.push(['Logo/Personalización', quote.logoCost]);
  }

  pdf.setFontSize(10);

  costItems.forEach(([label, value], index) => {
    // Alternar color de fondo
    if (index % 2 === 0) {
      pdf.setFillColor(250, 250, 250);
      pdf.rect(15, yPosition - 5, pageWidth - 30, 7, 'F');
    }

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...textDark);
    pdf.text(label as string, 20, yPosition);
    pdf.text(`$${(value as number).toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });
    yPosition += 7;
  });

  yPosition += 5;

  // ===== TOTAL =====
  pdf.setFillColor(...primaryDark);
  pdf.roundedRect(15, yPosition - 3, pageWidth - 30, 14, 2, 2, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TOTAL:', 20, yPosition + 6);
  pdf.text(`$${quote.total.toFixed(2)} MXN`, pageWidth - 20, yPosition + 6, { align: 'right' });

  if (quote.quantity > 1) {
    yPosition += 16;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...textGray);
    pdf.text(
      `Precio unitario: $${(quote.total / quote.quantity).toFixed(2)} MXN`,
      pageWidth - 20,
      yPosition,
      { align: 'right' }
    );
  }

  // ===== FOOTER PROFESIONAL =====
  yPosition = pageHeight - 45;

  // Línea separadora
  pdf.setDrawColor(...primaryLight);
  pdf.setLineWidth(0.5);
  pdf.line(20, yPosition, pageWidth - 20, yPosition);

  yPosition += 8;

  // Notas importantes
  pdf.setTextColor(...textDark);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CONDICIONES:', 20, yPosition);
  yPosition += 6;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(...textGray);

  const notes = [
    '• Validez de cotización: 15 días naturales',
    '• Incluye: Material, electricidad, depreciación de equipo y mano de obra especializada',
    `• Equipo utilizado: ${MACHINE.name}`,
    '• Los precios están expresados en pesos mexicanos (MXN)',
  ];

  notes.forEach((note) => {
    pdf.text(note, 20, yPosition);
    yPosition += 4;
  });

  // Información de contacto en footer
  yPosition = pageHeight - 10;
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...primaryDark);
  pdf.text('Prazis Print', pageWidth / 2, yPosition, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.text('gibran@prazis.mx | www.prazis.com.mx', pageWidth / 2, yPosition + 4, { align: 'center' });

  // Guardar PDF
  const projectName = inputs.projectName ? inputs.projectName.replace(/[^a-z0-9]/gi, '_') : 'Proyecto';
  const filename = `Cotizacion_Prazis_${projectName}_${new Date().getTime()}.pdf`;
  pdf.save(filename);
}
