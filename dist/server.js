"use strict";
// PROXY SCRIPT TO BYPASS RENDER'S HARDCODED "node src/server.ts" START COMMAND
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
console.log("=========================================");
console.log("Starting proxy server.ts execution...");
console.log("=========================================");
const distMainPath = path.join(__dirname, '../dist/main.js');
try {
    if (!fs.existsSync(distMainPath)) {
        console.log("Compiling TypeScript to JavaScript because dist/main.js was not found...");
        // Install typescript explicitly just in case it wasn't installed
        execSync('npm install typescript --no-save', { stdio: 'inherit' });
        // Run the compiler
        execSync('npm run build', { stdio: 'inherit' });
        console.log("Compilation successful!");
    }
    else {
        console.log("Compiled JavaScript found. Skipping build.");
    }
}
catch (error) {
    console.error("Failed to build the project during proxy execution:");
    console.error(error);
    process.exit(1);
}
console.log("Starting the real compiled server...");
// Require the compiled main.js
require('../dist/main.js');
