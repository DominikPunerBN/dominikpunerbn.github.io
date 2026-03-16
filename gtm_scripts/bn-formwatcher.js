(function(){
  var cfg = window['__bnFW_cfg__'];
  if(!cfg) return;
  if(window['__bnFW_on__']) return;
  window['__bnFW_on__'] = true;
  var SK=cfg.storageKey,SE=cfg.selEmail,SF=cfg.selFirst,SL=cfg.selLast,SP=cfg.selPhone;

  function deepQuery(sel){
    if(!sel)return[];
    var out=[];
    function walk(root){
      try{
        var els=root.querySelectorAll(sel);
        for(var i=0;i<els.length;i++)out.push(els[i]);
        var all=root.querySelectorAll('*');
        for(var j=0;j<all.length;j++){if(all[j].shadowRoot)walk(all[j].shadowRoot);}
      }catch(e){}
    }
    if(document.body)walk(document.body);
    return out;
  }

  function persist(e){
    if(!e||!e.target)return;
    var v=(e.target.value||'').trim();
    if(!v)return;
    var o;
    try{o=JSON.parse(sessionStorage.getItem(SK)||'{}');}catch(ex){o={};}
    var el=e.target;
    try{
      if(SE&&el.matches(SE))o.email=v;
      if(SF&&el.matches(SF))o.firstname=v;
      if(SL&&el.matches(SL))o.lastname=v;
      if(SP&&el.matches(SP))o.phone=v;
    }catch(ex){}
    sessionStorage.setItem(SK,JSON.stringify(o));
    console.log('[BN FormWatcher]',o);
  }

  function attach(){
    [SE,SF,SL,SP].filter(Boolean).forEach(function(sel){
      deepQuery(sel).forEach(function(el){
        if(!el.dataset.bnFwA){
          el.dataset.bnFwA='1';
          el.addEventListener('change',persist);
          el.addEventListener('input',persist);
        }
      });
    });
  }

  new MutationObserver(function(){attach();})
    .observe(document.body,{childList:true,subtree:true});

  new MutationObserver(function(muts){
    muts.forEach(function(m){
      m.addedNodes.forEach(function(n){
        if(n.nodeType===1&&n.shadowRoot){
          new MutationObserver(function(){attach();})
            .observe(n.shadowRoot,{childList:true,subtree:true});
        }
      });
    });
    attach();
  }).observe(document.body,{childList:true,subtree:true});

  attach();
  console.log('[BN FormWatcher] Gestartet:',SK);
})();
