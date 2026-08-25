const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replacements = {
  'bg-black': 'bg-zinc-50 dark:bg-black',
  'bg-zinc-950': 'bg-white dark:bg-zinc-950',
  'bg-zinc-900': 'bg-zinc-100 dark:bg-zinc-900',
  'text-white': 'text-slate-900 dark:text-white',
  'text-slate-300': 'text-slate-600 dark:text-slate-300',
  'text-slate-400': 'text-slate-500 dark:text-slate-400',
  'border-slate-900': 'border-slate-200 dark:border-slate-900',
  'border-slate-800': 'border-slate-300 dark:border-slate-800',
  'border-slate-700': 'border-slate-300 dark:border-slate-700',
  'border-zinc-900': 'border-zinc-200 dark:border-zinc-900'
};

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;

      for (const [key, value] of Object.entries(replacements)) {
        // Regex: match the key, but not if it's preceded by 'dark:' or part of another word
        const regex = new RegExp(`(?<!dark:)\\b${key}\\b`, 'g');
        content = content.replace(regex, value);
      }

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  });
}

processDirectory(directoryPath);
console.log('Theme styling update complete.');
