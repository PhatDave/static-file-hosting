import express from 'express';
import dirTree from 'directory-tree';
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

const pathValidators = {
    rootDir: (path: string): boolean => {
        if (path === '/') {
            return true;
        }
        return false;
    },
    parentDir: (path: string): boolean => {
        if (path.includes('..')) {
            return true;
        }
        return false;
    },
    existingDir: (path: string): boolean => {
        if (fs.existsSync(path)) {
            return true;
        }
        return false;
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        const _path = (req.params[0] as string) || '/';
        if (pathValidators.parentDir(_path)) {
            callback(Error('Invalid path!'), '');
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

type FileInfo = {
    name: string;
    path: string;
    size: number;
    type: string;
    extension: string;
    mtime: Date;
}
const savedRegex = new RegExp(`^${DESTINATION_FOLDER}/?`);
function getFolderInfo(dirPath: string): FileInfo[] {
    dirPath = dirPath.replace(/\\/g, '/');
    const files = fs.readdirSync(dirPath);
    const result: FileInfo[] = [];
    for (const file of files) {
        const fileStats = fs.statSync(path.join(dirPath, file));
        result.push({
            name: path.basename(file),
            path: path.join(dirPath, file).replace(/\\/g, '/').replace(savedRegex, ''),
            size: fileStats.size,
            type: fileStats.isDirectory() ? 'directory' : 'file',
            extension: path.extname(file),
            mtime: fileStats.mtime
        } as FileInfo)
    }
    return result;
}

// FILE HANDLING SECTION

const upload = multer({ storage: storage });

app.get('/file/**', (req, res) => {
    // @ts-ignore
    if (!req.params[0]) {
        res.status(400).json({ message: 'Path is required!' });
        return;
    }
    // @ts-ignore
    const _path = req.params[0] as string;
    if (pathValidators.rootDir(_path) || pathValidators.parentDir(_path)) {
        res.status(400).json({ message: 'Invalid path!' });
        return;
    }
    const fullPath = path.join(DESTINATION_FOLDER, _path).replace(/\\/g, '/');
    if (!pathValidators.existingDir(fullPath)) {
        res.status(404).json({ message: 'File not found!' });
        return;
    }
    console.log(`Serving ${fullPath}`);
    res.status(200).sendFile(fullPath, { root: '.' });
});
app.post('/file/**', upload.single('file'), (req, res) => {
    console.log(`Uploading file ${req.file?.originalname} with size ${req.file?.size}B`);
    res.status(200).json({ message: 'File uploaded successfully!' });
});

// API SECTION

app.get('/api', (req, res) => {
    const files = getFolderInfo(DESTINATION_FOLDER);
    res.json({ files: files });
});
app.get('/api/**', (req, res) => {
    // @ts-ignore
    if (!req.params[0]) {
        res.status(400).json({ message: 'Path is required!' });
        return;
    }
    // @ts-ignore
    const _path = req.params[0] as string;
    if (pathValidators.rootDir(_path) || pathValidators.parentDir(_path)) {
        res.status(400).json({ message: 'Invalid path!' });
        return;
    }
    const fullPath = path.join(DESTINATION_FOLDER, _path).replace(/\\/g, '/');
    if (!pathValidators.existingDir(fullPath)) {
        res.status(404).json({ message: 'File not found!' });
        return;
    }
    const files = getFolderInfo(fullPath);
    res.json({ files: files });
});

app.delete('/api/**', (req, res) => {
    // @ts-ignore
    if (!req.params[0]) {
        res.status(400).json({ message: 'Path is required!' });
        return;
    }
    // @ts-ignore
    const _path = req.params[0] as string;
    if (pathValidators.rootDir(_path) || pathValidators.parentDir(_path)) {
        res.status(400).json({ message: 'Invalid path!' });
        return;
    }
    const fullPath = path.join(DESTINATION_FOLDER, _path);
    if (!pathValidators.existingDir(fullPath)) {
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
    if (pathValidators.rootDir(_path) || pathValidators.parentDir(_path)) {
        if (res) {
            res.status(400).json({ message: 'Invalid path!' });
        }
        return;
    }
    const fullPath = path.join(DESTINATION_FOLDER, _path);
    console.log(fullPath);
    if (!pathValidators.existingDir(fullPath)) {
        res.status(404).json({ message: 'File not found!' });
        return;
    }

    if (!req.query.path) {
        res.status(400).json({ message: 'Destination path is required!' });
        return;
    }
    const destinationPath = req.query.path as string;
    if (pathValidators.rootDir(_path) || pathValidators.parentDir(_path)) {
        res.status(400).json({ message: 'Invalid destination path!' });
        return;
    }
    const destinationFullPath = path.join(DESTINATION_FOLDER, destinationPath);
    if (pathValidators.existingDir(fullPath)) {
        res.status(400).json({ message: 'Destination path already exists!' });
        return;
    }

    fs.renameSync(fullPath, destinationFullPath);
    res.status(200).send();
});

// END

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
