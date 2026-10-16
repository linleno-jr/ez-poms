# Ez Poms

A one-page, static React site for writing POMs (points of most significance).

- A valid POM is more than 25 and at most 40 words (26–40).
- The top bar counts valid POMs. Enter your required number in the goal box to track "x of y".
- Removing a POM asks "Are you sure?" first.
- Export all POMs with text to .docx or .pdf from the bottom of the page.
- Your work autosaves in your browser (localStorage) on this device.

## Run it

You need Node.js 18+ installed.

    npm install
    npm run dev        # development server
    npm run build      # builds the static site into dist/
    npm run preview    # preview the built site

The built `dist/` folder is plain static files and can be hosted anywhere
(GitHub Pages, Netlify, a school web server, etc.).
