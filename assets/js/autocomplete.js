function autocomplete(input, data) {
    let currentFocus;

    input.addEventListener("input", function(e) {
        let list, item, val = this.value;
        closeAllLists();
        if (!val) return false;
        currentFocus = -1;

        list = document.createElement("div");
        list.setAttribute("id", this.id + "-autocomplete-list");
        list.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(list);

        for (let i = 0; i < data.length; i++) {
            if (data[i].toLowerCase().includes(val.toLowerCase())) {
                item = document.createElement("div");
                item.innerHTML = data[i];
                item.addEventListener("click", function(e) {
                    input.value = this.innerText;
                    closeAllLists();
                });
                list.appendChild(item);
            }
        }
    });

    input.addEventListener("keydown", function(e) {
        let list = document.getElementById(this.id + "-autocomplete-list");
        if (list) list = list.getElementsByTagName("div");
        if (e.keyCode === 40) {
            currentFocus++;
            addActive(list);
        } else if (e.keyCode === 38) {
            currentFocus--;
            addActive(list);
        } else if (e.keyCode === 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (list) list[currentFocus].click();
            }
        }
    });

    function addActive(list) {
        if (!list) return false;
        removeActive(list);
        if (currentFocus >= list.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = list.length - 1;
        list[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(list) {
        for (let i = 0; i < list.length; i++) {
            list[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        let items = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < items.length; i++) {
            if (elmnt != items[i] && elmnt != input) {
                items[i].parentNode.removeChild(items[i]);
            }
        }
    }

    document.addEventListener("click", function(e) {
        closeAllLists(e.target);
    });
}