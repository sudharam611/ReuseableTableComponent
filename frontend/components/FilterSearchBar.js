export class FilterSearchBar{
    constructor(container){
        this.container = container;
    }
    createFilterUI(){
        const filterSection = document.createElement("div");
        filterSection.classList.add("search-section");
        const input = document.createElement("input");
        input.type = "text";
        input.id = "filter-input";
        input.placeholder = "Enter data to search";

        const button = document.createElement("button");
        button.id = "reset-button";
        button.textContent = "Reset";

        filterSection.appendChild(input);
        filterSection.appendChild(button);
        this.container.parentElement.insertBefore(filterSection, this.container);
        //button.addEventListener("click", () => this.reset());
        //this.addFilterListener();
    }
}