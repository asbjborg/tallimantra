// Markdown loader for Tallimantra
async function loadMarkdownPage(markdownPath) {
    try {
        // Load the markdown content
        const mdResponse = await fetch(markdownPath);
        const mdContent = await mdResponse.text();
        
        // Load the template
        const templateResponse = await fetch('/tallimantra/components/markdown-page.html');
        const template = await templateResponse.text();
        
        // Extract title from first h1 in markdown
        const titleMatch = mdContent.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : 'Tallimantra';
        
        // Replace placeholders
        const html = template
            .replace('{{title}}', title)
            .replace('{{content}}', mdContent);
        
        // Replace the entire document
        document.documentElement.innerHTML = html;
        
        // Load marked.js for markdown rendering
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
        script.onload = () => {
            // Convert markdown content
            const contentDiv = document.querySelector('.content');
            contentDiv.innerHTML = marked.parse(mdContent);
            
            // Highlight code blocks if prism.js is available
            if (window.Prism) {
                Prism.highlightAll();
            }
        };
        document.head.appendChild(script);
        
        // Add syntax highlighting
        const prismCSS = document.createElement('link');
        prismCSS.rel = 'stylesheet';
        prismCSS.href = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css';
        document.head.appendChild(prismCSS);
        
        const prismJS = document.createElement('script');
        prismJS.src = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js';
        document.head.appendChild(prismJS);
        
    } catch (error) {
        console.error('Failed to load markdown page:', error);
    }
}

// Auto-load markdown if path is provided
const markdownPath = document.currentScript.getAttribute('data-markdown');
if (markdownPath) {
    loadMarkdownPage(markdownPath);
} 