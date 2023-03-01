fetch('http://localhost:3004/agents')
    .then((res) => res.json())
    .then((data) => {
        let j = 0
        const myTable = document.getElementById("tableBody")
        data.forEach(datum => {
            let row = myTable.insertRow()
            row.insertCell(0).innerHTML = j + 1
            row.insertCell(1).innerHTML = datum.first_name
            row.insertCell(2).innerHTML = datum.last_name
            row.insertCell(3).innerHTML = datum.region
            row.insertCell(4).innerHTML = datum.rating
            row.insertCell(5).innerHTML = `$${datum.fee}`
            j++
        });
    })


