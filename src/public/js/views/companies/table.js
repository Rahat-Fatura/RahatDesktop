const columnDefs = [
  // {
  //   headerName: '',
  //   checkboxSelection: true,
  //   headerCheckboxSelection: true,
  //   headerClass: 'checkbox',
  //   pinned: 'left',
  //   width: 48,
  //   field: 'checkboxBtn',
  //   resizable: false,
  //   lockPosition: 'left',
  //   suppressAutoSize: true,
  //   suppressColumnsToolPanel: true,
  //   suppressMenu: true,
  // },
  {
    field: 'process',
    headerName: 'İşlem',
    cellRenderer: processCellRenderer,
    width: 90,
    pinned: 'left',
    resizable: false,
    lockPosition: 'left',
    suppressAutoSize: true,
    suppressColumnsToolPanel: true,
    suppressMenu: true,
  },
  {
    field: 'status',
    headerName: 'Durum',
    cellRenderer: statusCellRenderer,
    width: 120,
    pinned: 'left',
    resizable: false,
    lockPosition: 'left',
    suppressAutoSize: true,
    suppressColumnsToolPanel: true,
    suppressMenu: true,
  },
  {
    field: 'id',
    hide: true,
    suppressColumnsToolPanel: true,
  },
  {
    field: 'name',
    headerName: 'Firma Adı',
    filter: 'agTextColumnFilter',
    width: 500,
  },
  {
    field: 'tax_number',
    headerName: 'Vergi / TC Kimlik No',
    filter: 'agTextColumnFilter',
    width: 200,
  },
  {
    field: 'tax_office',
    headerName: 'Vergi Dairesi',
    filter: 'agTextColumnFilter',
    width: 200,
    hide: true,
  },
  {
    field: 'city',
    headerName: 'Şehir',
    filter: 'agTextColumnFilter',
    width: 200,
  },
  {
    field: 'country',
    headerName: 'Ülke',
    filter: 'agTextColumnFilter',
    width: 200,
    hide: true,
  },
  {
    field: 'address',
    headerName: 'Adres',
    filter: 'agTextColumnFilter',
    width: 200,
    hide: true,
  },
  {
    field: 'created_at',
    headerName: 'Eklenme Tarihi',
    filter: 'agTextColumnFilter',
    width: 200,
    hide: true,
  },
];

var localeText = AG_GRID_LOCALE_TR;

const gridOptions = {
  defaultColDef: {
    resizable: true,
    width: 120,
    floatingFilter: true,
  },
  sideBar: {
    toolPanels: ['columns'],
  },
  columnDefs: columnDefs,
  rowData: [],
  rowDragManaged: true,
  animateRows: true,
  localeText: localeText,
  rowSelection: 'multiple',
};

$(document).ready(function () {
  var gridDiv = document.querySelector('#companies-table');
  new agGrid.Grid(gridDiv, gridOptions);
  gridOptions.api.showLoadingOverlay();
  $.ajax({
    url: '/api/companies/list',
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      gridOptions.api.setRowData(data);
      gridOptions.api.hideOverlay();
    },
  });
});
