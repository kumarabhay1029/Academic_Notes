# 📚 Abhay's Notes Hub - IGNOU Study Notes

This repository contains comprehensive study notes for IGNOU courses, automatically published to GitHub Pages.

## 🌟 Live Site
Visit: `https://kumarabhay1029.github.io/Academic_Notes/`

## 🚀 Features
- **Multiple Format Support**: Upload Markdown (.md), PDF (.pdf), or Word (.docx/.doc) files
- **Automatic Deployment**: Notes are automatically converted to HTML and published when you push to main branch
- **PDF Viewer**: In-browser PDF viewing with download option
- **DOCX Conversion**: Word documents automatically converted to beautiful HTML
- **Image Support**: Images automatically copied and displayed
- **Search Functionality**: Easy search through all notes
- **Clean Design**: Modern, responsive interface
- **Easy to Update**: Just add files and push!

## 📝 How to Add New Notes

### Markdown Files (.md)
1. Create a new markdown file in the root directory
2. Name it using the format: `subject_Topic-Name.md` (e.g., `mcs201_Data-Types.md`)
3. Write your notes in markdown format
4. Commit and push to the main branch

### PDF Files (.pdf)
1. Add your PDF file to the root directory
2. Name it using the format: `subject_Topic-Name.pdf` (e.g., `mcs202_Assembly-Language.pdf`)
3. Commit and push - PDF will be viewable in-browser and downloadable

### Word Documents (.docx or .doc)
1. Add your Word document to the root directory
2. Name it using the format: `subject_Topic-Name.docx` (e.g., `feg02_Essay-Writing.docx`)
3. Commit and push - Document will be converted to beautiful HTML

### Images
- Just add image files (.jpg, .png, .gif, etc.) to the root directory
- Reference them in your markdown files
- They'll be automatically copied and displayed

**File Naming Convention**: Always use `SubjectCode_Topic-Name.ext` format for best results!

## 🔧 Manual Testing (Optional)

If you want to test the site locally before pushing:

```bash
# Install dependencies
npm install

# Generate the site
npm run build

# The generated site will be in the 'dist' folder
```

## 📂 Repository Structure
```
.
├── .github/workflows/deploy.yml  # GitHub Actions workflow
├── scripts/generate-site.js      # Enhanced site generator
├── *.md                          # Your markdown notes
├── *.pdf                         # Your PDF files
├── *.docx                        # Your Word documents
├── *.jpg, *.png, etc.           # Your images
├── package.json                  # Dependencies
└── README.md                     # This file
```

## 💡 Tips
- Use clear, descriptive filenames for your notes
- For markdown: Include proper formatting (headings, lists, code blocks, images)
- For PDFs: Make sure they're not password protected
- For Word docs: Use standard formatting for best conversion results
- Images are automatically detected and copied to the site
- Notes are automatically organized by subject code

## 🤝 Sharing with Friends
Simply share the live site URL with your friends. They can:
- Browse all notes
- Search for specific topics
- Read notes in any format (MD, PDF, DOCX)
- View and download PDFs
- Access notes on any device

## 🎓 Supported File Types
- **Markdown** (.md) - Full markdown support with syntax highlighting
- **PDF** (.pdf) - In-browser viewing + download
- **Word** (.docx, .doc) - Converted to HTML automatically
- **Images** (.jpg, .jpeg, .png, .gif, .svg, .webp, .bmp)

---
**Last Updated**: Auto-updated on every push  
**Made with**: ❤️ for IGNOU students
