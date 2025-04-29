export class RenderRows {
    constructor(filteredData, container, rowPool, columns ) {
        this.filteredData = filteredData;
        this.container = container;
        this.rowPool = rowPool;
        this.columns = columns
    }

    updateRows() {
      console.log('called')
        const scrollTop = this.container.scrollTop;
        const viewportHeight = this.container.clientHeight;
        const visibleRowCount = Math.ceil(viewportHeight / this.rowHeight) + 10;
        const start = Math.max(0, Math.floor(scrollTop / this.rowHeight) - 2);
        const end = Math.min(this.filteredData.length, start + visibleRowCount + 4);
      
        for (let i = 0; i < this.rowPool.length; i++) {
          const dataIndex = start + i;
          const tr = this.rowPool[i];
      
          if (dataIndex < end) {
            const rowData = this.filteredData[dataIndex];
            const tds = tr.children;
      
            this.columns.forEach((col, colIndex) => {
              const td = tds[colIndex];
              const newValue = rowData[col.key] ?? col.defaultValue ?? "N/A";
              const displayValue = typeof newValue === "boolean" ? (newValue ? "YES" : "NO") : newValue;
              const prevValue = td.getAttribute("data-prev-value");
              if (prevValue !== String(displayValue)) {
                td.setAttribute("data-prev-value", displayValue);
                if (col.custom) {
                  td.innerHTML = ""; 
                  col.custom(newValue, td); 
                } else {
                  td.textContent = displayValue;
                }
              }
              if (col.width && td.style.width !== col.width) {
                td.style.width = col.width;
              }
              td.setAttribute("data-label", col.label);
            });
      
            tr.style.top = `${dataIndex * this.rowHeight}px`;
            //tr.style.transform = `translateY(${dataIndex * this.rowHeight}px)`
            tr.style.display = "";
          } else {
            tr.style.display = "none";
          }
        }
      }
  
  
}