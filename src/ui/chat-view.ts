import { ItemView, Notice, WorkspaceLeaf, setIcon } from "obsidian";

import ChatWriterPlugin from "../main";

import { VaultService } from "../services/vault.service";
import { NoteGeneratorService } from "../services/note-generator.service";

import {
	buildFileContent,
	buildFileName,
	createUniqueFile,
} from "../utils/file-utils";

export const VIEW_TYPE_CHAT = "chat-writer-view";

export class ChatComposerView extends ItemView {
	private historyEl!: HTMLDivElement;

	private inputEl!: HTMLTextAreaElement;

	private sending = false;

	constructor(
		leaf: WorkspaceLeaf,
		private readonly plugin: ChatWriterPlugin,
	) {
		super(leaf);
	}

	getViewType(): string {
		return VIEW_TYPE_CHAT;
	}

	getDisplayText(): string {
		return "NoteIt";
	}

	getIcon(): string {
		return "message-square";
	}

	async onOpen(): Promise<void> {
		const { contentEl } = this;

		contentEl.empty();
		contentEl.addClass("chat-composer-view");

		const shell = contentEl.createDiv({
			cls: "chat-composer-shell",
		});

		shell.createEl("h2", {
			text: "NoteIt",
		});

		this.historyEl = shell.createDiv({
			cls: "chat-history",
		});

		this.renderMessage(
			"system",
			"Ready. Enter a prompt to generate notes.",
		);

		const inputWrap = shell.createDiv({
			cls: "chat-input-wrap",
		});

		this.inputEl = inputWrap.createEl("textarea", {
			attr: {
				placeholder: "Ask me to generate notes...",
			},
		});

		this.inputEl.addEventListener("keydown", (event) => {
			if (event.key === "Enter" && !event.shiftKey) {
				event.preventDefault();
				void this.handleSend();
			}
		});

		const actions = inputWrap.createDiv({
			cls: "chat-actions",
		});

		const clearBtn = actions.createEl("button", {
			text: "Clear Chat",
		});

		clearBtn.addEventListener("click", () => {
			this.historyEl.empty();
			this.renderMessage("system", "Chat cleared.");
		});

		const sendBtn = actions.createEl("button", {
			text: "Send",
		});

		sendBtn.addEventListener("click", () => {
			void this.handleSend();
		});
	}

	private renderMessage(role: "user" | "system", text: string): void {
		const wrapper = this.historyEl.createDiv({
			cls: `chat-message chat-message-${role}`,
		});

		const body = wrapper.createDiv({
			cls: "chat-message-body",
		});

		body.setText(text);

		// Make text selectable
		body.style.userSelect = "text";
		body.style.webkitUserSelect = "text";

		if (role === "user") {
			const copyBtn = wrapper.createEl("button", {
				cls: "chat-copy-button",
			});

			copyBtn.setAttribute("aria-label", "Copy prompt");
			copyBtn.setAttribute("title", "Copy prompt");

			setIcon(copyBtn, "copy");

			copyBtn.addEventListener("click", async () => {
				await navigator.clipboard.writeText(text);
				new Notice("Prompt copied");
			});
		}

		this.historyEl.scrollTop = this.historyEl.scrollHeight;
	}

	private async handleSend(): Promise<void> {
		if (this.sending) {
			return;
		}

		const userMessage = this.inputEl.value.trim();

		if (!userMessage) {
			return;
		}

		if (!this.plugin.settings.groqApiKey) {
			new Notice("Configure Groq API key first.");
			return;
		}

		this.sending = true;

		this.inputEl.value = "";

		this.renderMessage("user", userMessage);

		this.renderMessage("system", "Generating note...");

		try {
			const vaultService = new VaultService(
				this.app,
				this.plugin.settings.notesFolder,
				this.plugin.settings.tagFolder,
			);

			const context = vaultService.getVaultContext();

			if (!this.plugin.noteGenerator) {
				this.plugin.initializeServices();

				if (!this.plugin.noteGenerator) {
					throw new Error("No provider");
				}
			}

			const note = await this.plugin.noteGenerator.generateNote({
				userMessage,
				tags: context.tags,
				otherFiles: context.otherFiles,
				includeTags: this.plugin.settings.includeTagsInPrompt,
				includeRelatedNotes:
					this.plugin.settings.includeRelatedNotesInPrompt,
			});

			const fileContent = buildFileContent(
				note.content,
				note.tags,
				note.relatedNotes,
			);

			const fileName = buildFileName(note.title);

			const savedFile = await createUniqueFile(
				this.app.vault,
				`${this.plugin.settings.notesFolder}/${fileName}`,
				fileContent,
			);

			this.renderMessage("system", `Saved to ${savedFile.path}`);

			new Notice(`Created ${savedFile.basename}`);
		} catch (error) {
			console.error(error);

			this.renderMessage("system", "Failed to generate note.");

			new Notice("Failed to generate note.");
		} finally {
			this.sending = false;
		}
	}
}
