import express from 'express';
import dirTree from "directory-tree";
import multer from 'multer';
import serveStatic from 'serve-static';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;
const DESTINATION_FOLDER = 'upload';

if (!fs.existsSync(DESTINATION_FOLDER)) {
    fs.mkdirSync(DESTINATION_FOLDER);
}

app.use(serveStatic(DESTINATION_FOLDER));
app.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        const _path = req.params[0] as string || "/";
        if (_path.includes('..')) {
            callback(Error('Invalid path!'), "");
            return;
        }
        const fullPath = path.join(DESTINATION_FOLDER, _path);
        fs.mkdirSync(fullPath, { recursive: true });
        callback(null, fullPath);
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

function buildTree() {
    return dirTree(DESTINATION_FOLDER, { attributes: ['size', 'type', 'extension', 'mtime'] });
}

const upload = multer({ storage: storage });

app.get('/api', async (req, res) => {
    res.json({ root: buildTree() });
});

app.delete('/api/**', (req, res) => {
    // @ts-ignore
    if (!req.params[0]) {
        res.status(400).json({ message: 'Path is required!' });
        return;
    }
    // @ts-ignore
    const _path = req.params[0] as string;
    if (_path.includes('..') || _path === '/') {
        if (res) {
            res.status(400).json({ message: 'Invalid path!' });
        }
        return;
    }
    const fullPath = path.join(DESTINATION_FOLDER, _path);
    if (!fs.existsSync(fullPath)) {
        res.status(404).json({ message: 'File not found!' });
        return;
    }
    fs.rmSync(fullPath, { recursive: true });
    res.status(200).send();
});

app.patch('/api/**', (req, res) => {
    // @ts-ignore
    if (!req.params[0]) {
        res.status(400).json({ message: 'Path is required!' });
        return;
    }
    // @ts-ignore
    const _path = req.params[0] as string;
    if (_path.includes('..') || _path === '/') {
        if (res) {
            res.status(400).json({ message: 'Invalid path!' });
        }
        return;
    }
    const fullPath = path.join(DESTINATION_FOLDER, _path);
    if (!fs.existsSync(fullPath)) {
        res.status(404).json({ message: 'File not found!' });
        return;
    }

    if (!req.query.path) {
        res.status(400).json({ message: 'Destination path is required!' });
        return;
    }
    const destinationPath = req.query.path as string;
    if (destinationPath.includes('..') || destinationPath === '/') {
        res.status(400).json({ message: 'Invalid destination path!' });
        return;
    }
    const destinationFullPath = path.join(DESTINATION_FOLDER, destinationPath);
    if (fs.existsSync(destinationFullPath))  {
        res.status(400).json({ message: 'Destination path already exists!' });
        return;
    }

    fs.renameSync(fullPath, destinationFullPath);
    res.status(200).send();
});

app.post('/api/**', upload.single('file'), (req, res) => {
    console.log(`Uploading file ${req.file?.originalname} with size ${req.file?.size}B`);
    res.status(200).json({ message: 'File uploaded successfully!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});