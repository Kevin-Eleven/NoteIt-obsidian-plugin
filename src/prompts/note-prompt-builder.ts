import { SYSTEM_PROMPT } from "./system-prompt";
import { MARKDOWN_RULES } from "./markdown-rules";
import { LATEX_RULES } from "./latex-rules";
import { CALLOUT_RULES } from "./callout-rules";
import { MERMAID_RULES } from "./mermaid-rules";
import { NOTE_QUALITY_RULES } from "./note-quality-rules";
import { buildJsonOutputRules } from "./json-output-rules";
interface PromptOptions {
	includeTags: boolean;
	includeRelatedNotes: boolean;
}

export function buildSystemPrompt(options: PromptOptions): string {
	return [
		SYSTEM_PROMPT,
		buildJsonOutputRules({
			includeTags: options.includeTags,
			includeRelatedNotes: options.includeRelatedNotes,
		}),
		MARKDOWN_RULES,
		LATEX_RULES,
		CALLOUT_RULES,
		MERMAID_RULES,
		NOTE_QUALITY_RULES,
	].join("\n\n");
}
