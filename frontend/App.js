import { TableComponent } from "./Table.js";
import { fetchData } from "./utilities/fetchData.js";
import { tableConfiguration } from "./configuration/tableConfig.js";


new TableComponent("table-wrapper", tableConfiguration,  () => fetchData());

//new TableComponent("table-wrapper", tableConfiguration);