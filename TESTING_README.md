# PDF Export Testing - Quick Start

## 🚀 Quick Testing (2 minutes)

### Option 1: Use the automated script
```bash
./test-pdf.sh
```

### Option 2: Manual testing
```bash
npm run dev
# Then open: http://localhost:3000/test-pdf
```

## 🎯 What to Test

1. **Basic Download** - Click "Download PDF" and verify file downloads
2. **Quality Presets** - Test different quality options (standard, high, print-ready)
3. **Customization** - Change settings and see how they affect the PDF
4. **Preview** - Open PDF preview modal and test zoom/sharing features
5. **Rate Limiting** - Try the "Test Rate Limiting" button (6th request should fail)
6. **Console Logs** - Open DevTools → Console for detailed debug info

## 📋 Key Features to Verify

- ✅ PDF generates and downloads successfully
- ✅ Progress bar shows during generation
- ✅ Different quality settings produce different file sizes
- ✅ Preview modal opens and displays PDF correctly
- ✅ Error handling shows user-friendly messages
- ✅ Rate limiting prevents abuse (5 requests/minute)
- ✅ Analytics tracking records download events

## 🐛 Troubleshooting

**"PDF generation failed"**
- Check browser console for errors
- Verify you're logged in (Supabase auth required)
- Try refreshing the page

**Download doesn't start**
- Check if popup blockers are enabled
- Try a different browser
- Verify network connection

**Poor PDF quality**
- Try higher DPI settings (300 for print)
- Check if fonts are loading properly
- Verify print styles are applied

## 📱 Mobile Testing

Use DevTools device simulator to test mobile interface:
1. F12 → Toggle device toolbar
2. Select iPhone/iPad/Android device
3. Test touch interactions and responsiveness

## 🔧 Advanced Testing

For detailed testing scenarios, see `PDF_TESTING_GUIDE.md` which includes:
- Component-level testing
- API endpoint testing
- Browser compatibility testing
- Performance testing
- Production readiness checklist

## 🎉 Ready for Production?

Once basic testing passes:
1. Test with real user data
2. Deploy to staging environment
3. Test with actual ATS systems
4. Set up proper error monitoring
5. Configure analytics in production 