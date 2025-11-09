const a=(o,e="",s=!1)=>Object.entries(o).filter(([t,r])=>r).map(([t,r])=>typeof r=="object"?a(r,t,Array.isArray(r)):`${e?`${e}[${s?"":t}]`:`${t}`}=${r}`).join("&");export{a as b};
