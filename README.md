# NoteIt for Obsidian

AI-powered note generation for Obsidian using Groq LLMs. Describe a topic in the dedicated chat panel to automatically create structured, markdown notes enriched with YAML frontmatter, tags, links, callouts, and Mermaid diagrams.

---

## Features

* **AI Generation:** Creates complete markdown notes (title, content, tags, links) from natural language prompts.
* **Vault-Aware Context:** Optionally injects existing note titles and tags into the prompt for hyper-relevant connections.
* **Chat Interface:** Dedicated sidebar panel featuring prompt history, clear/copy actions, and standard shortcuts (`Enter` to send).
* **Automated Saving:** Generates unique filenames and writes directly to your configured vault directory.

---

## Architecture & Project Structure

```text
User Prompt ──> Chat View ──> Vault Service ──> Note Generator ──> LLM Factory ──> Groq API ──> Zod Validation ──> Markdown Builder ──> Obsidian Vault

```

```text
src/
├── llm/          # LLM Factory and Groq Provider implementations
├── models/       # Request and response definitions
├── prompts/      # System prompt templates (Mermaid, Callouts, LaTeX)
├── services/     # Vault parsing and note generation orchestration
├── settings/     # Plugin configuration tabs
├── ui/           # Chat UI panel view
└── main.ts       # Entry point and lifecycle management

```

---

## Technical Specifications

### Input Schema Validation (Zod)

```json
{
    "title": "Note Title",
    "tags": ["tag1", "tag2"],
    "related_notes": ["Note A", "Note B"],
    "content": "Markdown body content..."
}

```

### Generated File Format

```markdown
---
created: 2026-01-01T00:00:00.000Z
tags:
    - ai
---
Related Notes:
- [[Attention]]

# Title
Generated content...

```

---

## Configuration

* **Provider:** API Key (`gsk_...`), Model Selection (Default: `llama-3.3-70b-versatile`), and Temperature (Default: `0.2`).
* **Vault Paths:** Target folders for saving **Notes** (Default: `2-notes`) and indexing **Tags** (Default: `1-tags`).
* **Context:** Toggles to include/exclude existing tags and note titles from the LLM prompt.

---

## Development

### Setup & Build

```bash
npm install      # Install dependencies
npm run dev      # Watch mode for development
npm run build    # Production compilation

```

### Installation

Copy build artifacts (`main.js`, `manifest.json`, `styles.css`) to:

```text
<vault>/.obsidian/plugins/NoteIt/

```

Enable via **Settings → Community Plugins**.

---

## License

MIT
