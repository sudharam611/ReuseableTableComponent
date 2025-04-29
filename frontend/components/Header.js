export class Header {
    constructor(theadElement, columns = [], styleConfiguration = {}) {
      
      this.thead = theadElement;
      this.columns = columns;
      this.styleConfiguration = styleConfiguration;
    }
  
    renderTableHeaders() {
      const tr = document.createElement("tr");
      this.columns.forEach((col) => {
        const th = document.createElement("th");
        th.setAttribute("data-key", col.key);
        th.textContent = col.label;
        if (col.width) {
          th.style.width = col.width;
        }
        if (col.sortable !== false) {
          th.classList.add("sortable");
          const sortArrow = document.createElement("span");
          sortArrow.classList.add("sort-arrow");
          sortArrow.setAttribute("data-key", col.key);
          sortArrow.style.cursor = "pointer";
  
          const img = document.createElement("img");
          img.src = this.styleConfiguration.sortIconStyling.sortDefaultIcon;
          img.width = this.styleConfiguration.sortIconStyling.imageWidth;
          img.height = this.styleConfiguration.sortIconStyling.imageHeight;
          sortArrow.appendChild(img);
          th.appendChild(sortArrow);
        }
  
        if (col.columnLevelFiltering) {
          const filterWrapper = document.createElement("div");
          filterWrapper.className = "filter-wrapper";
          filterWrapper.style.position = "absolute";
          filterWrapper.style.top = "8px";
          filterWrapper.style.right = "28px";
          filterWrapper.style.display = "inline-block";
  
          const filterIcon = document.createElement("img");
          filterIcon.src = this.styleConfiguration.filterIcon || "images/filter-icon.png";
          filterIcon.className = "filter-icon";
          filterIcon.style.width = "18px";
          filterIcon.style.height = "18px";
          filterIcon.style.cursor = "pointer";
          filterWrapper.appendChild(filterIcon);
  
          const filterDropdown = document.createElement("select");
          filterDropdown.className = "column-filter";
          filterDropdown.setAttribute("data-key", col.key);
          filterDropdown.style.position = "absolute";
          filterDropdown.style.top = "100%";
          filterDropdown.style.left = "0";
          filterDropdown.style.display = "none";
          filterDropdown.style.zIndex = "10";
  
          const defaultOption = document.createElement("option");
          defaultOption.textContent = "All";
          defaultOption.value = "";
          filterDropdown.appendChild(defaultOption);
  
          col.columnLevelFiltering.forEach(range => {
            const option = document.createElement("option");
            option.textContent = range.label;
            option.value = JSON.stringify({ min: range.min, max: range.max });
            filterDropdown.appendChild(option);
          });
  
          filterIcon.addEventListener("click", () => {
            filterDropdown.style.display =
              filterDropdown.style.display === "none" ? "block" : "none";
          });
  
          filterDropdown.addEventListener("change", (e) => {
            const key = e.target.getAttribute("data-key");
            const range = e.target.value ? JSON.parse(e.target.value) : null;
            this.filterDataByRange(key, range);
            this.updateRows();
            filterDropdown.style.display = "none";
          });
  
          filterWrapper.appendChild(filterDropdown);
          th.appendChild(filterWrapper);
        }
  
        tr.appendChild(th);
      });
      this.thead.innerHTML = "";
      this.thead.appendChild(tr);
    }
  }
  