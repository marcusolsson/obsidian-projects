"use strict";var Ci=Object.create;var Ee=Object.defineProperty;var Ai=Object.getOwnPropertyDescriptor;var Di=Object.getOwnPropertyNames;var Ii=Object.getPrototypeOf,ki=Object.prototype.hasOwnProperty;var p=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),ji=(e,t)=>{for(var r in t)Ee(e,r,{get:t[r],enumerable:!0})},jt=(e,t,r,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of Di(t))!ki.call(e,n)&&n!==r&&Ee(e,n,{get:()=>t[n],enumerable:!(i=Ai(t,n))||i.enumerable});return e};var P=(e,t,r)=>(r=e!=null?Ci(Ii(e)):{},jt(t||!e||!e.__esModule?Ee(r,"default",{value:e,enumerable:!0}):r,e)),_i=e=>jt(Ee({},"__esModule",{value:!0}),e);var ct=p(lt=>{"use strict";Object.defineProperty(lt,"__esModule",{value:!0});lt.default=Oi;var Pi=Ti(require("crypto"));function Ti(e){return e&&e.__esModule?e:{default:e}}var Ae=new Uint8Array(256),Ce=Ae.length;function Oi(){return Ce>Ae.length-16&&(Pi.default.randomFillSync(Ae),Ce=0),Ae.slice(Ce,Ce+=16)}});var Pt=p(De=>{"use strict";Object.defineProperty(De,"__esModule",{value:!0});De.default=void 0;var Bi=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;De.default=Bi});var fe=p(Ie=>{"use strict";Object.defineProperty(Ie,"__esModule",{value:!0});Ie.default=void 0;var Ni=Mi(Pt());function Mi(e){return e&&e.__esModule?e:{default:e}}function Li(e){return typeof e=="string"&&Ni.default.test(e)}var qi=Li;Ie.default=qi});var pe=p(ke=>{"use strict";Object.defineProperty(ke,"__esModule",{value:!0});ke.default=void 0;var Ri=$i(fe());function $i(e){return e&&e.__esModule?e:{default:e}}var A=[];for(let e=0;e<256;++e)A.push((e+256).toString(16).substr(1));function Vi(e,t=0){let r=(A[e[t+0]]+A[e[t+1]]+A[e[t+2]]+A[e[t+3]]+"-"+A[e[t+4]]+A[e[t+5]]+"-"+A[e[t+6]]+A[e[t+7]]+"-"+A[e[t+8]]+A[e[t+9]]+"-"+A[e[t+10]]+A[e[t+11]]+A[e[t+12]]+A[e[t+13]]+A[e[t+14]]+A[e[t+15]]).toLowerCase();if(!(0,Ri.default)(r))throw TypeError("Stringified UUID is invalid");return r}var Ui=Vi;ke.default=Ui});var Bt=p(je=>{"use strict";Object.defineProperty(je,"__esModule",{value:!0});je.default=void 0;var Hi=Ot(ct()),Yi=Ot(pe());function Ot(e){return e&&e.__esModule?e:{default:e}}var Tt,st,dt=0,ut=0;function Ki(e,t,r){let i=t&&r||0,n=t||new Array(16);e=e||{};let a=e.node||Tt,o=e.clockseq!==void 0?e.clockseq:st;if(a==null||o==null){let f=e.random||(e.rng||Hi.default)();a==null&&(a=Tt=[f[0]|1,f[1],f[2],f[3],f[4],f[5]]),o==null&&(o=st=(f[6]<<8|f[7])&16383)}let l=e.msecs!==void 0?e.msecs:Date.now(),c=e.nsecs!==void 0?e.nsecs:ut+1,s=l-dt+(c-ut)/1e4;if(s<0&&e.clockseq===void 0&&(o=o+1&16383),(s<0||l>dt)&&e.nsecs===void 0&&(c=0),c>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");dt=l,ut=c,st=o,l+=122192928e5;let d=((l&268435455)*1e4+c)%4294967296;n[i++]=d>>>24&255,n[i++]=d>>>16&255,n[i++]=d>>>8&255,n[i++]=d&255;let u=l/4294967296*1e4&268435455;n[i++]=u>>>8&255,n[i++]=u&255,n[i++]=u>>>24&15|16,n[i++]=u>>>16&255,n[i++]=o>>>8|128,n[i++]=o&255;for(let f=0;f<6;++f)n[i+f]=a[f];return t||(0,Yi.default)(n)}var Wi=Ki;je.default=Wi});var ft=p(_e=>{"use strict";Object.defineProperty(_e,"__esModule",{value:!0});_e.default=void 0;var Gi=Ji(fe());function Ji(e){return e&&e.__esModule?e:{default:e}}function Qi(e){if(!(0,Gi.default)(e))throw TypeError("Invalid UUID");let t,r=new Uint8Array(16);return r[0]=(t=parseInt(e.slice(0,8),16))>>>24,r[1]=t>>>16&255,r[2]=t>>>8&255,r[3]=t&255,r[4]=(t=parseInt(e.slice(9,13),16))>>>8,r[5]=t&255,r[6]=(t=parseInt(e.slice(14,18),16))>>>8,r[7]=t&255,r[8]=(t=parseInt(e.slice(19,23),16))>>>8,r[9]=t&255,r[10]=(t=parseInt(e.slice(24,36),16))/1099511627776&255,r[11]=t/4294967296&255,r[12]=t>>>24&255,r[13]=t>>>16&255,r[14]=t>>>8&255,r[15]=t&255,r}var zi=Qi;_e.default=zi});var pt=p(W=>{"use strict";Object.defineProperty(W,"__esModule",{value:!0});W.default=to;W.URL=W.DNS=void 0;var Xi=Nt(pe()),Zi=Nt(ft());function Nt(e){return e&&e.__esModule?e:{default:e}}function eo(e){e=unescape(encodeURIComponent(e));let t=[];for(let r=0;r<e.length;++r)t.push(e.charCodeAt(r));return t}var Mt="6ba7b810-9dad-11d1-80b4-00c04fd430c8";W.DNS=Mt;var Lt="6ba7b811-9dad-11d1-80b4-00c04fd430c8";W.URL=Lt;function to(e,t,r){function i(n,a,o,l){if(typeof n=="string"&&(n=eo(n)),typeof a=="string"&&(a=(0,Zi.default)(a)),a.length!==16)throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");let c=new Uint8Array(16+n.length);if(c.set(a),c.set(n,a.length),c=r(c),c[6]=c[6]&15|t,c[8]=c[8]&63|128,o){l=l||0;for(let s=0;s<16;++s)o[l+s]=c[s];return o}return(0,Xi.default)(c)}try{i.name=e}catch{}return i.DNS=Mt,i.URL=Lt,i}});var qt=p(Pe=>{"use strict";Object.defineProperty(Pe,"__esModule",{value:!0});Pe.default=void 0;var ro=no(require("crypto"));function no(e){return e&&e.__esModule?e:{default:e}}function io(e){return Array.isArray(e)?e=Buffer.from(e):typeof e=="string"&&(e=Buffer.from(e,"utf8")),ro.default.createHash("md5").update(e).digest()}var oo=io;Pe.default=oo});var $t=p(Te=>{"use strict";Object.defineProperty(Te,"__esModule",{value:!0});Te.default=void 0;var ao=Rt(pt()),lo=Rt(qt());function Rt(e){return e&&e.__esModule?e:{default:e}}var co=(0,ao.default)("v3",48,lo.default),so=co;Te.default=so});var Ut=p(Oe=>{"use strict";Object.defineProperty(Oe,"__esModule",{value:!0});Oe.default=void 0;var uo=Vt(ct()),fo=Vt(pe());function Vt(e){return e&&e.__esModule?e:{default:e}}function po(e,t,r){e=e||{};let i=e.random||(e.rng||uo.default)();if(i[6]=i[6]&15|64,i[8]=i[8]&63|128,t){r=r||0;for(let n=0;n<16;++n)t[r+n]=i[n];return t}return(0,fo.default)(i)}var ho=po;Oe.default=ho});var Ht=p(Be=>{"use strict";Object.defineProperty(Be,"__esModule",{value:!0});Be.default=void 0;var mo=vo(require("crypto"));function vo(e){return e&&e.__esModule?e:{default:e}}function go(e){return Array.isArray(e)?e=Buffer.from(e):typeof e=="string"&&(e=Buffer.from(e,"utf8")),mo.default.createHash("sha1").update(e).digest()}var yo=go;Be.default=yo});var Kt=p(Ne=>{"use strict";Object.defineProperty(Ne,"__esModule",{value:!0});Ne.default=void 0;var wo=Yt(pt()),xo=Yt(Ht());function Yt(e){return e&&e.__esModule?e:{default:e}}var bo=(0,wo.default)("v5",80,xo.default),So=bo;Ne.default=So});var Wt=p(Me=>{"use strict";Object.defineProperty(Me,"__esModule",{value:!0});Me.default=void 0;var Eo="00000000-0000-0000-0000-000000000000";Me.default=Eo});var Gt=p(Le=>{"use strict";Object.defineProperty(Le,"__esModule",{value:!0});Le.default=void 0;var Fo=Co(fe());function Co(e){return e&&e.__esModule?e:{default:e}}function Ao(e){if(!(0,Fo.default)(e))throw TypeError("Invalid UUID");return parseInt(e.substr(14,1),16)}var Do=Ao;Le.default=Do});var Jt=p(B=>{"use strict";Object.defineProperty(B,"__esModule",{value:!0});Object.defineProperty(B,"v1",{enumerable:!0,get:function(){return Io.default}});Object.defineProperty(B,"v3",{enumerable:!0,get:function(){return ko.default}});Object.defineProperty(B,"v4",{enumerable:!0,get:function(){return jo.default}});Object.defineProperty(B,"v5",{enumerable:!0,get:function(){return _o.default}});Object.defineProperty(B,"NIL",{enumerable:!0,get:function(){return Po.default}});Object.defineProperty(B,"version",{enumerable:!0,get:function(){return To.default}});Object.defineProperty(B,"validate",{enumerable:!0,get:function(){return Oo.default}});Object.defineProperty(B,"stringify",{enumerable:!0,get:function(){return Bo.default}});Object.defineProperty(B,"parse",{enumerable:!0,get:function(){return No.default}});var Io=q(Bt()),ko=q($t()),jo=q(Ut()),_o=q(Kt()),Po=q(Wt()),To=q(Gt()),Oo=q(fe()),Bo=q(pe()),No=q(ft());function q(e){return e&&e.__esModule?e:{default:e}}});var me=p((Ps,er)=>{var Mo=Object.prototype.toString;er.exports=function(t){if(t===void 0)return"undefined";if(t===null)return"null";var r=typeof t;if(r==="boolean")return"boolean";if(r==="string")return"string";if(r==="number")return"number";if(r==="symbol")return"symbol";if(r==="function")return Vo(t)?"generatorfunction":"function";if(Lo(t))return"array";if(Yo(t))return"buffer";if(Ho(t))return"arguments";if(Ro(t))return"date";if(qo(t))return"error";if($o(t))return"regexp";switch(Zt(t)){case"Symbol":return"symbol";case"Promise":return"promise";case"WeakMap":return"weakmap";case"WeakSet":return"weakset";case"Map":return"map";case"Set":return"set";case"Int8Array":return"int8array";case"Uint8Array":return"uint8array";case"Uint8ClampedArray":return"uint8clampedarray";case"Int16Array":return"int16array";case"Uint16Array":return"uint16array";case"Int32Array":return"int32array";case"Uint32Array":return"uint32array";case"Float32Array":return"float32array";case"Float64Array":return"float64array"}if(Uo(t))return"generator";switch(r=Mo.call(t),r){case"[object Object]":return"object";case"[object Map Iterator]":return"mapiterator";case"[object Set Iterator]":return"setiterator";case"[object String Iterator]":return"stringiterator";case"[object Array Iterator]":return"arrayiterator"}return r.slice(8,-1).toLowerCase().replace(/\s/g,"")};function Zt(e){return typeof e.constructor=="function"?e.constructor.name:null}function Lo(e){return Array.isArray?Array.isArray(e):e instanceof Array}function qo(e){return e instanceof Error||typeof e.message=="string"&&e.constructor&&typeof e.constructor.stackTraceLimit=="number"}function Ro(e){return e instanceof Date?!0:typeof e.toDateString=="function"&&typeof e.getDate=="function"&&typeof e.setDate=="function"}function $o(e){return e instanceof RegExp?!0:typeof e.flags=="string"&&typeof e.ignoreCase=="boolean"&&typeof e.multiline=="boolean"&&typeof e.global=="boolean"}function Vo(e,t){return Zt(e)==="GeneratorFunction"}function Uo(e){return typeof e.throw=="function"&&typeof e.return=="function"&&typeof e.next=="function"}function Ho(e){try{if(typeof e.length=="number"&&typeof e.callee=="function")return!0}catch(t){if(t.message.indexOf("callee")!==-1)return!0}return!1}function Yo(e){return e.constructor&&typeof e.constructor.isBuffer=="function"?e.constructor.isBuffer(e):!1}});var rr=p((Ts,tr)=>{"use strict";tr.exports=function(t){return typeof t<"u"&&t!==null&&(typeof t=="object"||typeof t=="function")}});var or=p((Os,ir)=>{"use strict";var nr=rr();ir.exports=function(t){nr(t)||(t={});for(var r=arguments.length,i=1;i<r;i++){var n=arguments[i];nr(n)&&Ko(t,n)}return t};function Ko(e,t){for(var r in t)Wo(t,r)&&(e[r]=t[r])}function Wo(e,t){return Object.prototype.hasOwnProperty.call(e,t)}});var cr=p((Bs,lr)=>{"use strict";var Go=me(),Jo=or();lr.exports=function(e,t){typeof t=="function"&&(t={parse:t});var r=zo(e),i={section_delimiter:"---",parse:Zo},n=Jo({},i,t),a=n.section_delimiter,o=r.content.split(/\r?\n/),l=null,c=ar(),s=[],d=[];function u(N){r.content=N,l=[],s=[]}function f(N){d.length&&(c.key=Xo(d[0],a),c.content=N,n.parse(c,l),l.push(c),c=ar(),s=[],d=[])}for(var h=0;h<o.length;h++){var g=o[h],x=d.length,v=g.trim();if(Qo(v,a)){if(v.length===3&&h!==0){if(x===0||x===2){s.push(g);continue}d.push(v),c.data=s.join(`
`),s=[];continue}l===null&&u(s.join(`
`)),x===2&&f(s.join(`
`)),d.push(v);continue}s.push(g)}return l===null?u(s.join(`
`)):f(s.join(`
`)),r.sections=l,r};function Qo(e,t){return!(e.slice(0,t.length)!==t||e.charAt(t.length+1)===t.slice(-1))}function zo(e){if(Go(e)!=="object"&&(e={content:e}),typeof e.content!="string"&&!ea(e.content))throw new TypeError("expected a buffer or string");return e.content=e.content.toString(),e.sections=[],e}function Xo(e,t){return e?e.slice(t.length).trim():""}function ar(){return{key:"",data:"",content:""}}function Zo(e){return e}function ea(e){return e&&e.constructor&&typeof e.constructor.isBuffer=="function"?e.constructor.isBuffer(e):!1}});var J=p((Ns,G)=>{"use strict";function sr(e){return typeof e>"u"||e===null}function ta(e){return typeof e=="object"&&e!==null}function ra(e){return Array.isArray(e)?e:sr(e)?[]:[e]}function na(e,t){var r,i,n,a;if(t)for(a=Object.keys(t),r=0,i=a.length;r<i;r+=1)n=a[r],e[n]=t[n];return e}function ia(e,t){var r="",i;for(i=0;i<t;i+=1)r+=e;return r}function oa(e){return e===0&&Number.NEGATIVE_INFINITY===1/e}G.exports.isNothing=sr;G.exports.isObject=ta;G.exports.toArray=ra;G.exports.repeat=ia;G.exports.isNegativeZero=oa;G.exports.extend=na});var ne=p((Ms,dr)=>{"use strict";function ve(e,t){Error.call(this),this.name="YAMLException",this.reason=e,this.mark=t,this.message=(this.reason||"(unknown reason)")+(this.mark?" "+this.mark.toString():""),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack||""}ve.prototype=Object.create(Error.prototype);ve.prototype.constructor=ve;ve.prototype.toString=function(t){var r=this.name+": ";return r+=this.reason||"(unknown reason)",!t&&this.mark&&(r+=" "+this.mark.toString()),r};dr.exports=ve});var pr=p((Ls,fr)=>{"use strict";var ur=J();function ht(e,t,r,i,n){this.name=e,this.buffer=t,this.position=r,this.line=i,this.column=n}ht.prototype.getSnippet=function(t,r){var i,n,a,o,l;if(!this.buffer)return null;for(t=t||4,r=r||75,i="",n=this.position;n>0&&`\0\r
\x85\u2028\u2029`.indexOf(this.buffer.charAt(n-1))===-1;)if(n-=1,this.position-n>r/2-1){i=" ... ",n+=5;break}for(a="",o=this.position;o<this.buffer.length&&`\0\r
\x85\u2028\u2029`.indexOf(this.buffer.charAt(o))===-1;)if(o+=1,o-this.position>r/2-1){a=" ... ",o-=5;break}return l=this.buffer.slice(n,o),ur.repeat(" ",t)+i+l+a+`
`+ur.repeat(" ",t+this.position-n+i.length)+"^"};ht.prototype.toString=function(t){var r,i="";return this.name&&(i+='in "'+this.name+'" '),i+="at line "+(this.line+1)+", column "+(this.column+1),t||(r=this.getSnippet(),r&&(i+=`:
`+r)),i};fr.exports=ht});var E=p((qs,mr)=>{"use strict";var hr=ne(),aa=["kind","resolve","construct","instanceOf","predicate","represent","defaultStyle","styleAliases"],la=["scalar","sequence","mapping"];function ca(e){var t={};return e!==null&&Object.keys(e).forEach(function(r){e[r].forEach(function(i){t[String(i)]=r})}),t}function sa(e,t){if(t=t||{},Object.keys(t).forEach(function(r){if(aa.indexOf(r)===-1)throw new hr('Unknown option "'+r+'" is met in definition of "'+e+'" YAML type.')}),this.tag=e,this.kind=t.kind||null,this.resolve=t.resolve||function(){return!0},this.construct=t.construct||function(r){return r},this.instanceOf=t.instanceOf||null,this.predicate=t.predicate||null,this.represent=t.represent||null,this.defaultStyle=t.defaultStyle||null,this.styleAliases=ca(t.styleAliases||null),la.indexOf(this.kind)===-1)throw new hr('Unknown kind "'+this.kind+'" is specified for "'+e+'" YAML type.')}mr.exports=sa});var Q=p((Rs,gr)=>{"use strict";var vr=J(),Ve=ne(),da=E();function mt(e,t,r){var i=[];return e.include.forEach(function(n){r=mt(n,t,r)}),e[t].forEach(function(n){r.forEach(function(a,o){a.tag===n.tag&&a.kind===n.kind&&i.push(o)}),r.push(n)}),r.filter(function(n,a){return i.indexOf(a)===-1})}function ua(){var e={scalar:{},sequence:{},mapping:{},fallback:{}},t,r;function i(n){e[n.kind][n.tag]=e.fallback[n.tag]=n}for(t=0,r=arguments.length;t<r;t+=1)arguments[t].forEach(i);return e}function ie(e){this.include=e.include||[],this.implicit=e.implicit||[],this.explicit=e.explicit||[],this.implicit.forEach(function(t){if(t.loadKind&&t.loadKind!=="scalar")throw new Ve("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.")}),this.compiledImplicit=mt(this,"implicit",[]),this.compiledExplicit=mt(this,"explicit",[]),this.compiledTypeMap=ua(this.compiledImplicit,this.compiledExplicit)}ie.DEFAULT=null;ie.create=function(){var t,r;switch(arguments.length){case 1:t=ie.DEFAULT,r=arguments[0];break;case 2:t=arguments[0],r=arguments[1];break;default:throw new Ve("Wrong number of arguments for Schema.create function")}if(t=vr.toArray(t),r=vr.toArray(r),!t.every(function(i){return i instanceof ie}))throw new Ve("Specified list of super schemas (or a single Schema object) contains a non-Schema object.");if(!r.every(function(i){return i instanceof da}))throw new Ve("Specified list of YAML types (or a single Type object) contains a non-Type object.");return new ie({include:t,explicit:r})};gr.exports=ie});var wr=p(($s,yr)=>{"use strict";var fa=E();yr.exports=new fa("tag:yaml.org,2002:str",{kind:"scalar",construct:function(e){return e!==null?e:""}})});var br=p((Vs,xr)=>{"use strict";var pa=E();xr.exports=new pa("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(e){return e!==null?e:[]}})});var Er=p((Us,Sr)=>{"use strict";var ha=E();Sr.exports=new ha("tag:yaml.org,2002:map",{kind:"mapping",construct:function(e){return e!==null?e:{}}})});var Ue=p((Hs,Fr)=>{"use strict";var ma=Q();Fr.exports=new ma({explicit:[wr(),br(),Er()]})});var Ar=p((Ys,Cr)=>{"use strict";var va=E();function ga(e){if(e===null)return!0;var t=e.length;return t===1&&e==="~"||t===4&&(e==="null"||e==="Null"||e==="NULL")}function ya(){return null}function wa(e){return e===null}Cr.exports=new va("tag:yaml.org,2002:null",{kind:"scalar",resolve:ga,construct:ya,predicate:wa,represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"}},defaultStyle:"lowercase"})});var Ir=p((Ks,Dr)=>{"use strict";var xa=E();function ba(e){if(e===null)return!1;var t=e.length;return t===4&&(e==="true"||e==="True"||e==="TRUE")||t===5&&(e==="false"||e==="False"||e==="FALSE")}function Sa(e){return e==="true"||e==="True"||e==="TRUE"}function Ea(e){return Object.prototype.toString.call(e)==="[object Boolean]"}Dr.exports=new xa("tag:yaml.org,2002:bool",{kind:"scalar",resolve:ba,construct:Sa,predicate:Ea,represent:{lowercase:function(e){return e?"true":"false"},uppercase:function(e){return e?"TRUE":"FALSE"},camelcase:function(e){return e?"True":"False"}},defaultStyle:"lowercase"})});var jr=p((Ws,kr)=>{"use strict";var Fa=J(),Ca=E();function Aa(e){return 48<=e&&e<=57||65<=e&&e<=70||97<=e&&e<=102}function Da(e){return 48<=e&&e<=55}function Ia(e){return 48<=e&&e<=57}function ka(e){if(e===null)return!1;var t=e.length,r=0,i=!1,n;if(!t)return!1;if(n=e[r],(n==="-"||n==="+")&&(n=e[++r]),n==="0"){if(r+1===t)return!0;if(n=e[++r],n==="b"){for(r++;r<t;r++)if(n=e[r],n!=="_"){if(n!=="0"&&n!=="1")return!1;i=!0}return i&&n!=="_"}if(n==="x"){for(r++;r<t;r++)if(n=e[r],n!=="_"){if(!Aa(e.charCodeAt(r)))return!1;i=!0}return i&&n!=="_"}for(;r<t;r++)if(n=e[r],n!=="_"){if(!Da(e.charCodeAt(r)))return!1;i=!0}return i&&n!=="_"}if(n==="_")return!1;for(;r<t;r++)if(n=e[r],n!=="_"){if(n===":")break;if(!Ia(e.charCodeAt(r)))return!1;i=!0}return!i||n==="_"?!1:n!==":"?!0:/^(:[0-5]?[0-9])+$/.test(e.slice(r))}function ja(e){var t=e,r=1,i,n,a=[];return t.indexOf("_")!==-1&&(t=t.replace(/_/g,"")),i=t[0],(i==="-"||i==="+")&&(i==="-"&&(r=-1),t=t.slice(1),i=t[0]),t==="0"?0:i==="0"?t[1]==="b"?r*parseInt(t.slice(2),2):t[1]==="x"?r*parseInt(t,16):r*parseInt(t,8):t.indexOf(":")!==-1?(t.split(":").forEach(function(o){a.unshift(parseInt(o,10))}),t=0,n=1,a.forEach(function(o){t+=o*n,n*=60}),r*t):r*parseInt(t,10)}function _a(e){return Object.prototype.toString.call(e)==="[object Number]"&&e%1===0&&!Fa.isNegativeZero(e)}kr.exports=new Ca("tag:yaml.org,2002:int",{kind:"scalar",resolve:ka,construct:ja,predicate:_a,represent:{binary:function(e){return e>=0?"0b"+e.toString(2):"-0b"+e.toString(2).slice(1)},octal:function(e){return e>=0?"0"+e.toString(8):"-0"+e.toString(8).slice(1)},decimal:function(e){return e.toString(10)},hexadecimal:function(e){return e>=0?"0x"+e.toString(16).toUpperCase():"-0x"+e.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}})});var Tr=p((Gs,Pr)=>{"use strict";var _r=J(),Pa=E(),Ta=new RegExp("^(?:[-+]?(?:0|[1-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");function Oa(e){return!(e===null||!Ta.test(e)||e[e.length-1]==="_")}function Ba(e){var t,r,i,n;return t=e.replace(/_/g,"").toLowerCase(),r=t[0]==="-"?-1:1,n=[],"+-".indexOf(t[0])>=0&&(t=t.slice(1)),t===".inf"?r===1?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:t===".nan"?NaN:t.indexOf(":")>=0?(t.split(":").forEach(function(a){n.unshift(parseFloat(a,10))}),t=0,i=1,n.forEach(function(a){t+=a*i,i*=60}),r*t):r*parseFloat(t,10)}var Na=/^[-+]?[0-9]+e/;function Ma(e,t){var r;if(isNaN(e))switch(t){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===e)switch(t){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===e)switch(t){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(_r.isNegativeZero(e))return"-0.0";return r=e.toString(10),Na.test(r)?r.replace("e",".e"):r}function La(e){return Object.prototype.toString.call(e)==="[object Number]"&&(e%1!==0||_r.isNegativeZero(e))}Pr.exports=new Pa("tag:yaml.org,2002:float",{kind:"scalar",resolve:Oa,construct:Ba,predicate:La,represent:Ma,defaultStyle:"lowercase"})});var vt=p((Js,Or)=>{"use strict";var qa=Q();Or.exports=new qa({include:[Ue()],implicit:[Ar(),Ir(),jr(),Tr()]})});var gt=p((Qs,Br)=>{"use strict";var Ra=Q();Br.exports=new Ra({include:[vt()]})});var qr=p((zs,Lr)=>{"use strict";var $a=E(),Nr=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),Mr=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function Va(e){return e===null?!1:Nr.exec(e)!==null||Mr.exec(e)!==null}function Ua(e){var t,r,i,n,a,o,l,c=0,s=null,d,u,f;if(t=Nr.exec(e),t===null&&(t=Mr.exec(e)),t===null)throw new Error("Date resolve error");if(r=+t[1],i=+t[2]-1,n=+t[3],!t[4])return new Date(Date.UTC(r,i,n));if(a=+t[4],o=+t[5],l=+t[6],t[7]){for(c=t[7].slice(0,3);c.length<3;)c+="0";c=+c}return t[9]&&(d=+t[10],u=+(t[11]||0),s=(d*60+u)*6e4,t[9]==="-"&&(s=-s)),f=new Date(Date.UTC(r,i,n,a,o,l,c)),s&&f.setTime(f.getTime()-s),f}function Ha(e){return e.toISOString()}Lr.exports=new $a("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:Va,construct:Ua,instanceOf:Date,represent:Ha})});var $r=p((Xs,Rr)=>{"use strict";var Ya=E();function Ka(e){return e==="<<"||e===null}Rr.exports=new Ya("tag:yaml.org,2002:merge",{kind:"scalar",resolve:Ka})});var Hr=p((Zs,Ur)=>{"use strict";var z;try{Vr=require,z=Vr("buffer").Buffer}catch{}var Vr,Wa=E(),yt=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;function Ga(e){if(e===null)return!1;var t,r,i=0,n=e.length,a=yt;for(r=0;r<n;r++)if(t=a.indexOf(e.charAt(r)),!(t>64)){if(t<0)return!1;i+=6}return i%8===0}function Ja(e){var t,r,i=e.replace(/[\r\n=]/g,""),n=i.length,a=yt,o=0,l=[];for(t=0;t<n;t++)t%4===0&&t&&(l.push(o>>16&255),l.push(o>>8&255),l.push(o&255)),o=o<<6|a.indexOf(i.charAt(t));return r=n%4*6,r===0?(l.push(o>>16&255),l.push(o>>8&255),l.push(o&255)):r===18?(l.push(o>>10&255),l.push(o>>2&255)):r===12&&l.push(o>>4&255),z?z.from?z.from(l):new z(l):l}function Qa(e){var t="",r=0,i,n,a=e.length,o=yt;for(i=0;i<a;i++)i%3===0&&i&&(t+=o[r>>18&63],t+=o[r>>12&63],t+=o[r>>6&63],t+=o[r&63]),r=(r<<8)+e[i];return n=a%3,n===0?(t+=o[r>>18&63],t+=o[r>>12&63],t+=o[r>>6&63],t+=o[r&63]):n===2?(t+=o[r>>10&63],t+=o[r>>4&63],t+=o[r<<2&63],t+=o[64]):n===1&&(t+=o[r>>2&63],t+=o[r<<4&63],t+=o[64],t+=o[64]),t}function za(e){return z&&z.isBuffer(e)}Ur.exports=new Wa("tag:yaml.org,2002:binary",{kind:"scalar",resolve:Ga,construct:Ja,predicate:za,represent:Qa})});var Kr=p((ed,Yr)=>{"use strict";var Xa=E(),Za=Object.prototype.hasOwnProperty,el=Object.prototype.toString;function tl(e){if(e===null)return!0;var t=[],r,i,n,a,o,l=e;for(r=0,i=l.length;r<i;r+=1){if(n=l[r],o=!1,el.call(n)!=="[object Object]")return!1;for(a in n)if(Za.call(n,a))if(!o)o=!0;else return!1;if(!o)return!1;if(t.indexOf(a)===-1)t.push(a);else return!1}return!0}function rl(e){return e!==null?e:[]}Yr.exports=new Xa("tag:yaml.org,2002:omap",{kind:"sequence",resolve:tl,construct:rl})});var Gr=p((td,Wr)=>{"use strict";var nl=E(),il=Object.prototype.toString;function ol(e){if(e===null)return!0;var t,r,i,n,a,o=e;for(a=new Array(o.length),t=0,r=o.length;t<r;t+=1){if(i=o[t],il.call(i)!=="[object Object]"||(n=Object.keys(i),n.length!==1))return!1;a[t]=[n[0],i[n[0]]]}return!0}function al(e){if(e===null)return[];var t,r,i,n,a,o=e;for(a=new Array(o.length),t=0,r=o.length;t<r;t+=1)i=o[t],n=Object.keys(i),a[t]=[n[0],i[n[0]]];return a}Wr.exports=new nl("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:ol,construct:al})});var Qr=p((rd,Jr)=>{"use strict";var ll=E(),cl=Object.prototype.hasOwnProperty;function sl(e){if(e===null)return!0;var t,r=e;for(t in r)if(cl.call(r,t)&&r[t]!==null)return!1;return!0}function dl(e){return e!==null?e:{}}Jr.exports=new ll("tag:yaml.org,2002:set",{kind:"mapping",resolve:sl,construct:dl})});var oe=p((nd,zr)=>{"use strict";var ul=Q();zr.exports=new ul({include:[gt()],implicit:[qr(),$r()],explicit:[Hr(),Kr(),Gr(),Qr()]})});var Zr=p((id,Xr)=>{"use strict";var fl=E();function pl(){return!0}function hl(){}function ml(){return""}function vl(e){return typeof e>"u"}Xr.exports=new fl("tag:yaml.org,2002:js/undefined",{kind:"scalar",resolve:pl,construct:hl,predicate:vl,represent:ml})});var tn=p((od,en)=>{"use strict";var gl=E();function yl(e){if(e===null||e.length===0)return!1;var t=e,r=/\/([gim]*)$/.exec(e),i="";return!(t[0]==="/"&&(r&&(i=r[1]),i.length>3||t[t.length-i.length-1]!=="/"))}function wl(e){var t=e,r=/\/([gim]*)$/.exec(e),i="";return t[0]==="/"&&(r&&(i=r[1]),t=t.slice(1,t.length-i.length-1)),new RegExp(t,i)}function xl(e){var t="/"+e.source+"/";return e.global&&(t+="g"),e.multiline&&(t+="m"),e.ignoreCase&&(t+="i"),t}function bl(e){return Object.prototype.toString.call(e)==="[object RegExp]"}en.exports=new gl("tag:yaml.org,2002:js/regexp",{kind:"scalar",resolve:yl,construct:wl,predicate:bl,represent:xl})});var on=p((ad,nn)=>{"use strict";var He;try{rn=require,He=rn("esprima")}catch{typeof window<"u"&&(He=window.esprima)}var rn,Sl=E();function El(e){if(e===null)return!1;try{var t="("+e+")",r=He.parse(t,{range:!0});return!(r.type!=="Program"||r.body.length!==1||r.body[0].type!=="ExpressionStatement"||r.body[0].expression.type!=="ArrowFunctionExpression"&&r.body[0].expression.type!=="FunctionExpression")}catch{return!1}}function Fl(e){var t="("+e+")",r=He.parse(t,{range:!0}),i=[],n;if(r.type!=="Program"||r.body.length!==1||r.body[0].type!=="ExpressionStatement"||r.body[0].expression.type!=="ArrowFunctionExpression"&&r.body[0].expression.type!=="FunctionExpression")throw new Error("Failed to resolve function");return r.body[0].expression.params.forEach(function(a){i.push(a.name)}),n=r.body[0].expression.body.range,r.body[0].expression.body.type==="BlockStatement"?new Function(i,t.slice(n[0]+1,n[1]-1)):new Function(i,"return "+t.slice(n[0],n[1]))}function Cl(e){return e.toString()}function Al(e){return Object.prototype.toString.call(e)==="[object Function]"}nn.exports=new Sl("tag:yaml.org,2002:js/function",{kind:"scalar",resolve:El,construct:Fl,predicate:Al,represent:Cl})});var ge=p((ld,ln)=>{"use strict";var an=Q();ln.exports=an.DEFAULT=new an({include:[oe()],explicit:[Zr(),tn(),on()]})});var An=p((cd,ye)=>{"use strict";var R=J(),hn=ne(),Dl=pr(),mn=oe(),Il=ge(),H=Object.prototype.hasOwnProperty,Ye=1,vn=2,gn=3,Ke=4,wt=1,kl=2,cn=3,jl=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,_l=/[\x85\u2028\u2029]/,Pl=/[,\[\]\{\}]/,yn=/^(?:!|!!|![a-z\-]+!)$/i,wn=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function sn(e){return Object.prototype.toString.call(e)}function L(e){return e===10||e===13}function Z(e){return e===9||e===32}function k(e){return e===9||e===32||e===10||e===13}function ae(e){return e===44||e===91||e===93||e===123||e===125}function Tl(e){var t;return 48<=e&&e<=57?e-48:(t=e|32,97<=t&&t<=102?t-97+10:-1)}function Ol(e){return e===120?2:e===117?4:e===85?8:0}function Bl(e){return 48<=e&&e<=57?e-48:-1}function dn(e){return e===48?"\0":e===97?"\x07":e===98?"\b":e===116||e===9?"	":e===110?`
`:e===118?"\v":e===102?"\f":e===114?"\r":e===101?"\x1B":e===32?" ":e===34?'"':e===47?"/":e===92?"\\":e===78?"\x85":e===95?"\xA0":e===76?"\u2028":e===80?"\u2029":""}function Nl(e){return e<=65535?String.fromCharCode(e):String.fromCharCode((e-65536>>10)+55296,(e-65536&1023)+56320)}var xn=new Array(256),bn=new Array(256);for(X=0;X<256;X++)xn[X]=dn(X)?1:0,bn[X]=dn(X);var X;function Ml(e,t){this.input=e,this.filename=t.filename||null,this.schema=t.schema||Il,this.onWarning=t.onWarning||null,this.legacy=t.legacy||!1,this.json=t.json||!1,this.listener=t.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=e.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.documents=[]}function Sn(e,t){return new hn(t,new Dl(e.filename,e.input,e.position,e.line,e.position-e.lineStart))}function m(e,t){throw Sn(e,t)}function We(e,t){e.onWarning&&e.onWarning.call(null,Sn(e,t))}var un={YAML:function(t,r,i){var n,a,o;t.version!==null&&m(t,"duplication of %YAML directive"),i.length!==1&&m(t,"YAML directive accepts exactly one argument"),n=/^([0-9]+)\.([0-9]+)$/.exec(i[0]),n===null&&m(t,"ill-formed argument of the YAML directive"),a=parseInt(n[1],10),o=parseInt(n[2],10),a!==1&&m(t,"unacceptable YAML version of the document"),t.version=i[0],t.checkLineBreaks=o<2,o!==1&&o!==2&&We(t,"unsupported YAML version of the document")},TAG:function(t,r,i){var n,a;i.length!==2&&m(t,"TAG directive accepts exactly two arguments"),n=i[0],a=i[1],yn.test(n)||m(t,"ill-formed tag handle (first argument) of the TAG directive"),H.call(t.tagMap,n)&&m(t,'there is a previously declared suffix for "'+n+'" tag handle'),wn.test(a)||m(t,"ill-formed tag prefix (second argument) of the TAG directive"),t.tagMap[n]=a}};function U(e,t,r,i){var n,a,o,l;if(t<r){if(l=e.input.slice(t,r),i)for(n=0,a=l.length;n<a;n+=1)o=l.charCodeAt(n),o===9||32<=o&&o<=1114111||m(e,"expected valid JSON character");else jl.test(l)&&m(e,"the stream contains non-printable characters");e.result+=l}}function fn(e,t,r,i){var n,a,o,l;for(R.isObject(r)||m(e,"cannot merge mappings; the provided source object is unacceptable"),n=Object.keys(r),o=0,l=n.length;o<l;o+=1)a=n[o],H.call(t,a)||(t[a]=r[a],i[a]=!0)}function le(e,t,r,i,n,a,o,l){var c,s;if(Array.isArray(n))for(n=Array.prototype.slice.call(n),c=0,s=n.length;c<s;c+=1)Array.isArray(n[c])&&m(e,"nested arrays are not supported inside keys"),typeof n=="object"&&sn(n[c])==="[object Object]"&&(n[c]="[object Object]");if(typeof n=="object"&&sn(n)==="[object Object]"&&(n="[object Object]"),n=String(n),t===null&&(t={}),i==="tag:yaml.org,2002:merge")if(Array.isArray(a))for(c=0,s=a.length;c<s;c+=1)fn(e,t,a[c],r);else fn(e,t,a,r);else!e.json&&!H.call(r,n)&&H.call(t,n)&&(e.line=o||e.line,e.position=l||e.position,m(e,"duplicated mapping key")),t[n]=a,delete r[n];return t}function xt(e){var t;t=e.input.charCodeAt(e.position),t===10?e.position++:t===13?(e.position++,e.input.charCodeAt(e.position)===10&&e.position++):m(e,"a line break is expected"),e.line+=1,e.lineStart=e.position}function S(e,t,r){for(var i=0,n=e.input.charCodeAt(e.position);n!==0;){for(;Z(n);)n=e.input.charCodeAt(++e.position);if(t&&n===35)do n=e.input.charCodeAt(++e.position);while(n!==10&&n!==13&&n!==0);if(L(n))for(xt(e),n=e.input.charCodeAt(e.position),i++,e.lineIndent=0;n===32;)e.lineIndent++,n=e.input.charCodeAt(++e.position);else break}return r!==-1&&i!==0&&e.lineIndent<r&&We(e,"deficient indentation"),i}function Ge(e){var t=e.position,r;return r=e.input.charCodeAt(t),!!((r===45||r===46)&&r===e.input.charCodeAt(t+1)&&r===e.input.charCodeAt(t+2)&&(t+=3,r=e.input.charCodeAt(t),r===0||k(r)))}function bt(e,t){t===1?e.result+=" ":t>1&&(e.result+=R.repeat(`
`,t-1))}function Ll(e,t,r){var i,n,a,o,l,c,s,d,u=e.kind,f=e.result,h;if(h=e.input.charCodeAt(e.position),k(h)||ae(h)||h===35||h===38||h===42||h===33||h===124||h===62||h===39||h===34||h===37||h===64||h===96||(h===63||h===45)&&(n=e.input.charCodeAt(e.position+1),k(n)||r&&ae(n)))return!1;for(e.kind="scalar",e.result="",a=o=e.position,l=!1;h!==0;){if(h===58){if(n=e.input.charCodeAt(e.position+1),k(n)||r&&ae(n))break}else if(h===35){if(i=e.input.charCodeAt(e.position-1),k(i))break}else{if(e.position===e.lineStart&&Ge(e)||r&&ae(h))break;if(L(h))if(c=e.line,s=e.lineStart,d=e.lineIndent,S(e,!1,-1),e.lineIndent>=t){l=!0,h=e.input.charCodeAt(e.position);continue}else{e.position=o,e.line=c,e.lineStart=s,e.lineIndent=d;break}}l&&(U(e,a,o,!1),bt(e,e.line-c),a=o=e.position,l=!1),Z(h)||(o=e.position+1),h=e.input.charCodeAt(++e.position)}return U(e,a,o,!1),e.result?!0:(e.kind=u,e.result=f,!1)}function ql(e,t){var r,i,n;if(r=e.input.charCodeAt(e.position),r!==39)return!1;for(e.kind="scalar",e.result="",e.position++,i=n=e.position;(r=e.input.charCodeAt(e.position))!==0;)if(r===39)if(U(e,i,e.position,!0),r=e.input.charCodeAt(++e.position),r===39)i=e.position,e.position++,n=e.position;else return!0;else L(r)?(U(e,i,n,!0),bt(e,S(e,!1,t)),i=n=e.position):e.position===e.lineStart&&Ge(e)?m(e,"unexpected end of the document within a single quoted scalar"):(e.position++,n=e.position);m(e,"unexpected end of the stream within a single quoted scalar")}function Rl(e,t){var r,i,n,a,o,l;if(l=e.input.charCodeAt(e.position),l!==34)return!1;for(e.kind="scalar",e.result="",e.position++,r=i=e.position;(l=e.input.charCodeAt(e.position))!==0;){if(l===34)return U(e,r,e.position,!0),e.position++,!0;if(l===92){if(U(e,r,e.position,!0),l=e.input.charCodeAt(++e.position),L(l))S(e,!1,t);else if(l<256&&xn[l])e.result+=bn[l],e.position++;else if((o=Ol(l))>0){for(n=o,a=0;n>0;n--)l=e.input.charCodeAt(++e.position),(o=Tl(l))>=0?a=(a<<4)+o:m(e,"expected hexadecimal character");e.result+=Nl(a),e.position++}else m(e,"unknown escape sequence");r=i=e.position}else L(l)?(U(e,r,i,!0),bt(e,S(e,!1,t)),r=i=e.position):e.position===e.lineStart&&Ge(e)?m(e,"unexpected end of the document within a double quoted scalar"):(e.position++,i=e.position)}m(e,"unexpected end of the stream within a double quoted scalar")}function $l(e,t){var r=!0,i,n=e.tag,a,o=e.anchor,l,c,s,d,u,f={},h,g,x,v;if(v=e.input.charCodeAt(e.position),v===91)c=93,u=!1,a=[];else if(v===123)c=125,u=!0,a={};else return!1;for(e.anchor!==null&&(e.anchorMap[e.anchor]=a),v=e.input.charCodeAt(++e.position);v!==0;){if(S(e,!0,t),v=e.input.charCodeAt(e.position),v===c)return e.position++,e.tag=n,e.anchor=o,e.kind=u?"mapping":"sequence",e.result=a,!0;r||m(e,"missed comma between flow collection entries"),g=h=x=null,s=d=!1,v===63&&(l=e.input.charCodeAt(e.position+1),k(l)&&(s=d=!0,e.position++,S(e,!0,t))),i=e.line,ce(e,t,Ye,!1,!0),g=e.tag,h=e.result,S(e,!0,t),v=e.input.charCodeAt(e.position),(d||e.line===i)&&v===58&&(s=!0,v=e.input.charCodeAt(++e.position),S(e,!0,t),ce(e,t,Ye,!1,!0),x=e.result),u?le(e,a,f,g,h,x):s?a.push(le(e,null,f,g,h,x)):a.push(h),S(e,!0,t),v=e.input.charCodeAt(e.position),v===44?(r=!0,v=e.input.charCodeAt(++e.position)):r=!1}m(e,"unexpected end of the stream within a flow collection")}function Vl(e,t){var r,i,n=wt,a=!1,o=!1,l=t,c=0,s=!1,d,u;if(u=e.input.charCodeAt(e.position),u===124)i=!1;else if(u===62)i=!0;else return!1;for(e.kind="scalar",e.result="";u!==0;)if(u=e.input.charCodeAt(++e.position),u===43||u===45)wt===n?n=u===43?cn:kl:m(e,"repeat of a chomping mode identifier");else if((d=Bl(u))>=0)d===0?m(e,"bad explicit indentation width of a block scalar; it cannot be less than one"):o?m(e,"repeat of an indentation width identifier"):(l=t+d-1,o=!0);else break;if(Z(u)){do u=e.input.charCodeAt(++e.position);while(Z(u));if(u===35)do u=e.input.charCodeAt(++e.position);while(!L(u)&&u!==0)}for(;u!==0;){for(xt(e),e.lineIndent=0,u=e.input.charCodeAt(e.position);(!o||e.lineIndent<l)&&u===32;)e.lineIndent++,u=e.input.charCodeAt(++e.position);if(!o&&e.lineIndent>l&&(l=e.lineIndent),L(u)){c++;continue}if(e.lineIndent<l){n===cn?e.result+=R.repeat(`
`,a?1+c:c):n===wt&&a&&(e.result+=`
`);break}for(i?Z(u)?(s=!0,e.result+=R.repeat(`
`,a?1+c:c)):s?(s=!1,e.result+=R.repeat(`
`,c+1)):c===0?a&&(e.result+=" "):e.result+=R.repeat(`
`,c):e.result+=R.repeat(`
`,a?1+c:c),a=!0,o=!0,c=0,r=e.position;!L(u)&&u!==0;)u=e.input.charCodeAt(++e.position);U(e,r,e.position,!1)}return!0}function pn(e,t){var r,i=e.tag,n=e.anchor,a=[],o,l=!1,c;for(e.anchor!==null&&(e.anchorMap[e.anchor]=a),c=e.input.charCodeAt(e.position);c!==0&&!(c!==45||(o=e.input.charCodeAt(e.position+1),!k(o)));){if(l=!0,e.position++,S(e,!0,-1)&&e.lineIndent<=t){a.push(null),c=e.input.charCodeAt(e.position);continue}if(r=e.line,ce(e,t,gn,!1,!0),a.push(e.result),S(e,!0,-1),c=e.input.charCodeAt(e.position),(e.line===r||e.lineIndent>t)&&c!==0)m(e,"bad indentation of a sequence entry");else if(e.lineIndent<t)break}return l?(e.tag=i,e.anchor=n,e.kind="sequence",e.result=a,!0):!1}function Ul(e,t,r){var i,n,a,o,l=e.tag,c=e.anchor,s={},d={},u=null,f=null,h=null,g=!1,x=!1,v;for(e.anchor!==null&&(e.anchorMap[e.anchor]=s),v=e.input.charCodeAt(e.position);v!==0;){if(i=e.input.charCodeAt(e.position+1),a=e.line,o=e.position,(v===63||v===58)&&k(i))v===63?(g&&(le(e,s,d,u,f,null),u=f=h=null),x=!0,g=!0,n=!0):g?(g=!1,n=!0):m(e,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),e.position+=1,v=i;else if(ce(e,r,vn,!1,!0))if(e.line===a){for(v=e.input.charCodeAt(e.position);Z(v);)v=e.input.charCodeAt(++e.position);if(v===58)v=e.input.charCodeAt(++e.position),k(v)||m(e,"a whitespace character is expected after the key-value separator within a block mapping"),g&&(le(e,s,d,u,f,null),u=f=h=null),x=!0,g=!1,n=!1,u=e.tag,f=e.result;else if(x)m(e,"can not read an implicit mapping pair; a colon is missed");else return e.tag=l,e.anchor=c,!0}else if(x)m(e,"can not read a block mapping entry; a multiline key may not be an implicit key");else return e.tag=l,e.anchor=c,!0;else break;if((e.line===a||e.lineIndent>t)&&(ce(e,t,Ke,!0,n)&&(g?f=e.result:h=e.result),g||(le(e,s,d,u,f,h,a,o),u=f=h=null),S(e,!0,-1),v=e.input.charCodeAt(e.position)),e.lineIndent>t&&v!==0)m(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return g&&le(e,s,d,u,f,null),x&&(e.tag=l,e.anchor=c,e.kind="mapping",e.result=s),x}function Hl(e){var t,r=!1,i=!1,n,a,o;if(o=e.input.charCodeAt(e.position),o!==33)return!1;if(e.tag!==null&&m(e,"duplication of a tag property"),o=e.input.charCodeAt(++e.position),o===60?(r=!0,o=e.input.charCodeAt(++e.position)):o===33?(i=!0,n="!!",o=e.input.charCodeAt(++e.position)):n="!",t=e.position,r){do o=e.input.charCodeAt(++e.position);while(o!==0&&o!==62);e.position<e.length?(a=e.input.slice(t,e.position),o=e.input.charCodeAt(++e.position)):m(e,"unexpected end of the stream within a verbatim tag")}else{for(;o!==0&&!k(o);)o===33&&(i?m(e,"tag suffix cannot contain exclamation marks"):(n=e.input.slice(t-1,e.position+1),yn.test(n)||m(e,"named tag handle cannot contain such characters"),i=!0,t=e.position+1)),o=e.input.charCodeAt(++e.position);a=e.input.slice(t,e.position),Pl.test(a)&&m(e,"tag suffix cannot contain flow indicator characters")}return a&&!wn.test(a)&&m(e,"tag name cannot contain such characters: "+a),r?e.tag=a:H.call(e.tagMap,n)?e.tag=e.tagMap[n]+a:n==="!"?e.tag="!"+a:n==="!!"?e.tag="tag:yaml.org,2002:"+a:m(e,'undeclared tag handle "'+n+'"'),!0}function Yl(e){var t,r;if(r=e.input.charCodeAt(e.position),r!==38)return!1;for(e.anchor!==null&&m(e,"duplication of an anchor property"),r=e.input.charCodeAt(++e.position),t=e.position;r!==0&&!k(r)&&!ae(r);)r=e.input.charCodeAt(++e.position);return e.position===t&&m(e,"name of an anchor node must contain at least one character"),e.anchor=e.input.slice(t,e.position),!0}function Kl(e){var t,r,i;if(i=e.input.charCodeAt(e.position),i!==42)return!1;for(i=e.input.charCodeAt(++e.position),t=e.position;i!==0&&!k(i)&&!ae(i);)i=e.input.charCodeAt(++e.position);return e.position===t&&m(e,"name of an alias node must contain at least one character"),r=e.input.slice(t,e.position),H.call(e.anchorMap,r)||m(e,'unidentified alias "'+r+'"'),e.result=e.anchorMap[r],S(e,!0,-1),!0}function ce(e,t,r,i,n){var a,o,l,c=1,s=!1,d=!1,u,f,h,g,x;if(e.listener!==null&&e.listener("open",e),e.tag=null,e.anchor=null,e.kind=null,e.result=null,a=o=l=Ke===r||gn===r,i&&S(e,!0,-1)&&(s=!0,e.lineIndent>t?c=1:e.lineIndent===t?c=0:e.lineIndent<t&&(c=-1)),c===1)for(;Hl(e)||Yl(e);)S(e,!0,-1)?(s=!0,l=a,e.lineIndent>t?c=1:e.lineIndent===t?c=0:e.lineIndent<t&&(c=-1)):l=!1;if(l&&(l=s||n),(c===1||Ke===r)&&(Ye===r||vn===r?g=t:g=t+1,x=e.position-e.lineStart,c===1?l&&(pn(e,x)||Ul(e,x,g))||$l(e,g)?d=!0:(o&&Vl(e,g)||ql(e,g)||Rl(e,g)?d=!0:Kl(e)?(d=!0,(e.tag!==null||e.anchor!==null)&&m(e,"alias node should not have any properties")):Ll(e,g,Ye===r)&&(d=!0,e.tag===null&&(e.tag="?")),e.anchor!==null&&(e.anchorMap[e.anchor]=e.result)):c===0&&(d=l&&pn(e,x))),e.tag!==null&&e.tag!=="!")if(e.tag==="?"){for(e.result!==null&&e.kind!=="scalar"&&m(e,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+e.kind+'"'),u=0,f=e.implicitTypes.length;u<f;u+=1)if(h=e.implicitTypes[u],h.resolve(e.result)){e.result=h.construct(e.result),e.tag=h.tag,e.anchor!==null&&(e.anchorMap[e.anchor]=e.result);break}}else H.call(e.typeMap[e.kind||"fallback"],e.tag)?(h=e.typeMap[e.kind||"fallback"][e.tag],e.result!==null&&h.kind!==e.kind&&m(e,"unacceptable node kind for !<"+e.tag+'> tag; it should be "'+h.kind+'", not "'+e.kind+'"'),h.resolve(e.result)?(e.result=h.construct(e.result),e.anchor!==null&&(e.anchorMap[e.anchor]=e.result)):m(e,"cannot resolve a node with !<"+e.tag+"> explicit tag")):m(e,"unknown tag !<"+e.tag+">");return e.listener!==null&&e.listener("close",e),e.tag!==null||e.anchor!==null||d}function Wl(e){var t=e.position,r,i,n,a=!1,o;for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap={},e.anchorMap={};(o=e.input.charCodeAt(e.position))!==0&&(S(e,!0,-1),o=e.input.charCodeAt(e.position),!(e.lineIndent>0||o!==37));){for(a=!0,o=e.input.charCodeAt(++e.position),r=e.position;o!==0&&!k(o);)o=e.input.charCodeAt(++e.position);for(i=e.input.slice(r,e.position),n=[],i.length<1&&m(e,"directive name must not be less than one character in length");o!==0;){for(;Z(o);)o=e.input.charCodeAt(++e.position);if(o===35){do o=e.input.charCodeAt(++e.position);while(o!==0&&!L(o));break}if(L(o))break;for(r=e.position;o!==0&&!k(o);)o=e.input.charCodeAt(++e.position);n.push(e.input.slice(r,e.position))}o!==0&&xt(e),H.call(un,i)?un[i](e,i,n):We(e,'unknown document directive "'+i+'"')}if(S(e,!0,-1),e.lineIndent===0&&e.input.charCodeAt(e.position)===45&&e.input.charCodeAt(e.position+1)===45&&e.input.charCodeAt(e.position+2)===45?(e.position+=3,S(e,!0,-1)):a&&m(e,"directives end mark is expected"),ce(e,e.lineIndent-1,Ke,!1,!0),S(e,!0,-1),e.checkLineBreaks&&_l.test(e.input.slice(t,e.position))&&We(e,"non-ASCII line breaks are interpreted as content"),e.documents.push(e.result),e.position===e.lineStart&&Ge(e)){e.input.charCodeAt(e.position)===46&&(e.position+=3,S(e,!0,-1));return}if(e.position<e.length-1)m(e,"end of the stream or a document separator is expected");else return}function En(e,t){e=String(e),t=t||{},e.length!==0&&(e.charCodeAt(e.length-1)!==10&&e.charCodeAt(e.length-1)!==13&&(e+=`
`),e.charCodeAt(0)===65279&&(e=e.slice(1)));var r=new Ml(e,t),i=e.indexOf("\0");for(i!==-1&&(r.position=i,m(r,"null byte is not allowed in input")),r.input+="\0";r.input.charCodeAt(r.position)===32;)r.lineIndent+=1,r.position+=1;for(;r.position<r.length-1;)Wl(r);return r.documents}function Fn(e,t,r){t!==null&&typeof t=="object"&&typeof r>"u"&&(r=t,t=null);var i=En(e,r);if(typeof t!="function")return i;for(var n=0,a=i.length;n<a;n+=1)t(i[n])}function Cn(e,t){var r=En(e,t);if(r.length!==0){if(r.length===1)return r[0];throw new hn("expected a single document in the stream, but found more")}}function Gl(e,t,r){return typeof t=="object"&&t!==null&&typeof r>"u"&&(r=t,t=null),Fn(e,t,R.extend({schema:mn},r))}function Jl(e,t){return Cn(e,R.extend({schema:mn},t))}ye.exports.loadAll=Fn;ye.exports.load=Cn;ye.exports.safeLoadAll=Gl;ye.exports.safeLoad=Jl});var Jn=p((sd,Ct)=>{"use strict";var xe=J(),be=ne(),Ql=ge(),zl=oe(),On=Object.prototype.toString,Bn=Object.prototype.hasOwnProperty,Xl=9,we=10,Zl=13,ec=32,tc=33,rc=34,Nn=35,nc=37,ic=38,oc=39,ac=42,Mn=44,lc=45,Ln=58,cc=61,sc=62,dc=63,uc=64,qn=91,Rn=93,fc=96,$n=123,pc=124,Vn=125,D={};D[0]="\\0";D[7]="\\a";D[8]="\\b";D[9]="\\t";D[10]="\\n";D[11]="\\v";D[12]="\\f";D[13]="\\r";D[27]="\\e";D[34]='\\"';D[92]="\\\\";D[133]="\\N";D[160]="\\_";D[8232]="\\L";D[8233]="\\P";var hc=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"];function mc(e,t){var r,i,n,a,o,l,c;if(t===null)return{};for(r={},i=Object.keys(t),n=0,a=i.length;n<a;n+=1)o=i[n],l=String(t[o]),o.slice(0,2)==="!!"&&(o="tag:yaml.org,2002:"+o.slice(2)),c=e.compiledTypeMap.fallback[o],c&&Bn.call(c.styleAliases,l)&&(l=c.styleAliases[l]),r[o]=l;return r}function Dn(e){var t,r,i;if(t=e.toString(16).toUpperCase(),e<=255)r="x",i=2;else if(e<=65535)r="u",i=4;else if(e<=4294967295)r="U",i=8;else throw new be("code point within a string may not be greater than 0xFFFFFFFF");return"\\"+r+xe.repeat("0",i-t.length)+t}function vc(e){this.schema=e.schema||Ql,this.indent=Math.max(1,e.indent||2),this.noArrayIndent=e.noArrayIndent||!1,this.skipInvalid=e.skipInvalid||!1,this.flowLevel=xe.isNothing(e.flowLevel)?-1:e.flowLevel,this.styleMap=mc(this.schema,e.styles||null),this.sortKeys=e.sortKeys||!1,this.lineWidth=e.lineWidth||80,this.noRefs=e.noRefs||!1,this.noCompatMode=e.noCompatMode||!1,this.condenseFlow=e.condenseFlow||!1,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function In(e,t){for(var r=xe.repeat(" ",t),i=0,n=-1,a="",o,l=e.length;i<l;)n=e.indexOf(`
`,i),n===-1?(o=e.slice(i),i=l):(o=e.slice(i,n+1),i=n+1),o.length&&o!==`
`&&(a+=r),a+=o;return a}function St(e,t){return`
`+xe.repeat(" ",e.indent*t)}function gc(e,t){var r,i,n;for(r=0,i=e.implicitTypes.length;r<i;r+=1)if(n=e.implicitTypes[r],n.resolve(t))return!0;return!1}function Ft(e){return e===ec||e===Xl}function se(e){return 32<=e&&e<=126||161<=e&&e<=55295&&e!==8232&&e!==8233||57344<=e&&e<=65533&&e!==65279||65536<=e&&e<=1114111}function yc(e){return se(e)&&!Ft(e)&&e!==65279&&e!==Zl&&e!==we}function kn(e,t){return se(e)&&e!==65279&&e!==Mn&&e!==qn&&e!==Rn&&e!==$n&&e!==Vn&&e!==Ln&&(e!==Nn||t&&yc(t))}function wc(e){return se(e)&&e!==65279&&!Ft(e)&&e!==lc&&e!==dc&&e!==Ln&&e!==Mn&&e!==qn&&e!==Rn&&e!==$n&&e!==Vn&&e!==Nn&&e!==ic&&e!==ac&&e!==tc&&e!==pc&&e!==cc&&e!==sc&&e!==oc&&e!==rc&&e!==nc&&e!==uc&&e!==fc}function Un(e){var t=/^\n* /;return t.test(e)}var Hn=1,Yn=2,Kn=3,Wn=4,Je=5;function xc(e,t,r,i,n){var a,o,l,c=!1,s=!1,d=i!==-1,u=-1,f=wc(e.charCodeAt(0))&&!Ft(e.charCodeAt(e.length-1));if(t)for(a=0;a<e.length;a++){if(o=e.charCodeAt(a),!se(o))return Je;l=a>0?e.charCodeAt(a-1):null,f=f&&kn(o,l)}else{for(a=0;a<e.length;a++){if(o=e.charCodeAt(a),o===we)c=!0,d&&(s=s||a-u-1>i&&e[u+1]!==" ",u=a);else if(!se(o))return Je;l=a>0?e.charCodeAt(a-1):null,f=f&&kn(o,l)}s=s||d&&a-u-1>i&&e[u+1]!==" "}return!c&&!s?f&&!n(e)?Hn:Yn:r>9&&Un(e)?Je:s?Wn:Kn}function bc(e,t,r,i){e.dump=function(){if(t.length===0)return"''";if(!e.noCompatMode&&hc.indexOf(t)!==-1)return"'"+t+"'";var n=e.indent*Math.max(1,r),a=e.lineWidth===-1?-1:Math.max(Math.min(e.lineWidth,40),e.lineWidth-n),o=i||e.flowLevel>-1&&r>=e.flowLevel;function l(c){return gc(e,c)}switch(xc(t,o,e.indent,a,l)){case Hn:return t;case Yn:return"'"+t.replace(/'/g,"''")+"'";case Kn:return"|"+jn(t,e.indent)+_n(In(t,n));case Wn:return">"+jn(t,e.indent)+_n(In(Sc(t,a),n));case Je:return'"'+Ec(t,a)+'"';default:throw new be("impossible error: invalid scalar style")}}()}function jn(e,t){var r=Un(e)?String(t):"",i=e[e.length-1]===`
`,n=i&&(e[e.length-2]===`
`||e===`
`),a=n?"+":i?"":"-";return r+a+`
`}function _n(e){return e[e.length-1]===`
`?e.slice(0,-1):e}function Sc(e,t){for(var r=/(\n+)([^\n]*)/g,i=function(){var s=e.indexOf(`
`);return s=s!==-1?s:e.length,r.lastIndex=s,Pn(e.slice(0,s),t)}(),n=e[0]===`
`||e[0]===" ",a,o;o=r.exec(e);){var l=o[1],c=o[2];a=c[0]===" ",i+=l+(!n&&!a&&c!==""?`
`:"")+Pn(c,t),n=a}return i}function Pn(e,t){if(e===""||e[0]===" ")return e;for(var r=/ [^ ]/g,i,n=0,a,o=0,l=0,c="";i=r.exec(e);)l=i.index,l-n>t&&(a=o>n?o:l,c+=`
`+e.slice(n,a),n=a+1),o=l;return c+=`
`,e.length-n>t&&o>n?c+=e.slice(n,o)+`
`+e.slice(o+1):c+=e.slice(n),c.slice(1)}function Ec(e){for(var t="",r,i,n,a=0;a<e.length;a++){if(r=e.charCodeAt(a),r>=55296&&r<=56319&&(i=e.charCodeAt(a+1),i>=56320&&i<=57343)){t+=Dn((r-55296)*1024+i-56320+65536),a++;continue}n=D[r],t+=!n&&se(r)?e[a]:n||Dn(r)}return t}function Fc(e,t,r){var i="",n=e.tag,a,o;for(a=0,o=r.length;a<o;a+=1)ee(e,t,r[a],!1,!1)&&(a!==0&&(i+=","+(e.condenseFlow?"":" ")),i+=e.dump);e.tag=n,e.dump="["+i+"]"}function Cc(e,t,r,i){var n="",a=e.tag,o,l;for(o=0,l=r.length;o<l;o+=1)ee(e,t+1,r[o],!0,!0)&&((!i||o!==0)&&(n+=St(e,t)),e.dump&&we===e.dump.charCodeAt(0)?n+="-":n+="- ",n+=e.dump);e.tag=a,e.dump=n||"[]"}function Ac(e,t,r){var i="",n=e.tag,a=Object.keys(r),o,l,c,s,d;for(o=0,l=a.length;o<l;o+=1)d="",o!==0&&(d+=", "),e.condenseFlow&&(d+='"'),c=a[o],s=r[c],ee(e,t,c,!1,!1)&&(e.dump.length>1024&&(d+="? "),d+=e.dump+(e.condenseFlow?'"':"")+":"+(e.condenseFlow?"":" "),ee(e,t,s,!1,!1)&&(d+=e.dump,i+=d));e.tag=n,e.dump="{"+i+"}"}function Dc(e,t,r,i){var n="",a=e.tag,o=Object.keys(r),l,c,s,d,u,f;if(e.sortKeys===!0)o.sort();else if(typeof e.sortKeys=="function")o.sort(e.sortKeys);else if(e.sortKeys)throw new be("sortKeys must be a boolean or a function");for(l=0,c=o.length;l<c;l+=1)f="",(!i||l!==0)&&(f+=St(e,t)),s=o[l],d=r[s],ee(e,t+1,s,!0,!0,!0)&&(u=e.tag!==null&&e.tag!=="?"||e.dump&&e.dump.length>1024,u&&(e.dump&&we===e.dump.charCodeAt(0)?f+="?":f+="? "),f+=e.dump,u&&(f+=St(e,t)),ee(e,t+1,d,!0,u)&&(e.dump&&we===e.dump.charCodeAt(0)?f+=":":f+=": ",f+=e.dump,n+=f));e.tag=a,e.dump=n||"{}"}function Tn(e,t,r){var i,n,a,o,l,c;for(n=r?e.explicitTypes:e.implicitTypes,a=0,o=n.length;a<o;a+=1)if(l=n[a],(l.instanceOf||l.predicate)&&(!l.instanceOf||typeof t=="object"&&t instanceof l.instanceOf)&&(!l.predicate||l.predicate(t))){if(e.tag=r?l.tag:"?",l.represent){if(c=e.styleMap[l.tag]||l.defaultStyle,On.call(l.represent)==="[object Function]")i=l.represent(t,c);else if(Bn.call(l.represent,c))i=l.represent[c](t,c);else throw new be("!<"+l.tag+'> tag resolver accepts not "'+c+'" style');e.dump=i}return!0}return!1}function ee(e,t,r,i,n,a){e.tag=null,e.dump=r,Tn(e,r,!1)||Tn(e,r,!0);var o=On.call(e.dump);i&&(i=e.flowLevel<0||e.flowLevel>t);var l=o==="[object Object]"||o==="[object Array]",c,s;if(l&&(c=e.duplicates.indexOf(r),s=c!==-1),(e.tag!==null&&e.tag!=="?"||s||e.indent!==2&&t>0)&&(n=!1),s&&e.usedDuplicates[c])e.dump="*ref_"+c;else{if(l&&s&&!e.usedDuplicates[c]&&(e.usedDuplicates[c]=!0),o==="[object Object]")i&&Object.keys(e.dump).length!==0?(Dc(e,t,e.dump,n),s&&(e.dump="&ref_"+c+e.dump)):(Ac(e,t,e.dump),s&&(e.dump="&ref_"+c+" "+e.dump));else if(o==="[object Array]"){var d=e.noArrayIndent&&t>0?t-1:t;i&&e.dump.length!==0?(Cc(e,d,e.dump,n),s&&(e.dump="&ref_"+c+e.dump)):(Fc(e,d,e.dump),s&&(e.dump="&ref_"+c+" "+e.dump))}else if(o==="[object String]")e.tag!=="?"&&bc(e,e.dump,t,a);else{if(e.skipInvalid)return!1;throw new be("unacceptable kind of an object to dump "+o)}e.tag!==null&&e.tag!=="?"&&(e.dump="!<"+e.tag+"> "+e.dump)}return!0}function Ic(e,t){var r=[],i=[],n,a;for(Et(e,r,i),n=0,a=i.length;n<a;n+=1)t.duplicates.push(r[i[n]]);t.usedDuplicates=new Array(a)}function Et(e,t,r){var i,n,a;if(e!==null&&typeof e=="object")if(n=t.indexOf(e),n!==-1)r.indexOf(n)===-1&&r.push(n);else if(t.push(e),Array.isArray(e))for(n=0,a=e.length;n<a;n+=1)Et(e[n],t,r);else for(i=Object.keys(e),n=0,a=i.length;n<a;n+=1)Et(e[i[n]],t,r)}function Gn(e,t){t=t||{};var r=new vc(t);return r.noRefs||Ic(e,r),ee(r,0,e,!0,!0)?r.dump+`
`:""}function kc(e,t){return Gn(e,xe.extend({schema:zl},t))}Ct.exports.dump=Gn;Ct.exports.safeDump=kc});var zn=p((dd,b)=>{"use strict";var Qe=An(),Qn=Jn();function ze(e){return function(){throw new Error("Function "+e+" is deprecated and cannot be used.")}}b.exports.Type=E();b.exports.Schema=Q();b.exports.FAILSAFE_SCHEMA=Ue();b.exports.JSON_SCHEMA=vt();b.exports.CORE_SCHEMA=gt();b.exports.DEFAULT_SAFE_SCHEMA=oe();b.exports.DEFAULT_FULL_SCHEMA=ge();b.exports.load=Qe.load;b.exports.loadAll=Qe.loadAll;b.exports.safeLoad=Qe.safeLoad;b.exports.safeLoadAll=Qe.safeLoadAll;b.exports.dump=Qn.dump;b.exports.safeDump=Qn.safeDump;b.exports.YAMLException=ne();b.exports.MINIMAL_SCHEMA=Ue();b.exports.SAFE_SCHEMA=oe();b.exports.DEFAULT_SCHEMA=ge();b.exports.scan=ze("scan");b.exports.parse=ze("parse");b.exports.compose=ze("compose");b.exports.addConstructor=ze("addConstructor")});var Zn=p((ud,Xn)=>{"use strict";var jc=zn();Xn.exports=jc});var At=p((exports,module)=>{"use strict";var yaml=Zn(),engines=exports=module.exports;engines.yaml={parse:yaml.safeLoad.bind(yaml),stringify:yaml.safeDump.bind(yaml)};engines.json={parse:JSON.parse.bind(JSON),stringify:function(e,t){let r=Object.assign({replacer:null,space:2},t);return JSON.stringify(e,r.replacer,r.space)}};engines.javascript={parse:function parse(str,options,wrap){try{return wrap!==!1&&(str=`(function() {
return `+str.trim()+`;
}());`),eval(str)||{}}catch(e){if(wrap!==!1&&/(unexpected|identifier)/i.test(e.message))return parse(str,options,!1);throw new SyntaxError(e)}},stringify:function(){throw new Error("stringifying JavaScript is not supported")}}});var ti=p((fd,ei)=>{"use strict";ei.exports=function(e){return typeof e=="string"&&e.charAt(0)==="\uFEFF"?e.slice(1):e}});var Xe=p($=>{"use strict";var ri=ti(),ni=me();$.define=function(e,t,r){Reflect.defineProperty(e,t,{enumerable:!1,configurable:!0,writable:!0,value:r})};$.isBuffer=function(e){return ni(e)==="buffer"};$.isObject=function(e){return ni(e)==="object"};$.toBuffer=function(e){return typeof e=="string"?Buffer.from(e):e};$.toString=function(e){if($.isBuffer(e))return ri(String(e));if(typeof e!="string")throw new TypeError("expected input to be a string or buffer");return ri(e)};$.arrayify=function(e){return e?Array.isArray(e)?e:[e]:[]};$.startsWith=function(e,t,r){return typeof r!="number"&&(r=t.length),e.slice(0,r)===t}});var Se=p((hd,ii)=>{"use strict";var _c=At(),Pc=Xe();ii.exports=function(e){let t=Object.assign({},e);return t.delimiters=Pc.arrayify(t.delims||t.delimiters||"---"),t.delimiters.length===1&&t.delimiters.push(t.delimiters[0]),t.language=(t.language||t.lang||"yaml").toLowerCase(),t.engines=Object.assign({},_c,t.parsers,t.engines),t}});var Dt=p((md,oi)=>{"use strict";oi.exports=function(e,t){let r=t.engines[e]||t.engines[Tc(e)];if(typeof r>"u")throw new Error('gray-matter engine "'+e+'" is not registered');return typeof r=="function"&&(r={parse:r}),r};function Tc(e){switch(e.toLowerCase()){case"js":case"javascript":return"javascript";case"coffee":case"coffeescript":case"cson":return"coffee";case"yaml":case"yml":return"yaml";default:return e}}});var It=p((vd,ai)=>{"use strict";var Oc=me(),Bc=Dt(),Nc=Se();ai.exports=function(e,t,r){if(t==null&&r==null)switch(Oc(e)){case"object":t=e.data,r={};break;case"string":return e;default:throw new TypeError("expected file to be a string or object")}let i=e.content,n=Nc(r);if(t==null){if(!n.data)return e;t=n.data}let a=e.language||n.language,o=Bc(a,n);if(typeof o.stringify!="function")throw new TypeError('expected "'+a+'.stringify" to be a function');t=Object.assign({},e.data,t);let l=n.delimiters[0],c=n.delimiters[1],s=o.stringify(t,r).trim(),d="";return s!=="{}"&&(d=de(l)+de(s)+de(c)),typeof e.excerpt=="string"&&e.excerpt!==""&&i.indexOf(e.excerpt.trim())===-1&&(d+=de(e.excerpt)+de(c)),d+de(i)};function de(e){return e.slice(-1)!==`
`?e+`
`:e}});var ci=p((gd,li)=>{"use strict";var Mc=Se();li.exports=function(e,t){let r=Mc(t);if(e.data==null&&(e.data={}),typeof r.excerpt=="function")return r.excerpt(e,r);let i=e.data.excerpt_separator||r.excerpt_separator;if(i==null&&(r.excerpt===!1||r.excerpt==null))return e;let n=typeof r.excerpt=="string"?r.excerpt:i||r.delimiters[0],a=e.content.indexOf(n);return a!==-1&&(e.excerpt=e.content.slice(0,a)),e}});var ui=p((yd,di)=>{"use strict";var si=me(),Lc=It(),ue=Xe();di.exports=function(e){return si(e)!=="object"&&(e={content:e}),si(e.data)!=="object"&&(e.data={}),e.contents&&e.content==null&&(e.content=e.contents),ue.define(e,"orig",ue.toBuffer(e.content)),ue.define(e,"language",e.language||""),ue.define(e,"matter",e.matter||""),ue.define(e,"stringify",function(t,r){return r&&r.language&&(e.language=r.language),Lc(e,t,r)}),e.content=ue.toString(e.content),e.isEmpty=!1,e.excerpt="",e}});var pi=p((wd,fi)=>{"use strict";var qc=Dt(),Rc=Se();fi.exports=function(e,t,r){let i=Rc(r),n=qc(e,i);if(typeof n.parse!="function")throw new TypeError('expected "'+e+'.parse" to be a function');return n.parse(t,i)}});var gi=p((xd,vi)=>{"use strict";var $c=require("fs"),Vc=cr(),kt=Se(),Uc=It(),hi=ci(),Hc=At(),Yc=ui(),Kc=pi(),mi=Xe();function I(e,t){if(e==="")return{data:{},content:e,excerpt:"",orig:e};let r=Yc(e),i=I.cache[r.content];if(!t){if(i)return r=Object.assign({},i),r.orig=i.orig,r;I.cache[r.content]=r}return Wc(r,t)}function Wc(e,t){let r=kt(t),i=r.delimiters[0],n=`
`+r.delimiters[1],a=e.content;r.language&&(e.language=r.language);let o=i.length;if(!mi.startsWith(a,i,o))return hi(e,r),e;if(a.charAt(o)===i.slice(-1))return e;a=a.slice(o);let l=a.length,c=I.language(a,r);c.name&&(e.language=c.name,a=a.slice(c.raw.length));let s=a.indexOf(n);return s===-1&&(s=l),e.matter=a.slice(0,s),e.matter.replace(/^\s*#[^\n]+/gm,"").trim()===""?(e.isEmpty=!0,e.empty=e.content,e.data={}):e.data=Kc(e.language,e.matter,r),s===l?e.content="":(e.content=a.slice(s+n.length),e.content[0]==="\r"&&(e.content=e.content.slice(1)),e.content[0]===`
`&&(e.content=e.content.slice(1))),hi(e,r),(r.sections===!0||typeof r.section=="function")&&Vc(e,r.section),e}I.engines=Hc;I.stringify=function(e,t,r){return typeof e=="string"&&(e=I(e,r)),Uc(e,t,r)};I.read=function(e,t){let r=$c.readFileSync(e,"utf8"),i=I(r,t);return i.path=e,i};I.test=function(e,t){return mi.startsWith(e,kt(t).delimiters[0])};I.language=function(e,t){let i=kt(t).delimiters[0];I.test(e)&&(e=e.slice(i.length));let n=e.slice(0,e.search(/\r?\n/));return{raw:n,name:n?n.trim():""}};I.cache={};I.clearCache=function(){I.cache={}};vi.exports=I});var ns={};ji(ns,{activate:()=>ts,deactivate:()=>rs});module.exports=_i(ns);var C=P(require("vscode"));var F=P(require("vscode")),_t=P(require("path"));var K=class extends F.TreeItem{constructor(r,i,n,a,o,l,c){super(r,n);this.label=r;this.type=i;this.collapsibleState=n;this.id=a;this.projectId=o;this.project=l;this.view=c;switch(this.contextValue=i===0?"project":i===1?"view":"archive",this.tooltip=i===0?`Project: ${r} (ID: ${a})`:i===1?`View: ${r} (Type: ${c?.type})`:"Archives",i){case 0:this.iconPath=new F.ThemeIcon("project");break;case 1:c?.type==="table"?this.iconPath=new F.ThemeIcon("list-tree"):c?.type==="board"?this.iconPath=new F.ThemeIcon("layout"):c?.type==="calendar"?this.iconPath=new F.ThemeIcon("calendar"):c?.type==="gallery"?this.iconPath=new F.ThemeIcon("multiple-windows"):this.iconPath=new F.ThemeIcon("preview");break;case 2:this.iconPath=new F.ThemeIcon("archive");break}i===0&&l?.dataSource&&(l.dataSource.kind==="folder"?this.description=`Folder: ${_t.basename(l.dataSource.config.path)}`:l.dataSource.kind==="tag"?this.description=`Tag: ${l.dataSource.config.tag}`:l.dataSource.kind==="query"&&(this.description="Query")),i===1&&o&&a?this.command={command:"vscode-projects.openView",title:"Open View",arguments:[o,a]}:i===0&&a&&(this.command={command:"vscode-projects.openProject",title:"Open Project",arguments:[a]})}},Fe=class{constructor(t){this.projectManager=t;this._onDidChangeTreeData=new F.EventEmitter;this.onDidChangeTreeData=this._onDidChangeTreeData.event;this.showArchives=!1;console.log("ProjectsProvider constructor called")}refresh(){this._onDidChangeTreeData.fire()}toggleArchives(){this.showArchives=!this.showArchives,this.refresh()}getTreeItem(t){return console.log(`getTreeItem called for: ${t.label}`),t}getChildren(t){console.log(`getChildren called with element: ${t?t.label:"root"}`);try{if(t){if(t.type===0&&t.projectId){let r=this.projectManager.getProject(t.projectId);return r?Promise.resolve(r.views.map(i=>new K(i.name,1,F.TreeItemCollapsibleState.None,i.id,r.id,r,i))):Promise.resolve([])}else if(t.type===2){let r=this.projectManager.getArchives();return Promise.resolve(r.map(i=>new K(i.name,0,F.TreeItemCollapsibleState.Collapsed,i.id,i.id,i)))}}else{let r=[],i=this.projectManager.getProjects();if(console.log(`Found ${i.length} projects`),i.length===0?r.push(new K("No projects found. Click the + button to create one.",0,F.TreeItemCollapsibleState.None)):i.forEach(n=>{r.push(new K(n.name,0,F.TreeItemCollapsibleState.Collapsed,n.id,n.id,n))}),this.showArchives){let n=this.projectManager.getArchives();console.log(`Found ${n.length} archived projects`),n.length>0&&r.push(new K("Archives",2,F.TreeItemCollapsibleState.Collapsed))}return Promise.resolve(r)}return Promise.resolve([])}catch(r){return console.error("Error getting children:",r),Promise.resolve([])}}};var M=P(require("vscode")),qe=P(Jt());var Qt={config:{},filter:{conjunction:"and",conditions:[]},colors:{conditions:[]},sort:{criteria:[]}},zt={fieldConfig:{},defaultName:"",templates:[],excludedFiles:[],isDefault:!1,dataSource:{kind:"folder",config:{path:"",recursive:!1}},newFilesFolder:"",views:[]},Xt={projects:[],archives:[],preferences:{projectSizeLimit:1e3,frontmatter:{quoteStrings:"PLAIN"},locale:{firstDayOfWeek:"default"},commands:[],linkBehavior:"open-editor"}};var he=class extends Error{constructor(r,i){super(i.message);this.recordId=r;this.err=i}};var $e=P(require("path")),Re=class{constructor(t,r){this.context=t;this.fileSystem=r;this.settings=this.loadSettings()}getProjects(){return this.settings.projects}getArchives(){return this.settings.archives}getProject(t){return this.settings.projects.find(r=>r.id===t)}async createProject(t,r){let i=(0,qe.v4)(),n={...zt,id:i,name:t,views:[{...Qt,id:(0,qe.v4)(),name:"Table",type:"table"}]};r&&(n={...n,dataSource:{kind:"folder",config:{path:r.fsPath,recursive:!1}}});let a=[...this.settings.projects,n];return this.settings={...this.settings,projects:a},await this.saveSettings(),n}async addViewToProject(t,r,i,n={}){let a=this.getProject(t);if(!a)throw new Error(`Project with ID ${t} not found`);let o={id:(0,qe.v4)(),name:r,type:i,config:n,filter:{conjunction:"and",conditions:[]},colors:{conditions:[]},sort:{criteria:[]}},l={...a,views:[...a.views,o]};await this.updateProject(l)}async updateProject(t){let r=this.settings.projects.map(i=>i.id===t.id?t:i);this.settings={...this.settings,projects:r},await this.saveSettings()}async deleteProject(t){let r=this.settings.projects.filter(i=>i.id!==t);this.settings={...this.settings,projects:r},await this.saveSettings()}async archiveProject(t){let r=this.settings.projects.find(i=>i.id===t);if(r){let i=this.settings.projects.filter(a=>a.id!==t),n=[...this.settings.archives,r];this.settings={...this.settings,projects:i,archives:n},await this.saveSettings()}}async createNote(t,r,i){let n="";if(t.newFilesFolder)n=t.newFilesFolder;else if(t.dataSource.kind==="folder")n=t.dataSource.config.path;else{let l=M.workspace.workspaceFolders;if(l&&l.length>0)n=l[0]?.uri.fsPath||"";else{let c=await M.window.showOpenDialog({canSelectFiles:!1,canSelectFolders:!0,canSelectMany:!1,title:"Select a folder to save the new note"});if(c&&c.length>0)n=c[0]?.fsPath||"";else throw new Error("No folder selected")}}let a=$e.join(n,`${r}.md`),o="";if(i)try{o=await this.fileSystem.readFile(i)}catch(l){console.error("Error reading template file:",l)}return await this.fileSystem.writeFile(a,o),a}async queryProject(t){let r=[],i=[];try{if(t.dataSource.kind==="folder"){let a=await this.fileSystem.getFilesInFolder(t.dataSource.config.path,t.dataSource.config.recursive);for(let o of a)try{if(o.endsWith(".md")){let l=o,c=await this.fileSystem.readFile(o),s=this.fileSystem.parseFrontMatter(c),d={id:l,values:{...s,path:o,name:$e.basename(o,".md")}};t.excludedFiles.includes(o)||r.push(d)}}catch(l){i.push(new he(o,l instanceof Error?l:new Error(`${l}`)))}}else t.dataSource.kind==="tag"||t.dataSource.kind}catch(a){i.push(new he("project",a instanceof Error?a:new Error(`Error querying project: ${a}`)))}let n=this.detectFields(r);return{records:r,fields:n,errors:i}}loadSettings(){let t=M.workspace.getConfiguration("vscode-projects"),r=t.get("projects",[]),i=t.get("archives",[]),n=t.get("preferences",Xt.preferences);return{projects:r,archives:i,preferences:n}}async saveSettings(){let t=M.workspace.getConfiguration("vscode-projects");await t.update("projects",this.settings.projects,M.ConfigurationTarget.Global),await t.update("archives",this.settings.archives,M.ConfigurationTarget.Global),await t.update("preferences",this.settings.preferences,M.ConfigurationTarget.Global)}detectFields(t){let r=new Map;for(let i of t)for(let[n,a]of Object.entries(i.values))if(!r.has(n)){let o=this.determineType(a),l=Array.isArray(a);r.set(n,{type:o,repeated:l})}return Array.from(r.entries()).map(([i,{type:n,repeated:a}])=>({name:i,type:n,repeated:a,identifier:i==="id",derived:i==="path"||i==="name"}))}determineType(t){return t==null?"unknown":Array.isArray(t)?t.length>0?this.determineType(t[0]):"string":t instanceof Date?"date":typeof t}};var T=P(require("vscode")),j=P(require("fs")),tt=P(require("path")),Y=require("util"),Ze=P(gi()),Gc=(0,Y.promisify)(j.readFile),Jc=(0,Y.promisify)(j.writeFile),Qc=(0,Y.promisify)(j.unlink),zc=(0,Y.promisify)(j.exists),Xc=(0,Y.promisify)(j.readdir),Zc=(0,Y.promisify)(j.stat),et=class{async readFile(t){try{try{let r=T.Uri.file(t),i=await T.workspace.fs.readFile(r);return Buffer.from(i).toString("utf8")}catch{return await Gc(t,"utf8")}}catch(r){throw new Error(`Failed to read file ${t}: ${r}`)}}async writeFile(t,r){try{await this.ensureDirectory(tt.dirname(t));try{let i=T.Uri.file(t),n=Buffer.from(r,"utf8");await T.workspace.fs.writeFile(i,n)}catch{await Jc(t,r,"utf8")}}catch(i){throw new Error(`Failed to write to file ${t}: ${i}`)}}async deleteFile(t){try{try{let r=T.Uri.file(t);await T.workspace.fs.delete(r)}catch{await Qc(t)}}catch(r){throw new Error(`Failed to delete file ${t}: ${r}`)}}async fileExists(t){try{try{let r=T.Uri.file(t);return await T.workspace.fs.stat(r),!0}catch{return zc(t)}}catch{return!1}}async getFilesInFolder(t,r){let i=[];try{let n=await Xc(t);for(let a of n){let o=tt.join(t,a),l=await Zc(o);if(l.isFile())i.push(o);else if(l.isDirectory()&&r){let c=await this.getFilesInFolder(o,r);i.push(...c)}}}catch(n){console.error(`Error reading directory ${t}:`,n)}return i}parseFrontMatter(t){try{let{data:r}=(0,Ze.default)(t);return r}catch(r){return console.error("Error parsing frontmatter:",r),{}}}addFrontMatter(t,r){try{let{content:i,data:n}=(0,Ze.default)(t),a={...n,...r};return Ze.default.stringify(i,a)}catch(i){return console.error("Error adding frontmatter:",i),t}}async ensureDirectory(t){try{await T.workspace.fs.createDirectory(T.Uri.file(t))}catch{try{await(0,Y.promisify)(j.mkdir)(t,{recursive:!0})}catch(i){if(i.code!=="EEXIST")throw i}}}};var y=P(require("vscode"));async function yi(e,t){let r=await y.window.showInputBox({prompt:"Enter a name for the new project",placeHolder:"My Project"});if(!r)return;let i=[{label:"Folder-based project",description:"Create a project based on a specific folder"},{label:"Tag-based project",description:"Create a project based on file tags"},{label:"Query-based project",description:"Create a project based on a search query"}],n=await y.window.showQuickPick(i,{placeHolder:"Select the type of project"});if(n)try{let a;if(n.label==="Folder-based project"){let o=await y.window.showOpenDialog({canSelectFiles:!1,canSelectFolders:!0,canSelectMany:!1,title:"Select a folder for the project"});if(o&&o.length>0)a=o[0];else return}await e.createProject(r,a),t.refresh(),y.window.showInformationMessage(`Project "${r}" created successfully.`)}catch(a){y.window.showErrorMessage(`Failed to create project: ${a}`)}}async function wi(e){let t=e.getProjects();if(t.length===0){y.window.showErrorMessage("No projects exist. Create a project first.");return}let r=t.map(a=>({label:a.name,description:rt(a),project:a})),i=await y.window.showQuickPick(r,{placeHolder:"Select a project to create a note in"});if(!i)return;let n=await y.window.showInputBox({prompt:"Enter a name for the new note",placeHolder:"My Note"});if(n)try{let a;if(i.project.templates&&i.project.templates.length>0){let c=i.project.templates.map(d=>({label:d.replace(/^.*[\\\/]/,""),description:d,template:d}));c.unshift({label:"No template",description:"Create a blank note",template:""});let s=await y.window.showQuickPick(c,{placeHolder:"Select a template (optional)"});s&&s.template&&(a=s.template)}let o=await e.createNote(i.project,n,a),l=y.Uri.file(o);await y.window.showTextDocument(l),y.window.showInformationMessage(`Note "${n}" created successfully.`)}catch(a){y.window.showErrorMessage(`Failed to create note: ${a}`)}}async function xi(e){let t=e.getProjects();if(t.length===0){y.window.showErrorMessage("No projects exist. Create a project first.");return}let r=t.map(l=>({label:l.name,description:rt(l),project:l})),i=await y.window.showQuickPick(r,{placeHolder:"Select a project to add a view to"});if(!i)return;let n=await y.window.showInputBox({prompt:"Enter a name for the new view",placeHolder:"New View"});if(!n)return;let a=[{label:"Table",description:"Display items in a table layout"},{label:"Board",description:"Display items in a kanban board layout"},{label:"Calendar",description:"Display items in a calendar"},{label:"Gallery",description:"Display items in a gallery grid"}],o=await y.window.showQuickPick(a,{placeHolder:"Select the type of view"});if(o)try{let l=o.label.toLowerCase(),c;if(l==="board"){let s=await e.queryProject(i.project);if(s.fields.length>0){let d=s.fields.map(f=>({label:f.name,description:`Type: ${f.type}`})),u=await y.window.showQuickPick(d,{placeHolder:"Select a field to group by in the board view"});u&&(c=u.label)}}await e.addViewToProject(i.project.id,n,l,c?{groupByField:c}:{}),y.window.showInformationMessage(`View "${n}" created successfully.`)}catch(l){y.window.showErrorMessage(`Failed to create view: ${l}`)}}async function bi(e,t){let r=e.getProjects();if(r.length===0){y.window.showErrorMessage("No projects exist to delete.");return}let i=r.map(o=>({label:o.name,description:rt(o),id:o.id})),n=await y.window.showQuickPick(i,{placeHolder:"Select a project to delete"});if(!(!n||await y.window.showWarningMessage(`Are you sure you want to delete the project "${n.label}"? This action cannot be undone.`,{modal:!0},"Delete")!=="Delete"))try{await e.deleteProject(n.id),t.refresh(),y.window.showInformationMessage(`Project "${n.label}" deleted successfully.`)}catch(o){y.window.showErrorMessage(`Failed to delete project: ${o}`)}}async function Si(e,t){let r=e.getProjects();if(r.length===0){y.window.showErrorMessage("No projects exist.");return}let i=r.map(s=>({label:s.name,description:rt(s),project:s})),n=await y.window.showQuickPick(i,{placeHolder:"Select a project"});if(!n)return;let a=n.project.views;if(a.length===0){y.window.showErrorMessage(`Project "${n.label}" has no views.`);return}if(a.length===1){y.window.showErrorMessage("Cannot delete the only view in a project. A project must have at least one view.");return}let o=a.map(s=>({label:s.name,description:`Type: ${s.type}`,id:s.id})),l=await y.window.showQuickPick(o,{placeHolder:"Select a view to delete"});if(!(!l||await y.window.showWarningMessage(`Are you sure you want to delete the view "${l.label}" from project "${n.label}"? This action cannot be undone.`,{modal:!0},"Delete")!=="Delete"))try{let s={...n.project,views:n.project.views.filter(d=>d.id!==l.id)};await e.updateProject(s),t.refresh(),y.window.showInformationMessage(`View "${l.label}" deleted successfully.`)}catch(s){y.window.showErrorMessage(`Failed to delete view: ${s}`)}}function rt(e){let t=e.dataSource;return t.kind==="folder"?`Folder: ${t.config.path}`:t.kind==="tag"?`Tag: ${t.config.tag}`:t.kind==="query"?`Query: ${t.config.query}`:""}var _=P(require("vscode")),it=P(require("path")),nt=class{constructor(t,r){this.context=t;this.projectManager=r;this.webviewPanels=new Map}async openView(t,r){try{let i=this.projectManager.getProject(t);if(!i)throw new Error(`Project with ID ${t} not found`);let n=i.views.find(a=>a.id===r);if(!n)throw new Error(`View with ID ${r} not found in project ${i.name}`);await this.showView(i,n)}catch(i){_.window.showErrorMessage(`Failed to open view: ${i}`)}}async openProject(t){try{let r=this.projectManager.getProject(t);if(!r)throw new Error(`Project with ID ${t} not found`);if(r.views.length>0)await this.showView(r,r.views[0]);else throw new Error(`Project ${r.name} has no views`)}catch(r){_.window.showErrorMessage(`Failed to open project: ${r}`)}}async showView(t,r){let i=`${t.id}:${r.id}`,n=this.webviewPanels.get(i);if(n){n.reveal();return}let a=_.window.createWebviewPanel("projectsView",`${t.name} - ${r.name}`,_.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0,localResourceRoots:[_.Uri.file(it.join(this.context.extensionPath,"media"))]});this.webviewPanels.set(i,a),a.onDidDispose(()=>{this.webviewPanels.delete(i)});let o=await this.projectManager.queryProject(t);a.webview.html=this.getWebviewContent(a.webview,t,r,o),a.webview.onDidReceiveMessage(async l=>{switch(l.command){case"openFile":if(l.path){let s=await _.workspace.openTextDocument(l.path);await _.window.showTextDocument(s)}break;case"editItem":if(l.recordId&&l.recordData)try{let s=o.records.findIndex(u=>u.id===l.recordId);if(s===-1)throw new Error(`Record with ID ${l.recordId} not found`);let d={...o.records[s],values:l.recordData};o.records[s]=d,a.webview.html=this.getWebviewContent(a.webview,t,r,o),a.webview.postMessage({command:"itemUpdated",recordId:l.recordId,success:!0})}catch(s){console.error("Failed to update item:",s),a.webview.postMessage({command:"itemUpdated",recordId:l.recordId,success:!1,error:String(s)})}break;case"refreshData":let c=await this.projectManager.queryProject(t);a.webview.html=this.getWebviewContent(a.webview,t,r,c);break;case"updateCalendarConfig":if(r.type==="calendar"&&l.config){let s={...r};s.config={...s.config,...l.config};let d={...t,views:t.views.map(u=>u.id===r.id?s:u)};await this.projectManager.updateProject(d),r=s,a.webview.postMessage({command:"configUpdated",config:s.config})}break}})}findSuitableDateField(t){let r=t.find(i=>i.name.toLowerCase().includes("date")||i.name.toLowerCase().includes("time")||i.name.toLowerCase().includes("deadline")||i.name.toLowerCase().includes("due"));return r?r.name:"date"}findDateFields(t){return t.filter(r=>r.name.toLowerCase().includes("date")||r.name.toLowerCase().includes("time")||r.name.toLowerCase().includes("deadline")||r.name.toLowerCase().includes("due")||r.name.toLowerCase().includes("created")||r.name.toLowerCase().includes("modified"))}getWebviewContent(t,r,i,n){let a=_.window.activeColorTheme.kind===_.ColorThemeKind.Dark,o=`
      :root {
        --container-background: ${a?"#252526":"#f3f3f3"};
        --item-background: ${a?"#2d2d2d":"#ffffff"};
        --text-color: ${a?"#e7e7e7":"#333333"};
        --border-color: ${a?"#3c3c3c":"#dddddd"};
        --highlight-color: ${a?"#264f78":"#ddddff"};
        --header-background: ${a?"#333333":"#eeeeee"};
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        color: var(--text-color);
        background-color: var(--container-background);
        padding: 0;
        margin: 0;
      }
      
      .toolbar {
        padding: 8px;
        background-color: var(--header-background);
        border-bottom: 1px solid var(--border-color);
        display: flex;
        align-items: center;
      }
      
      .toolbar button {
        background-color: var(--item-background);
        border: 1px solid var(--border-color);
        color: var(--text-color);
        padding: 4px 8px;
        margin-right: 8px;
        cursor: pointer;
      }
      
      .toolbar button:hover {
        background-color: var(--highlight-color);
      }
      
      .container {
        padding: 16px;
      }
      
      .card {
        background-color: var(--item-background);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        padding: 12px;
        margin-bottom: 8px;
      }
      
      table {
        width: 100%;
        border-collapse: collapse;
      }
      
      th {
        text-align: left;
        background-color: var(--header-background);
        padding: 8px;
        border-bottom: 2px solid var(--border-color);
      }
      
      td {
        padding: 8px;
        border-bottom: 1px solid var(--border-color);
      }
      
      .file-link {
        color: var(--text-color);
        text-decoration: underline;
        cursor: pointer;
      }
      
      .file-link:hover {
        text-decoration: none;
      }
      
      .board-container {
        display: flex;
        overflow-x: auto;
        padding: 16px;
        gap: 16px;
      }
      
      .board-column {
        min-width: 250px;
        background-color: var(--header-background);
        border-radius: 4px;
        padding: 8px;
      }
      
      .column-header {
        font-weight: bold;
        padding: 8px;
        border-bottom: 1px solid var(--border-color);
        margin-bottom: 8px;
      }
      
      .board-card {
        background-color: var(--item-background);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        padding: 8px;
        margin-bottom: 8px;
      }
      
      /* Filter and Sort Styles */
      .filter-bar {
        margin-bottom: 16px;
        background-color: var(--item-background);
        border-radius: 4px;
        padding: 8px;
        border: 1px solid var(--border-color);
      }
      
      .filter-controls {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .search-box {
        flex-grow: 1;
        padding: 4px 8px;
        border: 1px solid var(--border-color);
        background-color: var(--container-background);
        color: var(--text-color);
      }
      
      .filter-button {
        padding: 4px 8px;
        background-color: var(--header-background);
        border: 1px solid var(--border-color);
        color: var(--text-color);
        cursor: pointer;
      }
      
      .filter-panel {
        margin-top: 8px;
        padding: 8px;
        border-top: 1px solid var(--border-color);
      }
      
      .filter-builder {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      
      .filter-condition {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px;
        background-color: var(--container-background);
        border-radius: 4px;
        border: 1px solid var(--border-color);
      }
      
      .filter-join, .filter-property, .filter-operator, .filter-value {
        padding: 4px;
        background-color: var(--container-background);
        color: var(--text-color);
        border: 1px solid var(--border-color);
      }
      
      .filter-join {
        min-width: 60px;
      }
      
      .filter-property {
        min-width: 120px;
      }
      
      .filter-operator {
        min-width: 120px;
      }
      
      .filter-value {
        flex-grow: 1;
      }
      
      .filter-remove {
        background: none;
        border: none;
        color: var(--text-color);
        cursor: pointer;
        font-weight: bold;
        font-size: 16px;
        opacity: 0.7;
      }
      
      .filter-remove:hover {
        opacity: 1;
      }
      
      .filter-add {
        align-self: flex-start;
        padding: 4px 8px;
        background-color: var(--header-background);
        border: 1px solid var(--border-color);
        color: var(--text-color);
        cursor: pointer;
        margin-bottom: 8px;
      }
      
      .filter-saved {
        margin-top: 16px;
        border-top: 1px solid var(--border-color);
        padding-top: 16px;
      }
      
      .saved-filter {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px;
        margin-bottom: 8px;
        background-color: var(--container-background);
        border-radius: 4px;
        border: 1px solid var(--border-color);
      }
      
      .saved-filter-name {
        font-weight: bold;
      }
      
      .saved-filter-actions {
        display: flex;
        gap: 8px;
      }
      
      .filter-actions {
        margin-top: 12px;
        display: flex;
        justify-content: space-between;
      }
      
      .th-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .sort-controls {
        display: flex;
        gap: 4px;
      }
      
      .sort-control {
        cursor: pointer;
        opacity: 0.6;
      }
      
      .sort-control:hover {
        opacity: 1;
      }
      
      .sort-active {
        opacity: 1;
        color: var(--highlight-color);
      }
      
      /* Calendar View Styles */
      .calendar-container {
        display: flex;
        flex-direction: column;
        background-color: var(--item-background);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        overflow: hidden;
      }
      
      .calendar-toolbar {
        display: flex;
        align-items: center;
        padding: 8px;
        background-color: var(--header-background);
        border-bottom: 1px solid var(--border-color);
      }
      
      .calendar-toolbar button {
        background-color: var(--item-background);
        border: 1px solid var(--border-color);
        color: var(--text-color);
        padding: 4px 8px;
        margin-right: 8px;
        cursor: pointer;
      }
      
      .calendar-toolbar h2 {
        margin: 0 auto 0 16px;
        font-size: 1.2rem;
      }
      
      .calendar-filter {
        padding: 8px;
        background-color: var(--container-background);
        border-bottom: 1px solid var(--border-color);
      }
      
      .calendar-filter select {
        padding: 4px;
        background-color: var(--item-background);
        color: var(--text-color);
        border: 1px solid var(--border-color);
      }
      
      .calendar-grid {
        display: flex;
        flex-direction: column;
        padding: 8px;
      }
      
      .calendar-header {
        display: flex;
        border-bottom: 1px solid var(--border-color);
      }
      
      .calendar-header .calendar-cell {
        font-weight: bold;
        text-align: center;
        padding: 8px;
      }
      
      .calendar-body {
        display: flex;
        flex-direction: column;
      }
      
      .calendar-row {
        display: flex;
        border-bottom: 1px solid var(--border-color);
      }
      
      .calendar-row:last-child {
        border-bottom: none;
      }
      
      .calendar-cell {
        flex: 1;
        min-height: 100px;
        padding: 4px;
        border-right: 1px solid var(--border-color);
        position: relative;
      }
      
      .calendar-cell:last-child {
        border-right: none;
      }
      
      .calendar-cell.empty {
        background-color: var(--container-background);
      }
      
      .calendar-cell.today {
        background-color: var(--highlight-color);
      }
      
      .calendar-date {
        font-weight: bold;
        padding: 4px;
        text-align: right;
      }
      
      .calendar-events {
        margin-top: 4px;
        font-size: 0.9em;
        overflow: hidden;
      }
      
      .calendar-event {
        padding: 2px 4px;
        margin-bottom: 2px;
        background-color: var(--header-background);
        border-radius: 2px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;
        border: 1px solid transparent;
        transition: background-color 0.1s, border-color 0.1s;
      }
      
      .calendar-event:hover {
        background-color: var(--highlight-color);
        border-color: var(--text-color);
      }
      
      .more-events {
        font-size: 0.8em;
        text-align: center;
        color: var(--text-color);
        opacity: 0.8;
      }
      
      .event-details {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: var(--item-background);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        padding: 16px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        max-width: 80%;
        max-height: 80vh;
        overflow-y: auto;
        z-index: 10;
      }
      
      .event-details-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }
      
      .event-details-header h3 {
        margin: 0;
      }
      
      .event-details-header button {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.2em;
        color: var(--text-color);
      }
    `,l="";switch(i.type){case"table":l=this.renderTableView(n);break;case"board":l=this.renderBoardView(n,i);break;case"calendar":l=this.renderCalendarView(n,i);break;case"gallery":l=this.renderGalleryView(n);break;default:l=`<div class="container">
          <div class="card">
            <h2>Unsupported view type: ${i.type}</h2>
            <p>This view type is not yet implemented.</p>
          </div>
        </div>`}return`<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${r.name} - ${i.name}</title>
        <style>${o}</style>
      </head>
      <body>
        <div class="toolbar">
          <button id="refreshBtn">Refresh</button>
          <span>${r.name} - ${i.name}</span>
        </div>
        
        ${l}
        
        <script>
          (function() {
            // Convert dataframe to a JavaScript object
            const dataframe = ${JSON.stringify(n)};
            
            // Event listeners
            document.getElementById('refreshBtn').addEventListener('click', () => {
              vscode.postMessage({
                command: 'refreshData'
              });
            });
            
            // Add click event listener to file links
            document.querySelectorAll('.file-link').forEach(link => {
              link.addEventListener('click', () => {
                vscode.postMessage({
                  command: 'openFile',
                  path: link.dataset.path
                });
              });
            });
            
            // Handle filter panel toggle
            const showFiltersBtn = document.getElementById('showFiltersBtn');
            const filterPanel = document.getElementById('filterPanel');
            if (showFiltersBtn && filterPanel) {
              showFiltersBtn.addEventListener('click', () => {
                const isDisplayed = filterPanel.style.display !== 'none';
                filterPanel.style.display = isDisplayed ? 'none' : 'block';
                showFiltersBtn.textContent = isDisplayed ? 'Show Filters' : 'Hide Filters';
              });
            }
            
            // Clear filters
            const clearFilterBtn = document.getElementById('clearFilterBtn');
            if (clearFilterBtn) {
              clearFilterBtn.addEventListener('click', () => {
                // Reset all filter inputs
                document.querySelectorAll('.filter-value').forEach(input => {
                  input.value = '';
                });
                // Reset search box
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                  searchInput.value = '';
                }
                // Show all rows
                document.querySelectorAll('tbody tr').forEach(row => {
                  row.style.display = '';
                });
              });
            }
            
            // Simple search functionality
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
              searchInput.addEventListener('input', () => {
                const searchText = searchInput.value.toLowerCase();
                document.querySelectorAll('tbody tr').forEach(row => {
                  const rowText = row.textContent.toLowerCase();
                  row.style.display = rowText.includes(searchText) ? '' : 'none';
                });
              });
            }
            
            // Dynamic filter builder functionality
            const filterBuilder = document.getElementById('filterBuilder');
            const addFilterBtn = document.getElementById('addFilterBtn');
            const saveFilterBtn = document.getElementById('saveFilterBtn');
            const savedFiltersList = document.getElementById('savedFiltersList');
            const savedFiltersContainer = document.getElementById('savedFilters');
            
            if (filterBuilder && addFilterBtn) {
              // Function to create a new filter condition element
              function createFilterCondition(isFirstCondition = false) {
                const conditionId = 'filter-' + Date.now();
                const condition = document.createElement('div');
                condition.className = 'filter-condition';
                condition.id = conditionId;
                
                // Logical join operator (AND/OR) for conditions after the first one
                if (!isFirstCondition) {
                  const joinSelect = document.createElement('select');
                  joinSelect.className = 'filter-join';
                  
                  const andOption = document.createElement('option');
                  andOption.value = 'and';
                  andOption.textContent = 'AND';
                  andOption.selected = true;
                  
                  const orOption = document.createElement('option');
                  orOption.value = 'or';
                  orOption.textContent = 'OR';
                  
                  joinSelect.appendChild(andOption);
                  joinSelect.appendChild(orOption);
                  condition.appendChild(joinSelect);
                }
                
                // Property selector
                const propertySelect = document.createElement('select');
                propertySelect.className = 'filter-property';
                
                // Add default empty option
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Select property...';
                propertySelect.appendChild(defaultOption);
                
                // Add options for each field in the dataframe
                dataframe.fields.forEach(field => {
                  const option = document.createElement('option');
                  option.value = field.name;
                  option.textContent = field.name;
                  propertySelect.appendChild(option);
                });
                
                // Operator selector
                const operatorSelect = document.createElement('select');
                operatorSelect.className = 'filter-operator';
                
                const operators = [
                  { value: 'isNotEmpty', text: 'is not empty' },
                  { value: 'isEmpty', text: 'is empty' },
                  { value: 'is', text: 'is' },
                  { value: 'isNot', text: 'is not' },
                  { value: 'contains', text: 'contains' },
                  { value: 'doesNotContain', text: 'does not contain' }
                ];
                
                operators.forEach(op => {
                  const option = document.createElement('option');
                  option.value = op.value;
                  option.textContent = op.text;
                  operatorSelect.appendChild(option);
                });
                
                // Value input
                const valueInput = document.createElement('input');
                valueInput.type = 'text';
                valueInput.className = 'filter-value';
                valueInput.placeholder = 'Value...';
                
                // Remove button
                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.className = 'filter-remove';
                removeBtn.textContent = '\xD7';
                removeBtn.title = 'Remove condition';
                removeBtn.addEventListener('click', () => {
                  condition.remove();
                });
                
                // Add elements to condition
                condition.appendChild(propertySelect);
                condition.appendChild(operatorSelect);
                condition.appendChild(valueInput);
                condition.appendChild(removeBtn);
                
                // Handle operator change to show/hide value input
                operatorSelect.addEventListener('change', () => {
                  const operator = operatorSelect.value;
                  if (operator === 'isEmpty' || operator === 'isNotEmpty') {
                    valueInput.style.display = 'none';
                    valueInput.value = '';
                  } else {
                    valueInput.style.display = 'block';
                  }
                });
                
                // Initialize with correct display state
                if (operatorSelect.value === 'isEmpty' || operatorSelect.value === 'isNotEmpty') {
                  valueInput.style.display = 'none';
                }
                
                return condition;
              }
              
              // Add a new condition when the "Add Condition" button is clicked
              addFilterBtn.addEventListener('click', () => {
                const isFirstCondition = filterBuilder.children.length === 0;
                const condition = createFilterCondition(isFirstCondition);
                filterBuilder.appendChild(condition);
              });
              
              // Add an initial condition if the filter builder is empty
              if (filterBuilder.children.length === 0) {
                addFilterBtn.click();
              }
              
              // Save filter functionality
              if (saveFilterBtn) {
                saveFilterBtn.addEventListener('click', () => {
                  // Check if we have valid conditions to save
                  const conditions = [];
                  let hasValidConditions = false;
                  
                  document.querySelectorAll('.filter-condition').forEach(conditionEl => {
                    const propertySelect = conditionEl.querySelector('.filter-property');
                    const operatorSelect = conditionEl.querySelector('.filter-operator');
                    const valueInput = conditionEl.querySelector('.filter-value');
                    
                    if (propertySelect.value) {
                      hasValidConditions = true;
                      conditions.push({
                        property: propertySelect.value,
                        operator: operatorSelect.value,
                        value: valueInput.value
                      });
                    }
                  });
                  
                  if (!hasValidConditions) {
                    alert('Please add at least one valid filter condition');
                    return;
                  }
                  
                  // Prompt for filter name
                  const filterName = prompt('Enter a name for this filter:');
                  if (!filterName) return;
                  
                  // Save filter to localStorage
                  const viewKey = 'project_filters_' + dataframe.id;
                  let savedFilters = JSON.parse(localStorage.getItem(viewKey) || '[]');
                  
                  const filter = {
                    id: 'filter_' + Date.now(),
                    name: filterName,
                    conditions: conditions
                  };
                  
                  savedFilters.push(filter);
                  localStorage.setItem(viewKey, JSON.stringify(savedFilters));
                  
                  // Add to UI
                  addSavedFilterToUI(filter);
                });
              }
              
              // Function to add a saved filter to the UI
              function addSavedFilterToUI(filter) {
                if (!savedFiltersContainer || !savedFiltersList) return;
                
                // Show saved filters container if it was hidden
                savedFiltersContainer.style.display = 'block';
                
                const filterItem = document.createElement('div');
                filterItem.className = 'saved-filter';
                filterItem.dataset.filterId = filter.id;
                
                const nameEl = document.createElement('div');
                nameEl.className = 'saved-filter-name';
                nameEl.textContent = filter.name;
                
                const actionsEl = document.createElement('div');
                actionsEl.className = 'saved-filter-actions';
                
                const applyBtn = document.createElement('button');
                applyBtn.className = 'filter-button';
                applyBtn.textContent = 'Apply';
                applyBtn.addEventListener('click', () => {
                  // Clear existing filter conditions
                  filterBuilder.innerHTML = '';
                  
                  // Add conditions from saved filter
                  filter.conditions.forEach(condition => {
                    const conditionEl = createFilterCondition();
                    
                    const propertySelect = conditionEl.querySelector('.filter-property');
                    const operatorSelect = conditionEl.querySelector('.filter-operator');
                    const valueInput = conditionEl.querySelector('.filter-value');
                    
                    propertySelect.value = condition.property;
                    operatorSelect.value = condition.operator;
                    valueInput.value = condition.value;
                    
                    // Update visibility of value input
                    if (condition.operator === 'isEmpty' || condition.operator === 'isNotEmpty') {
                      valueInput.style.display = 'none';
                    }
                    
                    filterBuilder.appendChild(conditionEl);
                  });
                  
                  // Apply the filter
                  applyFiltersBtn.click();
                });
                
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'filter-button';
                deleteBtn.textContent = 'Delete';
                deleteBtn.addEventListener('click', () => {
                  // Remove from UI
                  filterItem.remove();
                  
                  // Remove from localStorage
                  const viewKey = 'project_filters_' + dataframe.id;
                  let savedFilters = JSON.parse(localStorage.getItem(viewKey) || '[]');
                  savedFilters = savedFilters.filter(f => f.id !== filter.id);
                  localStorage.setItem(viewKey, JSON.stringify(savedFilters));
                  
                  // Hide container if no saved filters left
                  if (savedFilters.length === 0) {
                    savedFiltersContainer.style.display = 'none';
                  }
                });
                
                actionsEl.appendChild(applyBtn);
                actionsEl.appendChild(deleteBtn);
                
                filterItem.appendChild(nameEl);
                filterItem.appendChild(actionsEl);
                
                savedFiltersList.appendChild(filterItem);
              }
              
              // Load saved filters on page load
              const viewKey = 'project_filters_' + dataframe.id;
              const savedFilters = JSON.parse(localStorage.getItem(viewKey) || '[]');
              
              if (savedFilters.length > 0 && savedFiltersContainer && savedFiltersList) {
                savedFiltersContainer.style.display = 'block';
                savedFilters.forEach(filter => {
                  addSavedFilterToUI(filter);
                });
              }
            }
            
            // Apply filters
            const applyFiltersBtn = document.getElementById('applyFiltersBtn');
            if (applyFiltersBtn) {
              applyFiltersBtn.addEventListener('click', () => {
                const filterConditions = [];
                
                // Get filters from the dynamic filter builder
                document.querySelectorAll('.filter-condition').forEach((conditionEl, index) => {
                  const propertySelect = conditionEl.querySelector('.filter-property');
                  const operatorSelect = conditionEl.querySelector('.filter-operator');
                  const valueInput = conditionEl.querySelector('.filter-value');
                  const joinSelect = conditionEl.querySelector('.filter-join');
                  
                  if (propertySelect.value) {
                    const property = propertySelect.value;
                    const operator = operatorSelect.value;
                    const value = valueInput.value;
                    // Get the logical join (AND/OR) if not the first condition
                    const join = index > 0 && joinSelect ? joinSelect.value : null;
                    
                    // Always include isEmpty/isNotEmpty operators even without value
                    if (value || operator === 'isEmpty' || operator === 'isNotEmpty') {
                      filterConditions.push({ 
                        field: property, 
                        operator, 
                        value,
                        join 
                      });
                    }
                  }
                });
                
                // Apply filters to rows
                document.querySelectorAll('tbody tr').forEach(row => {
                  let showRow = true;
                  
                  // If no filters, show all rows
                  if (filterConditions.length === 0) {
                    showRow = true;
                  } else {
                    // Process first condition
                    if (filterConditions.length > 0) {
                      showRow = evaluateFilterCondition(filterConditions[0], row);
                      
                      // Process additional conditions with AND/OR logic
                      for (let i = 1; i < filterConditions.length; i++) {
                        const condition = filterConditions[i];
                        const result = evaluateFilterCondition(condition, row);
                        
                        if (condition.join === 'or') {
                          showRow = showRow || result;
                        } else { // 'and' is default
                          showRow = showRow && result;
                        }
                      }
                    }
                  }
                  
                  row.style.display = showRow ? '' : 'none';
                });
                
                // Store the applied filters in a data attribute on the table
                const table = document.querySelector('table');
                if (table) {
                  table.dataset.appliedFilters = JSON.stringify(filterConditions);
                }
              });
              
              // Helper function to evaluate a single filter condition against a row
              function evaluateFilterCondition(condition, row) {
                const cellIndex = [...document.querySelectorAll('th')].findIndex(
                  th => th.textContent.trim() === condition.field
                );
                
                if (cellIndex >= 0) {
                  const cell = row.cells[cellIndex];
                  const cellText = cell.textContent.toLowerCase();
                  const filterValue = condition.value.toLowerCase();
                  
                  switch (condition.operator) {
                    case 'isNotEmpty':
                      return cellText !== '';
                    case 'isEmpty':
                      return cellText === '';
                    case 'is':
                      return cellText === filterValue;
                    case 'isNot':
                      return cellText !== filterValue;
                    case 'contains':
                      return cellText.includes(filterValue);
                    case 'doesNotContain':
                      return !cellText.includes(filterValue);
                    default:
                      return true; // Unknown operator
                  }
                }
                
                return true; // Column not found
              }
            }
            
            // Sorting functionality
            document.querySelectorAll('.sort-control').forEach(sortControl => {
              sortControl.addEventListener('click', () => {
                const field = sortControl.dataset.field;
                const isAscending = sortControl.classList.contains('sort-asc');
                
                // Find the column index
                const headers = document.querySelectorAll('th');
                const columnIndex = [...headers].findIndex(
                  header => header.textContent.includes(field)
                );
                
                if (columnIndex >= 0) {
                  const tbody = document.querySelector('tbody');
                  const rows = [...tbody.querySelectorAll('tr')];
                  
                  const sortedRows = rows.sort((a, b) => {
                    const aValue = a.cells[columnIndex].textContent;
                    const bValue = b.cells[columnIndex].textContent;
                    
                    // Try to convert to numbers if possible
                    const aNum = Number(aValue);
                    const bNum = Number(bValue);
                    
                    if (!isNaN(aNum) && !isNaN(bNum)) {
                      return isAscending ? aNum - bNum : bNum - aNum;
                    }
                    
                    // Otherwise compare as strings
                    return isAscending 
                      ? aValue.localeCompare(bValue)
                      : bValue.localeCompare(aValue);
                  });
                  
                  // Remove existing rows
                  rows.forEach(row => row.remove());
                  
                  // Add sorted rows
                  sortedRows.forEach(row => tbody.appendChild(row));
                  
                  // Update active sort indicator
                  document.querySelectorAll('.sort-control').forEach(sc => {
                    sc.classList.remove('sort-active');
                  });
                  sortControl.classList.add('sort-active');
                }
              });
            });
            
            // Handle messages from the extension
            window.addEventListener('message', event => {
              const message = event.data;
              switch (message.command) {
                case 'configUpdated':
                  console.log('Configuration updated, triggering full view refresh');
                  // Configuration was successfully updated, now refresh the entire view
                  vscode.postMessage({
                    command: 'refreshData'
                  });
                  break;
              }
            });
            
            // Initialize the view with data
            // This would be implemented differently for each view type
            
            // Calendar specific functionality
            const prevMonthBtn = document.getElementById('prevMonth');
            const nextMonthBtn = document.getElementById('nextMonth');
            const todayBtn = document.getElementById('todayBtn');
            const dateFieldSelect = document.getElementById('dateFieldSelect');
            const currentMonthDisplay = document.getElementById('currentMonthDisplay');
            const eventDetails = document.getElementById('eventDetails');
            const selectedDateEl = document.getElementById('selectedDate');
            const closeEventDetailsBtn = document.getElementById('closeEventDetails');
            const eventDetailsList = document.getElementById('eventDetailsList');
            
            if (prevMonthBtn && nextMonthBtn && todayBtn && dateFieldSelect) {
              // Current view state
              let currentViewDate = new Date();
              
              // Function to render a month
              const renderMonth = (year, month) => {
                currentViewDate = new Date(year, month, 1);
                
                // Update month display
                if (currentMonthDisplay) {
                  currentMonthDisplay.textContent = currentViewDate.toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  });
                }
                
                // Don't refresh here - we'll refresh after config update confirmation
                // in the message handler instead
              };
              
              // Initialize the current view date from config if available
              const configMonth = ${JSON.stringify(i.config?.month)};
              const configYear = ${JSON.stringify(i.config?.year)};
              
              if (configMonth !== undefined && configYear !== undefined) {
                currentViewDate = new Date(configYear, configMonth, 1);
              }
              
              // Navigate to previous month
              prevMonthBtn.addEventListener('click', () => {
                const prevMonth = currentViewDate.getMonth() - 1;
                const year = prevMonth < 0 ? currentViewDate.getFullYear() - 1 : currentViewDate.getFullYear();
                const month = prevMonth < 0 ? 11 : prevMonth;
                
                // Save the new month state to configuration
                vscode.postMessage({
                  command: 'updateCalendarConfig',
                  config: {
                    year: year,
                    month: month,
                    dateField: dateFieldSelect.value
                  }
                });
                
                // Update the UI without a full refresh
                renderMonth(year, month);
              });
              
              // Navigate to next month
              nextMonthBtn.addEventListener('click', () => {
                const nextMonth = currentViewDate.getMonth() + 1;
                const year = nextMonth > 11 ? currentViewDate.getFullYear() + 1 : currentViewDate.getFullYear();
                const month = nextMonth > 11 ? 0 : nextMonth;
                
                // Save the new month state to configuration
                vscode.postMessage({
                  command: 'updateCalendarConfig',
                  config: {
                    year: year,
                    month: month,
                    dateField: dateFieldSelect.value
                  }
                });
                
                // Update the UI without a full refresh
                renderMonth(year, month);
              });
              
              // Navigate to today
              todayBtn.addEventListener('click', () => {
                const today = new Date();
                const year = today.getFullYear();
                const month = today.getMonth();
                
                // Save the new month state to configuration
                vscode.postMessage({
                  command: 'updateCalendarConfig',
                  config: {
                    year: year,
                    month: month,
                    dateField: dateFieldSelect.value
                  }
                });
                
                // Update the UI without a full refresh
                renderMonth(year, month);
              });
              
              // Change date field
              dateFieldSelect.addEventListener('change', () => {
                // Save the selected date field to the configuration
                vscode.postMessage({
                  command: 'updateCalendarConfig',
                  config: {
                    year: currentViewDate.getFullYear(),
                    month: currentViewDate.getMonth(),
                    dateField: dateFieldSelect.value
                  }
                });
                // We'll wait for the configUpdated message to trigger the refresh
              });
              
              // Add click handlers for calendar events
              document.querySelectorAll('.calendar-event').forEach(eventEl => {
                eventEl.addEventListener('click', (e) => {
                  // Get the event details
                  const recordId = eventEl.dataset.recordId;
                  const filePath = eventEl.dataset.path;
                  
                  // Handle Ctrl+click to open file directly
                  if (e.ctrlKey || e.metaKey) { // metaKey for Mac
                    if (filePath) {
                      vscode.postMessage({
                        command: 'openFile',
                        path: filePath
                      });
                    }
                    return;
                  }
                  
                  // Find the record in the dataframe
                  const record = dataframe.records.find(r => r.id === recordId);
                  if (!record) return;
                  
                  // Create and show the item editor modal
                  const name = record.values.name || record.values.title || record.id;
                  const editorModal = createEditModal(name, record.id, record.values, filePath);
                  document.body.appendChild(editorModal);
                });
              });
              
              // Function to create an edit modal for a record
              function createEditModal(itemName, recordId, values, filePath) {
                // Create the modal container
                const modal = document.createElement('div');
                modal.className = 'event-details';
                modal.id = 'itemEditorModal';
                modal.style.display = 'block';
                
                // Create header
                const header = document.createElement('div');
                header.className = 'event-details-header';
                
                const title = document.createElement('h3');
                title.textContent = 'Edit Item: ' + itemName;
                
                const closeBtn = document.createElement('button');
                closeBtn.textContent = '\u2715';
                closeBtn.addEventListener('click', () => {
                  modal.remove();
                });
                
                header.appendChild(title);
                header.appendChild(closeBtn);
                modal.appendChild(header);
                
                // Create form
                const form = document.createElement('form');
                form.id = 'itemEditorForm';
                
                // Add fields for editing, filtering out system fields
                const editableFields = dataframe.fields.filter(f => 
                  !f.derived && 
                  f.name !== 'id' && 
                  f.name !== 'date' && 
                  f.name !== 'created' && 
                  f.name !== 'modified'
                );
                
                editableFields.forEach(field => {
                  const fieldValue = values[field.name] || '';
                  const fieldDiv = document.createElement('div');
                  fieldDiv.style.marginBottom = '12px';
                  
                  const label = document.createElement('label');
                  label.textContent = field.name + ':';
                  label.style.display = 'block';
                  label.style.marginBottom = '4px';
                  
                  const input = document.createElement('input');
                  input.type = 'text';
                  input.name = field.name;
                  input.value = fieldValue;
                  input.style.width = '100%';
                  input.style.padding = '4px';
                  input.style.backgroundColor = 'var(--container-background)';
                  input.style.color = 'var(--text-color)';
                  input.style.border = '1px solid var(--border-color)';
                  
                  fieldDiv.appendChild(label);
                  fieldDiv.appendChild(input);
                  form.appendChild(fieldDiv);
                });
                
                // Add form buttons
                const buttonDiv = document.createElement('div');
                buttonDiv.style.marginTop = '16px';
                buttonDiv.style.display = 'flex';
                buttonDiv.style.justifyContent = 'space-between';
                
                // Open file button
                const openFileBtn = document.createElement('button');
                openFileBtn.type = 'button';
                openFileBtn.textContent = 'Open File';
                openFileBtn.style.padding = '8px 16px';
                openFileBtn.addEventListener('click', () => {
                  if (filePath) {
                    vscode.postMessage({
                      command: 'openFile',
                      path: filePath
                    });
                  }
                  modal.remove();
                });
                
                const actionBtns = document.createElement('div');
                
                // Cancel button
                const cancelBtn = document.createElement('button');
                cancelBtn.type = 'button';
                cancelBtn.textContent = 'Cancel';
                cancelBtn.style.padding = '8px 16px';
                cancelBtn.style.marginRight = '8px';
                cancelBtn.addEventListener('click', () => {
                  modal.remove();
                });
                
                // Save button
                const saveBtn = document.createElement('button');
                saveBtn.type = 'submit';
                saveBtn.textContent = 'Save';
                saveBtn.style.padding = '8px 16px';
                saveBtn.style.backgroundColor = 'var(--highlight-color)';
                
                actionBtns.appendChild(cancelBtn);
                actionBtns.appendChild(saveBtn);
                
                buttonDiv.appendChild(openFileBtn);
                buttonDiv.appendChild(actionBtns);
                form.appendChild(buttonDiv);
                
                // Add form submission handler
                form.addEventListener('submit', (e) => {
                  e.preventDefault();
                  
                  // Get updated values from form
                  const formData = new FormData(e.target);
                  const updatedData = { ...values };
                  
                  // Update with form values
                  editableFields.forEach(field => {
                    updatedData[field.name] = formData.get(field.name);
                  });
                  
                  // Send update message
                  vscode.postMessage({
                    command: 'editItem',
                    recordId: recordId,
                    recordData: updatedData
                  });
                  
                  // Remove the modal - the view will refresh when update is confirmed
                  modal.remove();
                });
                
                modal.appendChild(form);
                return modal;
              }
              
              // Calendar dynamic filter builder functionality 
              const calendarFilterBuilder = document.getElementById('calendarFilterBuilder');
              const calendarAddFilterBtn = document.getElementById('calendarAddFilterBtn');
              const calendarSaveFilterBtn = document.getElementById('calendarSaveFilterBtn');
              const calendarSavedFiltersList = document.getElementById('calendarSavedFiltersList');
              const calendarSavedFiltersContainer = document.getElementById('calendarSavedFilters');
              const calendarShowFiltersBtn = document.getElementById('calendarShowFiltersBtn');
              const calendarFilterPanel = document.getElementById('calendarFilterPanel');
              const calendarClearFilterBtn = document.getElementById('calendarClearFilterBtn');
              const calendarApplyFiltersBtn = document.getElementById('calendarApplyFiltersBtn');
              
              // Show/hide filter panel
              if (calendarShowFiltersBtn && calendarFilterPanel) {
                calendarShowFiltersBtn.addEventListener('click', () => {
                  const isDisplayed = calendarFilterPanel.style.display !== 'none';
                  calendarFilterPanel.style.display = isDisplayed ? 'none' : 'block';
                  calendarShowFiltersBtn.textContent = isDisplayed ? 'Show Filters' : 'Hide Filters';
                });
              }
              
              if (calendarFilterBuilder && calendarAddFilterBtn) {
                // Function to create a new filter condition element (similar to the table view function)
                function createCalendarFilterCondition(isFirstCondition = false) {
                  const conditionId = 'calendar-filter-' + Date.now();
                  const condition = document.createElement('div');
                  condition.className = 'filter-condition';
                  condition.id = conditionId;
                  
                  // Logical join operator (AND/OR) for conditions after the first one
                  if (!isFirstCondition) {
                    const joinSelect = document.createElement('select');
                    joinSelect.className = 'filter-join';
                    
                    const andOption = document.createElement('option');
                    andOption.value = 'and';
                    andOption.textContent = 'AND';
                    andOption.selected = true;
                    
                    const orOption = document.createElement('option');
                    orOption.value = 'or';
                    orOption.textContent = 'OR';
                    
                    joinSelect.appendChild(andOption);
                    joinSelect.appendChild(orOption);
                    condition.appendChild(joinSelect);
                  }
                  
                  // Property selector
                  const propertySelect = document.createElement('select');
                  propertySelect.className = 'filter-property';
                  
                  // Add default empty option
                  const defaultOption = document.createElement('option');
                  defaultOption.value = '';
                  defaultOption.textContent = 'Select property...';
                  propertySelect.appendChild(defaultOption);
                  
                  // Add options for each field in the dataframe
                  dataframe.fields.forEach(field => {
                    const option = document.createElement('option');
                    option.value = field.name;
                    option.textContent = field.name;
                    propertySelect.appendChild(option);
                  });
                  
                  // Operator selector
                  const operatorSelect = document.createElement('select');
                  operatorSelect.className = 'filter-operator';
                  
                  const operators = [
                    { value: 'isNotEmpty', text: 'is not empty' },
                    { value: 'isEmpty', text: 'is empty' },
                    { value: 'is', text: 'is' },
                    { value: 'isNot', text: 'is not' },
                    { value: 'contains', text: 'contains' },
                    { value: 'doesNotContain', text: 'does not contain' }
                  ];
                  
                  operators.forEach(op => {
                    const option = document.createElement('option');
                    option.value = op.value;
                    option.textContent = op.text;
                    operatorSelect.appendChild(option);
                  });
                  
                  // Value input
                  const valueInput = document.createElement('input');
                  valueInput.type = 'text';
                  valueInput.className = 'filter-value';
                  valueInput.placeholder = 'Value...';
                  
                  // Remove button
                  const removeBtn = document.createElement('button');
                  removeBtn.type = 'button';
                  removeBtn.className = 'filter-remove';
                  removeBtn.textContent = '\xD7';
                  removeBtn.title = 'Remove condition';
                  removeBtn.addEventListener('click', () => {
                    condition.remove();
                  });
                  
                  // Add elements to condition
                  condition.appendChild(propertySelect);
                  condition.appendChild(operatorSelect);
                  condition.appendChild(valueInput);
                  condition.appendChild(removeBtn);
                  
                  // Handle operator change to show/hide value input
                  operatorSelect.addEventListener('change', () => {
                    const operator = operatorSelect.value;
                    if (operator === 'isEmpty' || operator === 'isNotEmpty') {
                      valueInput.style.display = 'none';
                      valueInput.value = '';
                    } else {
                      valueInput.style.display = 'block';
                    }
                  });
                  
                  // Initialize with correct display state
                  if (operatorSelect.value === 'isEmpty' || operatorSelect.value === 'isNotEmpty') {
                    valueInput.style.display = 'none';
                  }
                  
                  return condition;
                }
                
                // Add a new condition when the "Add Condition" button is clicked
                calendarAddFilterBtn.addEventListener('click', () => {
                  const isFirstCondition = calendarFilterBuilder.children.length === 0;
                  const condition = createCalendarFilterCondition(isFirstCondition);
                  calendarFilterBuilder.appendChild(condition);
                });
                
                // Add an initial condition if the filter builder is empty
                if (calendarFilterBuilder.children.length === 0) {
                  calendarAddFilterBtn.click();
                }
                
                // Save filter functionality
                if (calendarSaveFilterBtn) {
                  calendarSaveFilterBtn.addEventListener('click', () => {
                    // Check if we have valid conditions to save
                    const conditions = [];
                    let hasValidConditions = false;
                    
                    calendarFilterPanel.querySelectorAll('.filter-condition').forEach(conditionEl => {
                      const propertySelect = conditionEl.querySelector('.filter-property');
                      const operatorSelect = conditionEl.querySelector('.filter-operator');
                      const valueInput = conditionEl.querySelector('.filter-value');
                      
                      if (propertySelect.value) {
                        hasValidConditions = true;
                        conditions.push({
                          property: propertySelect.value,
                          operator: operatorSelect.value,
                          value: valueInput.value
                        });
                      }
                    });
                    
                    if (!hasValidConditions) {
                      alert('Please add at least one valid filter condition');
                      return;
                    }
                    
                    // Prompt for filter name
                    const filterName = prompt('Enter a name for this filter:');
                    if (!filterName) return;
                    
                    // Save filter to localStorage with a different key for calendar
                    const viewKey = 'calendar_filters_' + dataframe.id;
                    let savedFilters = JSON.parse(localStorage.getItem(viewKey) || '[]');
                    
                    const filter = {
                      id: 'calendar_filter_' + Date.now(),
                      name: filterName,
                      conditions: conditions
                    };
                    
                    savedFilters.push(filter);
                    localStorage.setItem(viewKey, JSON.stringify(savedFilters));
                    
                    // Add to UI
                    addCalendarSavedFilterToUI(filter);
                  });
                }
                
                // Function to add a saved filter to the UI
                function addCalendarSavedFilterToUI(filter) {
                  if (!calendarSavedFiltersContainer || !calendarSavedFiltersList) return;
                  
                  // Show saved filters container if it was hidden
                  calendarSavedFiltersContainer.style.display = 'block';
                  
                  const filterItem = document.createElement('div');
                  filterItem.className = 'saved-filter';
                  filterItem.dataset.filterId = filter.id;
                  
                  const nameEl = document.createElement('div');
                  nameEl.className = 'saved-filter-name';
                  nameEl.textContent = filter.name;
                  
                  const actionsEl = document.createElement('div');
                  actionsEl.className = 'saved-filter-actions';
                  
                  const applyBtn = document.createElement('button');
                  applyBtn.className = 'filter-button';
                  applyBtn.textContent = 'Apply';
                  applyBtn.addEventListener('click', () => {
                    // Clear existing filter conditions
                    calendarFilterBuilder.innerHTML = '';
                    
                    // Add conditions from saved filter
                    filter.conditions.forEach(condition => {
                      const conditionEl = createCalendarFilterCondition();
                      
                      const propertySelect = conditionEl.querySelector('.filter-property');
                      const operatorSelect = conditionEl.querySelector('.filter-operator');
                      const valueInput = conditionEl.querySelector('.filter-value');
                      
                      propertySelect.value = condition.property;
                      operatorSelect.value = condition.operator;
                      valueInput.value = condition.value;
                      
                      // Update visibility of value input
                      if (condition.operator === 'isEmpty' || condition.operator === 'isNotEmpty') {
                        valueInput.style.display = 'none';
                      }
                      
                      calendarFilterBuilder.appendChild(conditionEl);
                    });
                    
                    // Apply the filter
                    calendarApplyFiltersBtn.click();
                  });
                  
                  const deleteBtn = document.createElement('button');
                  deleteBtn.className = 'filter-button';
                  deleteBtn.textContent = 'Delete';
                  deleteBtn.addEventListener('click', () => {
                    // Remove from UI
                    filterItem.remove();
                    
                    // Remove from localStorage
                    const viewKey = 'calendar_filters_' + dataframe.id;
                    let savedFilters = JSON.parse(localStorage.getItem(viewKey) || '[]');
                    savedFilters = savedFilters.filter(f => f.id !== filter.id);
                    localStorage.setItem(viewKey, JSON.stringify(savedFilters));
                    
                    // Hide container if no saved filters left
                    if (savedFilters.length === 0) {
                      calendarSavedFiltersContainer.style.display = 'none';
                    }
                  });
                  
                  actionsEl.appendChild(applyBtn);
                  actionsEl.appendChild(deleteBtn);
                  
                  filterItem.appendChild(nameEl);
                  filterItem.appendChild(actionsEl);
                  
                  calendarSavedFiltersList.appendChild(filterItem);
                }
                
                // Load saved filters on page load
                const calendarViewKey = 'calendar_filters_' + dataframe.id;
                const calendarSavedFilters = JSON.parse(localStorage.getItem(calendarViewKey) || '[]');
                
                if (calendarSavedFilters.length > 0 && calendarSavedFiltersContainer && calendarSavedFiltersList) {
                  calendarSavedFiltersContainer.style.display = 'block';
                  calendarSavedFilters.forEach(filter => {
                    addCalendarSavedFilterToUI(filter);
                  });
                }
              }
              
              // Apply calendar filters
              if (calendarApplyFiltersBtn) {
                calendarApplyFiltersBtn.addEventListener('click', () => {
                  // Get filters from the calendar filter builder
                  const filterConditions = [];
                  
                  // Get filters from the dynamic filter builder
                  calendarFilterPanel.querySelectorAll('.filter-condition').forEach((conditionEl, index) => {
                    const propertySelect = conditionEl.querySelector('.filter-property');
                    const operatorSelect = conditionEl.querySelector('.filter-operator');
                    const valueInput = conditionEl.querySelector('.filter-value');
                    const joinSelect = conditionEl.querySelector('.filter-join');
                    
                    if (propertySelect.value) {
                      const property = propertySelect.value;
                      const operator = operatorSelect.value;
                      const value = valueInput.value;
                      // Get the logical join (AND/OR) if not the first condition
                      const join = index > 0 && joinSelect ? joinSelect.value : null;
                      
                      // Always include isEmpty/isNotEmpty operators even without value
                      if (value || operator === 'isEmpty' || operator === 'isNotEmpty') {
                        filterConditions.push({ 
                          field: property, 
                          operator, 
                          value,
                          join 
                        });
                      }
                    }
                  });
                  
                  // Store the filter conditions in the DOM for reference
                  if (calendarFilterPanel) {
                    calendarFilterPanel.dataset.appliedFilters = JSON.stringify(filterConditions);
                  }
                  
                  // For calendar view, we need to refresh the data to apply the filters
                  // In a more sophisticated implementation, we would filter client-side
                  vscode.postMessage({
                    command: 'refreshData'
                  });
                });
              }
              
              // Clear calendar filters
              if (calendarClearFilterBtn) {
                calendarClearFilterBtn.addEventListener('click', () => {
                  // Clear all filter conditions
                  if (calendarFilterBuilder) {
                    calendarFilterBuilder.innerHTML = '';
                  }
                  
                  // Add a blank filter condition
                  if (calendarAddFilterBtn) {
                    calendarAddFilterBtn.click();
                  }
                  
                  // Refresh the view
                  vscode.postMessage({
                    command: 'refreshData'
                  });
                });
              }
              
              // Close event details modal
              if (closeEventDetailsBtn && eventDetails) {
                closeEventDetailsBtn.addEventListener('click', () => {
                  eventDetails.style.display = 'none';
                });
              }
            }
            
            // Add event listener to show/hide value input based on operator
            document.querySelectorAll('.filter-operator').forEach(selectEl => {
              // Initial setup - hide value inputs for operators that don't need them
              const operator = selectEl.value;
              const valueInput = selectEl.closest('.filter-field-inputs').querySelector('.filter-value');
              if (operator === 'isEmpty' || operator === 'isNotEmpty') {
                valueInput.style.display = 'none';
              } else {
                valueInput.style.display = 'block';
              }
              
              // Handle change events
              selectEl.addEventListener('change', () => {
                const operator = selectEl.value;
                const valueInput = selectEl.closest('.filter-field-inputs').querySelector('.filter-value');
                
                if (operator === 'isEmpty' || operator === 'isNotEmpty') {
                  valueInput.style.display = 'none';
                  valueInput.value = ''; // Clear the value since it's not needed
                } else {
                  valueInput.style.display = 'block';
                }
              });
            });
            
            const vscode = acquireVsCodeApi();
          })();
        </script>
      </body>
      </html>`}renderTableView(t){if(t.records.length===0)return`<div class="container">
        <div class="card">
          <h2>No data</h2>
          <p>This project has no data records.</p>
        </div>
      </div>`;let r=t.fields;return`
    <div class="container">
      <div class="filter-bar">
        <div class="filter-controls">
          <input type="text" id="searchInput" placeholder="Search..." class="search-box">
          <button id="clearFilterBtn" class="filter-button">Clear Filters</button>
          <button id="showFiltersBtn" class="filter-button">Show Filters</button>
        </div>
        <div id="filterPanel" class="filter-panel" style="display: none;">
          <h3>Filters</h3>
          
          <div id="filterBuilder" class="filter-builder">
            <!-- Dynamic filter conditions will be added here -->
          </div>
          
          <button id="addFilterBtn" class="filter-add">+ Add Condition</button>
          
          <div class="filter-actions">
            <div>
              <button id="saveFilterBtn" class="filter-button">Save Filter</button>
            </div>
            <div>
              <button id="applyFiltersBtn" class="filter-button">Apply Filters</button>
            </div>
          </div>
          
          <div id="savedFilters" class="filter-saved" style="display: none;">
            <h3>Saved Filters</h3>
            <div id="savedFiltersList">
              <!-- Saved filters will be displayed here -->
            </div>
          </div>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            ${r.map(n=>`
              <th>
                <div class="th-content">
                  <span>${n.name}</span>
                  <div class="sort-controls">
                    <span class="sort-control sort-asc" data-field="${n.name}" title="Sort ascending">\u2191</span>
                    <span class="sort-control sort-desc" data-field="${n.name}" title="Sort descending">\u2193</span>
                  </div>
                </div>
              </th>
            `).join("")}
          </tr>
        </thead>
        <tbody>
        ${t.records.map(n=>`
          <tr>
            ${r.map(a=>{let o=n.values[a.name];if(a.name==="path"&&typeof o=="string")return`<td>
                  <span class="file-link" data-path="${o}">${it.basename(o)}</span>
                </td>`;{let l="";return o==null?l="":o instanceof Date?l=o.toLocaleDateString():Array.isArray(o)?l=o.filter(c=>c!=null).join(", "):l=String(o),`<td>${l}</td>`}}).join("")}
          </tr>
        `).join("")}
        </tbody>
      </table>
    </div>`}renderBoardView(t,r){if(t.records.length===0)return`<div class="container">
        <div class="card">
          <h2>No data</h2>
          <p>This project has no data records.</p>
        </div>
      </div>`;let i=r.config?.groupByField||"status",n=new Map;n.set("No Status",[]),t.records.forEach(o=>{let l=o.values[i],c="No Status";l!=null&&(c=String(l)),n.has(c)||n.set(c,[]);let s=n.get(c);s&&s.push(o)});let a='<div class="board-container">';return n.forEach((o,l)=>{a+=`
        <div class="board-column">
          <div class="column-header">${String(l)} (${o.length})</div>`,o.forEach(c=>{let s="";c.values.name!==void 0?s=String(c.values.name):c.values.title!==void 0?s=String(c.values.title):s=c.id;let d=c.values.description!==void 0?String(c.values.description):"",u=c.values.path!==void 0?String(c.values.path):"";a+=`
          <div class="board-card">
            <div class="file-link" data-path="${u}">${s}</div>
            <div>${d}</div>
          </div>`}),a+="</div>"}),a+="</div>",a}renderCalendarView(t,r){if(t.records.length===0)return`<div class="container">
        <div class="card">
          <h2>No data</h2>
          <p>This project has no data records.</p>
        </div>
      </div>`;let i=new Date,n=r.config?.dateField||this.findSuitableDateField(t.fields),a=r.config?.year||i.getFullYear(),o=r.config?.month!==void 0?r.config.month:i.getMonth(),l=new Date(a,o,1),c=new Date(a,o+1,0),s=l.getDay(),d=`
    <div class="container">
      <div class="calendar-container">
        <div class="calendar-toolbar">
          <button id="prevMonth">\u2190</button>
          <h2 id="currentMonthDisplay">${l.toLocaleDateString("en-US",{month:"long",year:"numeric"})}</h2>
          <button id="nextMonth">\u2192</button>
          <button id="todayBtn">Today</button>
        </div>
        
        <div class="calendar-filter">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div>
              <label>Date field: 
                <select id="dateFieldSelect">
                  ${this.findDateFields(t.fields).map(g=>`<option value="${g.name}" ${g.name===n?"selected":""}>${g.name}</option>`).join("")}
                </select>
              </label>
            </div>
            <div>
              <button id="calendarShowFiltersBtn" class="filter-button">Show Filters</button>
            </div>
          </div>
          
          <div id="calendarFilterPanel" class="filter-panel" style="display: none;">
            <h3>Filters</h3>
            
            <div id="calendarFilterBuilder" class="filter-builder">
              <!-- Dynamic filter conditions will be added here -->
            </div>
            
            <button id="calendarAddFilterBtn" class="filter-add">+ Add Condition</button>
            
            <div class="filter-actions">
              <div>
                <button id="calendarSaveFilterBtn" class="filter-button">Save Filter</button>
              </div>
              <div>
                <button id="calendarApplyFiltersBtn" class="filter-button">Apply Filters</button>
                <button id="calendarClearFilterBtn" class="filter-button">Clear</button>
              </div>
            </div>
            
            <div id="calendarSavedFilters" class="filter-saved" style="display: none;">
              <h3>Saved Filters</h3>
              <div id="calendarSavedFiltersList">
                <!-- Saved filters will be displayed here -->
              </div>
            </div>
          </div>
        </div>
        
        <div class="calendar-grid">
          <div class="calendar-header">
            <div class="calendar-cell">Sun</div>
            <div class="calendar-cell">Mon</div>
            <div class="calendar-cell">Tue</div>
            <div class="calendar-cell">Wed</div>
            <div class="calendar-cell">Thu</div>
            <div class="calendar-cell">Fri</div>
            <div class="calendar-cell">Sat</div>
          </div>
          
          <div class="calendar-body">`,u=new Map;t.records.forEach(g=>{let x=g.values[n];if(x==null)return;let v;if(x instanceof Date)v=x;else if(typeof x=="string"){if(v=new Date(x),isNaN(v.getTime()))return}else if(typeof x=="number")v=new Date(x);else return;let N=v.toISOString().split("T")[0];u.has(N)||u.set(N,[]);let V=u.get(N);V&&V.push(g)});let f=1,h=c.getDate();for(let g=0;g<6;g++){d+='<div class="calendar-row">';for(let x=0;x<7;x++)if(g===0&&x<s||f>h)d+='<div class="calendar-cell empty"></div>';else{let N=new Date(a,o,f).toISOString().split("T")[0],V=u.get(N)||[],Ei=f===i.getDate()&&o===i.getMonth()&&a===i.getFullYear();if(d+=`
            <div class="calendar-cell ${Ei?"today":""}" data-date="${N}">
              <div class="calendar-date">${f}</div>
              <div class="calendar-events">`,V.length>0){V.sort((O,re)=>{let at=O.values.name||O.values.title||O.id,Fi=re.values.name||re.values.title||re.id;return String(at).localeCompare(String(Fi))});let ot=3;if(V.slice(0,ot).forEach(O=>{let re=O.values.name||O.values.title||O.id,at=O.values.path||"";d+=`
                <div class="calendar-event" data-record-id="${O.id}" data-path="${at}">
                  <span title="${re}">${re}</span>
                </div>`}),V.length>ot){let O=V.length-ot;d+=`<div class="more-events">+${O} more</div>`}}d+="</div></div>",f++}if(d+="</div>",f>h)break}return d+=`
          </div>
        </div>
        
        <div class="event-details" id="eventDetails" style="display: none;">
          <div class="event-details-header">
            <h3>Events for <span id="selectedDate"></span></h3>
            <button id="closeEventDetails">\u2715</button>
          </div>
          <div id="eventDetailsList"></div>
        </div>
      </div>
    </div>`,d}renderGalleryView(t){if(t.records.length===0)return`<div class="container">
        <div class="card">
          <h2>No data</h2>
          <p>This project has no data records.</p>
        </div>
      </div>`;let r=`<div class="container">
      <h2>Gallery View</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px;">`;return t.records.forEach(i=>{let n="";i.values.name!==void 0?n=String(i.values.name):i.values.title!==void 0?n=String(i.values.title):n=i.id;let a=i.values.description!==void 0?String(i.values.description):"",o=i.values.path!==void 0?String(i.values.path):"";r+=`
        <div class="card" style="height: 200px; overflow: hidden;">
          <h3><span class="file-link" data-path="${o}">${n}</span></h3>
          <p>${a}</p>
        </div>`}),r+="</div></div>",r}};var te;function w(e,t="info"){if(!te)return;let i=`[${new Date().toISOString().replace("T"," ").substr(0,19)}] ${e}`;switch(t){case"error":console.error(i),te.appendLine(`ERROR: ${e}`);break;case"warn":console.warn(i),te.appendLine(`WARNING: ${e}`);break;default:console.log(i),te.appendLine(`INFO: ${e}`)}}function es(e,t,r,i,n){w("Registering commands...");let a={"vscode-projects.showProjects":()=>{w("Show projects command executed"),n.reveal(null,{focus:!0,select:!1})},"vscode-projects.createProject":async()=>{w("Create project command executed");try{await yi(t,r)}catch(o){w(`Error creating project: ${o}`,"error"),C.window.showErrorMessage(`Failed to create project: ${o}`)}},"vscode-projects.createNote":async()=>{w("Create note command executed");try{await wi(t)}catch(o){w(`Error creating note: ${o}`,"error"),C.window.showErrorMessage(`Failed to create note: ${o}`)}},"vscode-projects.openProject":async o=>{w(`Open project command executed with projectId: ${o}`);try{if(!o){let l=t.getProjects();if(l.length===0)throw new Error("No projects exist. Create a project first.");let c=l.map(d=>({label:d.name,id:d.id})),s=await C.window.showQuickPick(c,{placeHolder:"Select a project to open"});if(!s)return;o=s.id,w(`User selected project: ${s.label} (${o})`)}await i.openProject(o)}catch(l){w(`Error opening project: ${l}`,"error"),C.window.showErrorMessage(`Failed to open project: ${l}`)}},"vscode-projects.openView":async(o,l)=>{w(`Open view command executed with projectId: ${o}, viewId: ${l}`);try{if(!o){let c=t.getProjects();if(c.length===0)throw new Error("No projects exist. Create a project first.");let s=c.map(u=>({label:u.name,id:u.id})),d=await C.window.showQuickPick(s,{placeHolder:"Select a project"});if(!d)return;o=d.id,w(`User selected project: ${d.label} (${o})`)}if(!l){let c=t.getProject(o);if(!c)throw new Error(`Project with ID ${o} not found`);if(c.views.length===0)throw new Error(`Project ${c.name} has no views`);let s=c.views.map(u=>({label:u.name,description:`Type: ${u.type}`,id:u.id})),d=await C.window.showQuickPick(s,{placeHolder:"Select a view"});if(!d)return;l=d.id,w(`User selected view: ${d.label} (${l})`)}await i.openView(o,l)}catch(c){w(`Error opening view: ${c}`,"error"),C.window.showErrorMessage(`Failed to open view: ${c}`)}},"vscode-projects.refreshView":()=>{w("Refresh view command executed"),r.refresh()},"vscode-projects.toggleArchives":()=>{w("Toggle archives command executed"),r.toggleArchives()},"vscode-projects.createView":async()=>{w("Create view command executed");try{await xi(t),r.refresh()}catch(o){w(`Error creating view: ${o}`,"error"),C.window.showErrorMessage(`Failed to create view: ${o}`)}},"vscode-projects.deleteProject":async()=>{w("Delete project command executed");try{await bi(t,r)}catch(o){w(`Error deleting project: ${o}`,"error"),C.window.showErrorMessage(`Failed to delete project: ${o}`)}},"vscode-projects.deleteView":async()=>{w("Delete view command executed");try{await Si(t,r)}catch(o){w(`Error deleting view: ${o}`,"error"),C.window.showErrorMessage(`Failed to delete view: ${o}`)}}};Object.keys(a).forEach(o=>{try{w(`Registering command: ${o}`);let l=C.commands.registerCommand(o,a[o]);e.subscriptions.push(l),w(`Command registered successfully: ${o}`)}catch(l){w(`Error registering command ${o}: ${l}`,"error"),C.window.showErrorMessage(`Failed to register command ${o}: ${l}`)}}),w("All commands registered successfully")}function ts(e){te=C.window.createOutputChannel("VSCode Projects"),e.subscriptions.push(te),w("Activating VSCode Projects extension"),w(`Extension path: ${e.extensionPath}`);try{let t=new et;w("File system adapter initialized");let r=new Re(e,t);w("Project manager initialized");let i=new nt(e,r);w("View provider initialized");let n=new Fe(r);w("Projects tree data provider initialized");let a=C.window.createTreeView("vscode-projects-sidebar",{treeDataProvider:n,showCollapseAll:!0});w("Tree view registered with ID: vscode-projects-sidebar"),es(e,r,n,i,a),e.subscriptions.push(te,a),w("VSCode Projects extension activated successfully"),C.window.showInformationMessage("VSCode Projects extension activated!")}catch(t){w(`Error during extension activation: ${t}`,"error"),C.window.showErrorMessage(`Failed to activate VSCode Projects extension: ${t}`)}}function rs(){w("Deactivating VSCode Projects extension")}0&&(module.exports={activate,deactivate});
/*! Bundled license information:

is-extendable/index.js:
  (*!
   * is-extendable <https://github.com/jonschlinkert/is-extendable>
   *
   * Copyright (c) 2015, Jon Schlinkert.
   * Licensed under the MIT License.
   *)

strip-bom-string/index.js:
  (*!
   * strip-bom-string <https://github.com/jonschlinkert/strip-bom-string>
   *
   * Copyright (c) 2015, 2017, Jon Schlinkert.
   * Released under the MIT License.
   *)
*/
//# sourceMappingURL=extension.js.map
