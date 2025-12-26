const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
let mammoth;
try { mammoth = require('mammoth'); } catch (_) { mammoth = null; }

marked.setOptions({ mangle: false, headerIds: true });

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const notesDir = path.join(distDir, 'notes');
const pdfDir = path.join(distDir, 'pdfs');
const imgDir = path.join(distDir, 'images');
const docsDir = path.join(distDir, 'docs');

function ensureDir(dir) { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); }

const EXCLUDE = new Set(['README.md','SETUP_INSTRUCTIONS.md','IMPLEMENTATION_COMPLETE.md','QUICK_START.md','DEPLOYMENT_FIX.md']);
const IMAGE_EXTS = ['.jpg','.jpeg','.png','.gif','.svg','.webp','.bmp'];
const EXCLUDE_DIRS = new Set(['.git','dist','node_modules','.github','scripts']);

function parseMeta(filename) {
  const base = path.basename(filename, path.extname(filename));
  const parts = base.split('_');
  const subject = (parts[0] || 'GENERAL').toUpperCase();
  let title = parts.slice(1).join(' ').replace(/-/g, ' ').trim();
  if (!title) title = base.replace(/-/g, ' ').replace(/,/g, ' ').trim();
  return { subject, title, base };
}

function rewriteImgSrc(html) {
  // Rewrite relative img src to ../images/<original-relative-path>
  return html.replace(/<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi, (tag, src) => {
    const isExternal = /^(https?:)?\/\//i.test(src);
    if (isExternal || src.startsWith('data:')) return tag; // keep as is
    if (src.startsWith('/')) return tag; // leave absolute paths
    const normalized = src.replace(/^\.\//, '').replace(/^\.\.\//, '');
    const newSrc = `../images/${normalized}`;
    return tag.replace(src, newSrc);
  });
}

function renderNotePage(title, subject, htmlContent) {
  const content = rewriteImgSrc(htmlContent);
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>${title} - Notes Hub</title><link rel="stylesheet" href="../note-style.css"/></head><body><header><div class="container"><a class="back-link" href="../index.html">← Back to Notes</a><h1>${title}</h1><p class="subject-tag">${subject}</p></div></header><main class="container"><article class="note-content">${content}</article></main><footer><p>&copy; ${new Date().getFullYear()} Student Initiative Group Notes Hub</p></footer></body></html>`;
}

async function build() {
  ensureDir(distDir); ensureDir(notesDir); ensureDir(pdfDir); ensureDir(imgDir); ensureDir(docsDir);

  const allFiles = fs.readdirSync(rootDir);
  const markdownFiles = allFiles.filter(f => f.toLowerCase().endsWith('.md') && !EXCLUDE.has(f));
  const pdfFiles = allFiles.filter(f => f.toLowerCase().endsWith('.pdf'));
  const docxFiles = allFiles.filter(f => f.toLowerCase().endsWith('.docx') || f.toLowerCase().endsWith('.doc'));
  const allRecursive = (function listFilesRecursively(startDir){
    const out = [];
    const stack = [startDir];
    while (stack.length) {
      const dir = stack.pop();
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const ent of entries) {
        const full = path.join(dir, ent.name);
        const rel = path.relative(rootDir, full);
        if (ent.isDirectory()) {
          if (!EXCLUDE_DIRS.has(ent.name)) stack.push(full);
        } else {
          out.push({ full, rel });
        }
      }
    }
    return out;
  })(rootDir);
  const imageFiles = allRecursive.filter(x => IMAGE_EXTS.includes(path.extname(x.full).toLowerCase()));

  const noteCards = [];
  const errors = [];

  // Copy images (preserve subfolder structure under dist/images)
  for (const img of imageFiles) {
    try {
      const target = path.join(imgDir, img.rel);
      ensureDir(path.dirname(target));
      fs.copyFileSync(img.full, target);
    } catch (e) { errors.push(`${img.rel}: ${e.message}`); }
  }

  // Markdown → HTML
  for (const file of markdownFiles) {
    try {
      const content = fs.readFileSync(path.join(rootDir, file), 'utf-8');
      const { subject, title, base } = parseMeta(file);
      const htmlContent = marked.parse(content);
      const noteHtml = renderNotePage(title, subject, htmlContent);
      const htmlFileName = `${base}.html`;
      fs.writeFileSync(path.join(notesDir, htmlFileName), noteHtml, 'utf-8');
      const plain = content.replace(/[#*`\[\]>]/g, ' ').replace(/\s+/g, ' ').trim();
      const description = (plain.length > 160 ? plain.slice(0, 160) + '…' : plain);
      noteCards.push({ subject, title, description, link: `notes/${htmlFileName}` });
    } catch (e) { errors.push(`${file}: ${e.message}`); }
  }

  // DOCX → HTML (via mammoth) + downloadable
  for (const file of docxFiles) {
    try {
      const srcPath = path.join(rootDir, file);
      const { subject, title, base } = parseMeta(file);
      fs.copyFileSync(srcPath, path.join(docsDir, file));
      let htmlContent = `<p><a class="btn view-btn" href="../docs/${file}" download>⬇️ Download DOCX</a></p>`;
      if (mammoth) {
        const result = await mammoth.convertToHtml({ path: srcPath });
        htmlContent = result.value || htmlContent;
      }
      const noteHtml = renderNotePage(title + ' (DOCX)', subject, htmlContent);
      const htmlFileName = `${base}.html`;
      fs.writeFileSync(path.join(notesDir, htmlFileName), noteHtml, 'utf-8');
      noteCards.push({ subject, title, description: 'Word document', link: `notes/${htmlFileName}` });
    } catch (e) { errors.push(`${file}: ${e.message}`); }
  }

  // PDF viewer pages
  for (const file of pdfFiles) {
    try {
      const { subject, title, base } = parseMeta(file);
      fs.copyFileSync(path.join(rootDir, file), path.join(pdfDir, file));
      const viewerHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>${title} - PDF Viewer</title><link rel="stylesheet" href="../note-style.css"/><style>.pdf-frame{width:100%;height:80vh;border:1px solid var(--border);border-radius:12px}</style></head><body><header><div class="container"><a class="back-link" href="../index.html">← Back to Notes</a><h1>${title}</h1><p class="subject-tag">${subject}</p></div></header><main class="container"><div class="note-content"><p><a class="btn view-btn" href="../pdfs/${file}" download>⬇️ Download PDF</a></p><iframe class="pdf-frame" src="../pdfs/${file}"></iframe></div></main><footer><p>&copy; ${new Date().getFullYear()} Student Initiative Group Notes Hub</p></footer></body></html>`;
      const htmlFileName = `${base}.html`;
      fs.writeFileSync(path.join(notesDir, htmlFileName), viewerHtml, 'utf-8');
      noteCards.push({ subject, title, description: 'PDF note', link: `notes/${htmlFileName}` });
    } catch (e) { errors.push(`${file}: ${e.message}`); }
  }

  // Index with subject filter chips
  const subjects = Array.from(new Set(noteCards.map(n => n.subject)));
  const indexHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>Student Initiative Group Notes Hub</title><link rel="stylesheet" href="style.css"/></head><body><header><div class="container"><div class="header-content"><h1>📚 Student Initiative Group Notes Hub</h1><p class="subtitle">IGNOU Study Notes & Resources</p></div></div></header><main class="container"><section class="search-section"><input id="search-bar" type="text" placeholder="🔍 Search notes by subject or topic..."/><div id="subject-chips" class="chips"><button class="chip active" data-subject="">All</button>${subjects.map(s=>`<button class=\"chip\" data-subject=\"${String(s).toLowerCase()}\">${s}</button>`).join('')}</div></section><section class="stats"><div class="stat-card"><div class="stat-number">${noteCards.length}</div><div class="stat-label">Total Notes</div></div><div class="stat-card"><div class="stat-number">${new Set(noteCards.map(n => n.subject)).size}</div><div class="stat-label">Subjects</div></div><div class="stat-card"><div class="stat-number">Updated</div><div class="stat-label">${new Date().toLocaleDateString()}</div></div></section><section class="notes-section"><h2>📖 Available Notes</h2><div id="notes-grid" class="notes-grid">${noteCards.map(n=>{const subj=n.subject.replace(/\"/g,'&quot;').toLowerCase();const ttl=n.title.replace(/\"/g,'&quot;').toLowerCase();const link=n.link.replace(/\"/g,'&quot;');return `<div class="note-card" data-subject="${subj}" data-title="${ttl}"><div class="note-header"><span class="subject-badge">${n.subject}</span></div><h3>${n.title}</h3><p class="note-description">${n.description}</p><div class="note-footer"><a class="btn view-btn" href="${link}">View Notes</a></div></div>`;}).join('')}</div></section><section class="about-section"><h2>About This Hub</h2><p>Notes are automatically updated when new content is added to the repository. Share with your friends and study together! 🎓</p></section></main><footer><p>&copy; ${new Date().getFullYear()} Student Initiative Group Notes Hub</p><p>Last updated: ${new Date().toLocaleString()}</p></footer><script>(function(){const searchBar=document.getElementById('search-bar');const cards=Array.from(document.querySelectorAll('.note-card'));const chips=Array.from(document.querySelectorAll('.chip'));let activeSubject='';function applyFilter(){const q=(searchBar.value||'').toLowerCase();cards.forEach(c=>{const s=c.dataset.subject||'';const t=c.dataset.title||'';const subjectMatch=!activeSubject||s===activeSubject;const textMatch=s.includes(q)||t.includes(q);c.style.display=(subjectMatch&&textMatch)?'block':'none';});}chips.forEach(ch=>{ch.addEventListener('click',()=>{chips.forEach(x=>x.classList.remove('active'));ch.classList.add('active');activeSubject=(ch.dataset.subject||'');applyFilter();});});searchBar.addEventListener('input',applyFilter);})();</script></body></html>`;

  fs.writeFileSync(path.join(distDir, 'index.html'), indexHtml, 'utf-8');

  // Styles
  const styleCSS = `:root{--primary:#2563eb;--primary-dark:#1e40af;--primary-light:#3b82f6;--secondary:#06b6d4;--accent:#8b5cf6;--bg:#f8fafc;--bg-secondary:#f1f5f9;--card:#ffffff;--text:#0f172a;--text-muted:#64748b;--border:#e2e8f0;--shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.08);--shadow-lg:0 10px 30px rgba(0,0,0,.12),0 4px 8px rgba(0,0,0,.08);--shadow-xl:0 20px 40px rgba(0,0,0,.15),0 8px 16px rgba(0,0,0,.1);--transition:all .3s cubic-bezier(.4,0,.2,1)}*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu',sans-serif;background:var(--bg);color:var(--text);line-height:1.6}.container{max-width:1200px;margin:0 auto;padding:0 1rem}@media(min-width:768px){.container{padding:0 2rem}}header{background:linear-gradient(135deg,var(--primary) 0%,var(--accent) 50%,var(--secondary) 100%);color:#fff;padding:3rem 0;text-align:center;box-shadow:var(--shadow-xl)}.header-content h1{font-size:clamp(1.5rem,5vw,2.5rem);margin-bottom:.5rem;font-weight:800;text-shadow:0 2px 4px rgba(0,0,0,.2)}.subtitle{font-size:clamp(.9rem,3vw,1.2rem)}.search-section{margin:2rem 0}#search-bar{width:100%;padding:1rem 1.5rem;border:2px solid var(--border);border-radius:50px;background:var(--card);box-shadow:var(--shadow)}#search-bar:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px rgba(3,102,214,.1)}.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1rem;margin:2rem 0}.stat-card{background:linear-gradient(135deg,var(--card) 0%,var(--bg-secondary) 100%);padding:1.5rem;border-radius:16px;text-align:center;box-shadow:var(--shadow);border:1px solid var(--border)}.stat-number{font-size:clamp(1.5rem,4vw,2rem);font-weight:800;background:linear-gradient(135deg,var(--primary) 0%,var(--accent) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:.5rem}.stat-label{color:var(--text-muted)}.notes-section{margin:2rem 0}.notes-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr));gap:1.25rem;margin-top:2rem}.note-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:1.5rem;box-shadow:var(--shadow);transition:var(--transition);display:flex;flex-direction:column;position:relative}.note-card:hover{transform:translateY(-6px);box-shadow:var(--shadow-xl);border-color:var(--primary-light)}.note-header{margin-bottom:.75rem}.subject-badge{display:inline-block;background:linear-gradient(135deg,var(--primary) 0%,var(--accent) 100%);color:#fff;padding:.4rem 1rem;border-radius:24px;font-size:.75rem;font-weight:700;text-transform:uppercase}.note-card h3{font-size:clamp(1.1rem,3vw,1.3rem);margin-bottom:.75rem}.note-description{color:var(--text-muted);font-size:clamp(.85rem,2.5vw,.95rem);margin-bottom:1rem;line-height:1.5;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.note-footer{display:flex;gap:.5rem;margin-top:auto}.btn{display:inline-block;padding:.75rem 1rem;border-radius:8px;text-decoration:none;font-weight:600;transition:all .3s ease;text-align:center;cursor:pointer;font-size:.9rem;white-space:nowrap}.view-btn{background:linear-gradient(135deg,var(--primary) 0%,var(--primary-light) 100%);color:#fff;box-shadow:0 4px 12px rgba(37,99,235,.3)}.view-btn:hover{background:linear-gradient(135deg,var(--primary-dark) 0%,var(--primary) 100%)}.about-section{background:linear-gradient(135deg,var(--card) 0%,var(--bg-secondary) 100%);padding:2rem;border-radius:16px;box-shadow:var(--shadow);border:1px solid var(--border)}footer{text-align:center;padding:2rem 0;color:var(--text-muted);border-top:1px solid var(--border);margin-top:3rem}@media(max-width:768px){.notes-grid{grid-template-columns:1fr}}.chips{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem}.chip{padding:.5rem .9rem;border-radius:999px;border:1px solid var(--border);background:var(--card);color:var(--text);font-weight:600;cursor:pointer;box-shadow:var(--shadow);transition:var(--transition)}.chip:hover{border-color:var(--primary-light);transform:translateY(-2px)}.chip.active{background:linear-gradient(135deg,var(--primary) 0%,var(--primary-light) 100%);color:#fff;border-color:transparent;box-shadow:var(--shadow-lg)}`;

  const noteStyleCSS = `:root{--primary:#2563eb;--primary-dark:#1e40af;--primary-light:#3b82f6;--accent:#8b5cf6;--secondary:#06b6d4;--bg:#f8fafc;--bg-secondary:#f1f5f9;--card:#fff;--text:#0f172a;--text-muted:#64748b;--border:#e2e8f0;--code-bg:#f1f5f9;--shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.08);--shadow-lg:0 10px 30px rgba(0,0,0,.12),0 4px 8px rgba(0,0,0,.08);--transition:all .3s cubic-bezier(.4,0,.2,1)}*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu',sans-serif;background:var(--bg);color:var(--text);line-height:1.7}.container{max-width:900px;margin:0 auto;padding:0 1rem}@media(min-width:768px){.container{padding:0 2rem}}header{background:linear-gradient(135deg,var(--primary) 0%,var(--accent) 50%,var(--secondary) 100%);color:#fff;padding:2rem 0;box-shadow:var(--shadow-lg)}.back-link{color:#fff;text-decoration:none;margin-bottom:1rem;font-weight:700}.subject-tag{display:inline-block;background:rgba(255,255,255,.2);padding:.3rem 1rem;border-radius:20px}.note-content{background:var(--card);padding:2rem 1.5rem;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,.1);border:1px solid var(--border);overflow-x:hidden}@media(min-width:768px){.note-content{padding:3rem}}.note-content h1{font-size:2rem;margin:2rem 0 1rem;border-bottom:3px solid var(--primary);padding-bottom:.5rem}.note-content h2{font-size:1.6rem;margin:1.5rem 0 1rem}.note-content h3{font-size:1.3rem;margin:1.25rem 0 .75rem}.note-content p{margin-bottom:1rem}.note-content ul,.note-content ol{margin:1rem 0 1rem 2rem}.note-content code{background:var(--code-bg);padding:.2rem .4rem;border-radius:4px;font-family:'Courier New',monospace}.note-content pre{background:var(--code-bg);padding:1rem;border-radius:8px;overflow-x:auto;margin:1rem 0;border:1px solid var(--border)}.note-content table{width:100%;border-collapse:collapse;margin:1.5rem 0;display:block;overflow-x:auto}.note-content th,.note-content td{border:1px solid var(--border);padding:.75rem;text-align:left}.note-content blockquote{border-left:4px solid var(--primary);padding-left:1rem;margin:1rem 0;color:var(--text-muted);font-style:italic}.note-content a{color:var(--primary);text-decoration:none;border-bottom:2px solid transparent;font-weight:600}.note-content a:hover{border-bottom-color:var(--primary)}.note-content img{max-width:100%;height:auto;border-radius:12px;margin:1.5rem auto;display:block;box-shadow:var(--shadow-lg);border:1px solid var(--border)}footer{text-align:center;padding:2rem 0;color:var(--text-muted);border-top:1px solid var(--border);margin-top:3rem}`;

  fs.writeFileSync(path.join(distDir, 'style.css'), styleCSS, 'utf-8');
  fs.writeFileSync(path.join(distDir, 'note-style.css'), noteStyleCSS, 'utf-8');

  console.log(`✅ Generated ${noteCards.length} note page(s)`);
  console.log(`📦 Output: ${distDir}`);
  if (errors.length) { console.log('⚠️ Skipped files:'); errors.forEach(e => console.log(' - ' + e)); }
}

build().catch(err => { console.error('Build failed:', err); process.exit(1); });
