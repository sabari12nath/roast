<img width="3188" height="1202" alt="frame (3)" src="https://github.com/user-attachments/assets/517ad8e9-ad22-457d-9538-a9e62d137cd7" />

# RoastBot 🎯


## Basic Details
### Team Name: LOOP


### Team Members
- Team Lead: Sabarinath 

### Project Description
RoastBot is a playful AI that serves short, witty, PG-13 roasts on demand. You type something, it claps back — never hateful, just spicy. Frontend in **Next.js**, backend in **FastAPI** (or a local **llama.cpp** runner), with safety rules to keep it fun.

### The Problem (that doesn't exist)
Friends not roasting you fast enough? Need instant humility between meetings? We’ve automated sarcasm so your self-esteem never gets a break.

### The Solution (that nobody asked for)
A one-click web app: enter bait → get roasted. Small, fast model + safety filters + vibe sliders (temperature/top-p) so you can tune your pain level.

## Technical Details
### Technologies/Components Used
For Software:
- **Languages:** TypeScript, Python
- **Frameworks:** Next.js (App Router), FastAPI
- **Libraries (frontend):** React, Tailwind CSS
- **Libraries (backend):** `llama-cpp-python` **or** `transformers` + a small chat model, `pydantic`, `uvicorn`
- **Tools:** Node.js, Python, curl/Postman

For Hardware:
- None required; CPU works. (GPU optional for faster roasts.)

### Implementation
For Software:
# Installation
```bash
# Frontend
cd frontend
npm install

# Backend (choose one model path)

# Option A: llama.cpp runtime (GGUF model)
cd ../backend
pip install fastapi uvicorn llama-cpp-python

# Option B: Transformers runtime
pip install fastapi uvicorn transformers accelerate torch sentencepiece


# Backend
cd backend
# ---- Option A: llama.cpp (put a GGUF model on disk) ----
# Example env:
#   MODEL_PATH=C:/models/qwen2.5-1.5b-instruct-q4_k_m.gguf
#   or any small instruct GGUF
set MODEL_PATH=C:/path/to/your-model.gguf     # Windows CMD example
# PowerShell: $env:MODEL_PATH="C:/path/to/your-model.gguf"
uvicorn api:app --reload --port 8001

# ---- Option B: Transformers (internet needed to pull the model once) ----
# Example env:
#   HF_MODEL=TinyLlama/TinyLlama-1.1B-Chat-v1.0  (or Phi-3-mini, Qwen2.5 1.5B Instruct, etc.)
set HF_MODEL=TinyLlama/TinyLlama-1.1B-Chat-v1.0
uvicorn api:app --reload --port 8001

# Frontend
cd ../frontend
echo "NEXT_PUBLIC_API_URL=http://127.0.0.1:8001" > .env.local
npm run dev

Project Documentation
For Software:

Screenshots (Add at least 3)
![Screenshot1](<img width="1414" height="781" alt="image" src="https://github.com/user-attachments/assets/6e14c0d6-1b12-4e21-a046-55a348fdbb12" />
)
Landing page with Roast input and Send button.

flowchart LR
  U[User] -->|types bait| FE[Next.js App (Roast UI)]
  subgraph Frontend
    FE --> S[Safety client checks (length, banned words)]
    FE -->|POST /api/roast (proxy)| PR[/Next.js API Route/]
  end

  PR -->|POST /roast| BE[(FastAPI Server)]
  subgraph Backend
    BE --> SR[System Prompt<br/>PG-13 rules, no hate]
    SR --> INF{Runtime}
    INF -->|llama.cpp| GGUF[GGUF Model (.gguf)]
    INF -->|transformers| HF[HF Model (TinyLlama/Phi/Qwen)]
    GGUF --> OUT[Text roast JSON]
    HF --> OUT[Text roast JSON]
  end
  OUT --> FE
  FE -->|render roast| U

Made with ❤️ at TinkerHub Useless Projects


