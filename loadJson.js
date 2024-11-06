function loadJson() {
    const fileInput = document.getElementById('fileInput');
    fileInput.accept = '.curvedefs';
    fileInput.click();
    fileInput.onchange = function (event) {
        const file = event.target.files[0];
        if (file && file.name.endsWith('.curvedefs')) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const content = e.target.result;
                try {
                    jsonData = JSON.parse(content);
                    console.log('Datos cargados:', jsonData);
                    displayData(jsonData);
                    document.getElementById('addRowButton').style.display = 'block';
                    document.getElementById('fileNameDisplay').textContent = `Archivo cargado: ${file.name}`;
                    fileNameDisplay.style.display = 'block';
                } catch (error) {
                    alert('Error al cargar el archivo: ' + error.message);
                }
            };
            reader.readAsText(file);
        } else {
            alert('Por favor, selecciona un archivo con la extensión .curvedefs');
        }
    };
}