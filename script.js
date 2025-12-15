let options = [];
async function loadOptions() {
    try {
        const response = await fetch("https://cdn.jsdelivr.net/gh/efficenspoun/miniature-doodle/options.json");
        options = await response.json();
        displayOptions(options);
    } catch (error) {
        console.error('Error loading options:', error);
    }
}

function displayOptions(optionsToDisplay) {
    const grid = document.getElementById('options-grid');
    grid.innerHTML = '';
    optionsToDisplay.forEach(option => {
        const card = document.createElement('div');
        card.innerHTML = `
        <div class="option-card" onclick="begin(${option.id})">
            ${option.thumbnail ? `<img src="${option.thumbnail}" alt="${option.name}" onerror="this.src='https://placehold.co/512x512'">` : ''}
            <h3>${option.name}</h3>
        </div>
        `;
        grid.appendChild(card);
    });
}

function handleSearch() {
    const searchInput = document.getElementById('search-bar').value.toLowerCase();
    const filtered = options.filter(option => option.name.toLowerCase().includes(searchInput));
    displayOptions(filtered);
}

async function getOption(id) {
    const res = await fetch(`https://cdn.jsdelivr.net/gh/efficenspoun/glowing-rotary-phone/${id}.html`)
    const html = await res.text();
    return html
}
async function begin(id) {
    if (!id) {
        alert('No option ID provided');
        return;
    }

    const url = new URL(window.location);
    url.searchParams.set("id",id);
    window.history.replaceState({}, "", url);

    try {
        const response = await fetch('https://cdn.jsdelivr.net/gh/efficenspoun/miniature-doodle/options.json');
        const options = await response.json();
        console.log(id)
        const option = options.find(g => g.id == id);
        if (!option) {
            alert('Option not found');
            return;
        }

        const html = await fetch('https://cdn.jsdelivr.net/gh/efficenspoun/miniature-doodle/begin.html').then(res => res.text());

        document.open();
        document.write(html);
        document.close();

        const iframe = document.getElementById('option-iframe');
        const optionHTML = await getOption(id);

        iframe.contentDocument.open();
        iframe.contentDocument.write(optionHTML);
        iframe.contentDocument.close();
    } catch (error) {
        console.error('Error beginning option:', error);
    }
}
function fullscreen() {
    const iframe = document.getElementById('option-iframe');
    // i literally just copied this from https://www.w3schools.com/howto/howto_js_fullscreen.asp
    if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
    } else if (iframe.webkitRequestFullscreen) { /* Safari */
        iframe.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        iframe.msRequestFullscreen();
    }
}
function aboutBlank(id) {
    const newWindow = window.open("about:blank", "_blank");
    option = `https://cdn.jsdelivr.net/gh/efficenspoun/glowing-rotary-phone/${id}.html`
    fetch(option+"?t="+Date.now()).then(response => response.text()).then(html => {
        if (newWindow) {
            newWindow.document.open();
            newWindow.document.write(html);
            newWindow.document.close();
        }
    })
}

// thank you https://stackoverflow.com/a/6509422
if (typeof indexPage === 'undefined') {
    begin()
} else {
    loadOptions()
}