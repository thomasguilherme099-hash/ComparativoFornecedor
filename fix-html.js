import { writeFileSync } from 'fs';

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <title>PaintCompare - Comparador de Preços de Tintas</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/main.css">
  </head>
  <body>
    <div id="root"></div>
    <script src="/main.js"></script>
  </body>
</html>`;

writeFileSync('dist/public/index.html', html);
console.log('HTML file created successfully!');
