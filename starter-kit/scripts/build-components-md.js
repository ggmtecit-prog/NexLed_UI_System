#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const rootScript = path.resolve(__dirname, '..', '..', 'scripts', 'build-components-md.js');

if (!fs.existsSync(rootScript)) {
  console.error(`Canonical builder not found: ${rootScript}`);
  process.exit(1);
}

const result = spawnSync(process.execPath, [rootScript], { stdio: 'inherit' });
process.exit(typeof result.status === 'number' ? result.status : 1);