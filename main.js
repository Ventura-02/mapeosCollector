let gridInstance;
let jsonData = [];
function displayData(data) {
    const columnDefs = [
        { width: 50, rowDrag: true, cellRenderer: () => '<i class="bi bi-arrows-move"></i>' },
        { headerName: 'Uid', field: 'Uid', editable: true },
        { headerName: 'Unit', field: 'Unit', editable: true },
        { headerName: 'TypeLogData', field: 'TypeLogData', editable: true },
        { headerName: 'CurveDescription', field: 'CurveDescription', editable: true },
        { headerName: 'Mnemonic', field: 'Mnemonic', editable: true },
        { headerName: 'IsIndex', field: 'IsIndex', editable: true, cellRenderer: 'checkboxCellRenderer' },
        { headerName: 'SaveInterval', field: 'SaveInterval', editable: true },
        { headerName: 'IsEnabled', field: 'IsEnabled', editable: true, cellRenderer: 'checkboxCellRenderer' },
        {
            headerName: 'Index Source',
            field: 'IndexComponent.SourceComponents[0].Source',
            editable: true,
            valueGetter: params => params.data.IndexComponent.SourceComponents[0]?.Source || 'N/A',
            valueSetter: function (params) {
                if (!params.data.IndexComponent.SourceComponents[0]) {
                    params.data.IndexComponent.SourceComponents[0] = {};
                }
                params.data.IndexComponent.SourceComponents[0].Source = params.newValue;
                return true;
            }
        },
        {
            headerName: 'Index Name',
            field: 'IndexComponent.SourceComponents[0].Name',
            editable: true,
            valueGetter: params => params.data.IndexComponent.SourceComponents[0]?.Name || 'N/A',
            valueSetter: function (params) {
                if (!params.data.IndexComponent.SourceComponents[0]) {
                    params.data.IndexComponent.SourceComponents[0] = {};
                }
                params.data.IndexComponent.SourceComponents[0].Name = params.newValue;
                return true;
            }
        },
        { headerName: 'Index Formula', field: 'IndexComponent.Formula', editable: true },
        {
            headerName: 'Value Source',
            field: 'ValueComponent.SourceComponents[0].Source',
            editable: true,
            valueGetter: params => params.data.ValueComponent.SourceComponents[0]?.Source || 'N/A',
            valueSetter: function (params) {
                if (!params.data.ValueComponent.SourceComponents[0]) {
                    params.data.ValueComponent.SourceComponents[0] = {};
                }
                params.data.ValueComponent.SourceComponents[0].Source = params.newValue;
                return true;
            }
        },
        {
            headerName: 'Value Name',
            field: 'ValueComponent.SourceComponents[0].Name',
            editable: true,
            valueGetter: params => params.data.ValueComponent.SourceComponents[0]?.Name || 'N/A',
            valueSetter: function (params) {
                if (!params.data.ValueComponent.SourceComponents[0]) {
                    params.data.ValueComponent.SourceComponents[0] = {};
                }
                params.data.ValueComponent.SourceComponents[0].Name = params.newValue;
                return true;
            }
        },
        { headerName: 'Value Formula', field: 'ValueComponent.Formula', editable: true },
        {
            headerName: 'Actions',
            cellRenderer: function (params) {
                const container = document.createElement('div');
                const addButton = document.createElement('button');
                addButton.innerHTML = '<i class="fas fa-plus"></i>';
                addButton.classList.add('add-row-button', 'btn', 'btn-success', 'btn-sm');
                addButton.style.padding = '2px 5px';
                addButton.onclick = function () {
                    addRowAt(params.node.rowIndex);
                };
                const deleteButton = document.createElement('buttonTrash');
                deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
                deleteButton.classList.add('delete-row-button', 'btn', 'btn-danger', 'btn-sm');
                deleteButton.style.padding = '2px 5px';
                deleteButton.onclick = function () {
                    deleteRow(params.node.rowIndex);
                };
                container.appendChild(addButton);
                container.appendChild(deleteButton);
                return container;
            }
        }
    ];
    const gridOptions = {
        columnDefs: columnDefs,
        rowData: data,
        rowDragManaged: true,
        animateRows: true,
        components: {
            checkboxCellRenderer: function (params) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = params.value;
                checkbox.onchange = function () {
                    params.node.setDataValue(params.colDef.field, checkbox.checked);
                };
                return checkbox;
            }
        },
        defaultColDef: {
            resizable: true,
            sortable: false,
            filter: false,
            editable: true
        },
        suppressDragLeaveHidesColumns: true,
        stopEditingWhenCellsLoseFocus: true,
        onFirstDataRendered: function (params) {
            params.api.sizeColumnsToFit();
            if (params.columnApi) {
                const allColumnIds = [];
                params.columnApi.getAllColumns().forEach(column => {
                    allColumnIds.push(column.getId());
                });
                params.columnApi.autoSizeColumns(allColumnIds);
            }
        }
    };
    const tableContainer = document.getElementById('tableContainer');
    if (gridInstance) {
        gridInstance.destroy();
    }
    gridInstance = new agGrid.Grid(tableContainer, gridOptions);
}
function deleteRow(index) {
    if (confirm('¿Estás seguro de que quieres eliminar esta fila?')) {
        jsonData.splice(index, 1);
        displayData(jsonData);
    }
}
function addRow() {
    const newRow = {
        Uid: '',
        Unit: 'n/a',
        TypeLogData: 0,
        CurveDescription: '',
        Mnemonic: '',
        IsIndex: false,
        IndexComponent: {
            SourceComponents: [],
            Formula: null,
            Filter: null
        },
        ValueComponent: {
            SourceComponents: [],
            Formula: null,
            Filter: null
        },
        SaveInterval: 5,
        IsArray: false,
        IsArrayEnble: true,
        IsEnabled: false
    };
    jsonData.push(newRow);
    displayData(jsonData);
    console.log('Fila agregada:', newRow);
}
function saveData() {
    const orderedData = [];
    gridInstance.gridOptions.api.forEachNodeAfterFilterAndSort((node) => {
        orderedData.push(node.data);
    });
    const jsonStr = JSON.stringify(orderedData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mapeo.curvedefs';
    a.click();
    URL.revokeObjectURL(url);
}
function exportToXlsx() {
    const processedData = jsonData.map(item => {
        return {
            Uid: item.Uid,
            Unit: item.Unit,
            TypeLogData: item.TypeLogData,
            CurveDescription: item.CurveDescription,
            Mnemonic: item.Mnemonic,
            IsIndex: item.IsIndex,
            SaveInterval: item.SaveInterval,
            IsArray: item.IsArray,
            IsArrayEnable: item.IsArrayEnable,
            IsEnabled: item.IsEnabled,
            IndexComponentSource: item.IndexComponent && item.IndexComponent.SourceComponents.length > 0
                ? item.IndexComponent.SourceComponents[0].Source
                : 'N/A',
            IndexComponentName: item.IndexComponent && item.IndexComponent.SourceComponents.length > 0
                ? item.IndexComponent.SourceComponents[0].Name
                : 'N/A',
            ValueComponentSource: item.ValueComponent && item.ValueComponent.SourceComponents.length > 0
                ? item.ValueComponent.SourceComponents[0].Source
                : 'N/A',
            ValueComponentName: item.ValueComponent && item.ValueComponent.SourceComponents.length > 0
                ? item.ValueComponent.SourceComponents[0].Name
                : 'N/A'
        };
    });
    const worksheet = XLSX.utils.json_to_sheet(processedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    XLSX.writeFile(workbook, 'datos.xlsx');
}
