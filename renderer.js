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
    console.log('avg: ', average(perf));
    const endTime = performance.now();
    console.log('total: ', endTime - startTime);
};

const syncIpc = (args) => {
    const startTime = performance.now();
    const perf = [];
    for (const p of args) {
        perf.push(sendSync(p));
    }
    console.log('avg: ', average(perf));
    const endTime = performance.now();
    console.log('total: ', endTime - startTime);
};



(async () => {
    console.log('ASYNC IPC, 100000 iterations');

    console.log('primitive')
    await asyncIpc(new Array(100000).fill(1));
    console.log('string')
    await asyncIpc(new Array(100000).fill('str'));
    console.log('object')
    await asyncIpc(new Array(100000).fill({
        firstName: "John",
        lastName: "Doe",
        id: 5566
    }));

    console.log('SYNC IPC, 100000 iterations');
    console.log('primitive')
    syncIpc(new Array(100000).fill(1));
    console.log('string')
    syncIpc(new Array(100000).fill('str'));
    console.log('object')
    syncIpc(new Array(100000).fill({
        firstName: "John",
        lastName: "Doe",
        id: 5566
    }));
})();