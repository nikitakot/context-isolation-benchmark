const asc = arr => arr.sort((a, b) => a - b);

const sum = arr => arr.reduce((a, b) => a + b, 0);

const mean = arr => sum(arr) / arr.length;

// sample standard deviation
const std = (arr) => {
    const mu = mean(arr);
    const diffArr = arr.map(a => (a - mu) ** 2);
    return Math.sqrt(sum(diffArr) / (arr.length - 1));
};

const quantile = (arr, q) => {
    const sorted = asc(arr);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
};

const invoke = async (val) => {
    const startTime = performance.now();
    await window.ipcInvoke('ipcEvent', val);
    const endTime = performance.now();
    return endTime - startTime;
}

const sendSync = (val) => {
    const startTime = performance.now();
    window.ipcSync('ipcEvent', val);
    const endTime = performance.now();
    return endTime - startTime;
}

const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;

const asyncIpc = async (args) => {
    const startTime = performance.now();
    const promises = [];
    for (const p of args) {
        promises.push(invoke(p));
    }
    const perf = await Promise.all(promises);
    const endTime = performance.now();
    const avg = average(perf);
    console.log('avg: ', avg);
    const median = quantile(perf, .50);
    console.log('median: ', median);
    const p95 = quantile(perf, .95)
    console.log('p95: ', p95)
    const total = endTime - startTime;
    console.log('total: ', total);
    return { avg, median, total, p95 };
};

const syncIpc = (args) => {
    const startTime = performance.now();
    const perf = [];
    for (const p of args) {
        perf.push(sendSync(p));
    }
    const endTime = performance.now();
    const avg = average(perf);
    console.log('avg: ', avg);
    const median = quantile(perf, .50);
    console.log('median: ', median);
    const p95 = quantile(perf, .95)
    console.log('p95: ', p95)
    const total = endTime - startTime;
    console.log('total: ', total);
    return { avg, median, total, p95 };
};

const draw = (label, asyncIpcMedian, asyncIpcTotal, syncIpcMedian, syncIpcTotal) => {
    const data = {
        labels: ['async ipc median', 'async ipc total', 'sync ipc median', 'sync ipc total'],
        datasets: [{
            label,
            data: [asyncIpcMedian, asyncIpcTotal, syncIpcMedian, syncIpcTotal],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
            ],
            borderWidth: 1
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        },
    };

    const x = document.createElement("CANVAS");
    document.getElementById("charts").appendChild(x);

    const myChart = new Chart(
        x,
        config
    );
}



(async () => {
    console.log('ASYNC IPC, 100000 iterations');

    console.log('primitive')
    const primitiveAsync = await asyncIpc(new Array(100000).fill(1));

    console.log('string')
    const stringAsync = await asyncIpc(new Array(100000).fill('str'));

    console.log('object')
    const objectAsync = await asyncIpc(new Array(100000).fill({
        firstName: "John",
        lastName: "Doe",
        id: 5566
    }));

    console.log('SYNC IPC, 100000 iterations');

    console.log('primitive')
    const primitiveSync = syncIpc(new Array(100000).fill(1));

    console.log('string')
    const stringSync = syncIpc(new Array(100000).fill('str'));

    console.log('object')
    const objectSync = syncIpc(new Array(100000).fill({
        firstName: "John",
        lastName: "Doe",
        id: 5566
    }));

    // draw('primitive', primitiveAsync.median, primitiveAsync.total, primitiveSync.median, primitiveSync.total);
    // draw('string', stringAsync.median, stringAsync.total, stringSync.median, stringSync.total);
    // draw('object', objectAsync.median, objectAsync.total, objectSync.median, objectSync.total);
})();