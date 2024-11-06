function exportToXlsx() {
    if (!jsonData || jsonData.length === 0) {
        alert('No hay datos para exportar.');
        return;
    }

    // Procesar los datos para exportación
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
                : 'N/A',
            ValueComponentFormula: item.ValueComponent && item.ValueComponent.Formula ? item.ValueComponent.Formula : 'N/A'
        };
    });

    // Filtrar las columnas seleccionadas para exportación
    const filteredData = processedData.map(row => {
        const newRow = {};
        if (document.getElementById('exportUid').checked) newRow.Uid = row.Uid;
        if (document.getElementById('exportUnit').checked) newRow.Unit = row.Unit;
        if (document.getElementById('exportTypeLogData').checked) newRow.TypeLogData = row.TypeLogData;
        if (document.getElementById('exportCurveDescription').checked) newRow.CurveDescription = row.CurveDescription;
        if (document.getElementById('exportMnemonic').checked) newRow.Mnemonic = row.Mnemonic;
        if (document.getElementById('exportIsIndex').checked) newRow.IsIndex = row.IsIndex;
        if (document.getElementById('exportSaveInterval').checked) newRow.SaveInterval = row.SaveInterval;
        if (document.getElementById('exportIsEnabled').checked) newRow.IsEnabled = row.IsEnabled;
        if (document.getElementById('exportIndexComponentSource').checked) newRow.IndexComponentSource = row.IndexComponentSource;
        if (document.getElementById('exportIndexComponentName').checked) newRow.IndexComponentName = row.IndexComponentName;
        if (document.getElementById('exportValueComponentSource').checked) newRow.ValueComponentSource = row.ValueComponentSource;
        if (document.getElementById('exportValueComponentName').checked) newRow.ValueComponentName = row.ValueComponentName;
        return newRow;
    });

    // Crear hoja de Excel y exportar
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, 'mapeos_colector.xlsx');
}

function showExportOptions() {
    document.getElementById('exportModal').classList.add('show');
    document.getElementById('modalOverlay').classList.add('show');
}

function closeExportOptions() {
    document.getElementById('exportModal').classList.remove('show');
    document.getElementById('modalOverlay').classList.remove('show');
}