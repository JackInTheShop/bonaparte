function initSelect() {
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
}

function initToast() {
    var toastText = document.getElementById('message').textContent;
    if (toastText.length > 0) {
        M.toast({ html: toastText, classes: "rounded" })
    }
}