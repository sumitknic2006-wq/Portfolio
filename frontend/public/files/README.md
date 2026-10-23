# Static Downloadable Files Directory

This directory stores downloadable static assets served directly by the web server (e.g., Vercel / Vite static server).

## Planned Contents
- `resume.pdf`: Verified curriculum vitae / resume for Sumit Kumar.
- Public documents and certificate references.

## Usage in Frontend
Files placed in `frontend/public/files/` are accessible via `/files/<filename>` in production and development.
Example: `<a href="/files/resume.pdf" download="Sumit_Kumar_Resume.pdf">Download Resume</a>`
