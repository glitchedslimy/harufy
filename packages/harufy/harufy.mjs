#!/usr/bin/env node
/* eslint-disable no-console */
'use strict';

const currentVersion = process.versions.node;
const requiredMajorVersion = parseInt(currentVersion.split('.')[0], 10);
const minimunMajorVersion = 14;

if(requiredMajorVersion < minimunMajorVersion) {
    console.error(`Node.js v${currentVersion} is out of date and unsupported!`);
    console.error(`Please use Node.js v${minimunMajorVersion} or newer.`);
    process.exit(1);
}

import('./dist/index.js').then(({main}) => main());