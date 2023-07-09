let plotLine = (data) => {
    const ctx = document.getElementById('myChart');

    const dataset = {
        labels: data.hourly.time, /* ETIQUETA DE DATOS */
        datasets: [{
            label: 'Temperatura semanal', /* ETIQUETA DEL GRÁFICO */
            data: data.hourly.temperature_2m, /* PODEMOS PONER TAMBIEN DATA[HOURLY][...] */ /* ARREGLO DE DATOS */
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    const config = {
        type: 'line',
        data: dataset,
    };

    const chart = new Chart(ctx, config)
}

let plotBar = (data) => {
    const ctx = document.getElementById('myChartBar');

    const dataset = {
        labels: data.daily.time, /* ETIQUETA DE DATOS */
        datasets: [{
            label: 'indice de uv maximo', /* ETIQUETA DEL GRÁFICO */
            data: data.daily.uv_index_max, /* PODEMOS PONER TAMBIEN DATA[HOURLY][...] */ /* ARREGLO DE DATOS */
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)'
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
              ],
              borderWidth: 3
        }]
    };

    const config = {
        type: 'bar',
        data: dataset,
    };

    const chart2 = new Chart(ctx, config)
}

let loadChartAndCard = (data) => {
    let timezone = data['timezone']
    document.querySelector('#timezone').textContent = timezone
    plotLine(data)
    plotBar(data)
}

let loadHTML = (html) => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(html, "text/html");
    let contenedorMareas = xml.getElementsByClassName('container-fluid')[0];
    let contenedorHTML = document.getElementById('table-container');
    contenedorHTML.innerHTML = contenedorMareas.innerHTML;
}

let loadMeteo = () => {
    let meteo = localStorage.getItem('meteo');
    if(meteo != null) {
        loadChartAndCard(JSON.parse(meteo))
        return;
    }
    let URL = 'https://api.open-meteo.com/v1/forecast?latitude=-2.20&longitude=-79.89&hourly=temperature_2m&daily=uv_index_max&timezone=auto';
    fetch(URL)
        .then(response => response.json())
        .then(data => {
            /* GUARDAR DATA EN LA MEMORIA */
            localStorage.setItem("meteo", JSON.stringify(data))
            loadChartAndCard(data)
            })
        .catch(console.error);
}

let loadInocar = () => {
    let inocar = localStorage.getItem('inocar');
    if(inocar != null) {
        loadHTML(inocar);
        return;
    }
    let url_proxy = 'https://cors-anywhere.herokuapp.com/'
    let URL = url_proxy + 'https://www.inocar.mil.ec/mareas/consultan.php';
    fetch(URL)
        .then(response => response.text())
        .then(data => {
            /* GUARDAR DATA EN LA MEMORIA */
            localStorage.setItem("inocar", data);
            loadHTML(data);
            })
        .catch(console.error);
}

let actualizarInformacion = () => {
    localStorage.removeItem('meteo');
    localStorage.removeItem('inocar');
    location.reload();
}

let botonActualizar = document.getElementById('actualizar');
botonActualizar.addEventListener('click', actualizarInformacion);
    
(function () {
    loadMeteo();
    loadInocar();
})();
