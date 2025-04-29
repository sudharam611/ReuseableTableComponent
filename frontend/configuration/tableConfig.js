export const tableConfiguration = {
    columns: [
      // {
      //   label: "Select",
      //   key: "checkbox",
      //   width: "5%",
      //   sortable: false,
      //   custom: () => {
      //     const cell = document.createElement("td");
      //     const checkbox = document.createElement("input");
      //     checkbox.type = "checkbox";
      //     checkbox.className = "row-checkbox";
      //     cell.appendChild(checkbox);
      //     return cell;
      //   },
      // },
      // {
      //   label: "",
      //   key: "image",
      //   sortable: true,
      //   width: "5%",
      //   custom: (imageObj, td) => {
      //     if (imageObj && imageObj.url) {
      //       td.innerHTML = `<img src="${imageObj.url}" alt="${imageObj.alt}" title="${imageObj.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 20px;" />`;
      //     } else {
      //       td.textContent = "No image";
      //     }
      //   }
      // },
      {
        label: "ID",
        key: "id",
        sortable: false,
        defaultValue: "0",
        width: "5%",
      },
      {
        label: "Name",
        key: "name",
        sortable: true,
        defaultValue: "Unknown",
        width: "30%",
        columnLevelFiltering: [
          { label: "A to D", min: 'A', max: 'D' },
          { label: "E to G", min: 'E', max: 'G' },
       
        ],
      },
      {
        label: "Age",
        key: "age",
        sortable: true,
        defaultValue: "NIL",
        width: "10%",
        columnLevelFiltering: [
          { label: "Below 10", min: 0, max: 10 },
          { label: "20 to 40", min: 20, max: 40 },
          { label: "50 to 70", min: 50, max: 70 }
        ],
      },
      {
        label: "Rank",
        key: "rank",
        sortable: true,
        defaultValue: "0",
        width: "10%",
      },
      // {label: "Present", key: "present", sortable: true, defaultValue: "NIL", width: "10%"},
      // {label: "Address", key: "address", trimming: true, width: "10%"},
      {
        label: "Percentage",
        key: "percentage",
        width: "20%",
        columnLevelFiltering: [
          { label: "Below 50%", min: 0, max: 50 },
          { label: "51% - 80%", min: 51, max: 80 },
          { label: "81% - 100%", min: 81, max: 100 }
        ],
        custom: (value, td) => {
          td.textContent = value;
        
          td.style.backgroundColor =
            value > 80 ? "#77B254" :
            value > 50 ? "#FFF085" : "#D84040";
        
          td.style.color = "#000";
          td.style.textAlign = "center";
          td.style.fontWeight = "bold";
          // td.style.borderRadius = "4px";
          td.style.padding = "4px 8px";
        }
        
      },
    ],
    defaultSortKey: "name",
    sortOrder: "asc",
  };
  