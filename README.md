# Premier Schools Exhibition

Discover Gurugram's Top 30+ Schools — All in One Place.

## Overview

A responsive landing page presenting the Gurugram edition of Premier Schools Exhibition. Visitors can view event details, browse school categories and participating-school logos, explore exhibition highlights, and access an enquiry form. The form provides client-side validation and demo feedback; it does not send or store enquiries or book appointments.

## Project Preview

<img src="assets/project-preview.webp" alt="Premier Schools Exhibition landing page shown across desktop, tablet, and mobile devices" width="100%">

## Key Features

- **Continuous hero animation:** Three image columns loop with the outer columns moving upward and the center column moving downward.
- **School showcases:** Two scrolling logo rows and four school-category cards introduce the exhibition content.
- **Responsive carousels:** Category cards support mobile dots, arrow keys, and touch swipes; exhibition highlights use previous/next controls.
- **Enquiry interaction:** Required-field checks, inline errors, invalid-field focus, and a client-side confirmation message.
- **In-page navigation:** Registration and pre-scheduling links lead to the enquiry form below the sticky header.
- **Accessibility support:** Form labels, image alternatives, visible focus styles, and reduced-motion styles are included.

## Live Website & Related Repository

https://premier-schools-exhibition-rosy-ten.vercel.app/

## Tech Stack

- **Markup:** HTML5 with semantic sections and inline SVG icons.
- **Styling:** CSS custom properties, Grid, Flexbox, media queries, and keyframe animations.
- **Interactions:** Vanilla JavaScript and browser DOM APIs; no framework or JavaScript package dependencies.
- **Typography:** Inter through Google Fonts, with system-font fallbacks.
- **Hosting:** Vercel static hosting.

## Prerequisites

- A modern browser.
- Git to clone the repository.
- Python 3 for the local server command below, or another static HTTP server.
- Optional: Node.js for the JavaScript syntax check.

## Installation & Setup

1. Clone the repository:

   ```sh
   git clone https://github.com/mayurbohraa/premier-schools-exhibition.git
   ```

2. Enter the repository:

   ```sh
   cd premier-schools-exhibition
   ```

3. No package installation, environment variables, API keys, or database setup is required. When using an existing project copy, run commands from the directory containing `index.html`.

## Running Locally

Start a static server from the repository root:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000/ and stop the server with `Ctrl+C` when finished.

An optional JavaScript syntax check is available:

```sh
node --check js/main.js
```

There are no package scripts, build step, or automated test suite. The source files are served directly.

## Project Structure

```text
.
├── index.html                 # Page content, form, and inline SVG symbols
├── css/
│   └── styles.css             # Branding, responsive layouts, and animations
├── js/
│   └── main.js                # Scrollers, navigation, validation, and carousels
├── assets/
│   ├── cards/                 # School-category images
│   ├── hero/                  # Hero animation images
│   ├── icons/                 # Exhibition and footer icons
│   ├── schools/               # School logos
│   └── project-preview.webp   # README banner
└── README.md
```

## Acknowledgements & Credits

Typography uses Inter, delivered through Google Fonts.
