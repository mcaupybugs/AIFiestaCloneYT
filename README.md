# AI Fiesta 🎭

A multi-provider AI chat interface that allows you to interact with multiple AI services through a single, unified interface.

## Features ✨

- **Multiple AI Providers**: ChatGPT, Claude, Gemini, Perplexity, and DeepSeek
- **Real-time Chat**: Interactive chat interface with typing indicators
- **Provider Switching**: Seamlessly switch between AI providers
- **Conversation History**: Maintains context within conversations
- **Dark Theme**: Beautiful dark UI similar to modern chat applications
- **Collapsible Sidebar**: Responsive design with collapsible navigation
- **API Integration**: Real API calls to AI services (not simulated)

## Setup 🚀

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd AIFiestaCloneYT
pnpm install
```

### 2. Configure API Keys

Copy the environment template:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
# AI Provider API Keys
VITE_OPENAI_API_KEY=sk-your-openai-key-here
VITE_ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
VITE_GOOGLE_API_KEY=your-google-api-key-here
VITE_PERPLEXITY_API_KEY=pplx-your-perplexity-key-here
VITE_DEEPSEEK_API_KEY=sk-your-deepseek-key-here
```

### 3. Get API Keys

#### OpenAI (ChatGPT)

1. Go to [OpenAI API](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add to `VITE_OPENAI_API_KEY`

#### Anthropic (Claude)

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create a new API key
3. Add to `VITE_ANTHROPIC_API_KEY`

#### Google (Gemini)

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add to `VITE_GOOGLE_API_KEY`

#### Perplexity

1. Go to [Perplexity API](https://www.perplexity.ai/settings/api)
2. Create a new API key
3. Add to `VITE_PERPLEXITY_API_KEY`

#### DeepSeek

1. Go to [DeepSeek Platform](https://platform.deepseek.com/api_keys)
2. Create a new API key
3. Add to `VITE_DEEPSEEK_API_KEY`

### 4. Run the Application

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage 💬

1. **Select an AI Provider**: Click on the tabs at the top to switch between providers
2. **Start Chatting**: Type your message in the input area and press Enter
3. **View Responses**: AI responses will appear in the chat area
4. **New Conversation**: Click "New Chat" in the sidebar to start fresh
5. **Configuration Status**: Providers with ⚠️ need API keys configured

## Provider Status 🟢

The interface will show:

- ✅ **Configured providers**: Ready to use
- ⚠️ **Unconfigured providers**: Need API keys (will show error when used)

## File Structure 📁

```
src/
├── components/          # React components (if split)
├── services/           # AI service integrations
│   ├── aiService.ts    # Main service orchestrator
│   ├── openai.ts       # OpenAI API integration
│   ├── anthropic.ts    # Anthropic API integration
│   ├── google.ts       # Google API integration
│   ├── perplexity.ts   # Perplexity API integration
│   ├── deepseek.ts     # DeepSeek API integration
│   └── types.ts        # Service type definitions
├── App.tsx             # Main application component
├── App.css             # Application styles
└── main.tsx            # Application entry point
```

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with your API keys
5. Submit a pull request

## Security 🔒

- API keys are stored in environment variables
- `.env` file is gitignored to prevent accidental commits
- Use `.env.example` as a template

## License 📄

MIT License - feel free to use and modify as needed!

---

Built with ❤️ using "Brain" unlike owners of AIFiesta.
