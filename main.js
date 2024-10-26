function displayData(data) {
    jsonData = data;  // Guardar el JSON en la variable global

    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = '';  // Limpiar contenido previo

    if (data.length === 0) {
        tableContainer.innerHTML = '<p>No hay datos para mostrar.</p>';
        return;
    }

    const table = document.createElement('table');
    table.border = '1';
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    headerRow.appendChild(document.createElement('th')).textContent = 'Acciones';  // Columna para los botones de eliminar
    headerRow.appendChild(document.createElement('th')).textContent = 'Uid';
    headerRow.appendChild(document.createElement('th')).textContent = 'Unit';
    headerRow.appendChild(document.createElement('th')).textContent = 'TypeLogData';
    headerRow.appendChild(document.createElement('th')).textContent = 'CurveDescription';
    headerRow.appendChild(document.createElement('th')).textContent = 'Mnemonic';
    headerRow.appendChild(document.createElement('th')).textContent = 'IsIndex';
    headerRow.appendChild(document.createElement('th')).textContent = 'SaveInterval';
    headerRow.appendChild(document.createElement('th')).textContent = 'IsEnabled';
    headerRow.appendChild(document.createElement('th')).textContent = 'Index Source';
    headerRow.appendChild(document.createElement('th')).textContent = 'Index Name';
    headerRow.appendChild(document.createElement('th')).textContent = 'Value Source';
    headerRow.appendChild(document.createElement('th')).textContent = 'Value Name';
    headerRow.appendChild(document.createElement('th')).textContent = 'Index Formula'; // Nueva columna para Formula de IndexComponent
    headerRow.appendChild(document.createElement('th')).textContent = 'Value Formula'; // Nueva columna para Formula de ValueComponent

    thead.appendChild(headerRow);

    data.forEach((item, rowIndex) => {
        const row = document.createElement('tr');

        // Crear celda para el botón de eliminar al principio de la fila
        const deleteTd = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="bi bi-trash"></i>'; // Icono de basura de Bootstrap
        deleteButton.classList.add('btn', 'btn-danger', 'btn-sm'); // Clase de Bootstrap para estilizar el botón
        deleteButton.onclick = function () {
            deleteRow(rowIndex);  // Llamar a la función para eliminar la fila
        };
        deleteTd.appendChild(deleteButton);
        row.appendChild(deleteTd);

        // Agregar valores de las propiedades del objeto y hacer las celdas editables
        const editableFields = [
            item.Uid,
            item.Unit,
            item.TypeLogData,
            item.CurveDescription,
            item.Mnemonic,
            item.IsIndex,
            item.SaveInterval,
            item.IsEnabled,
            item.IndexComponent.SourceComponents.length > 0 ? item.IndexComponent.SourceComponents[0].Source : 'N/A',
            item.IndexComponent.SourceComponents.length > 0 ? item.IndexComponent.SourceComponents[0].Name : 'N/A',
            item.ValueComponent.SourceComponents.length > 0 ? item.ValueComponent.SourceComponents[0].Source : 'N/A',
            item.ValueComponent.SourceComponents.length > 0 ? item.ValueComponent.SourceComponents[0].Name : 'N/A',
            item.IndexComponent.Formula ? item.IndexComponent.Formula : '', // Mostrar la fórmula de IndexComponent
            item.ValueComponent.Formula ? item.ValueComponent.Formula : '' // Mostrar la fórmula de ValueComponent
        ];

        editableFields.forEach((value, cellIndex) => {
            const cell = document.createElement('td');
            cell.contentEditable = true; // Hacer la celda editable
            cell.textContent = value;

            // Actualizar el JSON al editar la celda
            cell.addEventListener('input', function () {
                switch (cellIndex) {
                    case 0: item.Uid = cell.textContent; break;
                    case 1: item.Unit = cell.textContent; break;
                    case 2: item.TypeLogData = cell.textContent; break;
                    case 3: item.CurveDescription = cell.textContent; break;
                    case 4: item.Mnemonic = cell.textContent; break;
                    case 5: item.IsIndex = cell.textContent === 'true'; break;
                    case 6: item.SaveInterval = cell.textContent; break;
                    case 7: item.IsEnabled = cell.textContent === 'true'; break;
                    case 8:
                        if (!item.IndexComponent) item.IndexComponent = { SourceComponents: [] };
                        if (!item.IndexComponent.SourceComponents[0]) item.IndexComponent.SourceComponents[0] = { Source: '', Name: '' };
                        item.IndexComponent.SourceComponents[0].Source = cell.textContent;
                        break;
                    case 9:
                        if (!item.IndexComponent) item.IndexComponent = { SourceComponents: [] };
                        if (!item.IndexComponent.SourceComponents[0]) item.IndexComponent.SourceComponents[0] = { Source: '', Name: '' };
                        item.IndexComponent.SourceComponents[0].Name = cell.textContent;
                        break;
                    case 10:
                        if (!item.ValueComponent) item.ValueComponent = { SourceComponents: [] };
                        if (!item.ValueComponent.SourceComponents[0]) item.ValueComponent.SourceComponents[0] = { Source: '', Name: '' };
                        item.ValueComponent.SourceComponents[0].Source = cell.textContent;
                        break;
                    case 11:
                        if (!item.ValueComponent) item.ValueComponent = { SourceComponents: [] };
                        if (!item.ValueComponent.SourceComponents[0]) item.ValueComponent.SourceComponents[0] = { Source: '', Name: '' };
                        item.ValueComponent.SourceComponents[0].Name = cell.textContent;
                        break;
                    case 12:
                        if (!item.IndexComponent) item.IndexComponent = {};
                        item.IndexComponent.Formula = cell.textContent;
                        break;
                    case 13:
                        if (!item.ValueComponent) item.ValueComponent = {};
                        item.ValueComponent.Formula = cell.textContent;
                        break;
                }
            });
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    tableContainer.appendChild(table);
}

function deleteRow(index) {
    if (confirm('¿Estás seguro de que quieres eliminar esta fila?')) {
        jsonData.splice(index, 1);  // Eliminar el elemento del array JSON
        displayData(jsonData);  // Recargar la tabla con los datos actualizados
    }
}

function addRow() {
    const newRow = {  // Crear un nuevo objeto para la nueva fila
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

    jsonData.push(newRow);  // Agregar la nueva fila al JSON
    displayData(jsonData);  // Recargar la tabla
    console.log('Fila agregada:', newRow); // Mensaje de depuración
}

function saveData() {
    const tableRows = document.querySelectorAll('#tableContainer table tbody tr');
    jsonData.forEach((item, rowIndex) => {
        const row = tableRows[rowIndex];
        const cells = row.cells;

        item.Uid = cells[1].textContent;
        item.Unit = cells[2].textContent;
        item.TypeLogData = cells[3].textContent;
        item.CurveDescription = cells[4].textContent;
        item.Mnemonic = cells[5].textContent;
        item.IsIndex = cells[6].textContent === 'true';
        item.SaveInterval = cells[7].textContent;
        item.IsEnabled = cells[8].textContent === 'true';

        // Actualizar IndexComponent.SourceComponents
        item.IndexComponent.SourceComponents = [
            {
                Source: cells[9].textContent,
                Name: cells[10].textContent,
            },
        ];

        // Actualizar ValueComponent.SourceComponents
        item.ValueComponent.SourceComponents = [
            {
                Source: cells[11].textContent,
                Name: cells[12].textContent,
            },
        ];
    });

    // Convertir jsonData a JSON y descargar como archivo
    const jsonStr = JSON.stringify(jsonData);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mapeo.curvedefs';
    a.click();
    URL.revokeObjectURL(url);
}

function exportToXlsx() {
    // Crear una copia del JSON para modificar cómo se mostrarán los datos
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

    // Crear la hoja de Excel sin las columnas vacías (IndexCompor y ValueCompor)
    const worksheet = XLSX.utils.json_to_sheet(processedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');

    // Generar archivo y descargar
    XLSX.writeFile(workbook, 'datos.xlsx');
}