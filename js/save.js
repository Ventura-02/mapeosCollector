// Este archivo contiene la lógica para guardar el JSON editado

function saveJson() {
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'datos_editados.json';
    link.click();
}
