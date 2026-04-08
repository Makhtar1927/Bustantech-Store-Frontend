const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.js') || file.endsWith('.jsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const srcDir = path.join(__dirname, 'src');
const files = walk(srcDir);
let hasError = false;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // Simple regex for imports
  const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (importPath.startsWith('.')) {
      const resolvedPath = path.resolve(path.dirname(file), importPath);
      
      // Try to find the file with exact case
      const dirName = path.dirname(resolvedPath);
      const baseName = path.basename(resolvedPath);
      
      if (fs.existsSync(dirName)) {
        const filesInDir = fs.readdirSync(dirName);
        let foundExact = false;
        let pName = baseName;
        // Check with extensions
        const possibleNames = [pName, pName + '.js', pName + '.jsx', pName + '.ts', pName + '.tsx'];
        
        for (const possibleName of possibleNames) {
           if (filesInDir.includes(possibleName)) {
               foundExact = true;
               break;
           }
        }

        if (!foundExact) {
            // Check if it exists case-insensitively
            let foundInsensitive = null;
            for (const f of filesInDir) {
                if (f.toLowerCase() === baseName.toLowerCase() || f.toLowerCase() === baseName.toLowerCase() + '.js' || f.toLowerCase() === baseName.toLowerCase() + '.jsx') {
                    foundInsensitive = f;
                    break;
                }
            }
            
            if (foundInsensitive) {
                console.error(`Case Mismatch in ${file}:`);
                console.error(`Imported: '${importPath}'`);
                console.error(`Actual file on disk: '${foundInsensitive}'\n`);
                hasError = true;
            }
        }
      }
    }
  }
});

if (!hasError) {
  console.log("No case mismatches found.");
}
