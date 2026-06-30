import{c as l,r as c,a as h,u as p,j as e,z as r}from"./index-DcOfegA0.js";/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=l("KeyRound",[["path",{d:"M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z",key:"167ctg"}],["circle",{cx:"16.5",cy:"7.5",r:".5",key:"1kog09"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=l("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=l("ShieldAlert",[["path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",key:"1irkt0"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M12 16h.01",key:"1drbdi"}]]);function g(){const[t,d]=c.useState(""),[s,i]=c.useState(!1),{login:o}=h(),m=p(),u=async a=>{if(a.preventDefault(),!t.trim()){r.error("Please enter the admin password");return}i(!0);const n=await o(t);i(!1),n.success?(r.success("Authenticated as Sultan Ansari!"),m("/")):r.error(n.message||"Invalid admin password")};return e.jsxs("div",{className:"min-h-[calc(100vh-8rem)] flex items-center justify-center relative",children:[e.jsx("div",{className:"absolute w-[400px] h-[400px] bg-primary-500/10 rounded-full blur-3xl pointer-events-none"}),e.jsxs("div",{className:"glass-premium p-8 w-full max-w-md relative overflow-hidden text-center",children:[e.jsx("div",{className:"absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl"}),e.jsx("div",{className:"w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-400/10 flex items-center justify-center mx-auto mb-6 border border-primary-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)]",children:e.jsx(f,{className:"w-8 h-8 text-primary-400"})}),e.jsx("h2",{className:"text-2xl font-bold text-white mb-2 tracking-tight",children:"Admin Authentication"}),e.jsxs("p",{className:"text-sm text-slate-400 mb-6",children:["Authorized access required to add, modify, or delete leads. Enter password to login as ",e.jsx("span",{className:"text-primary-400 font-semibold",children:"Sultan Ansari"}),"."]}),e.jsxs("form",{onSubmit:u,className:"space-y-4 text-left",children:[e.jsxs("div",{className:"relative",children:[e.jsx("span",{className:"absolute left-3 top-1/2 -translate-y-1/2 text-slate-500",children:e.jsx(x,{className:"w-4 h-4"})}),e.jsx("input",{type:"password",placeholder:"Enter admin password...",value:t,onChange:a=>d(a.target.value),className:"input-premium pl-10",disabled:s,autoFocus:!0})]}),e.jsxs("button",{type:"submit",disabled:s,className:"w-full btn-premium flex items-center justify-center gap-2 mt-2",children:[e.jsx(y,{className:"w-4 h-4"}),s?"Authenticating...":"Unlock Admin Mode"]})]})]})]})}export{g as default};
