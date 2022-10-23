import MyPlugin from "main";
const MetaWeblog = require('metaweblog-api');
import { Editor, MarkdownView, Notice } from "obsidian";

export function commitToRemoteBlog(plugin:MyPlugin, editor: Editor, view: MarkdownView) {
    let filename = view.file.basename;
    let postId = filename.substring(filename.lastIndexOf('-') + 1);
    console.log(postId);
    const metaWeblog = new MetaWeblog(plugin.settings.url);
    new Notice('Commit content...')

    metaWeblog.getPost(postId, plugin.settings.username, plugin.settings.password)
                .then((post: any) => {
                    post.description = view.data;
                    console.log(view.data);
                    return metaWeblog.editPost(postId, plugin.settings.username, plugin.settings.password, post, true);
                }).then((result: any) => {
                    if (result) {
                        new Notice('Done');
                    } else {
                        new Notice('Unknown Error')
                    }
                }).catch((err: any) => {
                    console.warn(err);
                    new Notice(`Error: ${err}`)
                })
    
}