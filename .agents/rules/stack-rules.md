---
name: React and Node Best Practices
trigger: always_on
---

# Development Rules for notion_widget

- **Frontend (React)**: Use functional components, hooks, Vite for build. Keep components small and reusable. Use CSS modules or Tailwind.
- **Backend (Node.js)**: Use Express, async/await, and proper REST conventions. Do NOT hardcode secrets. Always use `dotenv` for configuration.
- **Quality**: Adhere to `ponytail` guidelines: favor minimal code, use native/standard library functions over external dependencies whenever possible. Don't overengineer.
