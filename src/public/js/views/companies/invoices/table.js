const pathArray = window.location.pathname.split('/');
const companyId = pathArray[2];
let filter_now = false;

const columnDefs = [
  {
    headerName: '',
    checkboxSelection: true,
    headerCheckboxSelection: true,
    headerClass: 'checkbox',
    pinned: 'left',
    width: 48,
    field: 'checkboxBtn',
    resizable: false,
    lockPosition: 'left',
    suppressAutoSize: true,
    suppressColumnsToolPanel: true,
    suppressMenu: true,
    editable: false,
  },
  {
    field: 'is_accounted',
    headerName: 'Muhasebe Durumu',
    filter: 'agSetColumnFilter',
    cellStyle: { textAlign: 'center' },
    filterParams: {
      valueFormatter: function (params) {
        if (params.value === 'not_accounted') {
          return 'MuhasebeleştirilMEmiş';
        } else if (params.value === 'accounted_successfully') {
          return 'Başarılı';
        } else if (params.value === 'accounted_error') {
          return 'Hatalı';
        } else {
          return params.value;
        }
      },
    },
    editable: false,
    cellRenderer: function (params) {
      if (params.value === 'not_accounted') {
        return `<span class="badge badge-center rounded-pill bg-warning"><i class="ti ti-circle"></i></span>`;
      } else if (params.value === 'accounted_successfully') {
        return '<span class="badge badge-center rounded-pill bg-success"><i class="ti ti-check"></i></span>';
      } else if (params.value === 'accounted_error') {
        return '<span class="badge badge-center rounded-pill bg-danger"><i class="fa-solid fa-xmark"></i></span>';
      } else {
        return params.value;
      }
    },
    width: 60,
  },
  {
    field: 'id',
    hide: true,
    suppressColumnsToolPanel: true,
  },
  {
    field: 'uuid',
    headerName: 'UUID',
    filter: 'agTextColumnFilter',
    hide: true,
  },
  {
    field: 'number',
    headerName: 'Fatura No',
    filter: 'agTextColumnFilter',
    width: 170,
    editable: false,
  },
  {
    field: 'direction',
    headerName: 'Yön',
    filter: 'agSetColumnFilter',
    filterParams: {
      valueFormatter: function (params) {
        if (params.value === 2) {
          return 'Gelen';
        } else if (params.value === 1) {
          return 'Giden';
        } else {
          return params.value;
        }
      },
    },
    valueFormatter: function (params) {
      if (params.value === 2) {
        return 'Gelen';
      } else if (params.value === 1) {
        return 'Giden';
      } else {
        return params.value;
      }
    },
  },
  {
    field: 'profile_id',
    headerName: 'Fatura Profili',
    filter: 'agSetColumnFilter',
    width: 150,
  },
  {
    field: 'type_code',
    headerName: 'Tip',
    filter: 'agSetColumnFilter',
    width: 100,
  },
  {
    field: 'issue_datetime',
    headerName: 'Tarih',
    width: 130,
    valueFormatter: function (params) {
      return moment(params.value).format('DD/MM/YYYY');
    },
  },
  {
    field: 'tax_number',
    headerName: 'Karşı VKTCKN',
    filter: 'agTextColumnFilter',
    valueGetter: function (params) {
      if (params.data.direction === 2) {
        return params.data.sender_tax;
      } else {
        return params.data.receiver_tax;
      }
    },
  },
  {
    field: 'company_name',
    headerName: 'Karşı Ünvan',
    filter: 'agTextColumnFilter',
    width: 200,
    valueGetter: function (params) {
      if (params.data.direction === 2) {
        return params.data.sender_name;
      } else {
        return params.data.receiver_name;
      }
    },
  },
  {
    field: 'payable_amount',
    headerName: 'Tutar',
    filter: 'agNumberColumnFilter',
    width: 150,
    valueFormatter: function (params) {
      return Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: params.data.currency_code,
      }).format(params.value);
    },
  },
];

var localeText = AG_GRID_LOCALE_TR;

const gridOptions = {
  defaultColDef: {
    resizable: true,
    width: 120,
    floatingFilter: true,
    editable: true,
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
  isExternalFilterPresent: () => true,
  doesExternalFilterPass: doesExternalFilterPass,
  readOnlyEdit: true,
  singleClickEdit: true,
  stopEditingWhenCellsLoseFocus: true,
};

function doesExternalFilterPass(node) {
  if (node.data) {
    let sd_data = moment(start_date.selectedDates[0]);
    let ed_data = moment(end_date.selectedDates[0]);
    let issue_datetime = moment(node.data.issue_datetime);
    // console.log(sd_data, ed_data, issue_datetime);
    if (issue_datetime.isBetween(sd_data, ed_data, null, '[]')) {
      return true;
    }
    return false;
  }
  return true;
}

$(document).ready(function () {
  // var gridDiv = document.querySelector('#companies-invoices-table');
  // new agGrid.Grid(gridDiv, gridOptions);

  var gridDiv = document.querySelector('#companies-invoices-table');
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  gridApi.showLoadingOverlay();
  $.ajax({
    url: `/api/company/${companyId}/invoices`,
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      gridApi.setRowData(data);
      gridApi.hideOverlay();
      filter_now = true;
    },
  });
  $('#search').on('click', function () {
    searchTable();
  });
  $('#searchbox').on('keyup', function (e) {
    if (e.keyCode === 13) {
      searchTable();
    }
  });
  $('#searchbox').on('focusout', function () {
    searchTable();
  });

  const searchTable = () => {
    gridApi.showLoadingOverlay();
    gridApi.onFilterChanged();
    gridApi.setGridOption('quickFilterText', $('#searchbox').val());
    gridApi.hideOverlay();
  };
});
