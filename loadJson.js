let jsonData = [];

function loadJson() {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();

    fileInput.onchange = function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const content = e.target.result;
            try {
                jsonData = JSON.parse(content);
                displayData(jsonData);
                document.getElementById('addRowButton').style.display = 'block';
            } catch (error) {
                alert('Error al cargar el archivo: ' + error.message);
            }
        };

        if (file) {
            reader.readAsText(file);
        }
    };
}
