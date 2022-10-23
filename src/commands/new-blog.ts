import MyPlugin from "main";
import { NewBlogModal } from "src/modals/new-blog-modal";

export function newBlog(plugin: MyPlugin) {
    plugin.metaweblog.getCategories(plugin.settings.blogId, plugin.settings.username, plugin.settings.password)
            .then((categoryInfos: any) => {
                new NewBlogModal(plugin, categoryInfos).open();
            })
}