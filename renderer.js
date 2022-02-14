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

const measueMessagePort = async (args) => {
    const startTime = performance.now();
    const port = await messagePortPromise;
    let counter = 10;
    let i = 0;
    let t = performance.now();
    const perf = [];
    const done = new Promise(resolve => {
        port.onmessage = (event) => {
            if (i < args.length) {
                if (counter > 1) {
                    counter--;
                } else {
                    perf.push(performance.now() - t);
                    t = performance.now();
                    counter = 10;
                }
                port.postMessage(args[i++]);
            } else {
                resolve();
            }
        };
    })
    port.postMessage(args[i++]);
    await done;
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
}

// no difference to measueMessagePort
const measueMessagePortNoPromise = async (args) => {
    const startTime = performance.now();
    const port = await messagePortPromise;
    let counter = 10;
    let i = 0;
    let t = performance.now();
    const perf = [];
    port.onmessage = (event) => {
        if (i < args.length) {
            if (counter > 1) {
                counter--;
            } else {
                perf.push(performance.now() - t);
                t = performance.now();
                counter = 10;
            }
            port.postMessage(args[i++]);
        } else {
            console.log('measueMessagePortNoPromise');
            const endTime = performance.now();
            const avg = average(perf);
            console.log('avg: ', avg);
            const median = quantile(perf, .50);
            console.log('median: ', median);
            const p95 = quantile(perf, .95)
            console.log('p95: ', p95)
            const total = endTime - startTime;
            console.log('total: ', total);
            console.log({ avg, median, total, p95 });
        }
    };
    port.postMessage(args[i++]);
}

const measureIpc = async (args) => {
    const startTime = performance.now();
    let counter = 10;
    let t = performance.now();
    const perf = [];
    for (const v of args) {
        const result = window.ipcSendSync(v[0], v[1]);
        if (counter > 1) {
            counter--;
        } else {
            perf.push(performance.now() - t);
            t = performance.now();
            counter = 10;
        }
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
}

(async () => {
    const numberPairs = new Array(100000).fill([20, 30]);

    const stringPairs = new Array(100000).fill(['John', 'Doe']);

    const objectPairs = new Array(100000).fill(
        [{
            firstName: "John",
            lastName: "Doe",
            id: 5566
        },
        {
            state: "Tucson, Arizona",
            birthdate: "October 27 1981"
        }]
    );

    console.log('measueMessagePort')
    const mpNum = await measueMessagePort(numberPairs);
    const mpStr = await measueMessagePort(stringPairs);
    const mpObj = await measueMessagePort(objectPairs);
    const mp = { num: mpNum, str: mpStr, obj: mpObj };

    console.log('measureIpc')
    const ipcNum = await measureIpc(numberPairs);
    const ipcStr = await measureIpc(stringPairs);
    const ipcObj = await measureIpc(objectPairs);
    const ipc = { num: ipcNum, str: ipcStr, obj: ipcObj };

    console.log(JSON.stringify({ mp, ipc }));
})();