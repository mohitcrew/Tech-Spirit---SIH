const fs = require('fs');
['src/auth/auth.service.ts', 'src/courses/courses.service.ts'].forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/\uFFFD/g, ''); // Replacement character
    content = content.replace(/[\x00-\x1F\x7F-\x9F]/g, c => c === '\n' || c === '\r' || c === '\t' ? c : '');
    fs.writeFileSync(f, content, 'utf8');
});
