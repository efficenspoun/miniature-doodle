let options = [];

async function loadOptions() {
    try {
        const response = await fetch("https://cdn.jsdelivr.net/gh/efficenspoun/miniature-doodle/options.json");
        options = await response.json();
        console.log(options);
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
        <div class="option-card" onclick="loadOption(${option.id})">
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

async function loadOption(id) {
    const gameId = id

    if (!gameId && document.href != "/") {
        alert('No option ID provided');
        return;
    }

    try {
        const response = await fetch('https://cdn.jsdelivr.net/gh/efficenspoun/miniature-doodle/options.json');
        const options = await response.json();
        const option = options.find(g => g.id === gameId);

        if (!option) {
            alert('option not found');
            return;
        }
        fetch('https://cdn.jsdelivr.net/gh/efficenspoun/miniature-doodle/begin.html').then(response => response.text()).then(html => {
            document.open();
            document.write(html);
            document.close();
        })
        const iframe = document.getElementById('option-iframe');
        iframe.src = option.url;

        // Fullscreen button
        document.getElementById('fullscreen-btn').addEventListener('click', () => {
            if (iframe.requestFullscreen) {
                iframe.requestFullscreen();
            } else if (iframe.mozRequestFullScreen) { 
                iframe.mozRequestFullScreen();
            } else if (iframe.webkitRequestFullscreen) { 
                iframe.webkitRequestFullscreen();
            } else if (iframe.msRequestFullscreen) { 
                iframe.msRequestFullscreen();
            }
        });

        // Refresh button
        document.getElementById('refresh-btn').addEventListener('click', () => {
            iframe.src = iframe.src; // Reloads the iframe
        });

        // Open directly button
        document.getElementById('open-direct-btn').addEventListener('click', () => {
            window.open(option.url, '_blank');
        });

    } catch (error) {
        console.error('Error loading option:', error);
    }
}

function aboutBlank() {
    const newWindow = window.open("about:blank", "_blank");
    fetch(zone+"?t="+Date.now()).then(response => response.text()).then(html => {
        if (newWindow) {
            newWindow.document.open();
            newWindow.document.write(html);
            newWindow.document.close();
        }
    })
}

// thank you https://stackoverflow.com/a/6509422
if (typeof indexPage === 'undefined') {
    loadOption()
} else {
    loadOptions()
}