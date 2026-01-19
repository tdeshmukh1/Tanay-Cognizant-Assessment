# AI Prompt App

Lightweight AI-integrated web app:
- Prompt input + submit
- Loading/error states
- Dynamic response display
- Prompt/response history (localStorage)
- Clear button

## Tech
- React + Vite (client)
- Node + Express (server proxy)
- OpenAI Responses API

## Setup

### Server
```bash
npm install
cp server/.env.example server/.env
# add OPENAI_API_KEY in server/.env
npm run dev
```

### Client (seperate terminal)
```bash
cd client
npm install
npm run dev
```
