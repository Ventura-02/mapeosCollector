function displayData(data) {
    jsonData = data;

    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = '';

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

    const thDelete = document.createElement('th');
    thDelete.textContent = 'Acciones';
    headerRow.appendChild(thDelete);

    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);

    data.forEach((item, rowIndex) => {
        const row = document.createElement('tr');

        const deleteTd = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
        deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
        deleteButton.onclick = function () {
            deleteRow(rowIndex);
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

                    td.contentEditable = true;
                    td.addEventListener('input', function () {
                        const sources = td.textContent.split(',').map(entry => {
                            const parts = entry.trim().split(' ');
                            return { Source: parts[0], Name: parts[1] };
                        });
                        jsonData[rowIndex][header].SourceComponents = sources;
                        console.log(`Actualizando ${header}:`, jsonData[rowIndex][header]);
                    });
                } else {
                    td.textContent = 'N/A';
                    td.contentEditable = true;
                    td.addEventListener('input', function () {
                        const sources = td.textContent.split(',').map(entry => {
                            const parts = entry.trim().split(' ');
                            return { Source: parts[0], Name: parts[1] };
                        });
                        jsonData[rowIndex][header].SourceComponents = sources;
                        console.log(`Actualizando ${header}:`, jsonData[rowIndex][header]);
                    });
                }
            } else if (header === 'Formula') {
                td.textContent = item[header] || '';
                td.contentEditable = true;
                td.addEventListener('input', function () {
                    jsonData[rowIndex][header] = td.textContent;
                    console.log(`Actualizando ${header}:`, jsonData[rowIndex][header]);
                });
            } else if (typeof item[header] === 'boolean') {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = item[header];
                checkbox.addEventListener('change', function () {
                    jsonData[rowIndex][header] = checkbox.checked;
                    console.log(`Actualizando ${header}:`, jsonData[rowIndex][header]);
                });
                td.appendChild(checkbox);
            } else {
                td.textContent = item[header];
                td.contentEditable = true;
                td.addEventListener('input', function () {
                    jsonData[rowIndex][header] = td.textContent;
                    console.log(`Actualizando ${header}:`, jsonData[rowIndex][header]);
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

function saveJson() {
    jsonData.forEach(item => {
        console.log('Guardando datos para el UID:', item.Uid);
        console.log('IndexComponent SourceComponents:', item.IndexComponent.SourceComponents);
        console.log('ValueComponent SourceComponents:', item.ValueComponent.SourceComponents);
    });

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'edited_data.curvedefs';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function exportToXlsx() {
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    XLSX.writeFile(workbook, 'datos.xlsx');
}
