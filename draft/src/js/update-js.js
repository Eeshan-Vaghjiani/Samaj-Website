const fs = require('fs');
const path = require('path');

// Get all HTML files in the current directory
const htmlFiles = fs.readdirSync('./').filter(file => file.endsWith('.html'));

// Update each HTML file
htmlFiles.forEach(file => {
  console.log(`Updating ${file}...`);
  
  try {
    // Read file content
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if the file already includes main.js
    if (!content.includes('src="js/main.js"')) {
      // Add main.js before closing head tag
      content = content.replace(
        '</head>',
        '    <script src="js/main.js" defer></script>\n</head>'
      );
      
      // Remove inline slideshow and mobile navigation scripts
      content = content.replace(
        /<script>\s+document\.addEventListener\('DOMContentLoaded', function\(\) \{\s+\/\/ Mobile menu toggle[\s\S]+?<\/script>/g,
        ''
      );
      
      // Write the updated content back to the file
      fs.writeFileSync(file, content, 'utf8');
      console.log(`✅ Updated ${file}`);
    } else {
      console.log(`⚠️ ${file} already includes main.js`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${file}:`, error);
  }
});

console.log('All HTML files have been updated!'); 