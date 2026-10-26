const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const publicDir = path.join(__dirname, '..', 'public');
const svgPath = path.join(publicDir, 'icon.svg');
const svgContent = fs.readFileSync(svgPath, 'utf8');

const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 1024px; height: 1024px; overflow: hidden; background: transparent; }
    svg { width: 1024px; height: 1024px; display: block; }
  </style>
</head>
<body>
  ${svgContent}
</body>
</html>`;

const tempHtml = path.join(publicDir, 'temp_icon.html');
fs.writeFileSync(tempHtml, htmlContent, 'utf8');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outputPng = path.join(publicDir, 'icon.png');
const appIconPng = path.join(publicDir, 'app-icon.png');

const cmd = `"${edgePath}" --headless --disable-gpu --screenshot="${outputPng}" --window-size=1024,1024 --default-background-color=00000000 "file:///${tempHtml.replace(/\\/g, '/')}"`;

try {
  execSync(cmd, { stdio: 'inherit' });
  fs.copyFileSync(outputPng, appIconPng);
  console.log('Successfully generated icon.png and app-icon.png');
} catch (err) {
  console.error('Error generating png:', err);
} finally {
  if (fs.existsSync(tempHtml)) {
    fs.unlinkSync(tempHtml);
  }
}
