export interface NoteRequest {
	userMessage: string;

	tags: string[];

	otherFiles: string[];

	includeTags: boolean;

	includeRelatedNotes: boolean;
}
