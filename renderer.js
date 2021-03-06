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

const draw = (label, off, on, syncIpcMedian, syncIpcTotal) => {
    const data = {
        labels: ['ctx isolation off', 'ctx isolation on'],
        datasets: [{
            label,
            data: [off, on],
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

    function relDiff(a, b) {
        return 100 * Math.abs((a - b) / ((a + b) / 2));
    }

    const x = document.createElement("CANVAS");
    const h = document.createElement("H1");
    const t = document.createTextNode(label);
    h.appendChild(t);
    document.getElementById("charts").appendChild(h);
    document.getElementById("charts").appendChild(x);
    const p = document.createElement("DIV");
    const rel = Math.round(relDiff(on, off) * 100) / 100;
    p.appendChild(document.createTextNode('Regression is ' + rel + '%'));
    document.getElementById("charts").appendChild(p);

    const myChart = new Chart(
        x,
        config
    );
}



(async () => {
    // console.log('ASYNC IPC, 100000 iterations');

    // console.log('primitive')
    // const primitiveAsync = await asyncIpc(new Array(100000).fill(1));

    // console.log('string')
    // const stringAsync = await asyncIpc(new Array(100000).fill('str'));

    // console.log('object')
    // const objectAsync = await asyncIpc(new Array(100000).fill({
    //     firstName: "John",
    //     lastName: "Doe",
    //     id: 5566
    // }));

    // console.log('SYNC IPC, 100000 iterations');

    // console.log('primitive')
    // const primitiveSync = syncIpc(new Array(100000).fill(1));

    // console.log('string')
    // const stringSync = syncIpc(new Array(100000).fill('str'));

    // console.log('object')
    // const objectSync = syncIpc(new Array(100000).fill({
    //     firstName: "John",
    //     lastName: "Doe",
    //     id: 5566
    // }));

    // draw('primitive', primitiveAsync.median, primitiveAsync.total, primitiveSync.median, primitiveSync.total);
    // draw('string', stringAsync.median, stringAsync.total, stringSync.median, stringSync.total);
    // draw('object', objectAsync.median, objectAsync.total, objectSync.median, objectSync.total);
    draw('E10: primitive, p95', 0.0950000248849392, 0.09999994654208422);
    draw('E10: string, p95', 0.0950000248849392, 0.1200000406242907);
    draw('E10: object, p95', 0.10500004282221198, 0.11500000255182385);
    draw('E10: primitive, total', 6498.874999990221, 6745.764999999665);
    draw('E10: string, total', 6497.830000007525, 7171.60000000149);
    draw('E10: object, total', 7002.740000025369, 7878.3800000092015);
    draw('E16: primitive, p95', 0.19999998807907104, 1);
    draw('E16: string, p95', 0.19999998807907104, 0.19999998807907104);
    draw('E16: object, p95', 0.19999998807907104, 0.19999998807907104);
    draw('E16: primitive, total', 6270, 17591.399999976158);
    draw('E16: string, total', 6887.800000011921, 6703.700000047684);
    draw('E16: object, total', 7000.099999964237, 7678);
})();