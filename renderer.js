// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const messagePortPromise = new Promise(resolve => {
    window.onmessage = (event) => {
        // event.source === window means the message is coming from the preload
        // script, as opposed to from an <iframe> or other source.
        if (event.source === window && event.data === 'main-world-port') {
            const [port] = event.ports
            // Once we have the port, we can communicate directly with the main
            // process.
            resolve(port);
        }
    }
});

const asc = arr => arr.sort((a, b) => a - b);

const sum = arr => arr.reduce((a, b) => a + b, 0);

const mean = arr => sum(arr) / arr.length;

const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;

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

const ipcWrapper = async (val) => {
    const startTime = performance.now();
    await window.ipcSend(val);
    const endTime = performance.now();
    return endTime - startTime;
};

const ipcMetrics = async (args) => {
    const startTime = performance.now();
    const perf = [];
    for (const p of args) {
        const t = await ipcWrapper(p);
        perf.push(t);
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

(async () => {
    const port = await messagePortPromise;

    const messagePortWrapper = async (val) => {
        const startTime = performance.now();
        await port.postMessage(val);
        const endTime = performance.now();
        return endTime - startTime;
    };

    const messagePortMetrics = async (args) => {
        const startTime = performance.now();
        const perf = [];
        for (const p of args) {
            const t = await messagePortWrapper(p);
            perf.push(t);
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

    console.log(JSON.stringify(await messagePortMetrics(new Array(100000).fill({
        firstName: "John",
        lastName: "Doe",
        id: 5566
    }))))

    console.log(JSON.stringify(await ipcMetrics(new Array(100000).fill({
        firstName: "John",
        lastName: "Doe",
        id: 5566
    }))))

})();