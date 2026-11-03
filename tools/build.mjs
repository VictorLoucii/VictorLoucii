// Builds README.md and assets/*.svg. Run from anywhere: node tools/build.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = join(OUT, 'assets');
mkdirSync(ASSETS, { recursive: true });

const SANS = `-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif`;
const MONO = `ui-monospace,SFMono-Regular,Menlo,Consolas,monospace`;
const C = { bg1: '#060b14', bg2: '#0c1626', ink: '#f1f5f9', mute: '#9fb0c6', line: '#2a3a52', cyan: '#22d3ee', yellow: '#facc15', panel: '#101c30' };

const baseStyle = `
  .flow{stroke-dasharray:5 11;animation:flow 2.2s linear infinite}
  .edge{animation:edge 30s linear infinite}
  .pulse{animation:pulse 4s ease-in-out infinite}
  @keyframes flow{to{stroke-dashoffset:-32}}
  @keyframes edge{to{stroke-dashoffset:-1200}}
  @keyframes pulse{50%{opacity:.45}}
  @media (prefers-reduced-motion:reduce){*{animation:none!important}}
  text{font-family:${SANS}}
  .mono{font-family:${MONO}}
`;

const defs = (w, h) => `<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.bg1}"/><stop offset="1" stop-color="${C.bg2}"/></linearGradient>
  <linearGradient id="accent" x1="0" y1="0" x2="${w}" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${C.cyan}"/><stop offset=".7" stop-color="${C.cyan}"/><stop offset="1" stop-color="${C.yellow}"/></linearGradient>
  <pattern id="grid" width="34" height="34" patternUnits="userSpaceOnUse"><path d="M34 0H0V34" fill="none" stroke="#38bdf8" stroke-opacity=".06"/></pattern>
  <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" fill="${C.cyan}"/></marker>
  <marker id="arrowY" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" fill="${C.yellow}"/></marker>
</defs>`;

const svg = (w, h, title, desc, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-labelledby="t d">
<title id="t">${title}</title><desc id="d">${desc}</desc>
<style>${baseStyle}</style>
${defs(w, h)}
${body}
</svg>
`;

const framed = (w, h, title, desc, body) => svg(w, h, title, desc, `
<rect width="${w}" height="${h}" rx="20" fill="url(#bg)"/>
<rect width="${w}" height="${h}" rx="20" fill="url(#grid)"/>
<rect x="8" y="8" width="${w - 16}" height="${h - 16}" rx="14" fill="none" stroke="${C.line}"/>
<rect class="edge" x="8" y="8" width="${w - 16}" height="${h - 16}" rx="14" fill="none" stroke="url(#accent)" stroke-width="2" stroke-dasharray="300 300" stroke-linecap="round"/>
${body}`);

const t = (x, y, s, size, fill, opts = '') => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${opts}>${s}</text>`;
const eyebrow = (x, y, s, fill = C.cyan) => t(x, y, s, 15, fill, 'font-weight="700" letter-spacing="3"');

// ---------- header ----------
const wave = 'M0 0H1200V205C980 275 780 165 560 215C360 260 170 250 0 200Z';
const header = svg(1200, 280, 'AI Engineer', 'Header banner: AI Engineer and full-stack mobile and web developer.', `
<clipPath id="clip"><path d="${wave}"/></clipPath>
<path d="${wave}" fill="url(#bg)"/>
<rect width="1200" height="280" fill="url(#grid)" clip-path="url(#clip)"/>
<path d="M0 200C170 250 360 260 560 215C780 165 980 275 1200 205" fill="none" stroke="${C.line}" stroke-width="2"/>
<path class="flow" d="M0 200C170 250 360 260 560 215C780 165 980 275 1200 205" fill="none" stroke="url(#accent)" stroke-width="3"/>
${t(600, 112, 'AI Engineer', 76, C.ink, 'text-anchor="middle" font-weight="800"')}
${t(600, 160, '&gt; Full-Stack Mobile &amp; Web Developer', 26, C.cyan, 'text-anchor="middle" class="mono"')}`);

// ---------- about console ----------
const rows = [
  ['builds', 'agentic AI and RAG systems, plus mobile and web apps'],
  ['stack', 'Python, LangGraph, FastAPI, Next.js, TypeScript, Supabase'],
  ['learning', 'LLM observability, Model Context Protocol, deterministic routing'],
  ['goal', 'connect AI orchestration to clean front-end experiences'],
  ['activity', '1,800+ contributions in the past year'],
];
const about = framed(1200, 276, 'About Victor', rows.map((r) => `${r[0]}: ${r[1]}`).join('. '), `
${t(70, 66, '$ whoami', 21, C.cyan, 'class="mono"')}
${rows.map((r, i) => t(70, 112 + i * 32, r[0], 20, C.yellow, 'class="mono"') + t(205, 112 + i * 32, r[1], 20, C.ink, 'class="mono"')).join('\n')}`);

// ---------- flagship ----------
const node = (x, s, sub, hi) => `<rect x="${x}" y="125" width="150" height="70" rx="10" fill="${C.panel}" stroke="${hi ? C.cyan : C.line}" stroke-width="${hi ? 2 : 1}"/>
${t(x + 75, 155, s, 19, C.ink, 'text-anchor="middle" font-weight="700"')}${t(x + 75, 178, sub, 15, C.mute, 'text-anchor="middle"')}`;
const xs = [75, 255, 435, 615, 795, 975];
const main = [['Question', 'typed or voice'], ['Input firewall', 'blocks jailbreaks'], ['Fast path', 'direct lookup'], ['Scope router', 'in scope?'], ['Agent', 'LangGraph', true], ['Answer', 'secrets masked']];
const conn = xs.slice(0, 5).map((x) => `<line class="flow" x1="${x + 151}" y1="160" x2="${x + 178}" y2="160" stroke="${C.cyan}" stroke-width="2" marker-end="url(#arrow)"/>`).join('');
const tile = (x, big, label, hi) => `<rect x="${x}" y="436" width="240" height="92" rx="10" fill="${C.panel}" stroke="${C.line}"/>
${t(x + 20, 478, big, 34, hi ? C.yellow : C.cyan, 'font-weight="800"')}${t(x + 20, 508, label, 16, C.mute)}`;
const flagship = framed(1200, 556, 'Unified Knowledge Agent',
  'Pipeline: question, input firewall, fast path, scope router, agent, answer. A human approves heavy tools. Search recall 34 of 34, AI logic 90 of 94, full RAG logic 38 of 41, on 94 test cases.', `
${eyebrow(75, 62, 'FLAGSHIP PROJECT')}
${t(75, 102, 'Unified Knowledge Agent', 36, C.ink, 'font-weight="800"')}
${main.map((m, i) => node(xs[i], m[0], m[1], m[2])).join('\n')}
${conn}
<line x1="510" y1="196" x2="510" y2="232" stroke="${C.mute}" stroke-dasharray="4 5"/>
${t(510, 255, 'Known lookups', 15, C.mute, 'text-anchor="middle"')}${t(510, 276, 'skip the LLM', 15, C.mute, 'text-anchor="middle"')}
<line x1="690" y1="196" x2="690" y2="232" stroke="${C.mute}" stroke-dasharray="4 5"/>
${t(690, 255, 'Out of scope:', 15, C.mute, 'text-anchor="middle"')}${t(690, 276, 'fixed reply', 15, C.mute, 'text-anchor="middle"')}
<line class="flow" x1="925" y1="196" x2="925" y2="236" stroke="${C.yellow}" stroke-width="2" marker-end="url(#arrowY)"/>
<rect class="pulse" x="880" y="238" width="245" height="60" rx="8" fill="${C.yellow}" fill-opacity=".1" stroke="${C.yellow}" stroke-width="2"/>
${t(1002, 263, 'YELLOW CARD', 17, C.yellow, 'text-anchor="middle" font-weight="800" letter-spacing="1"')}${t(1002, 286, 'A human approves heavy tools', 15, C.ink, 'text-anchor="middle"')}
<line class="flow" x1="830" y1="196" x2="830" y2="316" stroke="${C.cyan}" stroke-width="2" marker-end="url(#arrow)"/>
<rect x="435" y="318" width="690" height="72" rx="10" fill="${C.panel}" stroke="${C.line}"/>
${eyebrow(455, 346, 'SEARCH TOOL')}
${t(455, 375, 'expand query &gt; retrieve k=40 &gt; merge to 50 &gt; rerank &gt; top 10', 16, C.ink, 'class="mono"')}
${eyebrow(75, 422, "MEASURED ON THE PROJECT'S OWN TEST SET")}
${tile(75, '94', 'golden test cases')}${tile(345, '34/34', 'search recall@k')}${tile(615, '90/94', 'AI logic score')}${tile(885, '38/41', 'AI logic, full RAG only', true)}`);

// ---------- project tiles ----------
const card = (name, tag, lines, foot) => framed(400, 260, name, `${name}. ${lines.join(' ')} ${foot}`, `
${eyebrow(30, 48, tag)}
${t(30, 88, name, 28, C.ink, 'font-weight="800"')}
${lines.map((l, i) => t(30, 126 + i * 27, l, 19, C.mute)).join('')}
${t(30, 226, foot, 17, C.yellow, 'class="mono"')}`);
const tiles = {
  'project-jobhunt.svg': card('JobHunt', 'AGENT WORKFLOW', ['Screens LinkedIn posts, drafts', 'the email, then stops at', 'Gmail Drafts for my review.'], 'Python + DeepSeek'),
  'project-nergy.svg': card('N-ERGY Doc Q&amp;A', 'DOCUMENT AI', ['Every answer cites a page', 'and a verbatim quote.', 'Built in an 8-hour challenge.'], 'AWS EC2 + 4 A10 GPUs'),
  'project-timegenie.svg': card('TimeGenie', 'SMART INDIA HACKATHON', ['Conflict-free timetables', 'for an NP-hard problem,', 'solved with a fitness function.'], 'Python + Django REST'),
};

// ---------- divider and footer ----------
const divider = svg(1200, 24, 'Section divider', 'A thin animated line.', `<line x1="0" y1="12" x2="1200" y2="12" stroke="${C.line}" stroke-width="2"/><line class="flow" x1="0" y1="12" x2="1200" y2="12" stroke="url(#accent)" stroke-width="3"/>`);
const footWave = 'M0 90V50C200 10 400 20 620 50C820 78 1000 70 1200 30V90Z';
const footer = svg(1200, 90, 'Footer wave', 'A closing wave.', `<clipPath id="clip"><path d="${footWave}"/></clipPath><path d="${footWave}" fill="url(#bg)"/><rect width="1200" height="90" fill="url(#grid)" clip-path="url(#clip)"/><path class="flow" d="M0 50C200 10 400 20 620 50C820 78 1000 70 1200 30" fill="none" stroke="url(#accent)" stroke-width="3"/>`);

const files = { 'header.svg': header, 'about.svg': about, 'flagship.svg': flagship, 'divider.svg': divider, 'footer.svg': footer, ...tiles };
for (const [name, body] of Object.entries(files)) writeFileSync(join(ASSETS, name), body);

// ---------- README ----------
// GitHub links every bare image to its own file. An image inside <picture> gets no link.
const badge = ([label, logo, hex]) => `<picture><img src="https://img.shields.io/badge/-${encodeURIComponent(label).replace(/-/g, '--')}-161b22?style=flat-square${logo ? `&logo=${logo}&logoColor=${hex}` : ''}" alt="${label}"/></picture>`;
const btn = (href, text, color, logo) => `<a href="${href}"><img src="https://img.shields.io/badge/${encodeURIComponent(text).replace(/-/g, '--')}-${color}?style=for-the-badge&logo=${logo}&logoColor=white" alt="${text}"/></a>`;
const stack = [
  ['AI and LLM', [['LangGraph', 'langgraph', 'FFFFFF'], ['LangChain', 'langchain', '4FBF9F'], ['PyTorch', 'pytorch', 'EE4C2C'], ['Hugging Face', 'huggingface', 'FFD21E'], ['Sentence Transformers'], ['OpenAI API', 'openai', 'FFFFFF'], ['Anthropic API', 'anthropic', 'D97757'], ['Gemini API', 'googlegemini', '8E75B2'], ['ChromaDB'], ['FAISS'], ['Arize Phoenix'], ['LangSmith'], ['OpenTelemetry', 'opentelemetry', 'F5A800']]],
  ['Languages', [['Python', 'python', '3776AB'], ['TypeScript', 'typescript', '3178C6'], ['JavaScript', 'javascript', 'F7DF1E'], ['C++', 'cplusplus', '659AD2'], ['SQL', 'postgresql', '4169E1'], ['HTML', 'html5', 'E34F26'], ['CSS', 'css', '1572B6']]],
  ['Backend', [['FastAPI', 'fastapi', '009688'], ['Django', 'django', '44B78B'], ['Node.js', 'nodedotjs', '5FA04E'], ['Express', 'express', 'FFFFFF'], ['Pydantic', 'pydantic', 'E92063'], ['SQLAlchemy', 'sqlalchemy', 'D71F00'], ['Alembic'], ['Celery', 'celery', '37814A']]],
  ['Mobile', [['React Native', 'react', '61DAFB'], ['Expo', 'expo', 'FFFFFF'], ['React Navigation'], ['Zustand'], ['NativeWind'], ['Firebase', 'firebase', 'FFCA28'], ['Android Studio', 'androidstudio', '3DDC84']]],
  ['Web', [['React', 'react', '61DAFB'], ['Next.js', 'nextdotjs', 'FFFFFF'], ['Tailwind CSS', 'tailwindcss', '06B6D4'], ['Vite', 'vite', '646CFF'], ['Astro', 'astro', 'FF5D01'], ['Three.js', 'threedotjs', 'FFFFFF'], ['Material UI', 'mui', '007FFF']]],
  ['Data and cloud', [['PostgreSQL', 'postgresql', '4169E1'], ['Supabase', 'supabase', '3FCF8E'], ['Redis', 'redis', 'FF4438'], ['AWS'], ['Cloudflare', 'cloudflare', 'F38020'], ['Vercel', 'vercel', 'FFFFFF'], ['Netlify', 'netlify', '00C7B7'], ['Docker', 'docker', '2496ED']]],
  ['Data, vision and testing', [['NumPy', 'numpy', '4DABCF'], ['pandas', 'pandas', 'E70488'], ['OpenCV', 'opencv', '5C3EE8'], ['Pytest', 'pytest', '0A9EDC'], ['Playwright'], ['Ruff', 'ruff', 'D7FF64'], ['mypy']]],
  ['Tools', [['Git', 'git', 'F05032'], ['GitHub', 'github', 'FFFFFF'], ['Linux', 'linux', 'FCC624'], ['uv', 'uv', 'DE5FE9'], ['VS Code']]],
];

const readme = `<p align="center">
  <picture><img src="./assets/header.svg" width="100%" alt="AI Engineer and full-stack mobile and web developer."/></picture>
</p>

<p align="center">
  ${btn('https://www.linkedin.com/in/victor-loucii-48351a292/', 'LinkedIn', '0a66c2', 'linkedin')}
  ${btn('mailto:victor.neisakuolie@gmail.com', 'victor.neisakuolie@gmail.com', 'c5221f', 'gmail')}
  ${btn('https://victor-neisa-portfolio.netlify.app/', 'Portfolio', '0e7490', 'googlechrome')}
</p>

<p align="center">
  <picture><img src="./assets/about.svg" width="100%" alt="About Victor. Builds agentic AI and RAG systems, plus mobile and web apps. Learning LLM observability, Model Context Protocol and deterministic routing. 1,800+ contributions in the past year."/></picture>
</p>

<picture><img src="./assets/divider.svg" width="100%" alt=""/></picture>

<p align="center">
  <a href="https://github.com/VictorLoucii/unified-knowledge-agent">
    <img src="./assets/flagship.svg" width="100%" alt="Unified Knowledge Agent pipeline: question, input firewall, fast path, scope router, agent, answer. A human approves heavy tools. Search recall 34 of 34, AI logic 90 of 94, full RAG logic 38 of 41, on 94 test cases."/>
  </a>
</p>

<p align="center">
  <a href="https://github.com/VictorLoucii/JOB_Hunt"><img src="./assets/project-jobhunt.svg" width="32%" alt="JobHunt: screens LinkedIn posts and drafts emails for human review."/></a>
  <a href="https://github.com/VictorLoucii/doc-intelligence"><img src="./assets/project-nergy.svg" width="32%" alt="N-ERGY Document Intelligence: PDF question answering with cited quotes."/></a>
  <a href="https://github.com/VictorLoucii/TimeGenie"><img src="./assets/project-timegenie.svg" width="32%" alt="TimeGenie: AI timetable optimizer from Smart India Hackathon."/></a>
</p>

<p align="center">
  <b>Mobile apps:</b>
  <a href="https://github.com/VictorLoucii/CaliWeather">CaliWeather</a> &middot;
  <a href="https://github.com/VictorLoucii/wealthra-finance-companion">Wealthra</a> &middot;
  <a href="https://github.com/VictorLoucii/ReactNativeCLIprojects">React Native projects</a>
</p>

<picture><img src="./assets/divider.svg" width="100%" alt=""/></picture>

<h3 align="center">Tech stack</h3>

${stack.map(([name, items]) => `<p align="center"><b>${name}</b><br>\n${items.map(badge).join('\n')}\n</p>`).join('\n\n')}

<p align="center">Open to collaborating on AI agents, mobile apps and web apps.</p>

<p align="center">
  <picture><img src="./assets/footer.svg" width="100%" alt=""/></picture>
</p>
`;
writeFileSync(join(OUT, 'README.md'), readme);

console.log(`README ${readme.length} chars, ${Object.keys(files).length} panels`);
