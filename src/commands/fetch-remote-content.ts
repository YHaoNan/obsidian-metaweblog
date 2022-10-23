import MyPlugin from "main";
const MetaWeblog = require('metaweblog-api');
import { Editor, MarkdownView, Notice } from "obsidian";
const path = require('path');
const fs = require('fs');

export function fetchRemoteContent(plugin:MyPlugin, editor: Editor, view: MarkdownView) {
    let filename = view.file.basename;
    let postId = filename.substring(filename.lastIndexOf('-') + 1);
    console.log(postId);
    const metaWeblog = new MetaWeblog(plugin.settings.url);
    new Notice('Fetching content...')
    metaWeblog.getPost(postId, plugin.settings.username, plugin.settings.password)
                .then((post: any) => {
                    new Notice(`Categories：${post.categories}. All files under categoires above will update too...`);
                    let dirsToCreateBlogFile = [];
                    if (!post.categories || post.categories.length === 0) {
                        console.log(`No category blog!`);
                        dirsToCreateBlogFile.push(plugin.settings.vaultAbsolutePath);
                    }
                
                    if (post.categories) {
                        for (let category of post.categories) {
                            let categoryFSPath = path.resolve(plugin.settings.vaultAbsolutePath, category);
                            let dirExists = fs.existsSync(categoryFSPath);
                            if (!dirExists) {
                                console.log(`Make category dir ${categoryFSPath}`);
                                fs.mkdirSync(categoryFSPath);
                            }

                            dirsToCreateBlogFile.push(categoryFSPath);
                        }
                    }

                    console.log(dirsToCreateBlogFile);

                    let blogFileName = `${post.title}-${post.postid}.md`
                    for (let dir of dirsToCreateBlogFile) {
                        let filePath = path.resolve(dir, blogFileName);
                        let fd = fs.openSync(filePath, 'w+');
                        fs.writeSync(fd, post.description)
                        fs.close(fd);
                        console.log(`create blog file ${filePath}`);
                    }

                    new Notice('Done!');
                }).catch(
                    (err: any) => {
                        new Notice(`Error: ${err}`);
                    }
                )
}