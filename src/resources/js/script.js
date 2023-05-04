// For use with the clubs display page, clubs.ejs
// Sorts the table in alphabetical order by the column specified by the user input
// Stored in the variable "sort"
function sortTable() {
    var input, sort, table, tr, columnNum, i, x, y, switching, shouldSwitch, sortedTable;
    table = document.getElementById("clubTable");

    input = document.getElementById("sort");
    sort = input.value.toUpperCase();
    switching = true;
    if (sort == "NAME"){
        columnNum = 0;
    }
    else if (sort == "CATEGORY"){
        columnNum = 2;
    }
    else if (sort == "MEMBERS"){
        columnNum = 5;
    }
    // Avoid using DOM manipulation inside a loop, put all the elements of the table into the array sortedTable
    sortedTable = [];
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        sortedTable.push(tr[i]);
    }
    // Sort the array
    sortedTable.sort(function(a, b) {
        x = a.getElementsByTagName("td")[columnNum];
        y = b.getElementsByTagName("td")[columnNum];
        if (sort == "MEMBERS"){
            return Number(y.innerHTML.toLowerCase()) - Number(x.innerHTML.toLowerCase());
        }
        else {
            return x.innerHTML.toLowerCase().localeCompare(y.innerHTML.toLowerCase());
        }
    });
    // Clear table
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    // Add the sorted elements back into the table
    for (i = 0; i < sortedTable.length; i++) {
        table.appendChild(sortedTable[i]);
    }
}

// For use with the clubs display page, clubs.ejs
// Filters the table by the user input stored in the id "category"
function filterTable() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("category");
    filter = input.value.toUpperCase();
    table = document.getElementById("clubTable");
    tr = table.getElementsByTagName("tr");
    if (filter == "ALL") {
        for (i = 0; i < tr.length; i++) {
            tr[i].style.display = "";
        }
    } else {
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[2];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
}

// For use with the clubs display page, clubs.ejs
// Searches the table by the user input
function searchTable() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchBar");
    filter = input.value.toUpperCase();
    table = document.getElementById("table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

// For use with the clubs display page, clubs.ejs
// Toggles between the table and card view
function toggleView() {
    var x = document.getElementById("table");
    var y = document.getElementById("cards");
    if (x.style.display === "none") {
        x.style.display = "block";
        y.style.display = "none";
    } else {
        x.style.display = "none";
        y.style.display = "block";
    }
}

function reverseTable() {
    // Reorder the rows of the table in reverse order
}