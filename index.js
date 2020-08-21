#!/usr/bin/env node

const debounce = require('lodash.debounce');
const chokidar = require('chokidar');
const program = require('caporal');
const fs = require('fs');
const { spawn } = require('child_process');

program
    .version('0.0.1')
    // .command('deploy', 'Deploy an application')
    .argument('[filename]', 'Name of the file to execute')
    .action(async ({ filename }) => {
        // we desctrucuted args.filename
        const name = filename || 'index.js';

        try {
            // check if filename exists
            await fs.promises.access(name)
        } catch (err) {
            throw new Error(`File not found: ${filename}`);
        }

        const start = debounce(() => {
            spawn('node', [name], { stdio: 'inherit' });
        }, 100);

        chokidar
            .watch('.', {
                ignored: /node_modules/,
            })
            .on('add', start)
            .on('change', start)
            .on('unlink', start)

    });

program.parse(process.argv);