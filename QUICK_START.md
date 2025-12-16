# Quick Start Guide

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. Enter a website URL (e.g., `example.com` or `https://example.com`)
2. Click "Run Audit"
3. Wait for the analysis to complete (progress bar will show status)
4. Review results in the dashboard:
   - **Summary Cards**: Overall, Performance, SEO, and Technical scores
   - **Performance Tab**: Detailed performance metrics
   - **SEO Tab**: SEO audit results
   - **Technical Tab**: Technical checks
   - **Actionable Fixes Tab**: Prioritized issues with solutions
5. Click "Download Report as PDF" to generate a branded PDF report

## Adding Your Logo

See `LOGO_INTEGRATION.md` for instructions on adding your company logo to PDF reports.

## Building for Production

```bash
npm run build
npm start
```

## Troubleshooting

### CORS Issues
If you encounter CORS errors when auditing external websites, you may need to:
- Run the audit from a server environment
- Use a proxy service
- Configure CORS headers on the target website

### PDF Generation Issues
- Ensure jsPDF is properly installed
- Check browser console for errors
- Verify logo file path if using custom logo

### Performance Issues
- Large websites may take longer to audit
- Consider implementing rate limiting for production use
- Use caching for repeated audits of the same URL

