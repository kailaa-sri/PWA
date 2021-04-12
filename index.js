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



    }
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Chart.js Bar Chart'
                }
            }
        },
    };
    const DATA_COUNT = 7;
    const NUMBER_CFG = { count: DATA_COUNT, min: -100, max: 100 };

    const labels = Utils.months({ count: 7 });
    const data = {
        labels: labels,
        datasets: [{
                label: 'Dataset 1',
                data: Utils.numbers(NUMBER_CFG),
                borderColor: Utils.CHART_COLORS.red,
                backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
            },
            {
                label: 'Dataset 2',
                data: Utils.numbers(NUMBER_CFG),
                borderColor: Utils.CHART_COLORS.blue,
                backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
            }
        ]
    };
    const actions = [{
            name: 'Randomize',
            handler(chart) {
                chart.data.datasets.forEach(dataset => {
                    dataset.data = Utils.numbers({ count: chart.data.labels.length, min: -100, max: 100 });
                });
                chart.update();
            }
        },
        {
            name: 'Add Dataset',
            handler(chart) {
                const data = chart.data;
                const dsColor = Utils.namedColor(chart.data.datasets.length);
                const newDataset = {
                    label: 'Dataset ' + (data.datasets.length + 1),
                    backgroundColor: Utils.transparentize(dsColor, 0.5),
                    borderColor: dsColor,
                    borderWidth: 1,
                    data: Utils.numbers({ count: data.labels.length, min: -100, max: 100 }),
                };
                chart.data.datasets.push(newDataset);
                chart.update();
            }
        },
        {
            name: 'Add Data',
            handler(chart) {
                const data = chart.data;
                if (data.datasets.length > 0) {
                    data.labels = Utils.months({ count: data.labels.length + 1 });

                    for (var index = 0; index < data.datasets.length; ++index) {
                        data.datasets[index].data.push(Utils.rand(-100, 100));
                    }

                    chart.update();
                }
            }
        },
        {
            name: 'Remove Dataset',
            handler(chart) {
                chart.data.datasets.pop();
                chart.update();
            }
        },
        {
            name: 'Remove Data',
            handler(chart) {
                chart.data.labels.splice(-1, 1); // remove the label first

                chart.data.datasets.forEach(dataset => {
                    dataset.data.pop();
                });

                chart.update();
            }
        }
    ];



}