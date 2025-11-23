const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Create dist directory
const distDir = path.join(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Create notes directory in dist
const notesDir = path.join(distDir, 'notes');
if (!fs.existsSync(notesDir)) {
    fs.mkdirSync(notesDir, { recursive: true });
}

// Create assets and pdfs directories
const assetsDir = path.join(distDir, 'assets');
const pdfsDir = path.join(distDir, 'pdfs');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}
if (!fs.existsSync(pdfsDir)) {
    fs.mkdirSync(pdfsDir, { recursive: true });
}

// Read all markdown files (exclude documentation files)
const markdownFiles = fs.readdirSync(__dirname + '/..')
    .filter(file => file.endsWith('.md') && 
            file !== 'README.md' && 
            file !== 'SETUP_INSTRUCTIONS.md' &&
            file !== 'IMPLEMENTATION_COMPLETE.md' &&
            file !== 'QUICK_START.md' &&
            file !== 'DEPLOYMENT_FIX.md' &&
            file !== 'FINAL_STATUS.md');

console.log(`Found ${markdownFiles.length} markdown files`);

// Generate HTML for each markdown file
const noteCards = [];

markdownFiles.forEach(file => {
    try {
        const filePath = path.join(__dirname, '..', file);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // Extract title from filename
        const filename = path.basename(file, '.md');
        const parts = filename.split('_');
        
        // Try to extract subject code and title
        let subject = parts[0].toUpperCase();
        let title = parts.slice(1).join(' ').replace(/-/g, ' ');
        
        // If title is empty, use filename
        if (!title) {
            title = filename.replace(/-/g, ' ').replace(/,/g, ' ');
        } else {
            title = title.replace(/,/g, ' ');
        }
        
        // Clean up extra spaces
        title = title.replace(/\s+/g, ' ').trim();
        
        // Generate HTML content
        const htmlContent = marked(content);
    
    // Create HTML page for the note
    const noteHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Student Initiative Group Notes Hub</title>
    <link rel="stylesheet" href="../note-style.css">
</head>

let errorFiles = [];
markdownFiles.forEach(file => {
    try {
        const filePath = path.join(__dirname, '..', file);
        const content = fs.readFileSync(filePath, 'utf-8');

        // Extract title from filename
        const filename = path.basename(file, '.md');
        const parts = filename.split('_');

        // Try to extract subject code and title
        let subject = parts[0].toUpperCase();
        let title = parts.slice(1).join(' ').replace(/-/g, ' ');

        // If title is empty, use filename
        if (!title) {
            title = filename.replace(/-/g, ' ').replace(/,/g, ' ');
        } else {
            title = title.replace(/,/g, ' ');
        }

        // Clean up extra spaces
        title = title.replace(/\s+/g, ' ').trim();

        // Generate HTML content
        const htmlContent = marked(content);

        // Create HTML page for the note
        const noteHtml = `<!DOCTYPE html>
<body>
    <header>
        <div class="container">
            <a href="../index.html" class="back-link">← Back to Notes</a>
            <h1>${title}</h1>
            <p class="subject-tag">${subject}</p>
        </div>
    </header>
    <main class="container">
        <article class="note-content">
            ${htmlContent}
        </article>
    </main>
    <footer>
        <p>&copy; ${new Date().getFullYear()} Student Initiative Group Notes Hub. All rights reserved.</p>
    </footer>
</body>
</html>`;
    
    // Save the HTML file
    const htmlFileName = filename + '.html';
    fs.writeFileSync(path.join(notesDir, htmlFileName), noteHtml);
    
    // Create a short description (first 150 chars of content)
    const plainText = content.replace(/[#*`\[\]]/g, '').substring(0, 150);

        // Save the HTML file
        const htmlFileName = filename + '.html';
        fs.writeFileSync(path.join(notesDir, htmlFileName), noteHtml);

        // Create a short description (first 150 chars of content)
        const plainText = content.replace(/[#*`\[\]]/g, '').substring(0, 150);
        const description = plainText.trim() + '...';

        // Add to note cards
        noteCards.push({
            subject: subject,
            title: title,
            description: description,
            link: `notes/${htmlFileName}`,
            file: filename
        });
    } catch (error) {
        errorFiles.push(file);
        console.error(`Error processing file ${file}:`, error.message);
    }
});

if (errorFiles.length > 0) {
    console.log('The following files could not be processed and were skipped:');
    errorFiles.forEach(f => console.log(' - ' + f));
}
    const description = plainText.trim() + '...';
    
    // Add to note cards
    noteCards.push({
        subject: subject,
        title: title,
        description: description,
        link: `notes/${htmlFileName}`,
        file: filename
    });
    } catch (error) {
        console.error(`Error processing file ${file}:`, error.message);
    }
});

// Generate index.html
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Initiative Group Notes Hub - IGNOU Study Notes</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <div class="container">
            <div class="header-content">
                <h1>📚 Student Initiative Group Notes Hub</h1>
                <p class="subtitle">IGNOU Study Notes & Resources</p>
            </div>
        </div>
    </header>
    
    <main class="container">
        <section class="search-section">
            <input type="text" id="search-bar" placeholder="🔍 Search notes by subject or topic...">
        </section>
        
        <section class="stats">
            <div class="stat-card">
                <div class="stat-number">${noteCards.length}</div>
                <div class="stat-label">Total Notes</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${new Set(noteCards.map(n => n.subject)).size}</div>
                <div class="stat-label">Subjects</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">Updated</div>
                <div class="stat-label">${new Date().toLocaleDateString()}</div>
            </div>
        </section>
        
        <section class="notes-section">
            <h2>📖 Available Notes</h2>
            <div class="notes-grid" id="notes-grid">
                ${noteCards.map(note => {
                    const escapedSubject = note.subject.toLowerCase().replace(/"/g, '&quot;');
                    const escapedTitle = note.title.toLowerCase().replace(/"/g, '&quot;');
                    const escapedLink = note.link.replace(/"/g, '&quot;');
                    return `
                <div class="note-card" data-subject="${escapedSubject}" data-title="${escapedTitle}">
                    <div class="note-header">
                        <span class="subject-badge">${note.subject}</span>
                    </div>
                    <h3>${note.title}</h3>
                    <p class="note-description">${note.description}</p>
                    <div class="note-footer">
                        <a href="${escapedLink}" class="btn view-btn">View Notes</a>
                    </div>
                </div>
                `;
                }).join('')}
            </div>
        </section>
        
        <section class="about-section">
            <h2>About This Hub</h2>
            <p>This is a collection of study notes for IGNOU courses. Notes are automatically updated when new content is added to the repository. Share with your friends and study together! 🎓</p>
            <p><strong>How to use:</strong> Browse the notes above, use the search bar to find specific topics, and click "View Notes" to read them.</p>
        </section>
    </main>
    
    <footer>
        <p>&copy; ${new Date().getFullYear()} Student Initiative Group Notes Hub. All rights reserved.</p>
        <p>Last updated: ${new Date().toLocaleString()}</p>
    </footer>
    
    <script>
        // Search functionality
        const searchBar = document.getElementById('search-bar');
        const notesGrid = document.getElementById('notes-grid');
        const noteCards = document.querySelectorAll('.note-card');
        
        searchBar.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            noteCards.forEach(card => {
                const subject = card.dataset.subject;
                const title = card.dataset.title;
                
                if (subject.includes(searchTerm) || title.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    </script>
</body>
</html>`;

fs.writeFileSync(path.join(distDir, 'index.html'), indexHtml);

// Copy CSS files
const styleCSS = `/* Modern styling for the notes hub */
:root {
    --primary: #2563eb;
    --primary-dark: #1e40af;
    --primary-light: #3b82f6;
    --secondary: #06b6d4;
    --secondary-dark: #0891b2;
    --accent: #8b5cf6;
    --bg: #f8fafc;
    --bg-secondary: #f1f5f9;
    --card: #ffffff;
    --text: #0f172a;
    --text-muted: #64748b;
    --border: #e2e8f0;
    --shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08);
    --shadow-lg: 0 10px 30px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08);
    --shadow-xl: 0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1);
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    overflow-x: hidden;
    width: 100%;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.6;
    overflow-x: hidden;
    width: 100%;
    max-width: 100vw;
}

.container {
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 0 1rem;
}

@media (min-width: 768px) {
    .container {
        padding: 0 2rem;
    }
}

/* Header */
header {
    background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 50%, var(--secondary) 100%);
    color: white;
    padding: 3rem 0;
    text-align: center;
    box-shadow: var(--shadow-xl);
    width: 100%;
    position: relative;
    overflow: hidden;
}

header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.05) 50%, transparent 60%);
    background-size: 200% 200%;
    animation: shimmer 3s infinite;
}

@keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}

.header-content h1 {
    font-size: clamp(1.5rem, 5vw, 2.5rem);
    margin-bottom: 0.5rem;
    font-weight: 800;
    padding: 0 1rem;
    word-wrap: break-word;
    position: relative;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    letter-spacing: -0.5px;
}

.subtitle {
    font-size: clamp(0.9rem, 3vw, 1.2rem);
    opacity: 0.95;
    padding: 0 1rem;
    position: relative;
    font-weight: 500;
}

/* Search Section */
.search-section {
    margin: 2rem 0;
}

#search-bar {
    width: 100%;
    padding: 1rem 1.5rem;
    font-size: 1rem;
    border: 2px solid var(--border);
    border-radius: 50px;
    background: var(--card);
    transition: all 0.3s ease;
    box-shadow: var(--shadow);
}

#search-bar:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(3, 102, 214, 0.1);
}

/* Stats Section */
.stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin: 2rem 0;
    width: 100%;
}

.stat-card {
    background: linear-gradient(135deg, var(--card) 0%, var(--bg-secondary) 100%);
    padding: 1.5rem;
    border-radius: 16px;
    text-align: center;
    box-shadow: var(--shadow);
    border: 1px solid var(--border);
    min-width: 0;
    transition: var(--transition);
}

.stat-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary-light);
}

.stat-number {
    font-size: clamp(1.5rem, 4vw, 2rem);
    font-weight: 800;
    background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5rem;
}

.stat-label {
    color: var(--text-muted);
    font-size: clamp(0.8rem, 2vw, 0.9rem);
    word-wrap: break-word;
}

/* Notes Section */
.notes-section {
    margin: 2rem 0;
    width: 100%;
}

.notes-section h2 {
    font-size: clamp(1.5rem, 4vw, 2rem);
    margin-bottom: 1.5rem;
    color: var(--text);
    padding: 0 0.5rem;
}

.notes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
    gap: 1.25rem;
    margin-top: 2rem;
    width: 100%;
}

.note-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: var(--shadow);
    transition: var(--transition);
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
    position: relative;
}

.note-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary) 0%, var(--accent) 50%, var(--secondary) 100%);
    transform: scaleX(0);
    transition: transform 0.3s ease;
}

.note-card:hover::before {
    transform: scaleX(1);
}

.note-card:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-xl);
    border-color: var(--primary-light);
}

.note-header {
    margin-bottom: 0.75rem;
}

.subject-badge {
    display: inline-block;
    background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
    color: white;
    padding: 0.4rem 1rem;
    border-radius: 24px;
    font-size: 0.75rem;
    font-weight: 700;
    word-break: break-word;
    max-width: 100%;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}

.note-card h3 {
    font-size: clamp(1.1rem, 3vw, 1.3rem);
    margin-bottom: 0.75rem;
    color: var(--text);
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
}

.note-description {
    color: var(--text-muted);
    font-size: clamp(0.85rem, 2.5vw, 0.95rem);
    margin-bottom: 1rem;
    line-height: 1.5;
    word-wrap: break-word;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

.note-footer {
    display: flex;
    gap: 0.5rem;
    margin-top: auto;
}

.btn {
    display: inline-block;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    text-align: center;
    cursor: pointer;
    font-size: 0.9rem;
    white-space: nowrap;
}

.view-btn {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
    color: white;
    flex: 1;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.view-btn:hover {
    background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
}

/* About Section */
.about-section {
    background: linear-gradient(135deg, var(--card) 0%, var(--bg-secondary) 100%);
    padding: 2rem;
    border-radius: 16px;
    margin: 2rem 0;
    box-shadow: var(--shadow);
    border: 1px solid var(--border);
    width: 100%;
}

.about-section h2 {
    font-size: clamp(1.3rem, 4vw, 1.8rem);
    margin-bottom: 1rem;
    color: var(--text);
}

.about-section p {
    color: var(--text-muted);
    margin-bottom: 1rem;
    font-size: clamp(0.9rem, 2.5vw, 1rem);
    line-height: 1.6;
}

/* Footer */
footer {
    text-align: center;
    padding: 2rem 0;
    color: var(--text-muted);
    border-top: 1px solid var(--border);
    margin-top: 3rem;
}

footer p {
    margin: 0.25rem 0;
}

/* Responsive */
@media (max-width: 768px) {
    .container {
        padding: 0 1rem;
    }
    
    header {
        padding: 1.5rem 0;
    }
    
    .notes-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .stats {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }
    
    .note-card {
        padding: 1rem;
    }
    
    .about-section {
        padding: 1.25rem;
    }
}

@media (max-width: 480px) {
    .container {
        padding: 0 0.75rem;
    }
    
    .btn {
        padding: 0.6rem 0.8rem;
        font-size: 0.85rem;
    }
}
`;

const noteStyleCSS = `/* Styling for individual note pages */
:root {
    --primary: #2563eb;
    --primary-dark: #1e40af;
    --primary-light: #3b82f6;
    --accent: #8b5cf6;
    --secondary: #06b6d4;
    --bg: #f8fafc;
    --bg-secondary: #f1f5f9;
    --card: #ffffff;
    --text: #0f172a;
    --text-muted: #64748b;
    --border: #e2e8f0;
    --code-bg: #f1f5f9;
    --shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08);
    --shadow-lg: 0 10px 30px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08);
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.7;
}

.container {
    max-width: 900px;
    width: 100%;
    margin: 0 auto;
    padding: 0 1rem;
}

@media (min-width: 768px) {
    .container {
        padding: 0 2rem;
    }
}

/* Header */
header {
    background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 50%, var(--secondary) 100%);
    color: white;
    padding: 2rem 0;
    box-shadow: var(--shadow-lg);
    width: 100%;
    position: relative;
    overflow: hidden;
}

header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.05) 50%, transparent 60%);
    background-size: 200% 200%;
    animation: shimmer 3s infinite;
}

@keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}

.back-link {
    display: inline-block;
    color: white;
    text-decoration: none;
    margin-bottom: 1rem;
    font-weight: 700;
    opacity: 0.95;
    transition: var(--transition);
    font-size: clamp(0.9rem, 2.5vw, 1rem);
    position: relative;
}

.back-link:hover {
    opacity: 1;
    transform: translateX(-4px);
}

header h1 {
    font-size: clamp(1.3rem, 4vw, 2rem);
    margin-bottom: 0.5rem;
    word-wrap: break-word;
    padding: 0 0.5rem;
    position: relative;
    font-weight: 800;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    letter-spacing: -0.5px;
}

.subject-tag {
    display: inline-block;
    background: rgba(255, 255, 255, 0.2);
    padding: 0.3rem 1rem;
    border-radius: 20px;
    font-size: clamp(0.75rem, 2vw, 0.9rem);
    word-wrap: break-word;
}

/* Main Content */
main {
    padding: 1.5rem 0;
    width: 100%;
}

.note-content {
    background: var(--card);
    padding: 2rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--border);
    width: 100%;
    overflow-x: hidden;
}

@media (min-width: 768px) {
    .note-content {
        padding: 3rem;
    }
}

/* Typography */
.note-content h1 {
    font-size: 2rem;
    margin: 2rem 0 1rem;
    color: var(--text);
    border-bottom: 3px solid var(--primary);
    padding-bottom: 0.5rem;
}

.note-content h2 {
    font-size: 1.6rem;
    margin: 1.5rem 0 1rem;
    color: var(--text);
}

.note-content h3 {
    font-size: 1.3rem;
    margin: 1.25rem 0 0.75rem;
    color: var(--text);
}

.note-content p {
    margin-bottom: 1rem;
    color: var(--text);
}

.note-content ul, .note-content ol {
    margin: 1rem 0 1rem 2rem;
}

.note-content li {
    margin-bottom: 0.5rem;
}

/* Code blocks */
.note-content code {
    background: var(--code-bg);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: clamp(0.75rem, 2vw, 0.9em);
    word-wrap: break-word;
}

.note-content pre {
    background: var(--code-bg);
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1rem 0;
    border: 1px solid var(--border);
    max-width: 100%;
}

.note-content pre code {
    background: none;
    padding: 0;
    font-size: clamp(0.7rem, 1.8vw, 0.85em);
}

/* Tables */
.note-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
    display: block;
    overflow-x: auto;
    max-width: 100%;
}

.note-content th, .note-content td {
    border: 1px solid var(--border);
    padding: 0.75rem;
    text-align: left;
    font-size: clamp(0.8rem, 2vw, 0.95rem);
    word-wrap: break-word;
}

.note-content th {
    background: var(--code-bg);
    font-weight: 600;
}

/* Blockquotes */
.note-content blockquote {
    border-left: 4px solid var(--primary);
    padding-left: 1rem;
    margin: 1rem 0;
    color: var(--text-muted);
    font-style: italic;
}

/* Links */
.note-content a {
    color: var(--primary);
    text-decoration: none;
    border-bottom: 2px solid transparent;
    transition: var(--transition);
    font-weight: 600;
}

.note-content a:hover {
    border-bottom-color: var(--primary);
    color: var(--primary-dark);
}

/* Images */
.note-content img {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    margin: 1.5rem auto;
    display: block;
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--border);
    transition: var(--transition);
}

.note-content img:hover {
    transform: scale(1.02);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15), 0 6px 12px rgba(0, 0, 0, 0.1);
}

/* Image with link wrapper */
.note-content a img {
    cursor: pointer;
}

.note-content p > a:has(img) {
    border-bottom: none;
    display: block;
    text-align: center;
    margin: 1.5rem 0;
}

.note-content p > a:has(img)::after {
    content: '=��� Click to view full image';
    display: block;
    margin-top: 0.5rem;
    font-size: 0.85rem;
    color: var(--text-muted);
    font-style: italic;
    font-weight: 500;
}

.note-content p > a:has(img):hover::after {
    color: var(--primary);
}

/* Footer */
footer {
    text-align: center;
    padding: 2rem 0;
    color: var(--text-muted);
    border-top: 1px solid var(--border);
    margin-top: 3rem;
}

/* Responsive */
@media (max-width: 768px) {
    .note-content {
        padding: 1.25rem;
    }
    
    .note-content h1 {
        font-size: 1.5rem;
    }
    
    .note-content h2 {
        font-size: 1.3rem;
    }
    
    .note-content h3 {
        font-size: 1.1rem;
    }
    
    .note-content ul, .note-content ol {
        margin-left: 1.5rem;
    }
}

@media (max-width: 480px) {
    .container {
        padding: 0 0.75rem;
    }
    
    .note-content {
        padding: 1rem;
    }
    
    .note-content pre {
        padding: 0.75rem;
        font-size: 0.75rem;
    }
    
    .note-content th, .note-content td {
        padding: 0.5rem;
        font-size: 0.8rem;
    }
}
`;

fs.writeFileSync(path.join(distDir, 'style.css'), styleCSS);
fs.writeFileSync(path.join(distDir, 'note-style.css'), noteStyleCSS);

console.log('G�� Site generated successfully!');
console.log(`=��� Generated ${noteCards.length} note pages`);
console.log(`=��� Output directory: ${distDir}`);
