import MyPlugin from "main";
import { Modal, Notice } from "obsidian";
const path = require('path');
const fs = require('fs');

export class NewBlogModal extends Modal {
    categories: any[] = []
    titleInput: any;
    categoryCheckBoxies: Array<any> = [];
    submitButton: any;
    cancelButton: any;
    plugin: MyPlugin;
    constructor(plugin: MyPlugin, categories: string[]) {
        super(plugin.app);
        this.categories = categories;
        this.plugin = plugin;
    }

    onOpen() {
        this.prepareUI();
    }

    prepareUI() {
        let { contentEl } = this;
        contentEl.createEl('h3').innerText = 'New Blog';
        contentEl.createEl('hr');
        contentEl.createEl('h5').innerText = 'Title';
        this.titleInput = contentEl.createEl('input')
        this.titleInput.type = 'text';
        contentEl.createEl('h5').innerText = 'Choose Cateories';
        let categoryGroup = contentEl.createDiv();
        for (let category of this.categories) {
            let label = categoryGroup.createEl('label');
            label.style.margin = '5px';
            let chkbox = label.createEl('input');
            chkbox.setAttribute('categoryid', category.categoryid);
            chkbox.setAttribute('categoryname', category.title);
            chkbox.type = 'checkbox';
            label.createEl('span').innerText = category.title;
            this.categoryCheckBoxies.push(chkbox);
        }

        this.submitButton = contentEl.createEl('button');
        this.submitButton.innerText = 'Create';
        this.submitButton.onclick = () => this.createNewBlog();
    }

    createNewBlog() {
        console.log('create new blog');
        let title = this.titleInput.value;
        let categories = this.categoryCheckBoxies
                            .filter(chkbox => chkbox.checked)
                            .map(chkbox => chkbox.getAttribute('categoryname'));

        if (title.trim() === '') { new Notice('Title can not be empty'); return; }
        this.plugin.metaweblog.newPost(this.plugin.settings.blogId, this.plugin.settings.username, this.plugin.settings.password, {
            dateCreated: new Date(),
            description: '',
            title, categories
        }, false).then((postid: any) => {

            let dirsToCreateBlogFile: Array<string> = [];
            for (let category of categories) {
                let categoryFSPath = path.resolve(this.plugin.settings.vaultAbsolutePath, category);
                let dirExists = fs.existsSync(categoryFSPath);
                if (!dirExists) {
                    console.log(`Make category dir ${categoryFSPath}`);
                    fs.mkdirSync(categoryFSPath);
                }

                dirsToCreateBlogFile.push(categoryFSPath);
            }

            let blogFileName = `${title}-${postid}.md`
            for (let dir of dirsToCreateBlogFile) {
                let filePath = path.resolve(dir, blogFileName);
                let fd = fs.openSync(filePath, 'w+');
                fs.writeSync(fd, '')
                fs.close(fd);
                console.log(`create blog file ${filePath}`);
            }

            new Notice(`Blog is created!`);
            
        }).catch((err: any) => {
            new Notice(`Error to create new blog: ${err}`);
        })
    }

    onClose() {
        let { contentEl } = this;
        contentEl.empty();
    }
}