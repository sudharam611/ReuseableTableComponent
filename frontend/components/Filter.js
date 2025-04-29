export class Filter {
    constructor(updateRows, filteredData, data, container) {
      this.updateRows = updateRows;
      this.filteredData = filteredData;
      this.data = data;
      this.container = container;
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
          if (enteredInput === "") {
            this.filteredData = [...this.data];
          } else {
            this.filteredData = this.data.filter((row) =>
              Object.values(row).some((value) =>
                String(value).toLowerCase().includes(enteredInput)
              )
            );
            console.log(this.filteredData)
            if (this.filteredData.length === 0) {
              if (!isMessageDisplayed) {
                if (!this.container.contains(noDataMessage)) {
                  this.container.appendChild(noDataMessage);
                  isMessageDisplayed = true;
                }
              }
            } else {
              if (isMessageDisplayed) {
                this.container.removeChild(noDataMessage);
                isMessageDisplayed = false;
              }
            }
          }
  
          // Call updateRows but pass the filtered data
          this.updateRows(this.filteredData);
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
  }
  