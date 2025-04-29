export class TableStructure {
    constructor(container) {
        this.container = container;
        this.table = null;
        this.thead = null;
        this.tbody = null;
    }
    createTable() {
        this.table = document.createElement("table");
        this.table.classList.add("reusable-table");
        this.thead = document.createElement("thead");
        this.tbody = document.createElement("tbody");
        this.table.appendChild(this.thead);
        this.table.appendChild(this.tbody);
        //this.container.innerHTML = "";
        this.container.appendChild(this.table);

        return {table: this.table, thead: this.thead, tbody: this.tbody}
    }
}