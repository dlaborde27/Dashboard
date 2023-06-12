(function () {
    let URL = 'https://api.open-meteo.com/v1/forecast?latitude=-2.14&longitude=-79.97&hourly=temperature_2m&timezone=auto';
    fetch( URL )
    .then(response => response.json())
    .then(data => {
        console.log(data)
        let timezone = data['timezone']
        document.querySelector('#timezone').textContent = timezone
    })
    .catch(console.error);
})();