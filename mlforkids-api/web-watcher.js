const chokidar = require('chokidar');
const { exec } = require('child_process');


// Initialize watcher.
const watcher = chokidar.watch(['public/languages', 'app.js'], {
  ignored: /[\/\\]\.|sub-folder|third-party/, // ignore dotfiles
  persistent: true,
});

// Add event listeners.
watcher
  .on('add', (path) => handleChange(path))
  .on('change', (path) => handleChange(path));

function handleChange(path) {
  console.log(`File ${path} has been changed. Running the script...`);

  // Run the custom Bash script.
  exec(`npx gulp prodlanguages`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error running the script: ${error}`);
      return;
    }
    console.log(`Script output: ${stdout}`);
    console.error(`Script errors: ${stderr}`);
  });
}

console.log('Watching for file changes...');
