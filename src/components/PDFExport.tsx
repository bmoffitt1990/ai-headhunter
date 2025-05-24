'use client';

import React, { useRef, useState, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import { Download, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import PrintableResume from './PrintableResume';
import { ResumeData } from '@/features/resume/types/resume';
import { ResumeTemplate, TemplateCustomizations } from '@/lib/templates/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PDFExportProps {
  resumeData: ResumeData;
  template: ResumeTemplate;
  customizations: TemplateCustomizations;
  filename?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  onExportStart?: () => void;
  onExportComplete?: (success: boolean, filename?: string) => void;
  onError?: (error: string) => void;
}

type ExportMethod = 'browser-print' | 'html2pdf';
type ExportStatus = 'idle' | 'preparing' | 'generating' | 'success' | 'error';

export const PDFExport: React.FC<PDFExportProps> = ({
  resumeData,
  template,
  customizations,
  filename,
  className,
  variant = 'default',
  size = 'default',
  onExportStart,
  onExportComplete,
  onError,
}) => {
  const { toast } = useToast();
  const printableRef = useRef<HTMLDivElement>(null);
  const [exportStatus, setExportStatus] = useState<ExportStatus>('idle');
  const [exportMethod, setExportMethod] = useState<ExportMethod>('browser-print');

  // Generate filename
  const getFilename = useCallback(() => {
    if (filename) return filename;
    const name = resumeData.personalInfo.fullName || 'Resume';
    const cleanName = name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
    const date = new Date().toISOString().split('T')[0];
    return `${cleanName}_Resume_${date}.pdf`;
  }, [filename, resumeData.personalInfo.fullName]);

  // Browser print method using react-to-print
  const handleBrowserPrint = useReactToPrint({
    contentRef: printableRef,
    documentTitle: getFilename().replace('.pdf', ''),
    onBeforePrint: async () => {
      setExportStatus('preparing');
      onExportStart?.();
    },
    onAfterPrint: () => {
      setExportStatus('success');
      onExportComplete?.(true, getFilename());
      toast({
        title: 'PDF Export Initiated',
        description: 'Your browser\'s print dialog has opened. Choose "Save as PDF" to download.',
      });
    },
    pageStyle: `
      @media print {
        @page {
          margin: 0.5in;
          size: letter;
        }
        body {
          margin: 0;
          padding: 0;
        }
      }
    `,
  });

  // HTML2PDF method for direct PDF download
  const handleHtml2Pdf = useCallback(async () => {
    if (!printableRef.current) {
      toast({
        title: 'Export Failed',
        description: 'Resume content not found',
        variant: 'destructive',
      });
      return;
    }

    try {
      setExportStatus('preparing');
      onExportStart?.();

      setExportStatus('generating');

      // Dynamic import to avoid SSR issues
      const html2pdf = (await import('html2pdf.js')).default;

      const options = {
        margin: [0.5, 0.5, 0.5, 0.5], // inches
        filename: getFilename(),
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          allowTaint: false
        },
        jsPDF: { 
          unit: 'in', 
          format: 'letter', 
          orientation: 'portrait' 
        }
      };

      await html2pdf()
        .set(options)
        .from(printableRef.current)
        .save();

      setExportStatus('success');
      onExportComplete?.(true, getFilename());
      toast({
        title: 'PDF Downloaded Successfully',
        description: `${getFilename()} has been downloaded to your device.`,
      });

    } catch (error) {
      setExportStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'PDF generation failed';
      onError?.(errorMessage);
      toast({
        title: 'Export Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [getFilename, onExportStart, onExportComplete, onError, toast]);

  // Main export handler
  const handleExport = useCallback(() => {
    if (exportMethod === 'browser-print') {
      handleBrowserPrint();
    } else {
      handleHtml2Pdf();
    }
  }, [exportMethod, handleBrowserPrint, handleHtml2Pdf]);

  // Reset status
  const handleReset = useCallback(() => {
    setExportStatus('idle');
  }, []);

  const isLoading = exportStatus === 'preparing' || exportStatus === 'generating';
  const isDisabled = isLoading || !resumeData.personalInfo.fullName;

  // Button content based on status
  const getButtonContent = () => {
    switch (exportStatus) {
      case 'preparing':
        return (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Preparing...
          </>
        );
      case 'generating':
        return (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating PDF...
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
            Exported
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle className="w-4 h-4 mr-2 text-red-600" />
            Failed
          </>
        );
      default:
        return (
          <>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </>
        );
    }
  };

  // Button variant based on status
  const getButtonVariant = () => {
    if (exportStatus === 'success') return 'outline';
    if (exportStatus === 'error') return 'destructive';
    return variant;
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Hidden printable component */}
      <div className="hidden print:block">
        <PrintableResume
          ref={printableRef}
          resumeData={resumeData}
          template={template}
          customizations={customizations}
        />
      </div>

      {/* Visible printable component for preview/testing */}
      <div className="print:hidden">
        <PrintableResume
          ref={printableRef}
          resumeData={resumeData}
          template={template}
          customizations={customizations}
        />
      </div>

      {/* Export controls */}
      <div className="flex flex-col gap-3 mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex gap-2">
          <Button
            onClick={exportStatus === 'error' ? handleReset : handleExport}
            disabled={isDisabled}
            variant={getButtonVariant()}
            size={size}
            className="flex-1"
          >
            {getButtonContent()}
          </Button>

          {exportStatus === 'success' && (
            <Button
              onClick={handleReset}
              variant="outline"
              size={size}
              className="px-3"
            >
              <FileText className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Export method selection */}
        <div className="flex gap-2 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="exportMethod"
              value="browser-print"
              checked={exportMethod === 'browser-print'}
              onChange={(e) => setExportMethod(e.target.value as ExportMethod)}
              disabled={isLoading}
            />
            Browser Print (Recommended)
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="exportMethod"
              value="html2pdf"
              checked={exportMethod === 'html2pdf'}
              onChange={(e) => setExportMethod(e.target.value as ExportMethod)}
              disabled={isLoading}
            />
            Direct Download
          </label>
        </div>

        {/* Status info */}
        {exportStatus === 'success' && (
          <div className="text-xs text-green-600 bg-green-50 p-2 rounded border">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3" />
              <span>PDF export completed successfully</span>
            </div>
          </div>
        )}

        {exportStatus === 'error' && (
          <div className="text-xs text-red-600 bg-red-50 p-2 rounded border">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-3 h-3" />
              <span>Export failed. Please try again or use a different method.</span>
            </div>
          </div>
        )}

        {/* Method info */}
        <div className="text-xs text-gray-600">
          {exportMethod === 'browser-print' ? (
            <p><strong>Browser Print:</strong> Uses your browser&apos;s built-in print functionality. Choose &quot;Save as PDF&quot; in the print dialog.</p>
          ) : (
            <p><strong>Direct Download:</strong> Generates and downloads PDF directly to your device.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Quick export buttons for different methods
export const PDFQuickExport: React.FC<{
  resumeData: ResumeData;
  template: ResumeTemplate;
  customizations: TemplateCustomizations;
  className?: string;
}> = ({ resumeData, template, customizations, className }) => {
  return (
    <div className={cn('flex gap-2', className)}>
      <PDFExport
        resumeData={resumeData}
        template={template}
        customizations={customizations}
        variant="outline"
        size="sm"
        className="flex-1"
      />
    </div>
  );
};

export default PDFExport; 