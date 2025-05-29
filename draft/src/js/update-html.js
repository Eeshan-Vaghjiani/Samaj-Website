const fs = require('fs');
const path = require('path');

// Directory with HTML files
const pagesDir = path.join(__dirname, '..', 'pages');

// Read all HTML files in the pages directory
fs.readdir(pagesDir, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  // Filter for HTML files
  const htmlFiles = files.filter(file => file.endsWith('.html'));
  
  htmlFiles.forEach(file => {
    const filePath = path.join(pagesDir, file);
    
    // Read file content
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading file ${file}:`, err);
        return;
      }
      
      // Update CSS references
      let updatedContent = data.replace(
        /<link rel="stylesheet" href="(\.\.\/)?dist\/tailwind\.css">/,
        '<link rel="stylesheet" href="../../dist/tailwind.css">'
      );
      
      // Add style.css if it doesn't exist
      if (!updatedContent.includes('<link rel="stylesheet" href="../css/style.css">')) {
        updatedContent = updatedContent.replace(
          /<link rel="stylesheet" href="\.\.\/\.\.\/dist\/tailwind\.css">/,
          '<link rel="stylesheet" href="../../dist/tailwind.css">\n  <link rel="stylesheet" href="../css/style.css">'
        );
      }
      
      // Update script references
      updatedContent = updatedContent.replace(
        /<script src="(\.\.\/)?js\/main\.js" defer><\/script>/,
        '<script src="../js/main.js" defer></script>'
      );
      
      // Update header and footer fetch calls
      updatedContent = updatedContent.replace(
        /fetch\(['"]header\.html['"]\)/g,
        'fetch(\'../components/header.html\')'
      );
      
      updatedContent = updatedContent.replace(
        /fetch\(['"]footer\.html['"]\)/g,
        'fetch(\'../components/footer.html\')'
      );
      
      // Update image references if needed
      updatedContent = updatedContent.replace(
        /src="Timeline Related Photos/g,
        'src="../assets/images/Timeline Related Photos'
      );
      
      // Write updated content back to file
      fs.writeFile(filePath, updatedContent, 'utf8', err => {
        if (err) {
          console.error(`Error writing file ${file}:`, err);
          return;
        }
        console.log(`Updated ${file} successfully`);
      });
    });
  });
}); 