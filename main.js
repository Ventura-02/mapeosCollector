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

    const headers = Object.keys(data[0]);
    const headerRow = document.createElement('tr');

    // Agregar un encabezado para el botón de eliminar
    const thDelete = document.createElement('th');
    thDelete.textContent = 'Acciones';  // Columna para los botones de eliminar
    headerRow.appendChild(thDelete);

    // Agregar las columnas del JSON como encabezados
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });

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

        headers.forEach(header => {
            const td = document.createElement('td');

            if (header === 'IndexComponent' || header === 'ValueComponent') {
                const component = item[header];
                if (component && component.SourceComponents.length > 0) {
                    const sourceEntries = component.SourceComponents.map(c => `${c.Source} ${c.Name}`).join(', ');
                    td.textContent = sourceEntries;

                    td.contentEditable = true;  // Hacer la celda editable
                    td.addEventListener('input', function () {
                        const sources = td.textContent.split(',').map(entry => {
                            const parts = entry.trim().split(' ');
                            return { Source: parts[0], Name: parts[1] }; // Ajustar el formato esperado
                        });
                        jsonData[rowIndex][header].SourceComponents = sources;  // Actualizar el JSON
                        console.log(`Actualizando ${header}:`, jsonData[rowIndex][header]); // Mensaje de depuración
                    });
                } else {
                    td.textContent = 'N/A';
                    td.contentEditable = true; // Hacer la celda editable
                    td.addEventListener('input', function () {
                        const sources = td.textContent.split(',').map(entry => {
                            const parts = entry.trim().split(' ');
                            return { Source: parts[0], Name: parts[1] }; // Ajustar el formato esperado
                        });
                        jsonData[rowIndex][header].SourceComponents = sources;  // Actualizar el JSON
                        console.log(`Actualizando ${header}:`, jsonData[rowIndex][header]); // Mensaje de depuración
                    });
                }
            } else if (header === 'Formula') {
                td.textContent = item[header] || ''; // Mostrar el valor de Formula
                td.contentEditable = true; // Hacer la celda editable
                td.addEventListener('input', function () {
                    jsonData[rowIndex][header] = td.textContent; // Guardar cambios en la Formula
                    console.log(`Actualizando ${header}:`, jsonData[rowIndex][header]); // Mensaje de depuración
                });
            } else if (typeof item[header] === 'boolean') {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = item[header];
                checkbox.addEventListener('change', function () {
                    jsonData[rowIndex][header] = checkbox.checked;
                    console.log(`Actualizando ${header}:`, jsonData[rowIndex][header]); // Mensaje de depuración
                });
                td.appendChild(checkbox);
            } else {
                td.textContent = item[header];
                td.contentEditable = true;
                td.addEventListener('input', function () {
                    jsonData[rowIndex][header] = td.textContent;
                    console.log(`Actualizando ${header}:`, jsonData[rowIndex][header]); // Mensaje de depuración
                });
            }

            row.appendChild(td);
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

function saveJson() {
    // Comprobar y mostrar el contenido de SourceComponents antes de guardar
    jsonData.forEach(item => {
        console.log('Guardando datos para el UID:', item.Uid);
        console.log('IndexComponent SourceComponents:', item.IndexComponent.SourceComponents);
        console.log('ValueComponent SourceComponents:', item.ValueComponent.SourceComponents);
    });

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'edited_data.curvedefs';  // Nombre del archivo a descargar
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);  // Liberar el objeto URL
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