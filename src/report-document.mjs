import { displayDate } from './activity.mjs';
import { money, summary, totals } from './domain.mjs';

const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reportDate = date => date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

export function reportFilename(shopName, date = new Date()) {
  const name = Array.from(String(shopName || 'My shop').normalize('NFC').replace(/[\x00-\x1f\x7f<>:"/\\|?*]/g, ' ').replace(/\s+/g, ' ').trim()).slice(0, 40).join('').replace(/[. ]+$/, '') || 'My shop';
  return `RefurbTrack - ${name} - Shop Report - ${reportDate(date)}.pdf`;
}

export function reportHtml(records, shopName, { logo, font, date = new Date() }) {
  const sums = summary(records);
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(reportFilename(shopName, date).slice(0, -4))}</title>
<style>
@font-face{font-family:Comfortaa;src:url("${escape(font)}") format("truetype");font-weight:700;font-display:block}
@page{size:A4;margin:15mm 14mm}
*{box-sizing:border-box}body{margin:0;background:#fff;color:#183348;font:11px/1.5 Arial,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
h1,h2,.brand,.metric-label{font-family:Comfortaa,Arial,sans-serif}h1{font-size:29px;line-height:1.3;margin:26px 0 8px;letter-spacing:-.5px}h2{font-size:15px;margin:26px 0 12px}
.masthead{display:table;width:100%}.identity,.stamp{display:table-cell;vertical-align:middle}.stamp{text-align:right;color:#4E6270;font-size:10px;width:32%}.logo{width:54px;height:54px;object-fit:contain;vertical-align:middle;margin-right:10px}.brand{font-size:17px;font-weight:700;vertical-align:middle}
.shop{font-size:15px;margin:0 0 18px;overflow-wrap:anywhere}.overview{break-inside:avoid}.counts{color:#4E6270;margin:0 0 16px}
.metrics{display:table;table-layout:fixed;border-spacing:8px 0;margin:0 -8px;width:calc(100% + 16px)}.metric{display:table-cell;width:33.33%;padding:18px 14px;border-radius:20px;background:#DFE9EF;vertical-align:top}.metric.primary{background:#12334B;color:#fff}.metric.result{background:#CAE8DD}.metric-label{font-size:10px;line-height:1.6;margin:0 0 10px}.value{font-size:19px;font-weight:700;font-variant-numeric:tabular-nums;line-height:1.25;overflow-wrap:anywhere}.caption{font-size:10px;margin-top:8px;color:#4E6270}.primary .caption{color:#D9E8EC}.loss{color:#A32323}
table.records{width:100%;border-collapse:collapse;table-layout:fixed}thead{display:table-header-group}th{background:#DFEDE7;color:#183348;font-size:10px;font-weight:700;padding:11px 9px;text-align:left}th:first-child{border-radius:12px 0 0 12px}th:last-child{border-radius:0 12px 12px 0}td{padding:13px 9px;border-bottom:1px solid #D7E5DF;vertical-align:top;overflow-wrap:anywhere}tr{break-inside:avoid;page-break-inside:avoid}tbody tr:nth-child(even){background:#F3F8F5}.phone{font-weight:700;font-size:11px}.muted{color:#4E6270;font-size:10px}.status{color:#096B60;font-weight:700;margin-top:3px}.amount{text-align:right;font-variant-numeric:tabular-nums}.empty{text-align:center;padding:24px;color:#4E6270}
.status.loss{color:#A32323}h2{break-after:avoid}.note{margin-top:22px;padding:16px 18px;background:#F3F8F5;border-radius:16px;break-inside:avoid;color:#4E6270;font-size:10px}.note strong{display:block;color:#183348;margin-bottom:4px}.footer{margin-top:16px;color:#4E6270;font-size:9px;display:flex;justify-content:space-between;gap:16px}
@media screen{body{max-width:794px;padding:40px;margin:auto;background:#fff}html{background:#DFEDE7}}
</style></head><body>
<div class="overview">
  <header class="masthead"><div class="identity"><img class="logo" src="${escape(logo)}" alt="RefurbTrack icon"><span class="brand">RefurbTrack</span></div><div class="stamp">Prepared ${escape(reportDate(date))}<br>All amounts in Philippine pesos</div></header>
  <h1>Shop report</h1><p class="shop">${escape(shopName || 'My shop')}</p>
  <p class="counts">${sums.count} ${sums.count === 1 ? 'phone record' : 'phone records'} &nbsp;·&nbsp; ${sums.active} open &nbsp;·&nbsp; ${sums.completed} paid &nbsp;·&nbsp; ${sums.writtenOff} written off</p>
  <div class="metrics">
    <section class="metric primary"><div class="metric-label">Money in open jobs</div><div class="value">${money(sums.invested)}</div><div class="caption">Costs awaiting a final result</div></section>
    <section class="metric"><div class="metric-label">Recorded revenue</div><div class="value">${money(sums.revenue)}</div><div class="caption">Payments from completed jobs</div></section>
    <section class="metric result"><div class="metric-label">Profit / loss</div><div class="value${sums.profit < 0 ? ' loss' : ''}">${money(sums.profit)}</div><div class="caption">From paid and written-off jobs</div></section>
  </div>
</div>
<h2>Phone records</h2>
<table class="records"><colgroup><col style="width:25%"><col style="width:23%"><col style="width:16%"><col style="width:18%"><col style="width:18%"></colgroup>
<thead><tr><th scope="col">Phone</th><th scope="col">Job / status</th><th scope="col">Intake</th><th scope="col" class="amount">Costs</th><th scope="col" class="amount">Profit / loss</th></tr></thead>
<tbody>${records.map(r => {
    const t = totals(r);
    return `<tr><td><div class="phone">${escape(r.brand)} ${escape(r.model)}</div></td><td><div class="muted">${r.jobType === 'repair' ? 'Customer repair' : 'Buy & resell'}</div><div class="status${r.status === 'Not Worth Repairing' ? ' loss' : ''}">${escape(r.status)}</div></td><td>${escape(displayDate(r.acquiredAt))}</td><td class="amount">${money(t.investment)}</td><td class="amount${t.profit < 0 ? ' loss' : ''}">${t.profit === null ? '<span class="muted">Still open</span>' : money(t.profit)}</td></tr>`;
  }).join('') || '<tr><td colspan="5" class="empty">No phone records in this report.</td></tr>'}</tbody></table>
<aside class="note"><strong>How to read this report</strong>Costs include purchase, parts and paid labor. Profit is the final payment minus those costs. Open jobs have no final profit yet. Shop rent, tax and other overhead are not included.</aside>
<footer class="footer"><span>RefurbTrack · Workshop records</span><span>Generated ${escape(reportDate(date))} · All recorded jobs</span></footer>
</body></html>`;
}
