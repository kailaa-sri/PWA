window.onload = function() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js').then(function(registration) {

                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, function(err) {

                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }
    var installed = 0;
    window.addEventListener('appinstalled', (event) => {
        console.log('👍', 'appinstalled', event);
        installed = 1;
        document.getElementById("promotion").classList.add("hidden");
        // Clear the deferredPrompt so it can be garbage collected
        window.deferredPrompt = null;
    });
    if (installed == 0) {
        window.addEventListener('beforeinstallprompt', (event) => {
            console.log('👍', 'beforeinstallprompt', event);
            // Stash the event so it can be triggered later.
            window.deferredPrompt = event;
            // Remove the 'hidden' class from the install button container

            document.getElementById("promotion").classList.remove("hidden");
        });
        var inst = document.getElementById("Install");
        inst.addEventListener('click', async() => {
            console.log('👍', 'butInstall-clicked');
            const promptEvent = window.deferredPrompt;
            if (!promptEvent) {
                // The deferred prompt isn't available.
                return;
            }
            // Show the install prompt.
            promptEvent.prompt();
            // Log the result
            const result = await promptEvent.userChoice;
            console.log('👍', 'userChoice', result);
            // Reset the deferred prompt variable, since
            // prompt() can only be called once.
            window.deferredPrompt = null;
            // Hide the install button.
            document.getElementById("promotion").classList.add("hidden");
        });
        document.getElementById("promotion").classList.add("hidden");

    }

    var editorExtensionId = "libpmdgfhliebpigepnppcjgpdnphcpm";
    var dataset = 0;
    // Make a simple request:

    getcpuinfo();
    setInterval(function() { getcpuinfo(); }, 20000);

    function getcpuinfo() {
        chrome.runtime.sendMessage(editorExtensionId, { msg: "send cpu processor info" },
            function(response) {
                if (!response.reply)
                    console.log("no messgae reply ");
                else {
                    console.log(response.reply);
                    dataset.push(response.reply);
                    Displaygraph(dataset);

                }
            });
    }

    function Displaygraph(cpu) {


        d3.select("div")
            .data(cpu)
            .enter()
            .addEventListener("div")
            .attr("class", "bar")
            .style("height", (d) => (d * 100 + "px"))

    }
    const data = {
        labels: labels,
        datasets: [{
            label: 'My First dataset',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [0, 10, 5, 2, 20, 30, 45],
        }]
    };
    const config = {
        type: 'line',
        data,
        options: {}
    };
    const labels = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
    ];

    var myChart = new Chart(
        document.getElementById('myChart'),
        config
    );



}