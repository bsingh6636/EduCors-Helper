# EduCors web interface

React + Vite with a shared plain-CSS theme. See [the project guide](../READme.md) for setup and hosting.

- npm run dev: http://127.0.0.1:5173
- npm run build: production output in dist
- npm run preview: http://127.0.0.1:4174

The development and preview servers forward /api to http://127.0.0.1:9090. Configure VITE_API_URL when hosting the API separately.

Copyable examples on the homepage, in the playground, in the documentation, and on the dashboard use the public proxy at **https://cors-proxy.brijeshhq.com/api/getData**, including during local development. This address is defined in `src/lib/api.js`.
