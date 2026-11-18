// 분류 정의와 저장소별 덮어쓰기, 미설정 저장소는 기타 분류

export type GroupDef = { key: string; label: string };
export type RepoOverride = {
  label?: string;
  group?: string;
  snippet?: string[];
  // 폴더 이름에서 화면 이름으로
  sections?: Record<string, string>;
};

export const groupDefs: GroupDef[] = [
  { key: 'front', label: 'Frontend' },
  { key: 'back', label: 'Backend' },
  { key: 'data', label: 'Data' },
  { key: 'tools', label: 'Tools' },
  { key: 'etc', label: 'Etc' },
];

export const defaultGroup = 'etc';

// 사이트에 올리지 않는 저장소
export const excluded = ['assignments'];

export const overrides: Record<string, RepoOverride> = {
  'html-css-js': {
    label: 'HTML CSS JS',
    group: 'front',
    snippet: ['.note {', '  color: #0b6e8f;', '}'],
    sections: {
      '04_JSLIB': 'JS 라이브러리',
      '05_SCSS': 'SCSS',
      '06_NODE': 'Node',
    },
  },
  react: {
    label: 'React',
    group: 'front',
    snippet: ['function Study() {', '  return <Note />;', '}'],
  },
  flutter: {
    label: 'Flutter',
    group: 'front',
    snippet: ['void main() {', '  runApp(Study());', '}'],
  },
  java: {
    label: 'Java',
    group: 'back',
    snippet: ['public class Study {', '  void run() {}', '}'],
  },
  jsp: { label: 'JSP', group: 'back', snippet: ['<%= request.getParameter("id") %>'] },
  'spring-boot': {
    label: 'Spring Boot',
    group: 'back',
    snippet: ['@RestController', 'public class NoteController {', '}'],
  },
  fastapi: {
    label: 'FastAPI',
    group: 'back',
    snippet: ['@app.get("/notes")', 'def notes():', '    return []'],
  },
  database: {
    label: 'MySQL',
    group: 'data',
    snippet: ['SELECT title', 'FROM notes', "WHERE topic = 'MySQL'", 'ORDER BY id;'],
  },
  'machine-learning': {
    label: '머신러닝',
    group: 'data',
    snippet: ['model.fit(X, y)', 'model.predict(X_test)'],
  },
  'git-github': {
    label: 'Git',
    group: 'tools',
    snippet: ['git add .', 'git commit -m "feat"', 'git push'],
    sections: {
      '01_Git&Branch': 'Git과 브랜치',
      '02_Link_GitHub': 'GitHub 연동',
    },
  },
  docker: { label: 'Docker', group: 'tools', snippet: ['docker compose up -d', 'docker ps'] },
  'dev-tools': { label: '개발 도구', group: 'tools', snippet: ['npm run dev', 'npm run build'] },
  'vibe-coding': { label: '바이브 코딩', group: 'tools', snippet: ['claude', '> 기능 만들어 줘'] },
};
