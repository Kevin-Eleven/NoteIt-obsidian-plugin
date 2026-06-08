export interface ChatWriterSettings {
	provider: "groq";

	groqApiKey: string;

	model: string;

	temperature: number;
	notesFolder: string;

	tagFolder: string;

	includeTagsInPrompt: boolean;

	includeRelatedNotesInPrompt: boolean;
}

export const DEFAULT_SETTINGS: ChatWriterSettings = {
	provider: "groq",

	groqApiKey: "",

	model: "llama-3.3-70b-versatile",

	temperature: 0.2,
	notesFolder: "/",

	tagFolder: "/",

	includeTagsInPrompt: true,

	includeRelatedNotesInPrompt: true,
};
