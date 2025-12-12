document.addEventListener("keydown", e => {
  if (e.key.toLowerCase() === "r") {
    fetch("https://cdn.jsdelivr.net/gh/efficenspoun/miniature-doodle@main/index.html").then(response => response.text()).then(html => {
      document.open();
      document.write(html)
      document.close();
    })
  }
});