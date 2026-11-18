// 없는 주소도 앱이 열리도록 404 페이지 복사

import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve(import.meta.dirname, '../dist');

fs.copyFileSync(path.join(dist, 'index.html'), path.join(dist, '404.html'));
