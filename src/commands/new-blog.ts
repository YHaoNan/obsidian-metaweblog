import MyPlugin from "main";
import { Notice } from "obsidian";
import { NewBlogModal } from "src/modals/new-blog-modal";

export function newBlog(plugin: MyPlugin) {
    plugin.metaweblog.getCategories(plugin.settings.blogId, plugin.settings.username, plugin.settings.password)
            .then((categoryInfos: any) => {
                new NewBlogModal(plugin, categoryInfos).open();
            }).catch((err: any) => {
                new Notice(`Error: ${err}`);
            })
}