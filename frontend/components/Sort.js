import { styleConfiguration } from "../configuration/styleConfig.js";

export class Sort {
  constructor(filteredData, columns = [], updateRows, table, sortAsc, sortKey) {
    this.filteredData = filteredData;
    this.columns      = columns;
    this.updateRows   = updateRows;
    this.table        = table;
    this.sortAsc      = sortAsc;
    this.sortKey      = sortKey;
  }

  addSortListener() {
    const sortArrows = this.table.querySelectorAll(".sort-arrow");
    console.log(this.table);
    sortArrows.forEach(arrow => {
      const key = arrow.getAttribute("data-key");
      const cfg = this.columns.find(c => c.key === key);
      if (cfg?.sortable !== false) {
        arrow.addEventListener("click", () => this.sortColumn(key));
      }
    });
  }

  sortColumn(key) {
    const cfg = this.columns.find(c => c.key === key);
    if (cfg?.sortable === false) return;
    this.sortAsc = this.sortKey === key ? !this.sortAsc : true;
    this.sortKey = key;
    this.updateSortArrow();
    this.sortData();
    this.updateRows();
  }

  sortData() {
    const key = this.sortKey;
    this.filteredData.sort((a, b) => {
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

  updateSortArrow() {
    const arrows = this.table.querySelectorAll(".sort-arrow img");
    arrows.forEach(img => {
      const key = img.parentElement.getAttribute("data-key");
      if (key === this.sortKey) {
        img.src    = this.sortAsc
          ? styleConfiguration.sortIconStyling.sortAscIcon
          : styleConfiguration.sortIconStyling.sortDescIcon;
      } else {
        img.src = styleConfiguration.sortIconStyling.sortDefaultIcon;
      }
      img.width  = styleConfiguration.sortIconStyling.imageWidth;
      img.height = styleConfiguration.sortIconStyling.imageHeight;
    });
  }
}
