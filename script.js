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
    const res = await fetch(`https://cdn.jsdelivr.net/gh/efficenspoun/glowing-rotary-phone/${id}.html`);
    const html = await res.text();
    const iframe = document.getElementById('option-iframe');
    if (!iframe) return console.error('Iframe has not been created yet');
    try {
        iframe.contentDocument.open();
        iframe.contentDocument.write(html);
        iframe.contentDocument.close();
    } catch (e) {
        console.error('Failed to write into iframe for option', id, e);
    }
}
async function begin(id) {
    if (!id) {
        alert('No option ID provided');
        return;
    }
    
    // i am testing something
    /**const url = new URL(window.location);
    url.searchParams.set("id",id);
    window.history.replaceState({}, "", url);**/

    try {
        const response = await fetch('https://cdn.jsdelivr.net/gh/efficenspoun/miniature-doodle/options.json');
        const options = await response.json();
        const option = options.find(g => g.id == id);
        if (!option) {
            alert('Option not found');
            return;
        }
        const html = await fetch('https://cdn.jsdelivr.net/gh/efficenspoun/miniature-doodle/begin.html').then(res => res.text());
        try {
            document.open();
            document.write(html);
            document.close();
        } catch (e) {
            console.warn('Top-level document.write failed, falling back to a full-screen iframe.', e);
            // Clear the existing body and create a full-screen iframe so the fetched HTML
            // can be written using document.write() in the iframe (keeps using document.write)
            const iframe = document.createElement('iframe');
            iframe.style.position = 'fixed';
            iframe.style.inset = '0';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = '0';
            iframe.style.zIndex = '9999';
            // preserve minimal background while replacing
            document.documentElement.innerHTML = '';
            document.body = document.createElement('body');
            document.body.appendChild(iframe);
            try {
                iframe.contentDocument.open();
                iframe.contentDocument.write(html);
                iframe.contentDocument.close();
            } catch (err) {
                console.error('Fallback iframe document.write also failed', err);
                alert('Failed to open option — this browser blocked the operation.');
            }
        }

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