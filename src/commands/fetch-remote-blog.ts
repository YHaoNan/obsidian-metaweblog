import MyPlugin from "main";
import { Notice } from "obsidian";
const MetaWeblog = require('metaweblog-api');
const path = require('path');
const fs = require('fs');

export function fetchRemoteBlog(plugin: MyPlugin) {
    const metaWeblog = new MetaWeblog(plugin.settings.url);

    new Notice('Fetching your blogs, this may take some time...', 10000)
    /**
     * 1. 对于每个分类 创建其文件夹（若文件夹不存在）
     * 2. 对于每个博文 在其对应的文件夹中放置一份
     * 3. 对于未分类博文 在vault顶层中放置一份
     */
    console.log(`Sending fetch request...`);
    metaWeblog.getRecentPosts(plugin.settings.blogId, plugin.settings.username, plugin.settings.password, 10000)
                        .then((blogInfos: any) => {
                            new Notice('Fetch successed, create files');
                            console.log('Recevie response...');

                            for (let blogInfo of blogInfos) {
                                try {
                                    let dirsToCreateBlogFile = [];
                                    if (!blogInfo.categories || blogInfo.categories.length === 0) {
                                        console.log(`No category blog!`);
                                        dirsToCreateBlogFile.push(plugin.settings.vaultAbsolutePath);
                                    }
                                
                                    if (blogInfo.categories) {
                                        for (let category of blogInfo.categories) {
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

                                    let blogFileName = `${blogInfo.title}-${blogInfo.postid}.md`
                                    for (let dir of dirsToCreateBlogFile) {
                                        let filePath = path.resolve(dir, blogFileName);
                                        let fd = fs.openSync(filePath, 'w+');
                                        fs.writeSync(fd, blogInfo.description)
                                        fs.close(fd);
                                        console.log(`create blog file ${filePath}`);
                                    }
                                } catch(e) {
                                    console.log(e);
                                    new Notice(`Error when create blog file ${blogInfo.title}, cause ${e}`);
                                }
                            }
                            new Notice('All done!')
                        })
                            
        
}