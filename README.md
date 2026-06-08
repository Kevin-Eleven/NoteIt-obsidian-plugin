# NoteIt for Obsidian

AI-powered note generation for Obsidian using Groq LLMs.

NoteIt provides a dedicated chat interface inside Obsidian where users can describe a topic, concept, project, or idea and automatically generate structured markdown notes. Generated notes are enriched with tags, related-note suggestions, YAML frontmatter, Obsidian links, callouts, Mermaid diagrams, tables, and LaTeX when appropriate. :contentReference[oaicite:0]{index=0}

---

## Features

### AI Note Generation

- Generate complete Obsidian notes from natural language prompts.
- Produces structured markdown output.
- Returns:
    - Note title
    - Tags
    - Related notes
    - Main note content :contentReference[oaicite:1]{index=1}

### Vault-Aware Context

The plugin automatically gathers context from the user's vault:

#### Tags

Tags are collected from:

- Files inside a configurable tag folder
- Native Obsidian tags found through metadata cache

#### Existing Notes

The plugin scans a configurable notes folder and provides note titles to the LLM as additional context. :contentReference[oaicite:2]{index=2}

### Chat-Based UI

The plugin exposes a dedicated chat panel with:

- Prompt input box
- Chat history
- Send button
- Clear chat button
- Copy previous prompts
- Enter to send
- Shift + Enter for new lines :contentReference[oaicite:3]{index=3}

### Automatic Note Creation

Generated notes are:

- Saved directly into the configured notes folder
- Given unique filenames automatically
- Linked to related notes
- Assigned generated tags
- Stored with YAML frontmatter metadata :contentReference[oaicite:4]{index=4}

### Configurable Context Injection

Users can choose whether the model receives:

- Available tags
- Existing note titles

This allows control over prompt size and contextual awareness. :contentReference[oaicite:5]{index=5}

---

# Architecture

## High-Level Flow

```text
User Prompt
      │
      ▼
Chat View
      │
      ▼
Vault Service
      │
      ▼
Note Generator Service
      │
      ▼
LLM Factory
      │
      ▼
Groq Provider
      │
      ▼
Groq API
      │
      ▼
Structured JSON Response
      │
      ▼
JSON Validation
      │
      ▼
Markdown Note Builder
      │
      ▼
Obsidian Vault
```

---

# Project Structure

```text
src/
│
├── llm/
│   ├── interfaces/
│   │   └── llm-provider.ts
│   │
│   ├── providers/
│   │   └── groq-provider.ts
│   │
│   └── llm-factory.ts
│
├── models/
│   ├── note-request.ts
│   └── note-response.ts
│
├── prompts/
│   ├── note-prompt-builder.ts
│   ├── callout-rules.ts
│   ├── mermaid-rules.ts
│   ├── latex-rules.ts
│   └── ...
│
├── services/
│   ├── note-generator.service.ts
│   └── vault.service.ts
│
├── settings/
│   ├── plugin-settings.ts
│   └── settings-tab.ts
│
├── ui/
│   └── chat-view.ts
│
├── utils/
│   ├── file-utils.ts
│   └── json-parser.ts
│
└── main.ts
```

---

# Core Components

## main.ts

Plugin entry point.

Responsibilities:

- Load settings
- Register custom view
- Register commands
- Register ribbon icon
- Initialize services
- Handle plugin lifecycle events :contentReference[oaicite:6]{index=6}

---

## ChatComposerView

Custom Obsidian view responsible for user interaction.

Features:

- Chat interface
- Prompt submission
- Prompt history
- Copy prompt button
- Clear chat
- Note generation requests
- Note creation notifications :contentReference[oaicite:7]{index=7}

---

## VaultService

Extracts vault context.

Returns:

```ts
interface VaultContext {
	tags: string[];
	otherFiles: string[];
}
```

Collects:

- Folder-based tags
- Native Obsidian tags
- Existing notes in configured notes folder :contentReference[oaicite:8]{index=8}

---

## NoteGeneratorService

Coordinates note generation.

Responsibilities:

- Build prompt context
- Call LLM provider
- Parse JSON output
- Validate schema
- Return structured note objects :contentReference[oaicite:9]{index=9}

---

## LLMFactory

Creates the active LLM provider.

Current implementation:

```text
Groq
```

Future providers can be added without changing application logic. :contentReference[oaicite:10]{index=10}

---

## GroqProvider

Concrete LLM implementation.

Uses:

```text
Groq OpenAI-Compatible API
```

Supports:

- Model selection
- Temperature control
- JSON-mode responses :contentReference[oaicite:11]{index=11}

---

## JSON Parser

Validates model responses.

Uses:

```text
zod
```

Expected schema:

```json
{
	"title": "",
	"tags": [],
	"related_notes": [],
	"content": ""
}
```

Invalid responses are rejected before file creation. :contentReference[oaicite:12]{index=12}

---

# Generated Note Format

Generated notes are stored as:

```md
---
created: 2026-01-01T00:00:00.000Z
tags:
    - ai
    - transformers
---

Related Notes

- [[Attention]]
- [[Deep Learning]]

# Title

Generated content...
```

Features:

- Creation timestamp
- YAML frontmatter
- Related note links
- Structured markdown content :contentReference[oaicite:13]{index=13}

---

# Settings

## Provider Settings

### Groq API Key

Required for note generation.

```text
gsk_xxxxxxxxx
```

### Model

Default:

```text
llama-3.3-70b-versatile
```

### Temperature

Default:

```text
0.2
```

Lower values produce more deterministic notes. :contentReference[oaicite:14]{index=14}

---

## Vault Settings

### Notes Folder

Default:

```text
2-notes
```

Location where generated notes are saved. :contentReference[oaicite:15]{index=15}

### Tag Folder

Default:

```text
1-tags
```

Folder used to discover available tags. :contentReference[oaicite:16]{index=16}

---

## Context Settings

### Include Tags

Default:

```text
true
```

Provides available tags to the model.

### Include Related Notes

Default:

```text
true
```

Provides note titles to the model. :contentReference[oaicite:17]{index=17}

---

# Commands

## Open NoteIt

Opens the NoteIt panel.

Accessible through:

- Command Palette
- Ribbon Icon :contentReference[oaicite:18]{index=18}

---

# User Workflow

1. Open NoteIt.
2. Enter a prompt.
3. Press Enter or click Send.
4. Plugin gathers vault context.
5. Context is sent to Groq.
6. LLM returns structured JSON.
7. Response is validated.
8. Markdown note is generated.
9. Note is saved to the vault.
10. User receives confirmation. :contentReference[oaicite:19]{index=19}

---

# Extending the Plugin

## Adding a New LLM Provider

Implement:

```ts
LLMProvider;
```

```ts
interface LLMProvider {
	generateJson(params: GenerateJsonParams): Promise<string>;
}
```

Register provider in:

```ts
LLMFactory;
```

No changes are required elsewhere in the application. :contentReference[oaicite:20]{index=20}

---

# Current Limitations

- Only Groq is supported.
- No conversation memory between sessions.
- No embedding search.
- No semantic note retrieval.
- No retry guardrails.
- API key stored in plugin settings.
- Context is limited to tags and note titles.
- Generated notes rely entirely on LLM output quality.

---

# Future Roadmap

- Embedding-based retrieval
- Semantic note search
- RAG-enhanced generation
- Multiple LLM providers
- Streaming responses
- Retry guardrails
- Conversation persistence
- Note editing workflows
- Citation support
- Context ranking
- Related note similarity scoring

---

# Development

## Install Dependencies

```bash
npm install
```

## Development Build

```bash
npm run dev
```

## Production Build

```bash
npm run build
```

## Load Plugin

Copy build artifacts into:

```text
<vault>/.obsidian/plugins/NoteIt/
```

Enable the plugin from:

```text
Settings → Community Plugins
```

---

# License

MIT
