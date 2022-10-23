import MyPlugin from "main";
import { App, PluginSettingTab, Setting } from "obsidian";


export default class MetaweblogSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for metaweblog API.'});

		new Setting(containerEl)
			.setName('Appkey')
			.setDesc('Your metaweblog appkey')
			.addText(text => text
				.setPlaceholder('Enter your appkey')
				.setValue(this.plugin.settings.appkey)
				.onChange(async (value) => {
					this.plugin.settings.url = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('URL')
			.setDesc('Your metaweblog URL')
			.addText(text => text
				.setPlaceholder('Enter your URL')
				.setValue(this.plugin.settings.url)
				.onChange(async (value) => {
					this.plugin.settings.url = value;
					this.plugin.createMetaweblog();
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Username')
			.setDesc('Your metaweblog Username')
			.addText(text => text
				.setPlaceholder('Enter your username')
				.setValue(this.plugin.settings.username)
				.onChange(async (value) => {
					this.plugin.settings.username = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Password')
			.setDesc('Your metaweblog password')
			.addText(text => text
				.setPlaceholder('Enter your password')
				.setValue(this.plugin.settings.password)
				.onChange(async (value) => {
					this.plugin.settings.password = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Vault Absolute Path')
			.setDesc('Your vault absolute path')
			.addText(text => text
				.setPlaceholder('Your vault absolute path')
				.setValue(this.plugin.settings.vaultAbsolutePath)
				.onChange(async (value) => {
					this.plugin.settings.vaultAbsolutePath = value;
					await this.plugin.saveSettings();
				}));
		new Setting(containerEl)
			.setName('blogId')
			.setDesc('blogId')
			.addText(text => text
				.setPlaceholder('blogId')
				.setValue(this.plugin.settings.blogId)
				.onChange(async (value) => {
					this.plugin.settings.blogId = value;
					await this.plugin.saveSettings();
				}));
	}
}