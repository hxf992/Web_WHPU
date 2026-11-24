(() => {
  const endpoint = 'https://pub.orcid.org/v3.0/0000-0003-1262-8113/works';
  const descriptions = {
    '10.1016/j.istruc.2026.113466': '研究三周期极小曲面结构的力链传递及受压性能。',
    '10.1007/s11629-025-0043-0': '探讨温度梯度与不均匀沉降共同作用下，路基—隧道过渡段无砟轨道的损伤与离缝。',
    '10.1016/j.trgeo.2026.101993': '通过试验与数值方法研究再生塑料轨枕在有砟轨道中的横向阻力。',
    '10.1016/j.soildyn.2024.108820': '采用离散元方法分析列车动荷载下有砟轨道—路基系统的动力响应。',
    '10.1016/j.tws.2024.111973': '结合试验与离散元方法研究 Schwarz Primitive 多孔结构的轴向受载行为。',
    '10.1142/s0219455424502614': '研究三周期极小曲面单胞在轴向荷载作用下的非线性失稳。',
    '10.1016/j.compstruct.2023.117510': '通过试验研究三周期极小曲面结构的非线性动力行为。',
    '10.1016/j.engstruct.2023.116429': '利用离散元方法研究仿生 Gyroid 与 Primitive 混凝土结构在压扭组合荷载下的力学性能。',
    '10.3390/s23041786': '研究横风、道床冲刷与列车荷载共同作用下铁路轨道的多灾害连锁影响。',
    '10.1016/j.ijmecsci.2022.107738': '通过试验与离散元方法研究 IWP 多孔结构的轴向受载行为。',
    '10.1016/j.matpr.2022.04.691': '数值研究点荷载作用下多孔复合蜂窝轨道板的响应。',
    '10.3390/jcs6010007': '综述增材制造技术在铁路基础设施中的应用、挑战与前景。',
    '10.1061/(asce)gm.1943-5622.0001689': '通过数值与试验方法分析双块式轨枕在有砟轨道中的横向阻力。',
    '10.12688/openreseurope.17809.2': '研究利用数字孪生技术管理桥梁应对气候变化的适应措施。',
    '10.1016/j.conbuildmat.2022.127469': '利用机器学习预测道砟颗粒破碎后的数量与尺寸。',
    '10.3390/jcs6030071': '研究用于复合桥梁支座的 3D 打印 TPMS 夹芯晶格结构的力学与吸能性能。',
    '10.1016/j.engfailanal.2021.105888': '通过数值研究评估预应力混凝土轨枕的裂纹扩展行为。',
    '10.1177/0954406220971667': '研究准静态荷载下填充图案、密度与材料类型对 3D 打印立方结构的影响。',
    '10.1016/j.conbuildmat.2020.118770': '通过离散元建模研究轨枕底面纹理对横向阻力的影响。',
    '10.13238/j.issn.1004-2954.201908110002': '对复合轨枕道床横向阻力开展试验与优化分析。',
    '10.1177/0954409718805274': '通过数值与试验方法分析不同形状混凝土轨枕的单枕推移试验。',
    '10.1016/j.conbuildmat.2019.01.017': '研究道床各组成部分对梯形轨枕轨道横向阻力的贡献。',
    '10.3969/j.issn.0258-2724.20170480': '研究高速铁路有砟轨道的横向阻力特征与固化技术。',
    '10.3969/j.issn.0258-2724.2018.04.009': '对框架优化型Ⅲc轨枕的道床横向阻力开展试验研究。',
    '10.1016/j.conbuildmat.2018.07.095': '研究不同类型钢轨枕在有砟轨道中的横向位移。'
  };
  const target = document.querySelector('[data-orcid-works]');
  if (!target) return;
  const status = target.querySelector('.orcid-status');
  const list = target.querySelector('.orcid-list');
  const fallback = document.querySelector('[data-orcid-fallback]');
  const make = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  function safeUrl(value) { try { const u = new URL(value); return /^https?:$/.test(u.protocol) ? u.href : ''; } catch { return ''; } }
  function art(title) {
    const t = title.toLowerCase();
    const porous = /tpms|minimal surface|gyroid|primitive|cellular|porous|lattice|3d.print|additive manufacturing/.test(t);
    const tile = make('div', 'work-art ' + (porous ? 'work-art-porous' : 'work-art-track'));
    tile.setAttribute('role', 'img'); tile.setAttribute('aria-label', porous ? '多孔结构研究主题示意图' : '铁路与工程研究主题示意图');
    tile.append(make('span', '', porous ? 'POROUS STRUCTURES' : 'RAILWAY & ENGINEERING'));
    tile.append(make('small', '', '研究主题示意图'));
    return tile;
  }
  function render(data) {
    if (!Array.isArray(data.group)) throw new Error('invalid ORCID response');
    const seen = new Set();
    const works = data.group.map(group => {
      const choices = group['work-summary'] || [];
      const item = choices.find(x => x.title?.title?.value) || choices[0];
      if (!item || item.type !== 'journal-article') return null;
      const ids = [...(group['external-ids']?.['external-id'] || []), ...(item['external-ids']?.['external-id'] || [])];
      const doi = ids.find(x => String(x['external-id-type']).toLowerCase() === 'doi' && (!x['external-id-relationship'] || x['external-id-relationship'] === 'self'))?.['external-id-value']?.trim().replace(/^https?:\/\/(dx\.)?doi\.org\//i, '') || '';
      const title = item.title?.title?.value?.trim(); if (!title) return null;
      const key = doi ? 'doi:' + doi.toLowerCase() : 'title:' + title.toLowerCase().replace(/\s+/g, ' ');
      if (seen.has(key)) return null; seen.add(key);
      const year = item['publication-date']?.year?.value || '';
      const month = item['publication-date']?.month?.value || '';
      const url = doi ? 'https://doi.org/' + encodeURI(doi) : (safeUrl(item.url?.value) || 'https://orcid.org/0000-0003-1262-8113');
      return {title, doi: doi.toLowerCase(), year, month, journal: item['journal-title']?.value || '', url};
    }).filter(Boolean).sort((a,b) => (b.year + b.month.padStart(2,'0')).localeCompare(a.year + a.month.padStart(2,'0')));
    if (!works.length) throw new Error('no public journal articles');
    const fragment = document.createDocumentFragment();
    for (const w of works) {
      const card = make('article', 'orcid-work'); card.append(art(w.title));
      const content = make('div', 'orcid-work-body');
      content.append(make('p', 'orcid-meta', [w.year || '年份未提供', w.journal].filter(Boolean).join(' · ')));
      content.append(make('h3', '', w.title));
      const chineseTitle = w.title.match(/[，,]([\u4e00-\u9fff][\u4e00-\u9fff\wⅢⅡⅠc（）()、—-]+)$/);
      content.append(make('p', 'orcid-summary', descriptions[w.doi] || (chineseTitle ? '研究主题：' + chineseTitle[1] + '。' : '中文简介待补充；请查看原文或 ORCID 记录了解研究内容。')));
      const a = make('a', 'orcid-paper-link', w.doi ? '查看论文' : '查看记录'); a.href = w.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; content.append(a);
      card.append(content); fragment.append(card);
    }
    list.replaceChildren(fragment);
    if (fallback) fallback.hidden = true;
    status.textContent = '已从 ORCID 读取 ' + works.length + ' 篇公开期刊论文 · 每次打开页面时更新。未收录或非公开成果不会显示。';
  }
  const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 12000);
  fetch(endpoint, {headers: {Accept: 'application/json'}, signal: controller.signal})
    .then(r => { if (!r.ok) throw new Error('ORCID ' + r.status); return r.json(); })
    .then(render).catch(() => {status.textContent = '暂时无法连接 ORCID，显示原有成果列表。请稍后刷新，或访问 ORCID 查看最新记录。';})
    .finally(() => clearTimeout(timer));
})();
