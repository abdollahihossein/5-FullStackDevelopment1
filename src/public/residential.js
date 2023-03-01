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
            row.insertCell(3).innerHTML = datum.rating
            if (datum.rating == 100) {
                myTable.rows[j].cells[3].style.color="#299429"
            } else if ((90 <= datum.rating) && (datum.rating < 100)) {
                myTable.rows[j].cells[3].style.color="#207cd7"
            } else {
                myTable.rows[j].cells[3].style.color="#8314c7"
            }
            row.insertCell(4).innerHTML = `$${datum.fee}`
            j++
        });
        // Filtering the "Region" column:
        const filterButton = document.getElementById("choice")
        filterButton.addEventListener("change", () => {
            for (let i = 0; i < j ; i++) {
                document.getElementById("tableBody").deleteRow(0)
            }
            j = 0
            if (filterButton.options[filterButton.selectedIndex].value == "all") {
                data.forEach(datum => {
                    let row2 = myTable.insertRow()
                    row2.insertCell(0).innerHTML = j + 1
                    row2.insertCell(1).innerHTML = datum.first_name
                    row2.insertCell(2).innerHTML = datum.last_name
                    row2.insertCell(3).innerHTML = datum.rating
                    if (datum.rating == 100) {
                        myTable.rows[j].cells[3].style.color="#299429"
                    } else if ((90 <= datum.rating) && (datum.rating < 100)) {
                        myTable.rows[j].cells[3].style.color="#207cd7"
                    } else {
                        myTable.rows[j].cells[3].style.color="#8314c7"
                    }
                    row2.insertCell(4).innerHTML = datum.fee
                    j++
                })
            }
            else {
                data.forEach(datum => {
                    if (datum.region == filterButton.options[filterButton.selectedIndex].value) {
                        let row2 = myTable.insertRow()
                        row2.insertCell(0).innerHTML = j + 1
                        row2.insertCell(1).innerHTML = datum.first_name
                        row2.insertCell(2).innerHTML = datum.last_name
                        row2.insertCell(3).innerHTML = datum.rating
                        if (datum.rating == 100) {
                            myTable.rows[j].cells[3].style.color="#299429"
                        } else if ((90 <= datum.rating) && (datum.rating < 100)) {
                            myTable.rows[j].cells[3].style.color="#207cd7"
                        } else {
                            myTable.rows[j].cells[3].style.color="#8314c7"
                        }
                        row2.insertCell(4).innerHTML = datum.fee
                        j++
                    }
                })
            }
        })
    })
    



