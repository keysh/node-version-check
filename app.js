'use strict';
const path = require('path');
const https = require('https');
const notifier = require('node-notifier');

const VERSION = '1.0.1';

const help = () => {
    console.log('Usage: node ' + path.basename(__filename) + ' [OPTION]\n' +
                'Check for available Node.js updates\n' +
                'Mandatory arguments to long options are mandatory for short options too.\n' +
                '  -s, --stable\t\tcheck for stable release\n' +
                '  -l, --lts\t\tcheck for LTS release\n' +
                '  -h, --help\t\tdisplay this help and exit\n' +
                '  -v, --version\t\toutput version information and exit\n');
};

const version = () => {
    console.log('Version:\t' + VERSION + '\n' +
                'Copyright:\t(c) 2016 Jakub Leško.\n' +
                'License:\tThe MIT License (MIT).\n');
};

const check = (res) => {
    res.setEncoding('utf8');

    let content;
    res.on('data', (chunk) => {
        content += chunk
    });

    res.on('end', () => {
        const regex = /v(\d+.\d+.\d+)/gi;

        const installed = process.version.replace('v', '');
        const available = content.match(regex)[0].replace('v', '');

        if (installed != available) {
            notifier.notify({
                'title': 'Updates available',
                'message': 'Node.js update is available. You have installed version ' +
                            installed + '. Available version is ' + available + '.',
                'icon': __dirname + '/assets/icon.png',
                'open': 'https://nodejs.org'
            });
        }
    });
};


const source = {
    stable: {
        host: 'nodejs.org',
        path: '/dist/latest/',
        port: 443
    },
    lts: {
        host: 'nodejs.org',
        path: '/dist/latest-argon/',
        port: 443
    }
};

switch (process.argv[2]) {
    case '-s':
    case '--stable':
        https.request(source.stable, check).end();
        break;
    case '-l':
    case '--lts':
        https.request(source.lts, check).end();
        break;
    case '-v':
    case '--version':
        version();
        break;
    default:
        help();
        break;
}