const http2 = require('node:http2');

const client = http2.connect('https://nghttp2.org');

const req = client.request([':path', '/', ':method', 'GET']);
