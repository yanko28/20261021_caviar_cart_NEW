import React, { useRef, useState } from 'react';

const asset = (name) => `${import.meta.env.BASE_URL}assets/${name}`;
const initialItems = [
  { id: 'wolf', title: 'Зов Волка', price: 659000, quantity: 1, model: 'iPhone 18 Pro', storage: '256 Gb' },
  { id: 'president', title: 'Говорит Президент России', price: 659000, quantity: 2, model: 'iPhone 18 Pro', storage: '256 Gb' },
  { id: 'brunello', title: 'Brunello', price: 29900, quantity: 1 },
  { id: 'odyssey', title: 'Одиссея Ag', price: 499000, quantity: 1, size: 'M — 129 мм между дужками', hideCurrency: true },
];
const benefits = [
  { id: 'guarantee', title: 'Гарантия качества', text: 'Caviar работает только с оригинальными iPhone и только с качественными, редкими, драгоценными или особо прочными материалами. Гарантия на продукцию Caviar — 1 год.' },
  { id: 'delivery', title: 'Бесплатная доставка', text: 'Собственная курьерская служба бесплатно доставляет Caviar по Москве. Доставку по РФ осуществляет СПСР - так же бесплатно для Вас' },
  { id: 'original', title: 'Оригинальная продукция', text: 'Вся продукция на Caviar - оригинальная и закуплена у официальных поставщиков.\nВсе iPhone можно проверить по IMEI.' },
];
const money = (value) => new Intl.NumberFormat('ru-RU').format(value);
function productWord(count) {
  const mod100 = count % 100;
  const mod10 = count % 10;
  if (mod100 >= 11 && mod100 <= 14) return 'товаров';
  return mod10 === 1 ? 'товар' : mod10 >= 2 && mod10 <= 4 ? 'товара' : 'товаров';
}

function Select({ label, name, children, defaultValue = '' }) {
  return <div className="select-wrap">
    <select aria-label={label} name={name} defaultValue={defaultValue}>{children}</select>
    <img className="select-arrow" src={asset('arrow.svg')} alt="" />
  </div>;
}

function CartItem({ item, onQuantity, onRemove }) {
  return <article className="cart-item" aria-label={item.title}>
    <img className="product-image" src={asset(`${item.id}.png`)} alt={item.title} width="193.257" height="194" />
    <div className="product-details">
      <h2 className="product-title trimmed">{item.title}</h2>
      {item.model && <Select label={`Модель: ${item.title}`} defaultValue={item.model}><option>{item.model}</option></Select>}
      {item.storage && <Select label={`Память: ${item.title}`} defaultValue={item.storage}><option>{item.storage}</option></Select>}
      {item.size && <Select label={`Размер: ${item.title}`} defaultValue={item.size}><option>{item.size}</option></Select>}
      <label className="quantity-label">
        <span className="small-label trimmed">Количество</span>
        <input className="quantity-input" aria-label={`Количество: ${item.title}`} type="number" min="1" max="99" step="1" value={item.quantity}
          onChange={(event) => { const value = event.target.value; if (value === '') onQuantity(item.id, ''); else onQuantity(item.id, Math.min(99, Math.max(1, Math.trunc(Number(value))))); }}
          onBlur={() => { if (item.quantity === '') onQuantity(item.id, 1); }} />
      </label>
    </div>
    <div className="product-price">
      <span className="small-label trimmed">Стоимость</span>
      <span className="price-value trimmed">{money(item.price)}{item.hideCurrency ? '' : ' ₽'}</span>
    </div>
    <button className="remove-button" type="button" aria-label={`Удалить ${item.title}`} onClick={() => onRemove(item.id)}>
      <img src={asset('close.svg')} alt="" width="12" height="12" />
    </button>
  </article>;
}

function Divider() {
  return <div className="divider" aria-hidden="true"><img src={asset('divider.svg')} alt="" /></div>;
}

function Summary({ items, total, onCheckout }) {
  return <aside className="summary" aria-labelledby="summary-heading">
    <h2 id="summary-heading" className="section-heading trimmed">Ваш заказ</h2>
    <div className="order-line"><span className="trimmed">{items.length} {productWord(items.length)}</span><span className="trimmed">{money(total)} ₽</span></div>
    <Divider />
    <p className="total-label trimmed">Итоговая сумма</p>
    <p className="total-value trimmed" aria-live="polite">{money(total)} ₽</p>
    <button className="button" type="button" onClick={onCheckout}>Оформить заказ</button>
    <Divider />
    {benefits.map((benefit) => <section className="benefit" key={benefit.id}>
      <img src={asset(`${benefit.id}.png`)} alt="" width="45" height="48" />
      <div className="benefit-copy"><h3 className="section-heading trimmed">{benefit.title}</h3><p className="body-copy trimmed">{benefit.text}</p></div>
    </section>)}
  </aside>;
}

function CustomerForm({ formRef, items, total }) {
  function handleSubmit(event) {
    event.preventDefault();
    // Frontend-only hand-off: no order is created and no personal data is sent or stored.
    if (!items.length) return;
    event.currentTarget.dispatchEvent(new CustomEvent('caviar:checkout', {
      bubbles: true, detail: { items, total, customer: Object.fromEntries(new FormData(event.currentTarget)) },
    }));
  }
  return <section className="customer-section" aria-labelledby="customer-heading">
    <h2 className="section-heading trimmed" id="customer-heading">Ваши данные</h2>
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="form-fields">
        <input className="name-field" name="fullName" autoComplete="name" aria-label="Имя и фамилия" placeholder="Имя и фамилия" required />
        <input className="phone-field" name="phone" type="tel" autoComplete="tel" aria-label="Номер телефона" placeholder="Номер телефона" required />
        <div className="country-field"><Select label="Страна" name="country"><option value="">Страна</option></Select></div>
        <input className="address-field" name="address" autoComplete="street-address" aria-label="Адрес доставки" placeholder="Адрес доставки" required />
        <div className="payment-field"><Select label="Способ оплаты" name="payment"><option value="">Способ оплаты</option></Select></div>
        <textarea className="comment-field" name="comment" aria-label="Комментарий" placeholder="Комментарий" />
      </div>
      <label className="consent"><input type="checkbox" name="consent" required /><span className="body-copy trimmed">Согласие на обработку персональных данных</span></label>
      <div className="form-actions">
        <button className="button" type="submit">Оформить заказ</button>
        <a className="button button-outline" href="mailto:caviar@caviar-phones.ru">связаться с менеджером</a>
      </div>
    </form>
  </section>;
}

export default function App() {
  const [items, setItems] = useState(initialItems);
  const formRef = useRef(null);
  const total = items.reduce((sum, item) => sum + item.price * (Number(item.quantity) || 1), 0);
  function goToCheckout() {
    formRef.current.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
    formRef.current.elements.fullName.focus({ preventScroll: true });
  }
  return <div className="page">
    <header className="image-header"><img src={asset('header.png')} alt="Caviar. Оформление заказа" width="1440" height="132" /></header>
    <main>
      <section className="cart-section" aria-labelledby="cart-heading">
        <h1 id="cart-heading" className="section-heading trimmed">Корзина</h1>
        <div className="cart-layout">
          <div className="cart-items">{items.map((item) => <CartItem key={item.id} item={item}
            onQuantity={(id, quantity) => setItems((current) => current.map((product) => product.id === id ? { ...product, quantity } : product))}
            onRemove={(id) => setItems((current) => current.filter((product) => product.id !== id))} />)}</div>
          <Summary items={items} total={total} onCheckout={goToCheckout} />
        </div>
      </section>
      <CustomerForm formRef={formRef} items={items} total={total} />
    </main>
    <footer className="image-footer"><img src={asset('footer.png')} alt="Пресса о Caviar. Контакты и каталог Caviar." width="1440" height="655" /></footer>
  </div>;
}
