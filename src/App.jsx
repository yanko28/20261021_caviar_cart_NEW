import React, { useEffect, useState } from 'react';
const asset = name => `${import.meta.env.BASE_URL}assets/${name}`;
const initialItems = [
 {id:'wolf',category:'Custom Iphone',title:'Зов Волка',price:659000,quantity:1,model:'iPhone 18 Pro',storage:'512 Gb'},
 {id:'president',category:'Custom Samsung S26 Ultra',title:'Говорит Президент России',price:659000,quantity:1,storage:'512 Gb'},
 {id:'odyssey',category:'Custom RayBan wayfarer II',title:'Одиссея Ag',price:499000,quantity:1,size:'L (135 мм между дужками)'},
 {id:'brunello',category:'Кардхолдер',title:'Brunello',price:29900,quantity:1}
];
const money = value => new Intl.NumberFormat('ru-RU').format(value);
function Options({item,field,label,values,onChange}) {
 return <fieldset className="options"><legend className="trimmed">{label}</legend><div className="option-list">{values.map(value=><label className="option" key={value}><input type="radio" name={item.id+'-'+field} value={value} checked={item[field]===value} onChange={()=>onChange(item.id,field,value)}/><span className="trimmed">{value}</span></label>)}</div></fieldset>;
}
function CartItem({item,onChange}) {
 return <article className="cart-item"><img className="product-image" src={asset(item.id+'-new.png')} alt={item.title} width="981" height="720"/><div className="product-details">
 <p className="product-category trimmed">{item.category}</p><h2 className="product-title trimmed">{item.title}</h2>
 {item.model&&<Options item={item} field="model" label="Устройство" values={['iPhone 18 Pro','iPhone 18 Pro Max']} onChange={onChange}/>}
 {item.storage&&<Options item={item} field="storage" label="Память" values={['256 Gb','512 Gb','1 Tb','2 Tb']} onChange={onChange}/>}
 {item.size&&<Options item={item} field="size" label="Размер" values={['M (129 мм между дужками)','L (135 мм между дужками)']} onChange={onChange}/>}
 <div className="quantity"><span className="small-label trimmed">Количество</span><div className="quantity-control"><button type="button" aria-label={'Уменьшить количество: '+item.title} onClick={()=>onChange(item.id,'quantity',Math.max(1,item.quantity-1))}>-</button><input aria-label={'Количество: '+item.title} inputMode="numeric" type="number" min="1" max="99" value={item.quantity} onChange={e=>onChange(item.id,'quantity',Math.max(1,Math.min(99,Number(e.target.value)||1)))}/><button type="button" aria-label={'Увеличить количество: '+item.title} onClick={()=>onChange(item.id,'quantity',Math.min(99,item.quantity+1))}>+</button></div></div>
 <div className="product-price"><span className="small-label trimmed">Стоимость</span><span className="price-value trimmed">{money(item.price)} ₽</span></div>
 </div></article>;
}
function Select({label,name}) {return <div className="select-wrap"><select name={name} aria-label={label} defaultValue=""><option value="">{label}</option></select><img src={asset('arrow.svg')} alt="" width="18" height="6"/></div>;}
function CustomerForm({items,total}) {
 function submit(e){e.preventDefault();e.currentTarget.dispatchEvent(new CustomEvent('caviar:checkout',{bubbles:true,detail:{items,total,customer:Object.fromEntries(new FormData(e.currentTarget))}}));}
 return <section className="customer-section"><h1 className="section-heading trimmed">Ваши данные</h1><form onSubmit={submit}><div className="form-fields">
 <input className="name-field" name="fullName" autoComplete="name" aria-label="Имя и фамилия" placeholder="Имя и фамилия" required/>
 <input className="phone-field" name="phone" type="tel" autoComplete="tel" aria-label="Номер телефона" placeholder="Номер телефона" required/>
 <div className="country-field"><Select label="Страна" name="country"/></div>
 <input className="address-field" name="address" autoComplete="street-address" aria-label="Адрес доставки" placeholder="Адрес доставки" required/>
 <div className="payment-field"><Select label="Способ оплаты" name="payment"/></div>
 <textarea className="comment-field" name="comment" aria-label="Комментарий" placeholder="Комментарий"/>
 </div><label className="consent"><input type="checkbox" name="consent" required/><span className="trimmed">Согласие на обработку персональных данных</span></label><button className="button form-submit" type="submit">Оформить заказ</button></form></section>;
}
export default function App(){
 const [items,setItems]=useState(initialItems);
 const [screen,setScreen]=useState(()=>window.location.hash==='#order'?'order':'cart');
 useEffect(()=>{const sync=()=>{setScreen(window.location.hash==='#order'?'order':'cart');window.scrollTo(0,0);};window.addEventListener('hashchange',sync);return()=>window.removeEventListener('hashchange',sync);},[]);
 const total=items.reduce((sum,item)=>sum+item.price*item.quantity,0);
 const update=(id,field,value)=>setItems(current=>current.map(item=>item.id===id?{...item,[field]:value}:item));
 return <div className="page"><header><img className="header-image" src={asset('header-new.png')} alt="Caviar. Бренд, смартфоны, очки, часы, аксессуары, коллекции." width="1920" height="68"/></header><main>{screen==='order'?<CustomerForm items={items} total={total}/>:<section className="cart-section"><h1 className="section-heading trimmed">Корзина</h1><div className="cart-layout"><div className="cart-items">{items.map((item,index)=><React.Fragment key={item.id}><CartItem item={item} onChange={update}/>{index<3&&<div className="product-divider"><img src={asset('line'+(index+1)+'-new.svg')} alt=""/></div>}</React.Fragment>)}</div><aside className="summary"><p className="total-label trimmed">Итоговая сумма</p><p className="total-value trimmed" aria-live="polite">{money(total)} ₽</p><a className="button" href="#order">Оформить заказ</a>{['Гарантия качества','Бесплатная доставка','Оригинальная продукция'].map(label=><div className="benefit" key={label}><img src={asset('crown-new.svg')} alt="" width="39" height="24"/><span className="trimmed">{label}</span></div>)}</aside></div></section>}</main><footer><img className="footer-image" src={asset('footer-new.png')} alt="Пресса о Caviar. Контакты и каталог Caviar." width="1920" height="873"/></footer></div>;
}
