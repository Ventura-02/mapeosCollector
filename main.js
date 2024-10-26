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
    headerRow.appendChild(document.createElement('th')).textContent = 'Index Formula';
    headerRow.appendChild(document.createElement('th')).textContent = 'Value Source';
    headerRow.appendChild(document.createElement('th')).textContent = 'Value Name';
    headerRow.appendChild(document.createElement('th')).textContent = 'Value Formula';

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

        // Agregar valores de las propiedades del objeto en el nuevo orden
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
            item.IndexComponent.Formula ? item.IndexComponent.Formula : '',
            item.ValueComponent.SourceComponents.length > 0 ? item.ValueComponent.SourceComponents[0].Source : 'N/A',
            item.ValueComponent.SourceComponents.length > 0 ? item.ValueComponent.SourceComponents[0].Name : 'N/A',
            item.ValueComponent.Formula ? item.ValueComponent.Formula : ''
        ];

        editableFields.forEach((value, cellIndex) => {
            const cell = document.createElement('td');

            // Manejar las celdas de IsIndex e IsEnabled como checkboxes
            if (cellIndex === 5 || cellIndex === 7) { // IsIndex o IsEnabled
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = value === true; // Asegúrate de que sea un booleano
                checkbox.oninput = function () { // Corregido aquí
                    switch (cellIndex) {
                        case 5: item.IsIndex = checkbox.checked; break;
                        case 7: item.IsEnabled = checkbox.checked; break;
                    }
                };
                cell.appendChild(checkbox);
            } else {
                cell.textContent = value;
                cell.contentEditable = 'true'; // Permitir edición de la celda
                cell.oninput = function () { // Actualizar el objeto JSON cuando se realiza un cambio
                    switch (cellIndex) {
                        case 0: item.Uid = cell.textContent; break;
                        case 1: item.Unit = cell.textContent; break;
                        case 2: item.TypeLogData = cell.textContent; break;
                        case 3: item.CurveDescription = cell.textContent; break;
                        case 4: item.Mnemonic = cell.textContent; break;
                        case 6: item.SaveInterval = cell.textContent; break;
                        case 8: item.IndexComponent.SourceComponents.length > 0 ? item.IndexComponent.SourceComponents[0].Source = cell.textContent : 'N/A'; break;
                        case 9: item.IndexComponent.SourceComponents.length > 0 ? item.IndexComponent.SourceComponents[0].Name = cell.textContent : 'N/A'; break;
                        case 10: item.IndexComponent.Formula = cell.textContent; break;
                        case 11: item.ValueComponent.SourceComponents.length > 0 ? item.ValueComponent.SourceComponents[0].Source = cell.textContent : 'N/A'; break;
                        case 12: item.ValueComponent.SourceComponents.length > 0 ? item.ValueComponent.SourceComponents[0].Name = cell.textContent : 'N/A'; break;
                        case 13: item.ValueComponent.Formula = cell.textContent; break;
                    }
                };
            }

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
    const savedData = []; // Arreglo para almacenar los datos guardados

    tableRows.forEach((row, rowIndex) => {
        const cells = row.cells;

        // Crear un nuevo objeto basado en la estructura deseada
        const item = {
            Uid: cells[1].textContent,
            Unit: cells[2].textContent,
            TypeLogData: parseInt(cells[3].textContent) || 0, // Asegurarse de que sea un número
            CurveDescription: cells[4].textContent,
            Mnemonic: cells[5].textContent,
            IsIndex: cells[6].querySelector('input[type="checkbox"]').checked, // Obtener el estado del checkbox
            IndexComponent: {
                SourceComponents: [
                    {
                        Source: cells[9].textContent,
                        Name: cells[10].textContent,
                    }
                ],
                Formula: cells[11].textContent || null,
                Filter: null // Asumiendo que no se usa, puedes ajustar esto si es necesario
            },
            ValueComponent: {
                SourceComponents: [
                    {
                        Source: cells[12].textContent,
                        Name: cells[13].textContent,
                    }
                ],
                Formula: cells[14].textContent || null,
                Filter: null // Asumiendo que no se usa, puedes ajustar esto si es necesario
            },
            SaveInterval: parseFloat(cells[7].textContent) || 0.0, // Asegurarse de que sea un número
            IsArray: false, // Puedes ajustar esto según tu lógica
            IsArrayEnble: true, // Puedes ajustar esto según tu lógica
            IsEnabled: cells[8].querySelector('input[type="checkbox"]').checked // Obtener el estado del checkbox
        };

        savedData.push(item); // Agregar el objeto a la lista de datos guardados
    });

    // Convertir savedData a JSON y descargar como archivo
    const jsonStr = JSON.stringify(savedData, null, 2); // Usar un formato legible
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