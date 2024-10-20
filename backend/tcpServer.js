const net = require('net');
const fs = require('fs');
const path = require('path');

const TCP_PORT = process.env.TCP_PORT || 6000;

const startTCPServer = () => {
    const server = net.createServer((socket) => {
        console.log('New TCP client connected:', socket.remoteAddress);

        socket.on('data', (data) => {
            const { action, fileName, filePath } = JSON.parse(data);

            if (action === 'transferFile') {
                const readStream = fs.createReadStream(filePath);
                readStream.pipe(socket);

                readStream.on('end', () => {
                    console.log(`File ${fileName} sent successfully.`);
                    socket.end();
                });

                readStream.on('error', (err) => {
                    console.error('Error reading file:', err);
                    socket.end();
                });
            }
        });

        socket.on('end', () => {
            console.log('TCP client disconnected');
        });

        socket.on('error', (err) => {
            console.error('Socket error:', err);
        });
    });

    server.listen(TCP_PORT, () => {
        console.log(`TCP Server is running on port ${TCP_PORT}`);
    });
};

module.exports = { startTCPServer };
