const fs = require('fs');
const file = 'assets/css/gmv-theme.css';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/#F59E0B/gi, '#D4AF37')
               .replace(/#D97706/gi, '#AA8C2C')
               .replace(/#1E3A8A/gi, '#111111')
               .replace(/#3B82F6/gi, '#E5D3B3')
               .replace(/245, 158, 11/g, '212, 175, 55')
               .replace(/245,158,11/g, '212,175,55')
               .replace(/30, 58, 138/g, '17, 17, 17')
               .replace(/30,58,138/g, '17,17,17')
               .replace(/59,130,246/g, '229,211,179')
               .replace(/--font-heading:.*/g, `--font-heading: 'Playfair Display', serif;`)
               .replace(/--font-body:.*/g, `--font-body: 'Outfit', sans-serif;`);
fs.writeFileSync(file, content);

const file2 = 'assets/css/layout.css';
let layout = fs.readFileSync(file2, 'utf8');
layout = layout.replace(/--p:#F59E0B/g, '--p:#D4AF37')
             .replace(/--pd:#D97706/g, '--pd:#AA8C2C')
             .replace(/--s:#1E3A8A/g, '--s:#111111')
             .replace(/--s2:#162d6e/g, '--s2:#0a0a0a')
             .replace(/30,58,138/g, '17,17,17')
             .replace(/--font:'Inter',system-ui,sans-serif;/g, `--font:'Outfit',system-ui,sans-serif; --font-heading:'Playfair Display',serif;`)
             .replace(/font-size:clamp\(2\.4rem,4vw,3\.6rem\);font-weight:900/g, 'font-size:clamp(2.4rem,4vw,3.6rem);font-weight:700;font-family:var(--font-heading)')
             .replace(/border-bottom:3px solid var\(--p\);/g, 'border-bottom:1px solid rgba(212,175,55,0.3);');
fs.writeFileSync(file2, layout);
console.log('Done!');
