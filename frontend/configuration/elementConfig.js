export const elementConfiguration = {
    input: Object.assign(
      document.createElement("input"),
      {
        type: "text",
        id: "filter-input",
        placeholder: "Enter data to search"
      }
    ),
    button: Object.assign(
        document.createElement("button"),
        {
            id: "reset-button",
            textContent: "Reset"
        }
    )
  };
  