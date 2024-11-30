// Tallimantra Component Loader
async function loadComponent(name, targetId) {
    try {
        const response = await fetch(`/tallimantra/components/${name}.html`);
        const html = await response.text();
        document.getElementById(targetId).innerHTML = html;
    } catch (error) {
        console.error(`Failed to load ${name} component:`, error);
    }
}

// Load all components when document is ready
document.addEventListener('DOMContentLoaded', () => {
    // Load header if container exists
    const headerContainer = document.getElementById('tm-header');
    if (headerContainer) {
        loadComponent('header', 'tm-header');
    }

    // Load footer if container exists
    const footerContainer = document.getElementById('tm-footer');
    if (footerContainer) {
        loadComponent('footer', 'tm-footer');
    }
}); 