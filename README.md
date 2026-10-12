# ASTER Monev 2026 — Vercel Wrapper

This static Bootstrap 5 page wraps the existing Google Apps Script web app in an iframe so the Vercel URL remains visible in the browser. The actual form and response storage still run on Google Apps Script.

## Deploy to Vercel
1. Upload these files (`index.html`, `vercel.json`, `README.md`) to a GitHub repository.
2. In Vercel, choose **Add New → Project**, import that repository, and deploy as a static site. No build command is needed; output directory is the project root.
3. Use the generated `*.vercel.app` URL, or add a custom domain under **Project → Settings → Domains**.

## Important: allow iframe embedding in Apps Script
Google Apps Script may block framing by default. In the Apps Script project's `Code.gs`, the `doGet()` response must explicitly permit framing, for example:

```javascript
function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Monev ASTER 2026')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
```

If the existing `doGet()` already prepares template data or has other logic, **do not replace it wholesale**; add `.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)` to its existing evaluated output. Save and deploy a new Apps Script version after the change.

`ALLOWALL` permits other sites to embed the app, so only use this if intended and reviewed under your organization's security policy. The Vercel wrapper is not an authentication layer. Keep Apps Script access controls and Spreadsheet permissions appropriate for sensitive operational data.

## Limitations
- This wrapper does not migrate the backend. The form still depends on the existing Apps Script deployment and its availability.
- If iframe embedding is blocked by Google or organization policy, users can open the direct Apps Script form via the fallback link. To keep the Vercel URL and eliminate iframe restrictions, the frontend/backend must be migrated to a hosting architecture that supports the form submission workflow.
