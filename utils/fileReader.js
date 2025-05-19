const fs = require("fs");
function readFileSync(path) {
    const content = fs.readFileSync(path, "utf-8"); 
    return JSON.parse(content);
}

function readFileCallback(path, callback) {
    fs.readFile(path, "utf-8", (err, data) => { 
        if (err) throw err;
        callback(JSON.parse(data));
    });
}

function readFilePromise(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, "utf-8", (err, data) => {
            if (err) reject(err);
            else resolve(JSON.parse(data));
        });
    });
}

async function readFileAsyncAwait(path) {
    const data = await fs.promises.readFile(path, "utf-8");
    return JSON.parse(data);
}

module.exports = {
    readFileSync,
    readFileCallback,
    readFilePromise,
    readFileAsyncAwait
};