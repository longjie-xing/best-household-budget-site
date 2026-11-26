// charts.js — native canvas charts for the budget site.
// No libraries: a donut for category share and grouped bars for the
// monthly trend, both drawn with the 2D canvas API.

function setupCanvas(canvas, heightCss) {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || canvas.parentElement.clientWidth || 600;
  if (width <= 0) return null;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(heightCss * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx: ctx, width: width, height: heightCss };
}

// Donut chart: slices is [{ label, value, color }]. Draws the ring and a
// centre total, and returns nothing; the legend lives in the HTML.
function drawDonut(canvas, slices, centreLabel, centreValue) {
  const box = setupCanvas(canvas, 260);
  if (!box) return;
  const ctx = box.ctx;
  const total = slices.reduce(function (sum, slice) { return sum + slice.value; }, 0);
  if (total <= 0) {
    ctx.fillStyle = '#6b7a75';
    ctx.font = '15px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No spending in this period yet.', box.width / 2, box.height / 2);
    return;
  }
  const cx = box.width / 2;
  const cy = box.height / 2;
  const outer = Math.min(box.width, box.height) / 2 - 14;
  const inner = outer * 0.62;
  let angle = -Math.PI / 2;
  slices.forEach(function (slice) {
    const sweep = (slice.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outer, angle, angle + sweep);
    ctx.closePath();
    ctx.fillStyle = slice.color;
    ctx.fill();
    angle += sweep;
  });
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fillStyle = '#fffdf7';
  ctx.fill();
  ctx.fillStyle = '#163832';
  ctx.font = 'bold 21px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(centreValue, cx, cy - 2);
  ctx.fillStyle = '#6b7a75';
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillText(centreLabel, cx, cy + 18);
}

// Grouped bar chart: months on the x axis, one income bar (green) and one
// spending bar (red) per month. Values are dollars.
function drawMonthlyBars(canvas, months) {
  const box = setupCanvas(canvas, 280);
  if (!box) return;
  const ctx = box.ctx;
  const padLeft = 58;
  const padBottom = 30;
  const padTop = 16;
  const plotWidth = box.width - padLeft - 12;
  const plotHeight = box.height - padTop - padBottom;
  const maxValue = Math.max.apply(null, months.map(function (m) {
    return Math.max(m.income, m.spending);
  }).concat([1]));
  const scale = plotHeight / (maxValue * 1.08);

  ctx.strokeStyle = '#e2dccc';
  ctx.fillStyle = '#6b7a75';
  ctx.font = '11px system-ui, sans-serif';
  ctx.textAlign = 'right';
  for (let step = 0; step <= 4; step++) {
    const value = (maxValue * 1.08 * step) / 4;
    const y = padTop + plotHeight - value * scale;
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(box.width - 12, y);
    ctx.stroke();
    ctx.fillText('$' + Math.round(value).toLocaleString('en-US'), padLeft - 8, y + 4);
  }

  const groupWidth = plotWidth / months.length;
  const barWidth = Math.min(34, (groupWidth - 24) / 2);
  months.forEach(function (month, index) {
    const groupX = padLeft + index * groupWidth;
    const incomeHeight = month.income * scale;
    const spendHeight = month.spending * scale;
    ctx.fillStyle = '#3d7a4f';
    ctx.fillRect(groupX + (groupWidth / 2) - barWidth - 3, padTop + plotHeight - incomeHeight, barWidth, incomeHeight);
    ctx.fillStyle = '#b4442f';
    ctx.fillRect(groupX + (groupWidth / 2) + 3, padTop + plotHeight - spendHeight, barWidth, spendHeight);
    ctx.fillStyle = '#22302d';
    ctx.font = '12px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(month.label, groupX + groupWidth / 2, box.height - 10);
  });

  // Legend, drawn above the plot so it survives any layout.
  ctx.textAlign = 'left';
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillStyle = '#3d7a4f';
  ctx.fillRect(padLeft, 2, 10, 10);
  ctx.fillStyle = '#22302d';
  ctx.fillText('Income', padLeft + 15, 11);
  ctx.fillStyle = '#b4442f';
  ctx.fillRect(padLeft + 80, 2, 10, 10);
  ctx.fillStyle = '#22302d';
  ctx.fillText('Spending', padLeft + 95, 11);
}
