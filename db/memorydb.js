class DB {
    constructor() {
        this.files = [];
    }
    add = (file) => { if (file !== null) this.files.push(file); };
    remove = (index) => this.files = this.files.filter((file, fileIndex) => fileIndex != index);
    getFiles = () => this.files;
    getFile = (index) => this.files[index];
}

exports.DB = DB;