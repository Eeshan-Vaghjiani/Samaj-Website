const fs = require('fs');

// Read the index.html file
let htmlContent = fs.readFileSync('index.html', 'utf8');

// Define the old content to replace
const oldContent = `<div class="trust-initiatives">
                <div class="initiative-card">
                    <div class="initiative-image">
                        <img src="Timeline Related Photos/school.jpg" alt="SCLP School">
                    </div>
                    <div class="initiative-content">
                        <div class="initiative-icon">
                            <span>🏫</span>
                        </div>
                        <h3>SCLP School</h3>
                    </div>
                </div>
                
                <div class="initiative-card">
                    <div class="initiative-image">
                        <img src="Timeline Related Photos/6. Next 10 Years (2008 - 2018)/2016 Free Medical Camp - Eye Checkup.JPG" alt="Medical Clinic">
                    </div>
                    <div class="initiative-content">
                        <div class="initiative-icon">
                            <span>⚕️</span>
                        </div>
                        <h3>Medical Clinic</h3>
                    </div>
                </div>
                
                <div class="initiative-card">
                    <div class="initiative-image">
                        <img src="Timeline Related Photos/6. Next 10 Years (2008 - 2018)/Youth League Kabaddi 2013.jpg" alt="Other Initiatives">
                    </div>
                    <div class="initiative-content">
                        <div class="initiative-icon">
                            <span>🤝</span>
                        </div>
                        <h3>Other Initiatives</h3>
                    </div>
                </div>
            </div>`;

// Define the new content
const newContent = `<div class="committee-cards">
                <div class="committee-card">
                    <a href="charitable-trust.html#school" target="_blank">
                        <div class="committee-img">
                            <img src="Timeline Related Photos/school.jpg" alt="SCLP School">
                        </div>
                        <div class="committee-card-content">
                            <h3>SCLP School</h3>
                        </div>
                    </a>
                </div>
                
                <div class="committee-card">
                    <a href="charitable-trust.html#medical" target="_blank">
                        <div class="committee-img">
                            <img src="Timeline Related Photos/6. Next 10 Years (2008 - 2018)/2016 Free Medical Camp - Eye Checkup.JPG" alt="Medical Clinic">
                        </div>
                        <div class="committee-card-content">
                            <h3>Medical Clinic</h3>
                        </div>
                    </a>
                </div>
                
                <div class="committee-card">
                    <a href="charitable-trust.html#initiatives" target="_blank">
                        <div class="committee-img">
                            <img src="Timeline Related Photos/6. Next 10 Years (2008 - 2018)/Youth League Kabaddi 2013.jpg" alt="Other Initiatives">
                        </div>
                        <div class="committee-card-content">
                            <h3>Other Initiatives</h3>
                        </div>
                    </a>
                </div>
            </div>`;

// Replace the content
htmlContent = htmlContent.replace(oldContent, newContent);

// Write the updated content back to the file
fs.writeFileSync('index.html', htmlContent, 'utf8');

console.log('Trust initiatives section updated successfully!'); 