const defaultMenu = [
 {category:"Entrantes",items:[
  {name:"Burrata, tomate y albahaca",price:"12,50 €",desc:"Burrata cremosa con tomate de temporada, aceite de albahaca y pan crujiente.",ingredients:"Burrata, tomate, albahaca, AOVE, pan",allergens:"Lácteos, gluten"},
  {name:"Croquetas de jamón ibérico",price:"10,00 €",desc:"Croquetas caseras de textura cremosa y rebozado fino.",ingredients:"Leche, jamón ibérico, harina, huevo",allergens:"Gluten, lácteos, huevo"},
  {name:"Ensalada de temporada",price:"11,50 €",desc:"Hojas frescas, verduras de temporada, frutos secos y vinagreta de la casa.",ingredients:"Hojas verdes, verduras, frutos secos, vinagreta",allergens:"Frutos secos"}
 ]},
 {category:"Principales",items:[
  {name:"Arroz meloso de setas",price:"18,50 €",desc:"Arroz meloso cocinado lentamente con setas y caldo vegetal.",ingredients:"Arroz, setas, caldo vegetal, parmesano",allergens:"Lácteos"},
  {name:"Lubina a la brasa",price:"22,00 €",desc:"Lubina a la brasa acompañada de verduras y aceite de limón.",ingredients:"Lubina, verduras, limón, AOVE",allergens:"Pescado"},
  {name:"Carrillera al vino tinto",price:"20,50 €",desc:"Carrillera cocinada a baja temperatura con salsa de vino tinto.",ingredients:"Carrillera de ternera, vino tinto, patata",allergens:"Sulfitos"}
 ]},
 {category:"Postres",items:[
  {name:"Tarta de queso",price:"7,50 €",desc:"Tarta de queso cremosa con base crujiente y coulis de frutos rojos.",ingredients:"Queso crema, huevo, nata, frutos rojos",allergens:"Lácteos, huevo, gluten"},
  {name:"Chocolate y aceite de oliva",price:"7,00 €",desc:"Chocolate intenso, sal marina y un toque de nuestro AOVE.",ingredients:"Chocolate, AOVE, sal marina",allergens:"Puede contener trazas de frutos secos"}
 ]}
];

function getMenu(){
  const saved=sessionStorage.getItem('casaOlivaMenu');
  return saved ? JSON.parse(saved) : structuredClone(defaultMenu);
}
function saveMenu(menu){sessionStorage.setItem('casaOlivaMenu',JSON.stringify(menu));}

const menuContainer=document.getElementById('menu');
if(menuContainer) renderMenu();

async function renderMenu(){
 menuContainer.innerHTML='<p class="loading">Cargando la carta…</p>';
 let menu;
 try{
  const res=await fetch('/api/menu');
  if(!res.ok) throw new Error('bad-response');
  menu=await res.json();
  if(!Array.isArray(menu)||!menu.length) throw new Error('empty');
 }catch(err){
  menu=getMenu(); // sin conexión al backend: se muestra la carta de demostración
 }
 menuContainer.innerHTML='';
 menu.forEach((section,si)=>{
  const block=document.createElement('section'); block.className='menu-section reveal';
  block.innerHTML=`<div class="section-title"><span>${String(si+1).padStart(2,'0')}</span><h2>${section.category}</h2></div>`;
  const grid=document.createElement('div'); grid.className='dish-grid';
  section.items.forEach((dish,di)=>{
   const card=document.createElement('button'); card.className='dish-card'; card.style.setProperty('--delay',`${di*70}ms`);
   card.innerHTML=`<div class="dish-card-top"><span class="dish-index">${String(di+1).padStart(2,'0')}</span><strong>${dish.price}</strong></div><h3>${dish.name}</h3><p>${dish.desc}</p><span class="dish-open">Ver detalles →</span>`;
   card.onclick=()=>openDish(dish,section.category); grid.appendChild(card);
  });
  block.appendChild(grid); menuContainer.appendChild(block);
 });
}
const categoryImg={Entrantes:'img/dish-entrantes.svg',Principales:'img/dish-principales.svg',Postres:'img/dish-postres.svg'};
function openDish(dish,category){
 document.getElementById('cat').textContent=category; document.getElementById('name').textContent=dish.name; document.getElementById('desc').textContent=dish.desc;
 document.getElementById('price').textContent=dish.price; document.getElementById('ingredients').textContent=dish.ingredients; document.getElementById('allergens').textContent=dish.allergens;
 const photo=document.getElementById('dishPhoto'); photo.src=categoryImg[category]||'img/dish-principales.svg'; photo.alt=`Ilustración de ${dish.name}`;
 const modal=document.getElementById('modal'); modal.classList.add('open'); document.body.classList.add('no-scroll');
}
function closeDish(){document.getElementById('modal').classList.remove('open');document.body.classList.remove('no-scroll')}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDish()});
