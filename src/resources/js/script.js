// For use with the clubs display page, clubs.ejs
// Sorts the table in alphabetical order by the column specified by the user input
// Stored in the variable "sort"
function sortTable() {
    //document.getElementById("reverse").checked = false;
    var cards = document.getElementByID("cardView").checked;

    var input, sort, table, tr, columnNum, i, x, y, switching, shouldSwitch;
    if (cards) table = document.getElementById("cards");
    else table = document.getElementById("clubTable");

    input = document.getElementById("sort");
    sort = input.value.toUpperCase();
    switching = true;
    if (cards) {
        while(switching) {
            switching = false;
            tr = table.getElementsByTagName("div");
            for (i = 0; i < (tr.length - 1); i++) {
                shouldSwitch = false;
                x = tr[i].getElementsByTagName("h5")[0];
                y = tr[i + 1].getElementsByTagName("h5")[0];
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
            if (shouldSwitch) {
                tr[i].parentNode.insertBefore(tr[i + 1], tr[i]);
                switching = true;
            }
        }
    }
    else if (sort == "NAME"){
        columnNum = 0;
        while(switching) {
            switching = false;
            tr = table.getElementsByTagName("tr");
            for (i = 0; i < (tr.length - 1); i++) {
                shouldSwitch = false;
                x = tr[i].getElementsByTagName("td")[columnNum];
                y = tr[i + 1].getElementsByTagName("td")[columnNum];
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
            if (shouldSwitch) {
                tr[i].parentNode.insertBefore(tr[i + 1], tr[i]);
                switching = true;
            }
        }
    }
    else if (sort == "CATEGORY"){
        columnNum = 2;
        while(switching) {
            switching = false;
            tr = table.getElementsByTagName("tr");
            for (i = 0; i < (tr.length - 1); i++) {
                shouldSwitch = false;
                x = tr[i].getElementsByTagName("td")[columnNum];
                y = tr[i + 1].getElementsByTagName("td")[columnNum];
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
            if (shouldSwitch) {
                tr[i].parentNode.insertBefore(tr[i + 1], tr[i]);
                switching = true;
            }
        }
    }
    else if (sort == "MEMBERS"){
        columnNum = 4;
        while(switching) {
            switching = false;
            tr = table.getElementsByTagName("tr");
            for (i = 0; i < (tr.length - 1); i++) {
                shouldSwitch = false;
                x = tr[i].getElementsByTagName("td")[columnNum];
                y = tr[i + 1].getElementsByTagName("td")[columnNum];
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
            if (shouldSwitch) {
                tr[i].parentNode.insertBefore(tr[i + 1], tr[i]);
                switching = true;
            }
        }
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