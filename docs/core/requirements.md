# Requirements

## Functional Requirements

- **Forkability:** Easy to fork and modify.
- **Customizable Logic and Modules:** Users can configure chatbot behavior and integrate additional modules.
- **Dynamic Feature Addition:** Users can request and deploy new functions/modules by interacting with their chatbot.
- **Community Integration:** A streamlined process for sharing modifications with others.
- **API Compatibility:** Works with any API-supported tools and data sources.
- **Plugin Support:** Initial support for an "interact with n8n endpoint" plugin.

## Non-Functional Requirements

- **User-Friendly Setup:** Initial focus on simple forking and hosting (VM/Replit).
- **Clear Documentation:** Comprehensive guides for contributors and users.
- **Network-Safe Licensing:** AGPL license protection.
- **Styling Customizability:** Easy modification of colors, fonts, and sizes through GUIs or simple syntax.
- **User Authentication:** Supabase-based authentication with separate user data and chat histories.

## Roadmap

- **Phase 1:** Build modular frontend with n8n endpoint plugin support
- **Phase 2:** Add chatbot self-modification capabilities
- **Phase 3:** Introduce community sharing and plugin store
- **Phase 4:** Implement n8n flow for plugin pull requests
- **Phase 5:** Enhance open-source backend integrations 