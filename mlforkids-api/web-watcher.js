const chokidar = require('chokidar');
const { exec } = require('child_process');


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

console.log('Watching for file changes...');
