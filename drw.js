var LP = '', LQ = '', PM = {}, BZ = 18, RT = '', L = 'es', LS = ['es'], CUR = '', ST = {}, MOB = false, AU = {}, GR = {}

function tx(v) {
  if (v && typeof v == 'object') return v[L] != null && v[L] !== '' ? v[L] : (v[LS[0]] || '')
  return v == null ? '' : v
}

function url(h) {
  if (h && h.charAt(0) == '@') return (h.length > 1 ? (LP || RT) + h.slice(1) + '/' : LP || RT || './') + LQ
  return rp(h)
}

function rp(p) {
  if (PM[p]) return PM[p]
  if (!p || /^([a-z]+:|\/|#|\?)/i.test(p)) return p
  return RT + p
}

function mig(s) {
  var g = s.grid
  if (g.v >= 2) return
  var k = (g.row + g.gap) / 24
  function f(b) {
    b.y = Math.round(b.y * k)
    b.h = Math.max(1, Math.round(b.h * k))
    if (b.m && b.m.w) {
      b.m.y = Math.round(b.m.y * k)
      b.m.h = Math.max(1, Math.round(b.m.h * k))
    }
  }
  ;(s.common || []).forEach(f)
  s.pages.forEach(function (p) { p.blocks.forEach(f) })
  g.row = 24
  g.v = 2
}

function pgd(s, p) {
  var g = Object.assign({}, s.grid), o = (p && p.g) || {}
  for (var k in o) if (o[k] != null && o[k] !== '') g[k] = o[k]
  return g
}

function pbg(el, s, p) {
  var o = s.base || {}, i = p.bgi || (!p.bg && o.bgi), c = el.style
  c.backgroundColor = p.bg || o.bg || ''
  c.backgroundImage = i ? 'url("' + rp(i) + '")' : ''
  c.backgroundSize = i ? 'cover' : ''
  c.backgroundPosition = i ? 'center top' : ''
}

function plr(p) {
  return p.len != null ? p.len : (s.grid && s.grid.len) || 0
}

function plen(el, p, g) {
  var o = ['100vh'], f = 0, n = plr(p)
  if (n && !MOB) o.push(n * g.row + g.pad * 2 + 'px')
  ;(s.common || []).concat(p.blocks).forEach(function (b) { if (b.ag && !b.fix) f = Math.max(f, (b.fy || 0) + (b.fh || 10)) })
  if (f) o.push('calc(' + f.toFixed(2) + 'cqw + ' + g.pad + 'px)')
  el.style.minHeight = o.length > 1 ? 'max(' + o.join(', ') + ')' : ''
}

function shp(el, b) {
  var c = el.style, sw = b.sw || 0, ds = b.ds || ''
  if (b.sh == 'line') {
    var k = b.dir || 'h', p = { h: '0 50 100 50', v: '50 0 50 100', d: '0 0 100 100', u: '0 100 100 0' }[k].split(' ')
    el.innerHTML = '<svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%"><line x1="' + p[0] + '" y1="' + p[1] + '" x2="' + p[2] + '" y2="' + p[3] + '" /></svg>'
    var l = el.querySelector('line'), w = sw || 2
    l.setAttribute('stroke', b.sc || '#111')
    l.setAttribute('stroke-width', w)
    l.setAttribute('vector-effect', 'non-scaling-stroke')
    l.setAttribute('stroke-linecap', b.cap || 'butt')
    if (ds) l.setAttribute('stroke-dasharray', ds == 'dashed' ? w * 4 + ' ' + w * 3 : (b.cap == 'round' ? '0 ' : w + ' ') + w * 2.5)
    if (ds == 'dotted' && b.cap != 'round') l.setAttribute('stroke-linecap', 'butt')
    return
  }
  c.boxSizing = 'border-box'
  c.backgroundColor = b.fill || 'transparent'
  if (sw) c.border = sw + 'px ' + (ds || 'solid') + ' ' + (b.sc || '#111')
  c.borderRadius = b.sh == 'ellipse' ? '50%' : (b.rd || 0) + 'px'
}

function cols(g) { return MOB ? g.mc || 4 : g.cols }

function grd(box, g) {
  GR = g
  box.style.display = 'grid'
  box.style.gridTemplateColumns = 'repeat(' + cols(g) + ', minmax(0, 1fr))'
  box.style.gridAutoRows = g.row + 'px'
  box.style.columnGap = g.gap + 'px'
  box.style.rowGap = '0'
  box.style.padding = g.pad + 'px'
}

function auto(bl, g) {
  var c = g.mc || 4, y = 0
  AU = {}
  bl.forEach(function (b) { if (b.m && b.m.w && !b.m.hide) y = Math.max(y, b.m.y + b.m.h) })
  bl.slice().sort(function (a, b) { return a.y - b.y || a.x - b.x }).forEach(function (b) {
    if (b.fix || b.ag || (b.m && b.m.w)) return
    AU[b.id] = { x: 0, y: y, w: c, h: b._h || b.h }
    y += b._h || b.h
  })
}

function ps(b) {
  if (!MOB) return b
  if (b.m && b.m.w) return b.m
  return AU[b.id] || b
}

function lay(el, b, mm) {
  var p = ps(b), s = el.style
  el.classList.add('t-' + b.type)
  if (b.type == 'text' && !b.fm) el.classList.add('fr')
  s.zIndex = b.z || (b.fix ? 30 : b.type == 'band' ? (b.wp ? -1 : 0) : 1)
  s.display = MOB && b.m && b.m.hide ? 'none' : ''
  s.margin = ''
  if (b.type == 'band' && b.wp) {
    s.position = 'absolute'
    s.top = s.left = s.right = s.bottom = '0'
    s.width = s.height = s.transform = s.gridColumn = s.gridRow = ''
    el.classList.add('wp')
    return
  }
  if (b.ag && !b.fix && !b.wp) {
    s.position = 'absolute'
    s.left = (b.fx || 0) + 'cqw'
    s.top = (b.fy || 0) + 'cqw'
    s.width = (b.fw || 10) + 'cqw'
    s.height = b.type == 'text' && !b.fm ? '' : (b.fh || 10) + 'cqw'
    s.right = s.bottom = s.gridColumn = s.gridRow = ''
    s.transform = b.rot ? 'rotate(' + b.rot + 'deg)' : ''
    el.classList.add('ag')
    return
  }
  if (b.fix && b.type != 'band') {
    var c = cols(GR), w = Math.min(p.w, c)
    s.position = mm ? 'absolute' : 'fixed'
    s.width = 'calc(' + (w / c * 100) + '% - ' + (GR.pad * 2 * w / c) + 'px)'
    s.height = p.h * GR.row + 'px'
    s.top = b.fix == 'top' ? (b.fo || 0) + '%' : ''
    s.bottom = b.fix == 'bottom' ? (b.fo || 0) + '%' : ''
    s.left = b.fa == 'right' ? '' : b.fa == 'left' ? GR.pad + 'px' : '50%'
    s.right = b.fa == 'right' ? GR.pad + 'px' : ''
    s.transform = ((!b.fa || b.fa == 'center' ? 'translateX(-50%) ' : '') + (b.rot ? 'rotate(' + b.rot + 'deg)' : '')).trim()
    return
  }
  s.position = s.width = s.height = s.top = s.bottom = s.left = s.right = ''
  s.transform = b.rot ? 'rotate(' + b.rot + 'deg)' : ''
  s.gridColumn = (p.x + 1) + ' / span ' + p.w
  s.gridRow = (p.y + 1) + ' / span ' + p.h
  if (b.type == 'band' && !b.ic) {
    s.gridColumn = '1 / -1'
    s.margin = (p.y ? 0 : -GR.pad + 'px') + ' ' + -GR.pad + 'px 0'
    el.classList.add('fb')
  }
}

function bly(L) {
  var d = document.createElement('i'), c = d.style, fx = L.fx == null ? (L.fit == 'tile' ? 0 : 50) : L.fx, fy = L.fy == null ? (L.fit == 'tile' ? 0 : 50) : L.fy
  d.className = 'bl'
  if (L.k == 'grad') {
    var st = (L.st || []).map(function (x) { return x.c + (x.p == null ? '' : ' ' + x.p + '%') }).join(', ')
    if ((L.st || []).length < 2) st = st ? st + ', ' + st : 'transparent, transparent'
    c.backgroundImage = (L.rp ? 'repeating-' : '') + (L.kd == 'radial' ? 'radial-gradient(circle at ' + fx + '% ' + fy + '%, ' : 'linear-gradient(' + (L.ang == null ? 180 : L.ang) + 'deg, ') + st + ')'
  } else if (L.src) {
    d.dataset.src = L.src
    c.backgroundImage = 'url("' + rp(L.src) + '")'
    c.backgroundPosition = fx + '% ' + fy + '%'
    if (L.fit == 'tile') {
      c.backgroundSize = L.tn ? 'calc(100% / ' + L.tn + ') auto' : L.tw ? L.tw + 'px auto' : 'calc(100% / 4) auto'
      c.backgroundRepeat = L.rx == 'x' ? 'repeat-x' : L.rx == 'y' ? 'repeat-y' : 'repeat'
    } else {
      c.backgroundSize = L.fit == 'contain' ? 'contain' : L.fit == 'stretch' ? '100% 100%' : 'cover'
      c.backgroundRepeat = 'no-repeat'
    }
  }
  if (L.att) c.backgroundAttachment = 'fixed'
  if (L.op != null) c.opacity = L.op / 100
  return d
}

function lead(z) {
  var r = GR.row || 24
  return Math.max(1, Math.ceil(z * 1.1 / r)) * r
}

function fitx(el) {
  if (!el.dataset.fs) el.dataset.fs = parseFloat(getComputedStyle(el).fontSize)
  var hi = +el.dataset.fs, lo = 4
  el.style.fontSize = hi + 'px'
  if (el.scrollHeight <= el.clientHeight + 1 && el.scrollWidth <= el.clientWidth + 1) return
  for (var i = 0; i < 12; i++) {
    var m = (lo + hi) / 2
    el.style.fontSize = m + 'px'
    if (el.scrollHeight <= el.clientHeight + 1 && el.scrollWidth <= el.clientWidth + 1) lo = m
    else hi = m
  }
  el.style.fontSize = Math.floor(lo * 10) / 10 + 'px'
}

var BL = {}

function bas(root) {
  var r = GR.row || 24
  root.querySelectorAll('.c-text:not(.m-fit)').forEach(function (c) {
    if (c.style.display == 'flex') return
    var cs = getComputedStyle(c), f = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + '/' + cs.lineHeight + ' ' + cs.fontFamily
    if (BL[f] == null) {
      var p = document.createElement('div'), i = document.createElement('i')
      p.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden;font:' + f
      p.textContent = 'x'
      i.style.cssText = 'display:inline-block;width:0;height:0'
      p.appendChild(i)
      document.body.appendChild(p)
      BL[f] = i.offsetTop
      p.remove()
    }
    var y = BL[f] + parseFloat(cs.paddingTop) + parseFloat(cs.borderTopWidth), sh = (r - y % r) % r
    c.style.position = sh ? 'relative' : ''
    c.style.top = sh ? sh.toFixed(1) + 'px' : ''
  })
}

function sty(el, b, t) {
  var o = Object.assign({}, ST[b.sty] || {}, b), c = el.style
  if (o.font) c.fontFamily = o.font
  if (o.size) c.fontSize = o.size + 'px'
  if (o.wt) c.fontWeight = o.wt
  if (o.it) c.fontStyle = 'italic'
  if (o.un) c.textDecoration = 'underline'
  if (o.up) c.textTransform = 'uppercase'
  if (o.lr && t == 'text' && b.fm != 'fit') c.lineHeight = o.lr * (GR.row || 24) + 'px'
  else if (o.lh) c.lineHeight = o.lh
  else if (t == 'text' && b.fm != 'fit') c.lineHeight = lead(o.size || BZ) + 'px'
  if (o.kn) c.fontKerning = o.kn
  if (o.ff) c.fontFeatureSettings = o.ff.split(' ').filter(Boolean).map(function (f) { return '"' + f.replace('-', '') + '" ' + (f.charAt(0) == '-' ? 0 : 1) }).join(', ')
  if (t == 'text' && b.fm == 'fit') c.lineHeight = 1.15
  if (o.ls) c.letterSpacing = o.ls + 'em'
  if (o.al) c.textAlign = o.al
  if (o.va && (t == 'text' || t == 'button')) {
    c.display = 'flex'
    c.flexDirection = 'column'
    c.justifyContent = { top: 'flex-start', middle: 'center', bottom: 'flex-end' }[o.va]
  }
  if (o.pd != null) c.padding = o.pd + 'px'
  if (o.bw) c.border = o.bw + 'px solid ' + (o.bc || 'var(--ln, #000)')
  if (o.rd) c.borderRadius = o.rd + 'px'
  if (o.op != null) c.opacity = o.op / 100
  if (o.sk) c.transform = 'skewX(' + -o.sk + 'deg)'
  if (o.bg) c.backgroundColor = o.bg
  if (o.fg) c.color = o.fg
}

function sb(s) {
  var b = s.base || {}, y = (s.styles || {})[b.sty || 'body copy']
  return y || { font: b.font, size: b.size }
}

function base(el, s, p) {
  var o = Object.assign({}, s.base), c = el.style, y = sb(s)
  if (p) ['fg', 'hl', 'ln'].forEach(function (k) { if (p[k]) o[k] = p[k] })
  c.fontFamily = y.font || ''
  c.fontSize = y.size ? y.size + 'px' : ''
  c.fontWeight = y.wt || ''
  c.fontStyle = y.it ? 'italic' : ''
  c.letterSpacing = y.ls ? y.ls + 'em' : ''
  BZ = y.size || 18
  c.color = o.fg || ''
  c.setProperty('--hl', o.hl || '#fff45c')
  c.setProperty('--ln', o.ln || '#000')
  ST = s.styles || {}
}

function ln(it) {
  var a = document.createElement('a')
  a.href = url(it.href) || '#'
  a.textContent = tx(it.t)
  if (it.href && it.href.charAt(0) == '@' && it.href.slice(1) == CUR) a.className = 'on'
  return a
}

function mq(el, b) {
  var w = document.createElement('div'), t = ''
  for (var i = 0; i < 4; i++) t += '<span>' + tx(b.text) + '</span>'
  w.className = 'mqi'
  w.innerHTML = t + t
  w.style.animationDuration = (b.speed || 20) + 's'
  el.appendChild(w)
}

function nc(b) {
  var c = b.cols || 3
  return MOB ? b.mcol || Math.min(c, 2) : c
}

function crd(el, b) {
  var g = document.createElement('div'), p = document.createElement('div')
  g.className = 'cg'
  g.style.gridTemplateColumns = 'repeat(' + nc(b) + ', minmax(0, 1fr))'
  ;(b.items || []).forEach(function (it, i) {
    var d = document.createElement(it.href ? 'a' : 'div')
    if (it.href) d.href = url(it.href)
    d.className = 'cd'
    d.dataset.tag = it.tag || ''
    d.dataset.n = i
    d.dataset.p = parseFloat(String(it.price || '').replace(/[^0-9.]/g, '')) || 0
    d.dataset.k = b.id + ':' + i
    d.innerHTML = '<span class="hrt">♡</span>' +
      (it.badge ? '<span class="bdg">' + tx(it.badge) + '</span>' : '') +
      '<div class="ci">' + (it.img ? '<img src="' + rp(it.img) + '" alt="">' : '') + '</div>' +
      '<div class="cm"><span>' + tx(it.t) + '</span><span>' + (it.was ? '<s>' + it.was + '</s> ' : '') + (it.price || '') + '</span></div>'
    g.appendChild(d)
  })
  p.className = 'pgr'
  el.dataset.per = b.per || 0
  el.appendChild(g)
  el.appendChild(p)
  sh(el, 0, '')
}

function sh(el, n, tag) {
  var per = +el.dataset.per || 1e6, k = 0
  el.querySelectorAll('.cd').forEach(function (c) {
    var ok = !tag || c.dataset.tag == tag
    c.style.display = ok && k >= n * per && k < (n + 1) * per ? '' : 'none'
    if (ok) k++
  })
  var p = el.querySelector('.pgr'), m = Math.ceil(k / per)
  p.innerHTML = ''
  if (m > 1) {
    for (var i = 0; i < m; i++) p.innerHTML += '<span data-i="' + i + '"' + (i == n ? ' class="on"' : '') + '>' + (i + 1) + '</span>'
    if (n < m - 1) p.innerHTML += '<span data-i="' + (n + 1) + '">→</span>'
  }
  el.dataset.cur = n
  el.dataset.tag = tag
}

function pl(el, mm) {
  el.querySelectorAll('a[href^="@"]').forEach(function (a) {
    if (mm) a.dataset.at = a.getAttribute('href')
    a.setAttribute('href', url(a.getAttribute('href')))
  })
}

function fit(el, b) {
  if (b.fit) el.style.objectFit = b.fit
  if (b.fp) el.style.objectPosition = b.fp
}

function gal(el, b, mm) {
  var it = b.items || [], sl = b.mode == 'slides'
  el.classList.add(sl ? 'sl' : 'gg')
  if (!sl) {
    el.style.gridTemplateColumns = 'repeat(' + nc(b) + ', minmax(0, 1fr))'
    el.style.gap = (b.gg == null ? 10 : b.gg) + 'px'
  }
  if (!it.length && mm) el.innerHTML = '<span class="ph">gallery</span>'
  it.forEach(function (x, i) {
    var f = document.createElement('figure'), im = document.createElement('img')
    im.src = rp(x.src) || ''
    im.alt = tx(x.cap)
    im.loading = 'lazy'
    fit(im, b)
    if (b.zoom) {
      im.dataset.z = b.id
      im.dataset.cap = tx(x.cap)
    }
    f.appendChild(im)
    if (x.cap && b.caps) {
      var c = document.createElement('figcaption')
      c.textContent = tx(x.cap)
      f.appendChild(c)
    }
    if (sl && i) f.style.display = 'none'
    el.appendChild(f)
  })
  if (sl && it.length > 1) {
    el.insertAdjacentHTML('beforeend', '<a class="sv pv">‹</a><a class="sv nx">›</a><div class="dts">' + it.map(function (x, i) { return '<i' + (i ? '' : ' class="on"') + '></i>' }).join('') + '</div>')
    el.dataset.n = 0
    el.dataset.auto = b.auto || 0
  }
}

function bk(b, mm) {
  var el = document.createElement('div'), t = b.type
  if ((t == 'image' || t == 'video') && b.src) {
    el = document.createElement(t == 'image' ? 'img' : 'video')
    el.src = rp(b.src)
    fit(el, b)
    if (t == 'image') {
      el.alt = tx(b.alt)
      if (b.zoom) {
        el.dataset.z = b.id
        if (b.cap) el.dataset.cap = tx(b.cap)
      }
    } else {
      el.playsInline = true
      el.loop = !b.once
      if (b.poster) el.poster = rp(b.poster)
      if (b.ctl) el.controls = true
      if (!b.ctl || b.auto) {
        el.muted = true
        el.autoplay = true
      }
    }
  } else if (t == 'image' || t == 'video') {
    el.textContent = mm ? t : ''
    el.className = 'ph'
  } else if (t == 'gallery') {
    gal(el, b, mm)
  } else if (t == 'text') {
    el.innerHTML = tx(b.html)
    pl(el, mm)
    if (b.fm) el.classList.add('m-' + b.fm)
  } else if (t == 'marquee') {
    mq(el, b)
  } else if (t == 'nav' || t == 'tabs') {
    (b.items || []).forEach(function (it) { el.appendChild(ln(it)) })
    if (t == 'tabs' && b.flt) {
      var f = document.createElement('span')
      f.className = 'flt'
      f.innerHTML = tx(b.flt) + '<b>+</b><span class="fm"><span data-s="n">default</span><span data-s="lo">price, low to high</span><span data-s="hi">price, high to low</span><span data-s="az">a to z</span></span>'
      el.appendChild(f)
    }
  } else if (t == 'cards') {
    crd(el, b)
  } else if (t == 'banner') {
    if (b.src) el.style.backgroundImage = 'url("' + rp(b.src) + '")'
    if (b.fit) el.style.backgroundSize = b.fit
    if (b.fp) el.style.backgroundPosition = b.fp
    el.innerHTML = '<div class="bn">' + tx(b.html) + '</div>'
    pl(el, mm)
  } else if (t == 'button') {
    el.textContent = tx(b.t)
  } else if (t == 'lang') {
    LS.forEach(function (l) {
      var a = document.createElement('a')
      a.href = '#'
      a.dataset.l = l
      a.textContent = (b.names && b.names[l]) || l.toUpperCase()
      if (l == L) a.className = 'on'
      el.appendChild(a)
    })
  } else if (t == 'shape') {
    shp(el, b)
  } else if (t == 'band') {
    if (b.bg) el.style.backgroundColor = b.bg
    ;(b.ly || []).slice().reverse().forEach(function (L) { el.appendChild(bly(L)) })
  } else if (t == 'embed') {
    el.innerHTML = b.code || (mm ? '<span class="ph">embed</span>' : '')
  }
  el.className += ' c c-' + t
  sty(el, b, t)
  if (b.href && !mm && !b.zoom && 'text image banner button video'.indexOf(t) > -1) {
    var a = document.createElement('a')
    a.href = url(b.href)
    a.className = 'lk'
    a.appendChild(el)
    return a
  }
  return el
}

function nf() {
  return { id: 'nf', type: 'text', x: 0, y: 7, w: s.grid.cols, h: 6, al: 'center', size: 28, html: { es: 'no encontramos esta página. <a href="@">volver al inicio</a>', en: 'this page is not here. <a href="@">back home</a>' } }
}

function fb() {
  document.addEventListener('error', function (e) {
    var m = e.target, k = m.getAttribute && m.getAttribute('src') || '', i = k.indexOf('photos/up/')
    if ((m.tagName == 'IMG' || m.tagName == 'VIDEO') && i > -1 && !m.dataset.fb) {
      m.dataset.fb = 1
      m.src = '/api/img/up/' + k.slice(i + 10)
    }
  }, true)
}
