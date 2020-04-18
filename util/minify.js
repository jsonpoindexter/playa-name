// Minify all files in the 'public' directory qnd export to 'dist' directory
// NOTE: file extensions not in 'extensions' will not be copied over

const minify = require('minify');
const fs = require('fs');
const { resolve } = require('path');
const ncp = require('ncp').ncp;

// Valid minify file extensions
const extensions = ['.html', '.js', '.css'];

// Gets files recursively
const getFiles = async (dir, extensions) => {
    const dirents = await fs.readdirSync(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
        const res = resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res, extensions) : res;
    }));
    return Array.prototype.concat(...files).filter(path => extensions.some(extension => path.includes(extension, path.length - extension.length)));
}

(async () => {
    console.log('---------- minify start ----------')
    const srcPath = `${process.cwd()}/public`;
    const destPath = `${process.cwd()}/dist`;
    // Copy all files to move any files that will not be minified
    ncp(srcPath, destPath, async () => {
        // Minify and move shit
        const paths = await getFiles(srcPath, extensions);
        const ignore = await Promise.all(paths.map(async (path) => {
            try {
                console.log(`minify ${path}`)
                const minified = await minify(path);
                await fs.writeFileSync(path.replace(srcPath, destPath), minified);
            } catch(err) { console.log(err) }
        }))
        console.log('---------- minify complete ----------')
    })

})();


