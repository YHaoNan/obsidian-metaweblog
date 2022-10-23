import { Notice, Plugin } from 'obsidian';
import { MetaweblogSettings, DEFAULT_SETTINGS } from 'src/settings/metaweblog-settings';
import MetaweblogSettingTab from 'src/settings/metaweblog-setting-tab';
import { fetchRemoteBlog } from 'src/commands/fetch-remote-blog';
import { fetchRemoteContent } from 'src/commands/fetch-remote-content';
import { commitToRemoteBlog } from 'src/commands/commit-remote-blog';
import { newClipboardMediaObject } from 'src/commands/new-clipboard-media-object';
import { newBlog } from 'src/commands/new-blog';
import { deleteBlog } from 'src/commands/delete-blog';

export default class MyPlugin extends Plugin {
	settings: MetaweblogSettings = DEFAULT_SETTINGS;
	metaweblog: any = '';
	async onload() {
		// 这个命令拉取最多10000个博客，并创建文件和目录（目录即分类），但并不填充任何文件内容
		this.createMetaweblog();
		this.addCommand({
			id: 'fetch-remote-blogs',
			name: 'Fetch Remote Blogs',
			callback: () => fetchRemoteBlog(this)
		});
		this.addCommand({
			id: 'new-post',
			name: 'New Post',
			callback: () => newBlog(this)
		});

		this.registerEvent(
			this.app.workspace.on('editor-paste', (evt, editor, view) => {
				if (evt.clipboardData) {
					if (evt.clipboardData.files.length !== 0) {
						console.log('files')
						newClipboardMediaObject(this, evt.clipboardData.files, editor, view);
						evt.preventDefault();
					} 				
				}
			}) 
		);
		this.registerEvent(
			this.app.workspace.on('file-menu', (menu, file, source, leaf) => {
				menu.addItem((item) => {
					item
						.setTitle("Delete this blog")
						.setIcon("trash")
						.onClick(async ()=> {
							deleteBlog(this, file)
						})
				})
			})
		)
		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, view) => {
				menu.addItem((item) => {
					item
						.setTitle("Fetch Remote Content")
						.setIcon("install")
						.onClick(async () => {
							fetchRemoteContent(this, editor, view)
						});
				});
				menu.addItem((item) => {
					item
						.setTitle("Commit To Remote")
						.setIcon("paper-plane")
						.onClick(async () => {
							commitToRemoteBlog(this, editor, view);
						});
				});
			})
		);

		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
		this.addSettingTab(new MetaweblogSettingTab(this.app, this));
	}
	createMetaweblog() {
		const MetaWeblog = require('metaweblog-api');
		this.metaweblog = new MetaWeblog(this.settings.url);
		// this.metaweblog.getUsersBlogs(this.settings.appkey, this.settings.username, this.settings.password)
		// 	.then((blogInfo: any) => {
		// 		if(!blogInfo || blogInfo.length === 0) {
		// 			new Notice('No blog information...Plugin is not working');
		// 		} else {
		// 			let blogName = blogInfo[0].blogName;
		// 			let blogUrl = blogInfo[0].url;
		// 			this.settings.blogId = blogInfo[0].blogid;
		// 			if (blogInfo.length > 1) {
		// 				new Notice('There are multiple blog in your username. We will select the first');
		// 			}
		// 			new Notice(`ObsidianMetaweblog\n\nBlogId: ${this.settings.blogId}\nBlogName: ${blogName}\nBlogURL: ${blogUrl}`);
		// 		}
		// 	}).catch((err: any) => {
		// 		new Notice('It seems your network can not connect to your blog service provider. You can only edit offline.');
		// 		new Notice(`${err}`);
		// 	})
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
