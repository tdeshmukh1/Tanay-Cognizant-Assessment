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
cd server
npm install
cp .env.example .env
# add OPENAI_API_KEY in server/.env
npm run dev
