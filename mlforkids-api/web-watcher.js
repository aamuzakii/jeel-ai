const chokidar = require('chokidar');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

function getAllCssFiles(directoryPath) {
  const cssFiles = [];

  function traverseDirectory(currentPath) {
    const files = fs.readdirSync(currentPath);

    files.forEach(file => {
      const filePath = path.join(currentPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        traverseDirectory(filePath); // Recursive call for nested directories
      } else if (stats.isFile() && path.extname(file) === '.css') {
        const relativePath = path.relative(directoryPath, filePath);
        cssFiles.push('public/' + relativePath);
      }
    });
  }

  traverseDirectory(directoryPath);
  return cssFiles;
}

// Example usage:
const folderPath = '/home/zaki/freelance/taxinomitis-ml/mlforkids-api/public';
const cssFiles = getAllCssFiles(folderPath);

console.log(cssFiles);

// Initialize languageWatcher.
const languageWatcher = chokidar.watch(['public/languages'], {
  ignored: /[\/\\]\.|sub-folder|third-party/, // ignore dotfiles
  persistent: true,
});

// Add event listeners.
languageWatcher
  .on('add', (path) => handleChange(path))
  .on('change', (path) => handleChange(path));

function handleChange(path) {
  console.log(`File ${path} has been changed. Running the script...`);

  // Run the custom Bash script.
  exec(`npx gulp languages`, (error, stdout, stderr) => {
    if (error || stderr) {
      console.error(`Error running the script: ${error} ${stderr}`);
      return;
    }
    console.log(`Script output: ${stdout}`);
  });
}

const cssWatcher = chokidar.watch(['public/app.css'], {
  persistent: true,
});

// Add event listeners.
cssWatcher
  .on('add', (path) => handleChangeGlobalCSS(path))
  .on('change', (path) => handleChangeGlobalCSS(path));

function handleChangeGlobalCSS(path) {
  console.log(`File ${path} has been changed. Running the script...`);

  // Run the custom Bash script.
  exec(`npx gulp css`, (error, stdout, stderr) => {
    if (error || stderr) {
      console.error(`Error running the script: ${error} ${stderr}`);
      return;
    }
    console.log(`Script output: ${stdout}`);
  });
}

console.log('Watching for file changes...');
