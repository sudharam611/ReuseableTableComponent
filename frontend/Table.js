import { elementConfiguration } from "./configuration/elementConfig.js";
import { styleConfiguration } from "./configuration/styleConfig.js";

export class TableComponent {
  #data = [];
  #filteredData = [];
  constructor(tableContainer, options = {}, fetchDataCallBack) {
    this.fetchDataCallBack = fetchDataCallBack || undefined;
    this.container = document.getElementById(tableContainer);
    this.sortKey = options.defaultSortKey || "";
    this.sortAsc = options.sortOrder !== "desc";
    this.columns = options.columns || [];
    this.bufferRows = 0;
    this.rowPool = [];
    this.rowHeight = 0;
    this.activeFilters = {};
    this.initialColumnWidths = [];
    this.removedRows = [];
    this.initial();
  }
  
  async initial() {
    const spinner = document.getElementById('loading-spinner');
    try {
      spinner.style.display = "block";
      if (this.fetchDataCallBack && typeof this.fetchDataCallBack === 'function') {
        this.#data = await this.fetchDataCallBack(); 
      } else {
       alert("No data provided. Please check the URL. Rendering with default headers.");
        this.#data = [];
      }
      this.#filteredData = [...this.#data];
      this.tableStructureSetup();
      if (this.#data.length === 0) {
        this.renderNoDataRow();
      }
      this.tableFeatures();
      //if (this.sortKey) this.sortData();
    } catch (error) {
      alert("Failed to fetch data. Please check the URL");
      this.tableStructureSetup();
      this.renderNoDataRow();
      console.error(error);
    } finally {
      spinner.style.display = "none";
    }
  }

  tableStructureSetup() {
    this.createFilterUI();
    this.createTable();
    this.renderTableHeaders();
  }
  
  tableFeatures() {
    this.columnResize(document.querySelector('.reusable-table'));
    this.measureRowAndHeight();
    this.columnFilter();
    this.addSortListener();
    this.addScrollListeners();
    document
        .getElementById("reset-button")
        .addEventListener("click", () => this.reset());
    if (this.sortKey) {
      this.sortData();
      this.updateRows();
    }
  }

  createFilterUI() {
    const filterSection = document.createElement("div");
    filterSection.classList.add("search-section");
    filterSection.appendChild(elementConfiguration.input);
    filterSection.appendChild(elementConfiguration.button);
    this.container.parentElement.insertBefore(filterSection, this.container);
    elementConfiguration.button.addEventListener("click", () => this.reset());
    this.addFilterListener();
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
  }

  renderNoDataRow() {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.setAttribute("colspan", this.columns.length); 
    td.textContent = "No data available";
    td.classList.add("no-data-row");
    tr.appendChild(td);
    this.tbody.appendChild(tr);
    return;
  }

  renderTableHeaders() {
    const tr = document.createElement("tr");
    this.columns.forEach((col) => {
      const th = document.createElement("th");
      th.setAttribute("data-key", col.key);
      th.textContent = col.label;
      if (col.width) {
        th.style.width = col.width || '20%';
      }
      if (col.sortable !== false) {
        th.classList.add("sortable");
        this.displaySortArrow(col.key, th);
      }
      if (col.columnLevelFiltering) {
        this.createColumnFiltering(col.key, col.columnLevelFiltering, th);
      }
      tr.appendChild(th);
    });
    this.thead.appendChild(tr);
  }

  displaySortArrow(key, th) {
    const sortArrow = document.createElement("span");
    sortArrow.classList.add("sort-arrow");
    sortArrow.setAttribute("data-key", key);
    const img = document.createElement("img");
    img.src = styleConfiguration.sortIconStyling.sortDefaultIcon;
    img.width = styleConfiguration.sortIconStyling.imageWidth;
    img.height = styleConfiguration.sortIconStyling.imageHeight
    sortArrow.appendChild(img);
    th.appendChild(sortArrow);
  }

  updateSortArrow() {
    const arrows = document.querySelectorAll(".sort-arrow img");
    arrows.forEach((img) => {
      const key = img.parentElement.getAttribute("data-key");
      if (key === this.sortKey) {
        img.src = this.sortAsc ? styleConfiguration.sortIconStyling.sortAscIcon : styleConfiguration.sortIconStyling.sortDescIcon;
        img.width = styleConfiguration.sortIconStyling.imageWidth;
        img.height = styleConfiguration.sortIconStyling.imageHeight;
      } else {
        img.src = styleConfiguration.sortIconStyling.sortDefaultIcon;
        img.width = styleConfiguration.sortIconStyling.imageWidth;
        img.height = styleConfiguration.sortIconStyling.imageHeight;
      }
    });
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
  }

  updateRows() {
    if (this.#filteredData.length === 0) {
      this.removedRows = [...this.rowPool];
      this.rowPool.forEach(tr => tr.remove());
      console.log(this.rowPool.length)
      return;
    }
    if (this.removedRows.length > 0) {
      this.removedRows.forEach(tr => {
        this.tbody.appendChild(tr); 
      });
      this.removedRows = []; 
    }
    
    const scrollTop = this.container.scrollTop;
    const viewportHeight = this.container.clientHeight;
    const visibleRowCount = Math.ceil(viewportHeight / this.rowHeight) + 10;
    const start = Math.max(0, Math.floor(scrollTop / this.rowHeight) - 2);
    const end = Math.min(this.#filteredData.length, start + visibleRowCount + 4);
  
    for (let i = 0; i < this.rowPool.length; i++) {
      const dataIndex = start + i;
      const tr = this.rowPool[i];
  
      if (dataIndex < end) {
        const rowData = this.#filteredData[dataIndex];
        const tds = tr.children;
  
        this.columns.forEach((col, colIndex) => {
          const td = tds[colIndex];
          const newValue = rowData[col.key] ?? col.defaultValue ?? "N/A";
          const displayValue = typeof newValue === "boolean" ? (newValue ? "YES" : "NO") : newValue;
          const prevValue = td.getAttribute("data-prev-value");
          if (prevValue !== String(displayValue)) {
            td.setAttribute("data-prev-value", displayValue);
            if (col.custom) {
              //td.innerHTML = ""; 
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
        tr.style.display = "";
      } else {
        tr.style.display = "none";
      }
    }
  }
  
  createColumnFiltering(key, dropdownData, th) {
    const filterWrapper = document.createElement("div");
    filterWrapper.classList.add('filter-wrapper');
    const filterIcon = document.createElement("img");
    filterIcon.classList.add('filter-icon');
    filterIcon.src = styleConfiguration.filterIconStyling.filterIcon;
    filterIcon.style.width = styleConfiguration.filterIconStyling.iconWidth;
    filterIcon.style.height = styleConfiguration.filterIconStyling.iconHeight;
    filterWrapper.appendChild(filterIcon);
  
    const filterDropdown = document.createElement("select");
    filterDropdown.classList.add('column-filter');
    filterDropdown.setAttribute("data-key", key);
    
  
    const defaultOption = document.createElement("option");
    defaultOption.textContent = "All";
    defaultOption.value = "";
    filterDropdown.appendChild(defaultOption);
  
    dropdownData.forEach(range => {
      const option = document.createElement("option");
      option.textContent = range.label;
      option.value = JSON.stringify({ min: range.min, max: range.max });
      filterDropdown.appendChild(option);
    });
  
    filterIcon.addEventListener("click", () => {
      filterDropdown.style.display = (filterDropdown.style.display === "block") ? "none" : "block";
    });
  
    filterDropdown.addEventListener("change", (e) => {
      // this.applyColumnFilter();
      // this.updateRows();
      filterDropdown.style.display = "none"; 
    });
  
    filterWrapper.appendChild(filterDropdown);
    th.appendChild(filterWrapper);
  }

  columnFilter() {
    const columnFilters = this.table.querySelectorAll(".column-filter");
    columnFilters.forEach(filter => {
        filter.addEventListener("change", (e) => {
            const key = e.target.getAttribute("data-key");
            const range = e.target.value ? JSON.parse(e.target.value) : null;
            this.activeFilters[key] = range || null; 
            this.applyColumnFilter(); 
          });
      });
  }

  applyColumnFilter() {
    this.#filteredData = this.#data.filter(row => {
      return Object.entries(this.activeFilters).every(([colKey, range]) => {
        if (!range) return true; 
        const value = row[colKey];
        if (typeof value === 'number') {
          return value >= range.min && value <= range.max;
        }
        if (typeof value === 'string') {
          const trimmedValue = value.trim();
          return trimmedValue >= range.min && trimmedValue <= range.max;
        }
        if (value instanceof Date || !isNaN(Date.parse(value))) {
          const dateValue = value instanceof Date ? value : new Date(value);
          const minDate = new Date(range.min);
          const maxDate = new Date(range.max);
          return dateValue >= minDate && dateValue <= maxDate;
        }
       return true;
      });
    });
    if (this.#filteredData.length === 0) {
      this.renderNoDataRow();
    }
    this.updateRows();
  }
  
  addSortListener() {
    const sortArrows = this.table.querySelectorAll(".sort-arrow");
    sortArrows.forEach((arrow) => {
      const key = arrow.getAttribute("data-key");
      const columnConfig = this.columns.find((col) => col.key === key);
      if (columnConfig?.sortable !== false) {
        arrow.addEventListener("click", () => this.sortColumn(key));
      }
    });
  }

  sortColumn(key) {
    const columnConfig = this.columns.find((col) => col.key === key);
    if (columnConfig?.sortable === false) return;
    this.sortAsc = this.sortKey === key ? !this.sortAsc : true;
    this.sortKey = key;
    this.updateSortArrow();
    this.sortData();
    this.updateRows();
  }

  sortData() {
    const key = this.sortKey;
    this.#filteredData.sort((a, b) => {
      let value1 = a[key];
      let value2 = b[key];
      if (value1 == null && value2 == null) return 0;
      if (value1 == null) return this.sortAsc ? 1 : -1;
      if (value2 == null) return this.sortAsc ? -1 : 1;
      if (typeof value1 === "boolean") value1 = value1 ? 1 : 0;
      if (typeof value2 === "boolean") value2 = value2 ? 1 : 0;
      if (value1 instanceof Date && value2 instanceof Date) {
        return this.sortAsc ? value1 - value2 : value2 - value1;
      }
      if (!isNaN(value1) && !isNaN(value2)) {
        return this.sortAsc ? value1 - value2 : value2 - value1;
      }
      return this.sortAsc
        ? String(value1).localeCompare(String(value2))
        : String(value2).localeCompare(String(value1));
    });
  }

  addFilterListener() {
    const input = document.getElementById("filter-input");
    const noDataMessage = document.createElement("div");
    noDataMessage.classList.add("no-data-div");
    noDataMessage.textContent = "No results found for your search";
  
    let isMessageDisplayed = false;
    input.addEventListener(
      "input",
      this.debounce((e) => {
        const enteredInput = e.target.value.trim().toLowerCase();
        const regex = new RegExp(enteredInput, "i");
        if (enteredInput === "") {
          this.#filteredData = [...this.#data];
        } else {
          this.#filteredData = this.#data.filter((row) =>
            Object.values(row).some((value) =>
              //String(value).toLowerCase().includes(enteredInput)
              regex.test(String(value))
            )
          );
        }
        if (this.#filteredData.length === 0) {
          if (!isMessageDisplayed) {
            if (!this.container.contains(noDataMessage)) {
              this.container.appendChild(noDataMessage);
            }
            isMessageDisplayed = true;
          }
        } else {
          if (isMessageDisplayed) {
            if (this.container.contains(noDataMessage)) {
              this.container.removeChild(noDataMessage);
            }
            isMessageDisplayed = false;
          }
        }
  
        this.updateRows();
      }, 300)
    );
  }

  debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  addScrollListeners() {
    let isUpdating = false;
    this.container.addEventListener("scroll", () => {
      if (!isUpdating) {
        requestAnimationFrame(() => {
          this.updateRows();  
          isUpdating = false; 
        });
        isUpdating = true; 
      }
    });
  }
  
  // throttle(fn, limit) {
  //   let lastCall = 0;
  //   return (...args) => {
  //     const now = new Date().getTime();
  //     if (now - lastCall >= limit) {
  //       lastCall = now;
  //       return fn.apply(this, args);
  //     }
  //   };
  // }

  columnResize(table) {
    // this.initialColumnWidths = [];
    const cols = table.querySelectorAll('th');
    const tableWidth = table.offsetWidth;
    table.style.tableLayout = 'fixed';
    cols.forEach((col, index) => {
      const configWidth = this.columns?.[index]?.width;
      const widthPercent = configWidth ? `${configWidth}%` : `${(col.offsetWidth / tableWidth) * 100}%`;
      this.initialColumnWidths[index] = configWidth || (col.offsetWidth / tableWidth) * 100;
      col.style.width = widthPercent;
      col.style.position = 'relative';
      const resizer = document.createElement('div');
      resizer.classList.add('resizer');
      resizer.style.height = `${this.table.offsetHeight}px`;
      col.appendChild(resizer);
      this.createResizableColumn(col, resizer, index, tableWidth);
    });
  }
  
  createResizableColumn(col, resizer, index, tableWidth) {
    let startX, startWidthPercent, animationFrame;
    const mouseDownHandler = (e) => {
      startX = e.clientX;
      startWidthPercent = parseFloat(col.style.width); 
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    };
    const mouseMoveHandler = (e) => {
      const xAxisDiff = e.clientX - startX;
      if (animationFrame) return;
      animationFrame = requestAnimationFrame(() => {
        const newWidthPx = (startWidthPercent / 100) * tableWidth + xAxisDiff;
        const newWidthPercent = (newWidthPx / tableWidth) * 100;
        const finalWidth = Math.max(5, newWidthPercent);
        col.style.width = `${finalWidth}%`;
        const rows = this.table.querySelectorAll('tr');
        rows.forEach(row => {
          const cell = row.children[index];
          if (cell) {
            cell.style.width = `${finalWidth}%`;
          }
        });
        if (this.columns[index]) {
          this.columns[index].width = finalWidth;
        }
        const headers = this.table.querySelectorAll('th');
        headers.forEach((th, idx) => {
          const width = this.columns[idx]?.width || this.initialColumnWidths[idx];
          if (width) th.style.width = `${width}%`;
        });
        animationFrame = null;
      });
    };
    const mouseUpHandler = () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      //document.removeEventListener('mouseup', mouseUpHandler);
    };
    resizer.addEventListener('mousedown', mouseDownHandler);
  }

  reset() {
    // window.scrollTo(0,0)
    this.activeFilters = {};
    const filterSelects = this.table.querySelectorAll(".column-filter");
    filterSelects.forEach(select => {
      select.value = "";
    });
    this.#filteredData = this.#data;
    document.getElementById("filter-input").value = "";
    this.#filteredData = [...this.#data];
    this.container.scrollTop = 0;
    this.sortKey = "";
    this.sortAsc = true;
    this.updateSortArrow();
    this.resetColumnWidths();
    const existingMessage = this.container.querySelector(".no-data-div");
    if (existingMessage) {
      console.log('removed')
      this.container.removeChild(existingMessage);
    }
    this.rowPool.forEach((tr) => {
      tr.style.display = "";
    });
    this.updateRows();
  }

  resetColumnWidths() {
    this.table.style.tableLayout = 'fixed';
    const cols = this.table.querySelectorAll('th');
    const rows = this.table.querySelectorAll('tr');
   
    cols.forEach(col => col.style.width = '');
    rows.forEach(row => {
      [...row.children].forEach(cell => cell.style.width = '');
    });
    cols.forEach((col, index) => {
      const width = this.initialColumnWidths?.[index];
      if (width != null) {
        col.style.width = width;
        if (this.columns[index]) {
          delete this.columns[index].width;
        }
        rows.forEach(row => {
          const cell = row.children[index];
          if (cell) {
            cell.style.width = width;
          }
        });
      }
    });
  }
  

}
