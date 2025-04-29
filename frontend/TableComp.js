import { CalculateRowAndHeight } from "./components/CalculateRowAndHeight.js";
import { Filter } from "./components/Filter.js";
import { FilterSearchBar } from "./components/FilterSearchBar.js";
import { Header } from "./components/Header.js";
import { RenderRows } from "./components/RenderRows.js";
import { ScrollListener } from "./components/ScrollListener.js";
import { Sort } from "./components/Sort.js";
import { TableStructure } from "./components/TableStructure.js";
import { styleConfiguration } from "./configuration/styleConfig.js";
export class TableComponent1 {
  // #data = [];
  // #filteredData = [];
  constructor(tableContainer, options = {}, fetchDataCallBack) {
    this.fetchDataCallBack = fetchDataCallBack || undefined;
    this.container = document.getElementById(tableContainer);
    this.sortKey = options.defaultSortKey || "";
    this.sortAsc = options.sortOrder !== "desc";
    this.columns = options.columns || [];
    this.bufferRows = 100;
    this.rowPool = [];
    this.rowHeight = 0;
    this.activeFilters = {};
    this.data = [];
  this.filteredData = [];
    this.initial();
  }

  async initial() {
    try {
      if (this.fetchDataCallBack && typeof this.fetchDataCallBack === 'function') {
        this.data = await this.fetchDataCallBack(); 
      } else {
       alert("No data provided. Please check the URL. Rendering with default headers.");
        this.data = [];
      }
      this.filteredData = [...this.data];
      console.log(this.filteredData)
      const filterBar = new FilterSearchBar(this.container);
      filterBar.createFilterUI();
      
      const tableStruct = new TableStructure(this.container);
       const {table, thead, tbody} = tableStruct.createTable();

      const tableHeader = new Header(thead, this.columns, styleConfiguration);
      tableHeader.renderTableHeaders();

      
      const renderRows = new RenderRows(
        this.filteredData,
        this.container,
        this.rowPool,     
        this.columns
      );

      const calculateRowAndHeight = new CalculateRowAndHeight(
        renderRows.updateRows.bind(renderRows),
        this.container,
        tbody,
        this.columns,
        this.bufferRows,
        this.rowPool
      );
     
       const { rowPool, rowHeight } = calculateRowAndHeight.measureRowAndHeight();
       renderRows.rowPool = rowPool;
       renderRows.rowHeight = rowHeight;
       renderRows.updateRows();

       const scrollListener = new ScrollListener(renderRows.updateRows.bind(renderRows), this.container);
       scrollListener.addScrollListeners();

       const sort = new Sort(this.filteredData,this.columns, renderRows.updateRows.bind(renderRows), table, this.sortAsc, this.sortKey);
       sort.addSortListener();
       sort.updateSortArrow();
      
       const filter = new Filter(renderRows.updateRows.bind(renderRows), this.filteredData, this.data, this.container)
       filter.addFilterListener();

      
    } catch (error) {
      alert("Failed to fetch data. Please check the URL");
    
      console.error(error);
    } 
  }

 
}