const myTable = document.getElementById("tableBody")

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
        const filterButton = document.getElementById("choice")
        filterButton.addEventListener("change", () => {
            for (let i = 0; i < j ; i++) {
                document.getElementById("tableBody").deleteRow(0)
            }
            j = 0
            if (filterButton.options[filterButton.selectedIndex].value == "all") {
                data.forEach(datum => {
                    fillRow(datum, j)
                    colorRating(datum.rating, j)
                    j++
                })
            }
            else {
                data.forEach(datum => {
                    if (datum.region == filterButton.options[filterButton.selectedIndex].value) {
                        fillRow(datum, j)
                        colorRating(datum.rating, j)
                        j++
                    }
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


