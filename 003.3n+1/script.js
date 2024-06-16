const input = document.getElementById("n");
const steps = document.getElementById("steps");
let graph;
function CollatzConjecture(n) {
    let numberofSteps = 0
    let result = [];
    result.push({ step: numberofSteps, value: n })
    while (n != 1) {
        if (n % 2 == 0) {
            n = n / 2
        } else {
            n = (n * 3) + 1
        }
        numberofSteps += 1
        result.push({ step: numberofSteps, value: n })
    }
    return result;
}

function ConstructGraph(n) {
    const data = CollatzConjecture(n);
    if (graph) {
        graph.destroy();
    }
    graph = new Chart("chart", {
        type: "line",
        data: {
            labels: data.map(row => row.step),
            datasets: [
                {
                    label: "Value",
                    data: data.map(row => row.value),
                    fill: false,
                    borderColor: '#d4af37',
                    backgroundColor: '#d4af37',
                    color: 'white',
                }
            ]
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            const Step = context[0].label == "0" ? "Initial Step" : "Step: " + context[0].label;
                            const Value = `Value: ${context[0].parsed.y}`;
                            return `${Step}\n${Value}`;
                        },
                        label: function(context) {
                            return "";
                        },
                    }
                },
                legend: {
                    display: false,
                },
            },
            scales: {
                y: {
                  grid: {
                    color: 'rgba(200, 200, 200, 0.1)',
                  }
                },
                x: {
                  grid: {
                    color: 'rgba(200, 200, 200, 0.1)',
                  }
                }
              }
        },
    });
    steps.innerHTML = `${data.length}`;
}

input.addEventListener("input", function (e) {
    if(e.target.value == '' || e.target.value == 0) {
        graph.destroy();
        steps.innerHTML = '0';
    }
    if (e.target.value == 1) {
        return;
    }
    if (e.target.value < 1) {
        e.target.value = '';
        return;
    }
    const n = parseInt(e.target.value);
    ConstructGraph(n);
});

ConstructGraph(50);