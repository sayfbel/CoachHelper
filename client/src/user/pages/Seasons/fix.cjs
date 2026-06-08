const fs = require('fs');
const paths = ['SeasonDetail.jsx', 'MatchScoresheetForm.jsx'];
paths.forEach(p => {
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace(/\\\`/g, '\`');
    content = content.replace(/\\\$/g, '$');
    fs.writeFileSync(p, content);
    console.log('Fixed', p);
});
