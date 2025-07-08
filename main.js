let gridApi;
let gridColumnApi;
let jsonData = [];

// Función para mostrar los datos en la tabla
function displayData(data) {
    // Definición de columnas
    const columnDefs = [
        { 
            width: 50, 
            rowDrag: true, 
            cellRenderer: () => '<i class="bi bi-arrows-move"></i>',
            suppressMenu: true,
            sortable: false,
            filter: false
        },
        { headerName: 'Uid', field: 'Uid', editable: true },
        { headerName: 'Unit', field: 'Unit', editable: true },
        { headerName: 'TypeLogData', field: 'TypeLogData', editable: true },
        { headerName: 'CurveDescription', field: 'CurveDescription', editable: true },
        { headerName: 'Mnemonic', field: 'Mnemonic', editable: true },
        { 
            headerName: 'IsIndex', 
            field: 'IsIndex', 
            editable: false, 
            cellRenderer: 'checkboxCellRenderer',
            cellClass: 'checkbox-cell'
        },
        { headerName: 'SaveInterval', field: 'SaveInterval', editable: true },
        { 
            headerName: 'IsEnabled', 
            field: 'IsEnabled', 
            editable: false, 
            cellRenderer: 'checkboxCellRenderer',
            cellClass: 'checkbox-cell'
        },
        {
            headerName: 'Index Source',
            field: 'IndexComponent.SourceComponents[0].Source',
            editable: true,
            valueGetter: params => params.data.IndexComponent?.SourceComponents?.[0]?.Source || 'N/A',
            valueSetter: function(params) {
                if (!params.data.IndexComponent) params.data.IndexComponent = {};
                if (!params.data.IndexComponent.SourceComponents) params.data.IndexComponent.SourceComponents = [{}];
                params.data.IndexComponent.SourceComponents[0].Source = params.newValue;
                return true;
            }
        },
        {
            headerName: 'Index Name',
            field: 'IndexComponent.SourceComponents[0].Name',
            editable: true,
            valueGetter: params => params.data.IndexComponent?.SourceComponents?.[0]?.Name || 'N/A',
            valueSetter: function(params) {
                if (!params.data.IndexComponent) params.data.IndexComponent = {};
                if (!params.data.IndexComponent.SourceComponents) params.data.IndexComponent.SourceComponents = [{}];
                params.data.IndexComponent.SourceComponents[0].Name = params.newValue;
                return true;
            }
        },
        { 
            headerName: 'Index Formula', 
            field: 'IndexComponent.Formula', 
            editable: true,
            valueGetter: params => params.data.IndexComponent?.Formula || 'N/A',
            valueSetter: function(params) {
                if (!params.data.IndexComponent) params.data.IndexComponent = {};
                params.data.IndexComponent.Formula = params.newValue;
                return true;
            }
        },
        {
            headerName: 'Value Source',
            field: 'ValueComponent.SourceComponents[0].Source',
            editable: true,
            valueGetter: params => params.data.ValueComponent?.SourceComponents?.[0]?.Source || 'N/A',
            valueSetter: function(params) {
                if (!params.data.ValueComponent) params.data.ValueComponent = {};
                if (!params.data.ValueComponent.SourceComponents) params.data.ValueComponent.SourceComponents = [{}];
                params.data.ValueComponent.SourceComponents[0].Source = params.newValue;
                return true;
            }
        },
        {
            headerName: 'Value Name',
            field: 'ValueComponent.SourceComponents[0].Name',
            editable: true,
            valueGetter: params => params.data.ValueComponent?.SourceComponents?.[0]?.Name || 'N/A',
            valueSetter: function(params) {
                if (!params.data.ValueComponent) params.data.ValueComponent = {};
                if (!params.data.ValueComponent.SourceComponents) params.data.ValueComponent.SourceComponents = [{}];
                params.data.ValueComponent.SourceComponents[0].Name = params.newValue;
                return true;
            }
        },
        { 
            headerName: 'Value Formula', 
            field: 'ValueComponent.Formula', 
            editable: true,
            valueGetter: params => params.data.ValueComponent?.Formula || 'N/A',
            valueSetter: function(params) {
                if (!params.data.ValueComponent) params.data.ValueComponent = {};
                params.data.ValueComponent.Formula = params.newValue;
                return true;
            }
        },
        {
            headerName: 'Actions',
            cellRenderer: function(params) {
                const container = document.createElement('div');
                container.style.display = 'flex';
                container.style.gap = '5px';
                
                const addButton = document.createElement('button');
                addButton.innerHTML = '<i class="fas fa-plus"></i>';
                addButton.classList.add('add-row-button', 'btn', 'btn-success', 'btn-sm');
                addButton.style.padding = '2px 5px';
                addButton.onclick = function() {
                    addRowAt(params.node.rowIndex);
                };
                
                const deleteButton = document.createElement('button');
                deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
                deleteButton.classList.add('delete-row-button', 'btn', 'btn-danger', 'btn-sm');
                deleteButton.style.padding = '2px 5px';
                deleteButton.onclick = function() {
                    deleteRow(params.node.rowIndex);
                };
                
                container.appendChild(addButton);
                container.appendChild(deleteButton);
                return container;
            },
            editable: false,
            sortable: false,
            filter: false,
            suppressMenu: true
        }
    ];

    // Configuración del grid
    const gridOptions = {
        columnDefs: columnDefs,
        rowData: data,
        rowDragManaged: true,
        animateRows: true,
        suppressRowClickSelection: true,
        components: {
            checkboxCellRenderer: function(params) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = params.value;
                checkbox.onchange = function() {
                    params.node.setDataValue(params.colDef.field, checkbox.checked);
                    gridApi.refreshCells({force: true});
                };
                return checkbox;
            }
        },
        defaultColDef: {
            resizable: true,
            sortable: false,
            filter: false,
            editable: true,
            flex: 1,
            minWidth: 100
        },
        onGridReady: function(params) {
            gridApi = params.api;
            gridColumnApi = params.columnApi;
            params.api.sizeColumnsToFit();
        },
        onFirstDataRendered: function(params) {
            params.api.sizeColumnsToFit();
        }
    };

    // Limpiar el contenedor y crear el grid
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = '';
    
    // Asegurarse de que agGrid está disponible
    if (typeof agGrid !== 'undefined') {
        new agGrid.Grid(tableContainer, gridOptions);
        
        // Mostrar el botón de agregar fila
        document.getElementById('addRowButton').style.display = 'block';
    } else {
        console.error('AG Grid no está cargado correctamente');
    }
}

// Función para eliminar una fila
function deleteRow(index) {
    if (confirm('¿Estás seguro de que quieres eliminar esta fila?')) {
        jsonData.splice(index, 1);
        displayData(jsonData);
    }
}

// Función para agregar una fila al final
function addRow() {
    const newRow = {
        Uid: '',
        Unit: 'n/a',
        TypeLogData: 0,
        CurveDescription: '',
        Mnemonic: '',
        IsIndex: false,
        IndexComponent: {
            SourceComponents: [{}],
            Formula: null,
            Filter: null
        },
        ValueComponent: {
            SourceComponents: [{}],
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
}

// Función para agregar una fila en una posición específica
function addRowAt(index) {
    const newRow = {
        Uid: '',
        Unit: 'n/a',
        TypeLogData: 0,
        CurveDescription: '',
        Mnemonic: '',
        IsIndex: false,
        IndexComponent: {
            SourceComponents: [{}],
            Formula: null,
            Filter: null
        },
        ValueComponent: {
            SourceComponents: [{}],
            Formula: null,
            Filter: null
        },
        SaveInterval: 5,
        IsArray: false,
        IsArrayEnble: true,
        IsEnabled: false
    };
    jsonData.splice(index + 1, 0, newRow);
    displayData(jsonData);
}

// Función para guardar los datos
function saveData() {
    if (!gridApi) {
        alert('La tabla no se ha cargado correctamente. Por favor, carga los datos primero.');
        return;
    }

    if (!jsonData || jsonData.length === 0) {
        alert('No hay datos para guardar.');
        return;
    }

    const orderedData = [];
    gridApi.forEachNode(node => {
        orderedData.push(node.data);
    });

    const jsonStr = JSON.stringify(orderedData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mapeo.curvedefs';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}