document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector("#searchInput")

    searchInput.addEventListener("input", e=>
        setTimeout(() => {
            const rows = document.querySelectorAll(`#${searchInput.getAttribute('aria-controls')} .chat-room h2`)
            for (const row of rows) {
                if (row.textContent.toLowerCase().includes(searchInput.value.toLowerCase())) row.parentElement.style.display = "grid"
                else row.parentElement.style.display = "none"
            }
        }, 300)
    )
})
