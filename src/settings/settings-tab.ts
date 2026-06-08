import { App, PluginSettingTab, Setting } from "obsidian";

import ChatWriterPlugin from "../main";

export class ChatWriterSettingTab extends PluginSettingTab {
	plugin: ChatWriterPlugin;

	constructor(app: App, plugin: ChatWriterPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", {
			text: "NoteIt Settings",
		});

		new Setting(containerEl)
			.setName("Groq API Key")
			.setDesc("API key used to generate notes through Groq.")
			.addText((text) =>
				text
					.setPlaceholder("gsk_...")
					.setValue(this.plugin.settings.groqApiKey)
					.onChange(async (value) => {
						this.plugin.settings.groqApiKey = value.trim();

						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Model")
			.setDesc("Groq model to use.")
			.addText((text) =>
				text
					.setValue(this.plugin.settings.model)
					.onChange(async (value) => {
						this.plugin.settings.model = value.trim();

						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Temperature")
			.setDesc("Lower values produce more deterministic notes.")
			.addSlider((slider) =>
				slider
					.setLimits(0, 1, 0.1)
					.setValue(this.plugin.settings.temperature)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.temperature = value;

						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Notes Folder")
			.setDesc("Folder where generated notes will be stored.")
			.addText((text) =>
				text
					.setValue(this.plugin.settings.notesFolder)
					.onChange(async (value) => {
						this.plugin.settings.notesFolder = value.trim();

						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Tag Folder")
			.setDesc("Folder whose files will be used as available tags.")
			.addText((text) =>
				text
					.setValue(this.plugin.settings.tagFolder)
					.onChange(async (value) => {
						this.plugin.settings.tagFolder = value.trim();

						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Include Tags")
			.setDesc("Provide available tags to the model.")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.includeTagsInPrompt)
					.onChange(async (value) => {
						this.plugin.settings.includeTagsInPrompt = value;

						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Include Related Notes")
			.setDesc("Provide note titles to the model.")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.includeRelatedNotesInPrompt)
					.onChange(async (value) => {
						this.plugin.settings.includeRelatedNotesInPrompt =
							value;

						await this.plugin.saveSettings();
					}),
			);
	}
}
