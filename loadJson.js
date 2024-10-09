let jsonData = [];  // Definir jsonData a nivel global

function loadJson() {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();

    fileInput.onchange = function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const content = e.target.result;
            try {
                jsonData = JSON.parse(content); // Parsear el contenido como JSON
                displayData(jsonData); // Mostrar los datos en la tabla
                document.getElementById('addRowButton').style.display = 'block'; // Mostrar el botón de añadir fila
            } catch (error) {
                alert('Error al cargar el archivo: ' + error.message);
            }
        };

        if (file) {
            reader.readAsText(file);
        }
    };
}
