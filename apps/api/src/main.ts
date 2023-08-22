import express from 'express';
import dirTree from "directory-tree";
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import serveStatic from 'serve-static';

const app = express();
const PORT = process.env.PORT ?? 3000;
const DESTINATION_FOLDER = 'upload';
const WEB_FOLDER = 'web';

if (!fs.existsSync(DESTINATION_FOLDER)) {
    fs.mkdirSync(DESTINATION_FOLDER);
}

// Usage:
// curl -H "Accept: multipart/form-data" -X GET "http://localhost:3000/file/"
// curl -H "Content-Type: multipart/form-data" -X POST "http://localhost:3000/file/" -F file=@Enca.ahk

app.use(serveStatic(WEB_FOLDER));
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
    return dirTree(DESTINATION_FOLDER, { attributes: ['size', 'type', 'extension', 'mtime', 'extension'] });
}

const savedRegex = new RegExp(`^${DESTINATION_FOLDER}\\\\`);
function cleanTree(tree: dirTree.DirectoryTree<Record<string, any>>) {
    if (tree.path) {
        tree.path = tree.path.replace(savedRegex, '');
    }
    if (tree.children) {
        tree.children.forEach(child => cleanTree(child));
    }
    return tree;
}

const upload = multer({ storage: storage });

app.get('/file/**', (req, res) => {
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
    const fullPath = path.join(DESTINATION_FOLDER, _path).replace(/\\/g, '/');
    if (!fs.existsSync(fullPath)) {
        res.status(404).json({ message: 'File not found!' });
        return;
    }
    console.log(`Serving ${fullPath}`);
    res.status(200).sendFile(fullPath, {root: '.'});
});

app.post('/file/**', upload.single('file'), (req, res) => {
    console.log(`Uploading file ${req.file?.originalname} with size ${req.file?.size}B`);
    res.status(200).json({ message: 'File uploaded successfully!' });
});

app.get('/api', (req, res) => {
    const tree = buildTree();
    cleanTree(tree)
    res.json({ root: tree });
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});