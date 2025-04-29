export class ScrollListener {
    constructor(updateRows, container) {
        this.updateRows = updateRows;
        this.container = container;
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
}