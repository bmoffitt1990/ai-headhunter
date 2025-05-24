import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import { ResumeData } from '@/features/resume/types/resume';
import { 
  ResumeTemplate, 
  TemplateCustomizations, 
  DEFAULT_CUSTOMIZATIONS 
} from '@/lib/templates/types';
import ResumePreview from './ResumePreview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  Download,
  Eye,
  FileText 
} from 'lucide-react';

interface PrintPreviewProps {
  resumeData: ResumeData;
  selectedTemplate: ResumeTemplate;
  customizations?: TemplateCustomizations;
  onClose?: () => void;
  className?: string;
}

/**
 * Print preview component with accurate representation
 * Provides print controls and zoom functionality
 */
const PrintPreview: React.FC<PrintPreviewProps> = ({
  resumeData,
  selectedTemplate,
  customizations = DEFAULT_CUSTOMIZATIONS,
  onClose,
  className,
}) => {
  const [zoom, setZoom] = React.useState(100);
  const [currentPage, setCurrentPage] = React.useState(1);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        // Create a new document for printing
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Resume - ${resumeData.personalInfo.fullName}</title>
              <link rel="stylesheet" href="/styles/resume-templates.css">
              <link rel="stylesheet" href="/styles/print.css">
              <style>
                @media print {
                  body { margin: 0; padding: 0; }
                  .resume-template { margin: 0; padding: 0; }
                }
              </style>
            </head>
            <body>
              ${printRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleDownloadPDF = () => {
    // This would integrate with the PDF export system from Task 1.5
    console.log('PDF download would be handled by Task 1.5 implementation');
  };

  return (
    <div className={cn('print-preview', 'fixed inset-0 z-50 bg-black/50', className)}>
      <div className="container mx-auto h-full flex flex-col">
        {/* Header Controls */}
        <Card className="m-4 mb-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText size={20} />
                Print Preview
              </CardTitle>
              <div className="flex items-center gap-2">
                {/* Zoom Controls */}
                <div className="flex items-center gap-1 border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomOut}
                    disabled={zoom <= 50}
                  >
                    <ZoomOut size={16} />
                  </Button>
                  <span className="px-2 text-sm font-medium min-w-[60px] text-center">
                    {zoom}%
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomIn}
                    disabled={zoom >= 200}
                  >
                    <ZoomIn size={16} />
                  </Button>
                </div>

                {/* Page Navigation */}
                <div className="flex items-center gap-2 text-sm">
                  <span>Page</span>
                  <input
                    type="number"
                    value={currentPage}
                    onChange={(e) => setCurrentPage(parseInt(e.target.value) || 1)}
                    className="w-12 px-1 py-1 text-center border rounded"
                    min="1"
                    max="2"
                  />
                  <span>of 2</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadPDF}
                  >
                    <Download size={16} className="mr-1" />
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrint}
                  >
                    <Printer size={16} className="mr-1" />
                    Print
                  </Button>
                  {onClose && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onClose}
                    >
                      <Eye size={16} className="mr-1" />
                      Back to Edit
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Print Preview Content */}
        <div className="flex-1 mx-4 mb-4 overflow-auto bg-gray-100 rounded-lg">
          <div className="flex justify-center py-8">
            <div className="print-preview-pages">
              {/* Print Margin Guides */}
              <div className="relative">
                <div className="print-margin-guide absolute inset-0 border-2 border-dashed border-blue-300 pointer-events-none" />
                
                {/* Resume Content */}
                <div
                  ref={printRef}
                  className="resume-print-container bg-white shadow-lg"
                  style={{ 
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'top center',
                    width: '8.5in',
                    minHeight: '11in',
                    margin: '0.5in',
                  }}
                >
                  <ResumePreview
                    resumeData={resumeData}
                    selectedTemplate={selectedTemplate}
                    customizations={customizations}
                    viewMode="print"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Print Guidelines */}
        <Card className="mx-4 mb-4">
          <CardContent className="pt-4">
            <div className="text-sm text-gray-600 flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-dashed border-blue-300 rounded" />
                <span>Print margins (0.5&quot;)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white border border-gray-300 rounded" />
                <span>Printable area</span>
              </div>
              <div className="text-gray-500">
                Recommended: Use &quot;Actual Size&quot; when printing
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrintPreview; 