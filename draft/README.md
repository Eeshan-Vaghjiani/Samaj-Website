# Shree Cutchi Leva Patel Samaj Website
npx http-server -o ./src/pages/index.html
This repository contains the website for the Shree Cutchi Leva Patel Samaj community in Nairobi, Kenya.

## Project Structure

```
├── src/                  # Source files
│   ├── js/               # JavaScript files
│   ├── css/              # CSS files
│   ├── components/       # Reusable components (header, footer)
│   ├── pages/            # HTML pages
│   ├── assets/           # Assets (images, fonts)
│   └── data/             # JSON data files
├── dist/                 # Compiled assets
├── node_modules/         # Node.js dependencies
└── Timeline Related Photos/ # Image assets for the timeline
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Development

The website uses:
- HTML5
- CSS3
- JavaScript (ES6+)
- Tailwind CSS for styling

### Building CSS

To build the CSS files:
```
npm run build:css
```

To watch for CSS changes during development:
```
npm run watch:css
```
