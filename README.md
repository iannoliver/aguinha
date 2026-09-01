# Águinha 💧

Seu lembrete fofo de beber água, todos os dias. PWA (Progressive Web App) estática — sem build, sem dependências.

## Rodando localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Estrutura

- `index.html` — app completo (HTML + CSS + JS inline)
- `manifest.json` — manifesto da PWA
- `service-worker.js` — cache offline
- `icons/` — ícones do app

## Deploy

Por ser 100% estático, pode ser hospedado no GitHub Pages, Netlify, Vercel, etc.
Para GitHub Pages: Settings → Pages → Deploy from branch → `main` / root.

## Push real (app fechado)

O lembrete com o app fechado no iPhone depende do backend em `../aguinha-backend`
(deploy no Render). Depois de instalar o PWA na tela de início:
ajustes → **Servidor de notificações** → cole a URL do Render → **Ativar**.
