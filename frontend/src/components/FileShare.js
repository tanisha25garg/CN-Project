import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import net from 'net'; 
import fs from 'fs';

const socket = io('http://localhost:5000');

const FileShare = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [description, setDescription] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        const fetchFiles = async () => {
            try {
                const response = await axios.get('/api/files', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFileList(response.data);
            } catch (error) {
                console.error('Error fetching files:', error);
                displayMessage('Failed to fetch files. Please try again.');
            }
        };

        fetchFiles();

        socket.on('fileMetadata', (fileMetadata) => {
            setFileList((prevList) => [...prevList, fileMetadata]);
        });

        return () => socket.off('fileMetadata');
    }, [navigate]);

    const displayMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(''), 5000); // Clear message after 5 seconds
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const sendFileOverTCP = (filePath, fileName) => {
        // const tcpSocket = new net.Socket(); // Create a new TCP socket

        // tcpSocket.connect(process.env.TCP_PORT || 6000, 'localhost', () => {
        //     console.log('Connected to TCP server');

        //     const fileTransferData = JSON.stringify({
        //         action: 'transferFile',
        //         fileName: fileName,
        //         filePath: filePath,
        //     });

        //     tcpSocket.write(fileTransferData);
        // });

        const client = net.createConnection({ port: 6000 }, () => {
            console.log('Connected to server');
        
            // Send file metadata
            const fileTransferData = JSON.stringify({
                action: 'transferFile',
                fileName: fileName,
                filePath: filePath,
            });

            client.write(fileTransferData);
        
            // Send the file in chunks
            const readStream = fs.createReadStream(filePath);
            readStream.pipe(client);
        });

        client.on('data', (data) => {
            console.log('Data received from TCP server:', data.toString());
            client.end(); // Close the connection
        });

        client.on('error', (err) => {
            console.error('TCP Socket error:', err);
            displayMessage('Error during TCP file transfer. Please try again.');
        });

        client.on('end', () => {
            console.log('Disconnected from TCP server');
        });
    };

    const handleFileUpload = async (event) => {
        event.preventDefault();
        if (!selectedFile) return;

        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'video/mp4', 'video/x-matroska'];

        if (!allowedTypes.includes(selectedFile.type)) {
            displayMessage('File type not supported. Please upload a valid file.');
            return;
        }

        if (selectedFile.size > 10 * 1024 * 1024) { // Max 10MB
            displayMessage('File size exceeds the limit of 10MB.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('description', description);

        const token = localStorage.getItem('token');

        setLoading(true);
        displayMessage('Uploading...');

        try {
            const response = await axios.post('/api/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });

            // Emit the uploaded file metadata to all connected clients
            socket.emit('shareFileMetadata', response.data.file);

            displayMessage('File uploaded successfully.');
            setFileList((prevList) => [...prevList, response.data.file]);
            setSelectedFile(null);
            setDescription('');
            
            // Call the TCP file transfer function
            sendFileOverTCP(response.data.file.filePath, response.data.file.originalFilename);

        } catch (error) {
            console.error('Error uploading file:', error);
            displayMessage('Failed to upload file. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (fileId, filename) => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.get(`/api/files/${fileId}/download`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            displayMessage('File downloaded successfully.');
        } catch (error) {
            console.error('Error downloading file: ', error);
            displayMessage('Failed to download file. Please try again.');
        }
    };

    const handleSearch = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`/api/files/search?searchQuery=${searchQuery}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: { searchQuery, fileType: '' },
            });
            setFileList(response.data);
        } catch (error) {
            console.error('Error searching files: ', error);
            displayMessage('Search failed. Please try again.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setSearchQuery('');
        setFileList([]);
        navigate('/login');
    };

    return (
        <div>
            <h2>Share a File</h2>
            <form onSubmit={handleFileUpload}>
                <input type='file' onChange={handleFileChange} />
                <input
                    type='text'
                    placeholder='Description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button type='submit' disabled={loading}>Upload and Share</button>
                {loading && <p>Uploading...</p>}
            </form>

            <h2>Search Files</h2>
            <input
                type='text'
                placeholder='Search by filename, filetype or description'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>

            <h2>Available Files</h2>
            <ul>
                {fileList.map((file, index) => (
                    <li key={index}>
                        <strong>{file.originalFilename}</strong> ({file.size} bytes) - {file.description}
                        <button onClick={() => handleDownload(file._id, file.originalFilename)}>Download</button>
                    </li>
                ))}
            </ul>

            <button onClick={handleLogout}>Logout</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default FileShare;
