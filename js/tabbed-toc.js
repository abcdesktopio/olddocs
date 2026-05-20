// Hide TOC / nav entries that point to headings inside inactive pymdownx.tabbed panes.
(function() {
  function isVisible(el){
    if (!el) return false;
    var style = window.getComputedStyle(el);
    return style && style.display !== 'none' && el.getClientRects().length > 0;
  }

  function pruneToc() {
    // Select typical toc/nav anchors used by MkDocs / Material
    var anchors = document.querySelectorAll('.md-nav__item a, .md-nav a, .toc a, .md-toc__link');
    anchors.forEach(function(a){
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) !== '#') return;
      var id = href.slice(1);
      var target = document.getElementById(id);
      if (!target) return;
      var li = a.closest('li') || a.parentElement;
      if (isVisible(target)) {
        if (li) li.style.display = '';
      } else {
        if (li) li.style.display = 'none';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    pruneToc();

    var debouncedPrune = (function(){
      var t = null;
      return function(delay){
        delay = delay || 80;
        if (t) clearTimeout(t);
        t = setTimeout(function(){ pruneToc(); t = null; }, delay);
      };
    })();

    // pymdownx.tabbed toggles panes via click; listen and debounce
    document.body.addEventListener('click', function(e){
      if (e.target.closest('.pymdownx-tabbed, .tabbed')) {
        debouncedPrune(80);
      }
    }, true);

    // Also watch for hash changes and resize (visibility may change)
    window.addEventListener('hashchange', function(){ debouncedPrune(30); });
    window.addEventListener('resize', function(){ debouncedPrune(120); });

    // MutationObserver: observe DOM and attribute changes inside tabbed containers
    var obs = new MutationObserver(function(mutations){
      for (var i=0;i<mutations.length;i++){
        var m = mutations[i];
        var el = m.target && m.target.closest ? m.target.closest('.pymdownx-tabbed, .tabbed') : null;
        if (el) { debouncedPrune(30); return; }
        if (m.addedNodes && m.addedNodes.length){
          for (var j=0;j<m.addedNodes.length;j++){
            var n = m.addedNodes[j];
            if (n.nodeType===1 && (n.closest('.pymdownx-tabbed, .tabbed') || n.querySelector && n.querySelector('.pymdownx-tabbed, .tabbed'))) { debouncedPrune(30); return; }
          }
        }
        if (m.type === 'attributes') { debouncedPrune(30); return; }
      }
    });
    obs.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style', 'hidden'] });
  });
})();
