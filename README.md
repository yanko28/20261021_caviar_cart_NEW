# Caviar cart

React + Vite implementation of the Figma frames `20261022_cart_NEW` and `cart_NEW_order_form`.

## Start
Requires Node.js 22.12 or newer.

```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

The GitHub Pages workflow builds and publishes every push to main.

- Cart: https://yanko28.github.io/20261021_caviar_cart_NEW/
- Order form: https://yanko28.github.io/20261021_caviar_cart_NEW/#order

Device, storage and size options work as radio groups. Quantity buttons update the order total. Browser Back returns from the form to the cart with the selected values intact. Prices are demonstration unit prices from Figma; a pricing matrix for alternative configurations has not been supplied.

All images, SVGs and Nunito Sans fonts are local. Product image layers, header and footer were exported from Figma. Header/footer are raster layers in the original design.

There is no backend or CMS. Form submission performs native field validation and emits a local `caviar:checkout` CustomEvent with the items, total and form values. It does not send or save personal information. Country and payment lists contain the placeholders provided by the design.

The four initial quantities follow the new design (one of each). The actual initial total is 1,846,900 RUB; the static Figma total of 2,505,900 RUB is inconsistent with those quantities.

Nunito Sans is provided under the SIL Open Font License in `public/assets/fonts/OFL.txt`.
