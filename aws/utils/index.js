import fs from "fs";
import path from "path";
import archiver from "archiver";

function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

export function zipDirectories(baseDir, outDir) {
    const directories = fs.readdirSync(baseDir)
        .filter(file => fs.statSync(path.join(baseDir, file)).isDirectory());

    directories.forEach(directory => {
        const sourceDir = path.join(baseDir, directory);
        const baseName = path.basename(sourceDir);
        const filename = `${baseName}.zip`;
        const outPath = path.resolve(outDir, filename);

        ensureDirectoryExistence(outPath);

        const output = fs.createWriteStream(outPath);
        const archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level
        });

        output.on('close', () => {
            console.log(`Archive created successfully, total bytes: ${archive.pointer()}`);
        });

        archive.on('error', (err) => {
            throw err;
        });

        archive.pipe(output);

        archive.directory(sourceDir, false);

        archive.finalize();
    });
}