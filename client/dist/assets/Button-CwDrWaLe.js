import{j as e}from"./index-Z139GkM8.js";function d({children:r,className:s="",glow:a=!1,hover:n=!0,onClick:t}){return e.jsx("div",{onClick:t,className:`
        glass rounded-2xl p-6 
        ${n?"glass-hover":""} 
        ${a?"glass-card-glow":""} 
        ${s}
      `,children:r})}function i({children:r,variant:s="primary",className:a="",...n}){const t={primary:"btn-primary",secondary:"btn-secondary",danger:"btn-danger"};return e.jsx("button",{className:`${t[s]} ${a}`,...n,children:r})}export{i as B,d as G};
