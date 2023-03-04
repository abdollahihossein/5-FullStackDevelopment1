const myTable = document.getElementById("tableBody")
const filterButton = document.getElementById("choice")

fetch('http://localhost:3004/agents')
    .then((res) => res.json())
    .then((data) => {
        let j = 0
        data.forEach(datum => {
            fillRow(datum, j)
            colorRating(datum.rating, j)
            j++
        });
        // Filtering Agents by "Region":
        filterButton.addEventListener("change", () => {
            for (let i = 0; i < j ; i++) {
                document.getElementById("tableBody").deleteRow(0)
            }
            j = 0
            let selectedRegion = filterButton.options[filterButton.selectedIndex].value
            if (selectedRegion == "all") {
                data.forEach(datum => {
                    fillRow(datum, j)
                    colorRating(datum.rating, j)
                    j++
                })
            }
            else {
                fetch('http://localhost:3004/sort-region', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "region": selectedRegion,
                        data
                    })
                })
                    .then((res) => res.json())
                    .then((filtereddata) => {
                        filtereddata.forEach(datum => {
                            fillRow(datum, j)
                            colorRating(datum.rating, j)
                            j++
                        })
                    })
            }
        })
    })
    
const fillRow = (element, j) => {
    let row = myTable.insertRow()
    row.insertCell(0).innerHTML = j + 1
    row.insertCell(1).innerHTML = element.first_name
    row.insertCell(2).innerHTML = element.last_name
    row.insertCell(3).innerHTML = element.rating
    row.insertCell(4).innerHTML = `$${element.fee}`
}

const colorRating = (rating, j) => {
    if (rating == 100) {
        myTable.rows[j].cells[3].style.color="#299429"
    } else if ((90 <= rating) && (rating < 100)) {
        myTable.rows[j].cells[3].style.color="#207cd7"
    } else {
        myTable.rows[j].cells[3].style.color="#8314c7"
    }
}
