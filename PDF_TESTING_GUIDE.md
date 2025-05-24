# PDF Export Testing Guide

This guide covers how to test the PDF export functionality that was implemented in Task 1.5.

## Prerequisites

1. **Development Server Running**
   ```bash
   npm run dev
   ```
   The app should be running on `http://localhost:3000`

2. **Authentication Setup**
   - Make sure Supabase is configured with proper environment variables
   - You'll need to be logged in to test PDF generation (due to authentication requirements)

3. **Browser Requirements**
   - Chrome/Chromium (recommended for Puppeteer backend)
   - Firefox, Safari, Edge (will use jsPDF fallback)

## Testing Scenarios

### 1. Component-Level Testing

#### A. Testing PDFDownload Component

Create a test page to isolate the PDF download component:

```tsx
// Create: src/app/test-pdf/page.tsx
'use client';

import { PDFDownload } from '@/components/PDFDownload';
import { defaultResumeData } from '@/features/resume/types/resume';
import { DEFAULT_CUSTOMIZATIONS } from '@/lib/templates/types';

// Sample template for testing
const sampleTemplate = {
  id: 'professional',
  name: 'Professional',
  description: 'Clean professional template',
  previewImage: '/templates/professional.png',
  category: 'professional' as const,
  colorThemes: [],
  fontOptions: [],
  supportedLayouts: ['single-column' as const],
  isATSFriendly: true,
  isPrintOptimized: true,
  version: '1.0'
};

export default function TestPDFPage() {
  const sampleResumeData = {
    ...defaultResumeData,
    personalInfo: {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      summary: 'Experienced software developer with expertise in React and Node.js'
    },
    experience: [{
      id: '1',
      company: 'Tech Corp',
      position: 'Senior Developer',
      location: 'San Francisco, CA',
      startDate: '2020-01',
      endDate: '2023-12',
      current: false,
      description: ['Built scalable web applications', 'Led team of 3 developers'],
      achievements: ['Increased performance by 40%', 'Reduced bugs by 60%']
    }]
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">PDF Export Testing</h1>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Basic Download Test</h2>
        <PDFDownload
          resumeData={sampleResumeData}
          template={sampleTemplate}
          customizations={DEFAULT_CUSTOMIZATIONS}
          onDownloadStart={() => console.log('Download started')}
          onDownloadComplete={(success, filename) => 
            console.log('Download completed:', success, filename)
          }
          onError={(error) => console.error('Download error:', error)}
        />
      </div>
    </div>
  );
}
```

**Access**: `http://localhost:3000/test-pdf`

#### B. Testing PDFCustomization Component

```tsx
// Add to the same test page
import { PDFCustomization } from '@/components/PDFCustomization';
import { DEFAULT_PDF_OPTIONS } from '@/lib/pdf/types';

// In the component:
const [pdfOptions, setPdfOptions] = useState(DEFAULT_PDF_OPTIONS);

// Add to JSX:
<div className="space-y-4">
  <h2 className="text-lg font-semibold">Customization Test</h2>
  <PDFCustomization
    options={pdfOptions}
    onChange={setPdfOptions}
  />
  <pre className="bg-gray-100 p-4 rounded text-sm">
    {JSON.stringify(pdfOptions, null, 2)}
  </pre>
</div>
```

#### C. Testing PDFPreview Component

```tsx
// Add to the same test page
import { PDFPreviewButton } from '@/components/PDFPreview';

// Add to JSX:
<div className="space-y-4">
  <h2 className="text-lg font-semibold">Preview Test</h2>
  <PDFPreviewButton
    resumeData={sampleResumeData}
    template={sampleTemplate}
    customizations={DEFAULT_CUSTOMIZATIONS}
    options={pdfOptions}
  />
</div>
```

### 2. API Endpoint Testing

#### A. Direct API Testing with curl

```bash
# Test API endpoint directly (requires authentication token)
curl -X POST http://localhost:3000/api/generate-pdf \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_TOKEN" \
  -d '{
    "resumeData": {
      "personalInfo": {
        "fullName": "Test User",
        "email": "test@example.com",
        "phone": "555-0123",
        "location": "Test City"
      },
      "experience": [],
      "education": [],
      "skills": [],
      "projects": []
    },
    "template": {
      "id": "test",
      "name": "Test Template"
    },
    "customizations": {
      "colorTheme": "professional",
      "fontFamily": "inter",
      "spacing": "normal",
      "layout": "single-column",
      "sectionOrder": ["personalInfo"],
      "showPhoto": false,
      "showIcons": true,
      "pageBreaks": "auto"
    },
    "options": {
      "format": "A4",
      "quality": "high"
    }
  }' \
  --output test-resume.pdf
```

#### B. Testing with Browser DevTools

1. Open DevTools → Network tab
2. Trigger PDF download through UI
3. Check the API request/response
4. Verify headers and response size

### 3. End-to-End User Flow Testing

#### A. Complete Resume Builder Flow

1. **Navigate to Resume Builder**: `http://localhost:3000`
2. **Login/Signup**: Use Supabase authentication
3. **Fill Resume Data**: Complete all sections
4. **Template Selection**: Choose a template
5. **Customize Template**: Adjust colors, fonts, layout
6. **Preview PDF**: Use the preview button
7. **Download PDF**: Test different quality options

#### B. Testing Different Quality Presets

```javascript
// Test each preset in browser console
const testPresets = [
  { name: 'Web Preview', options: { quality: 'standard', dpi: 96 } },
  { name: 'Standard Application', options: { quality: 'high', dpi: 150 } },
  { name: 'Print Ready', options: { quality: 'print-ready', dpi: 300 } }
];

testPresets.forEach(preset => {
  console.log(`Testing ${preset.name}:`, preset.options);
  // Trigger download with these options
});
```

### 4. Error Scenario Testing

#### A. Rate Limiting Test

```javascript
// Test rate limiting by making multiple rapid requests
for (let i = 0; i < 10; i++) {
  fetch('/api/generate-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testData)
  }).then(res => console.log(`Request ${i}:`, res.status));
}
```

#### B. Invalid Data Test

```javascript
// Test with invalid resume data
const invalidData = {
  resumeData: null,
  template: null,
  customizations: null
};

fetch('/api/generate-pdf', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(invalidData)
})
.then(res => res.json())
.then(data => console.log('Invalid data response:', data));
```

#### C. Authentication Error Test

```javascript
// Test without authentication
fetch('/api/generate-pdf', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(validData)
})
.then(res => console.log('Unauthenticated request:', res.status));
```

### 5. Performance Testing

#### A. Generation Time Measurement

```javascript
// Measure PDF generation time
const startTime = performance.now();

// Trigger PDF download
downloadPDF().then(() => {
  const endTime = performance.now();
  console.log(`PDF generation took ${endTime - startTime} milliseconds`);
});
```

#### B. File Size Analysis

```javascript
// Check generated PDF file sizes
const testOptions = [
  { quality: 'standard', dpi: 96 },
  { quality: 'high', dpi: 150 },
  { quality: 'print-ready', dpi: 300 }
];

testOptions.forEach(async (options) => {
  const response = await generatePDF(options);
  const blob = await response.blob();
  console.log(`${options.quality} (${options.dpi} DPI): ${blob.size} bytes`);
});
```

### 6. Browser Compatibility Testing

#### A. Backend Fallback Testing

1. **Test Puppeteer (Server-side)**:
   - Use Chrome/Chromium
   - Check DevTools → Network for successful API calls

2. **Test jsPDF Fallback (Client-side)**:
   - Disable server-side PDF generation (simulate server error)
   - Should automatically fall back to jsPDF

3. **Cross-Browser Testing**:
   - Chrome: Should use Puppeteer
   - Firefox: Should use jsPDF fallback
   - Safari: Should use jsPDF fallback
   - Edge: Should use Puppeteer (Chromium-based)

### 7. Mobile Testing

#### A. Responsive UI Testing

1. **Open DevTools**: F12 → Toggle device toolbar
2. **Test Mobile Sizes**: iPhone, iPad, Android
3. **Verify**:
   - Download button is touch-friendly
   - Progress indicators work
   - Error messages are readable
   - Customization panels are usable

#### B. Touch Interaction Testing

- Test tap targets on actual mobile devices
- Verify gesture support in preview modal
- Check file download on mobile browsers

### 8. Analytics Testing

#### A. Download Event Tracking

```javascript
// Check analytics in browser console
import { downloadAnalytics } from '@/lib/analytics/downloads';

// After some PDF downloads:
console.log('Analytics Stats:', downloadAnalytics.getStats());
console.log('Recent Events:', downloadAnalytics.getRecentEvents());
console.log('Performance Metrics:', downloadAnalytics.getPerformanceMetrics());
```

### 9. Production Testing Checklist

Before deploying to production, verify:

- [ ] PDF generation works with real user data
- [ ] File downloads work across all target browsers
- [ ] Rate limiting prevents abuse
- [ ] Error handling provides useful feedback
- [ ] Analytics tracking captures events
- [ ] Mobile experience is smooth
- [ ] Performance meets requirements (< 10s for standard quality)
- [ ] ATS compatibility verified with real ATS systems
- [ ] Security: No XSS vulnerabilities in HTML content

### 10. Debugging Tips

#### A. Common Issues and Solutions

1. **"PDF generation failed"**:
   - Check browser console for errors
   - Verify authentication token
   - Check server logs for Puppeteer errors

2. **Download doesn't start**:
   - Check Content-Disposition headers
   - Verify blob creation in DevTools
   - Test with different browsers

3. **Poor PDF quality**:
   - Check DPI settings
   - Verify font loading
   - Review CSS print styles

4. **Slow generation**:
   - Monitor generation time in analytics
   - Check network requests
   - Consider using lower quality for preview

#### B. Useful DevTools Commands

```javascript
// Monitor PDF generation in console
window.pdfDebug = true;

// Override PDF options for testing
window.testPDFOptions = {
  quality: 'print-ready',
  dpi: 300,
  format: 'A4'
};

// Force fallback to jsPDF
window.forcejsPDF = true;
```

## Quick Testing Script

Here's a quick script to test the basic functionality:

```bash
#!/bin/bash
echo "Testing PDF Export Functionality..."

# Start dev server
npm run dev &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Open test page
open http://localhost:3000/test-pdf

echo "Test page opened. Follow the testing scenarios above."
echo "Press Enter to stop the server..."
read

# Stop server
kill $SERVER_PID
```

This comprehensive testing guide should help you verify that all aspects of the PDF export system are working correctly! 