function e(e) {
  for (var t = {}, r = e.split(","), s = 0; s < r.length; s++) t[r[s]] = !0;
  return t
}

function t(e) {
  return e.replace(/<\?xml.*\?>\n/, "").replace(/<.*!doctype.*\>\n/, "").replace(/<.*!DOCTYPE.*\>\n/, "")
}

function r(e, r) {
  e = t(e), e = d.strDiscode(e);
  var a = [],
    n = {
      node: r,
      nodes: [],
      images: [],
      imageUrls: []
    };
  return c(e, {
    start: function(e, t, s) {
      var i = {
        node: "element",
        tag: e
      };
      if (u[e] ? i.tagType = "block" : p[e] ? i.tagType = "inline" : m[e] && (i.tagType = "closeSelf"), 0 !== t.length && (i.attr = t.reduce(function(e, t) {
          var r = t.name,
            s = t.value;
          return "class" == r && ( i.classStr = s), "style" == r && ( i.styleStr = s), s.match(/ /) && (s = s.split(" ")), e[r] ? Array.isArray(e[r]) ? e[r].push(s) : e[r] = [e[r], s] : e[r] = s, e
        }, {})), "img" === i.tag) {
        i.imgIndex = n.images.length;
        var l = i.attr.src;
        l = d.urlToHttpUrl(l, o), i.attr.src = l, i.from = r, n.images.push(i), n.imageUrls.push(l)
      }
      if ("font" === i.tag) {
        var c = ["x-small", "small", "medium", "large", "x-large", "xx-large", "-webkit-xxx-large"],
          f = {
            color: "color",
            face: "font-family",
            size: "font-size"
          };
        i.attr.style || (i.attr.style = []), i.styleStr || (i.styleStr = "");
        for (var h in f)
          if (i.attr[h]) {
            var g = "size" === h ? c[i.attr[h] - 1] : i.attr[h];
            i.attr.style.push(f[h]), i.attr.style.push(g), i.styleStr += f[h] + ": " + g + ";"
          }
      }
      if ("source" === i.tag && (n.source = i.attr.src), s) {
        var v = a[0] || n;
        void 0 === v.nodes && (v.nodes = []), v.nodes.push(i)
      } else a.unshift(i)
    },
    end: function(e) {
      var t = a.shift();
      if (t.tag !== e && console.error("invalid state: mismatch end tag"), "video" === t.tag && n.source && (t.attr.src = n.source, delete result.source), 0 === a.length) n.nodes.push(t);
      else {
        var r = a[0];
        void 0 === r.nodes && (r.nodes = []), r.nodes.push(t)
      }
    },
    chars: function(e) {
      var t = {
        node: "text",
        text: e,
        textArray: s(e)
      };
      if (0 === a.length) n.nodes.push(t);
      else {
        var r = a[0];
        void 0 === r.nodes && (r.nodes = []), r.nodes.push(t)
      }
    },
    comment: function(e) {}
  }), n
}

function s(e) {
  var t = [];
  if (0 == n.length || !l) {
    var r = {};
    return r.node = "text", r.text = e, a = [r]
  }
  e = e.replace(/\[([^\[\]]+)\]/g, ":$1:");
  for (var s = new RegExp("[:]"), a = e.split(s), o = 0; o < a.length; o++) {
    var d = a[o],
      r = {};
    l[d] ? (r.node = "element", r.tag = "emoji", r.text = l[d], r.baseSrc = i) : (r.node = "text", r.text = d), t.push(r)
  }
  return t
}

function a() {
  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
    t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "/wxParse/emojis/",
    r = arguments[2];
  n = e, i = t, l = r
}
var o = "https",
  n = "",
  i = "",
  l = {},
  d = require("./wxDiscode.js"),
  c = require("./htmlparser.js"),
  u = (e("area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr"), e("br,a,code,address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video")),
  p = e("abbr,acronym,applet,b,basefont,bdo,big,button,cite,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var"),
  m = e("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr");
e("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected"), e("wxxxcode-style,script,style,view,scroll-view,block");
module.exports = {
  html2json: r,
  emojisInit: a
}