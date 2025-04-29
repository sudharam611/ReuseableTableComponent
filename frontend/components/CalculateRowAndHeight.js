export class CalculateRowAndHeight {
    constructor(updateRows, container, tbody, columns, bufferRows, rowPool) {
      this.columns = columns;
      this.container = container;
      this.updateRows = updateRows;
      this.tbody = tbody;
      this.bufferRows = bufferRows;
      this.rowPool = rowPool;
    }

    measureRowAndHeight() {
        const tempRow = document.createElement("tr");
        this.columns.forEach(() => {
          const td = document.createElement("td");
          td.textContent = "Dummy";
          tempRow.appendChild(td);
        });
    
        this.tbody.appendChild(tempRow);
        this.rowHeight = tempRow.getBoundingClientRect().height;
        this.tbody.removeChild(tempRow);
        const containerHeight = this.container.clientHeight;
        const visibleRows = Math.ceil(containerHeight / this.rowHeight);
        const buffer = 5;
        this.bufferRows = visibleRows + buffer;
        for (let i = 0; i < this.bufferRows; i++) {
          const tr = document.createElement("tr");
          this.columns.forEach(() => {
            const td = document.createElement("td");
            tr.appendChild(td);
          });
          this.tbody.appendChild(tr);
          this.rowPool.push(tr);
          
        }
        this.tbody.style.position = "relative";
        this.updateRows();
        return {rowPool: this.rowPool, rowHeight: this.rowHeight};
      }
}