# Shree Cutchi Leva Patel Samaj Website

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

## Project Organization

- **Components**: Reusable UI components like headers and footers
- **Pages**: Individual HTML pages for different sections of the website
- **Data**: JSON files for event data and other dynamic content
- **Assets**: Images and other static files

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request 