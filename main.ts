import { App, Plugin, PluginSettingTab, Setting } from "obsidian";
import { generateTree } from "generate-tree";
import { parseInput } from "parse-input";

interface MyPluginSettings {
	charset: "ascii" | "utf-8";
	fullPath: boolean;
	trailingDirSlash: boolean;
	rootDot: boolean;
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();
		this.registerMarkdownCodeBlockProcessor("tree", (source, el) => {
			const tree = generateTree(parseInput(source), {
				charset: "utf-8",
				fullPath: this.settings.fullPath,
				trailingDirSlash: this.settings.trailingDirSlash,
				rootDot: this.settings.rootDot,
			});
			el.createEl("pre").createEl("code", { text: tree });
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Charset")
			.setDesc(
				"Which set of characters to use when rendering directory lines"
			)
			.addDropdown((dropdown) =>
				dropdown
					.addOption("utf-8", "utf-8")
					.addOption("ascii", "ascii")
					.setValue(this.plugin.settings.charset)
					.onChange(async (value: string) => {
						this.plugin.settings.charset =
							value === "utf-8" ? "utf-8" : "ascii";
						await this.plugin.saveSettings();
					})
			);
		new Setting(containerEl)
			.setName("Full Path")
			.setDesc(
				"Whether or not to append trailing slashes to directories. Items that already include a trailing slash will not have another appended."
			)
			.addToggle((toggle) =>
				toggle
					.setDisabled(false)
					.setValue(this.plugin.settings.fullPath)
					.onChange(async (value) => {
						this.plugin.settings.fullPath = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(containerEl)
			.setName("Trailing Dir Slash")
			.setDesc("Whether or not to print the full path of the item")
			.addToggle((toggle) =>
				toggle
					.setDisabled(false)
					.setValue(this.plugin.settings.trailingDirSlash)
					.onChange(async (value) => {
						this.plugin.settings.trailingDirSlash = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(containerEl)
			.setName("Root Dot")
			.setDesc("Whether or not to render a dot as the root of the tree")
			.addToggle((toggle) =>
				toggle
					.setDisabled(false)
					.setValue(this.plugin.settings.rootDot)
					.onChange(async (value) => {
						this.plugin.settings.rootDot = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
