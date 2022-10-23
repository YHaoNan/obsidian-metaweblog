import { randomUUID } from "crypto";
import MyPlugin from "main";
import { Editor, MarkdownView, Notice } from "obsidian";

export function newClipboardMediaObject(plugin: MyPlugin, fileList: FileList, editor: Editor, view: MarkdownView) {
    for (let i=0; i<fileList.length; i++) {
        let file = fileList[i];
        file.arrayBuffer().then(
            buf => {
                if (file.type.startsWith('image')) {
                    return plugin.metaweblog.newMediaObject(plugin.settings.blogId, plugin.settings.username, plugin.settings.password, {
                        name: `${randomUUID()}-${file.name}`,
                        type: file.type,
                        bits: Buffer.from(buf)
                    })
                } else {
                    throw `Unknown mime type ${file.type}`;
                }
            }
        ).then(res => {
            console.log(res);
            if (res.url) {
                editor.replaceSelection(`![image](${res.url})\n`);
            }
        }).catch(err => {
            new Notice(err);
        })
    }
}