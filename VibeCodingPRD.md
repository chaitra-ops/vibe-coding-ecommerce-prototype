**Product Requirements Document: Fruit Shop Web App**

**Overview**
- **Product name:** Fruit Shop (working name)
- **Platform:** Web (HTML, CSS, JavaScript)
- **Purpose:** A lightweight shopping web application for browsing and buying fruit products. The app demonstrates core e-commerce flows: product listing, product details, shopping cart, and checkout.

**Goals**
- Provide a clear, responsive UI for discovering fruit products.
- Enable users to add, remove, and update quantities in a cart.
- Keep implementation purely front-end (HTML/CSS/JS) with cart persisted in `localStorage`.
- Use simple, realistic sample fruit products for demo and testing.

**Scope**
- In-scope: Product Listing, Product Details, Shopping Cart, Checkout pages; client-side cart management; sample product data and sample checkout flow (no real payments).
- Out-of-scope: Payment gateway integration, user accounts/authentication, inventory sync, backend APIs for persistence (optional later).

**Target Users & Personas**
- Emily — casual buyer exploring produce quickly on mobile.
- Raj — price-conscious shopper comparing fruit and updating quantities.
- Mei — repeat visitor who wants a fast checkout and persistent cart.

**User Stories**
- As a shopper, I want to view available fruit so I can choose what to buy.
- As a shopper, I want to view product details so I can check price, description, and images.
- As a shopper, I want to add items to my cart from listing or details pages.
- As a shopper, I want to update quantities and remove items in my cart.
- As a shopper, I want to complete checkout by providing shipping details (no real payment) and receive confirmation.

**Acceptance Criteria**
- Users can load the Product Listing and see a grid/list of fruit with name, price, short description, and "Add to cart" controls.
- Product Details page shows full description, larger image, price, and an "Add to cart" control.
- Adding items to cart increases the cart item count and persists across page reloads.
- Cart page shows each item with quantity, unit price, subtotal, ability to change quantity, and remove item; totals update immediately.
- Checkout collects name, email, address, and displays order summary; submitting checkout clears cart and shows confirmation.

**Pages & Requirements**

- **Product Listing**
	- Purpose: Discover available fruit and add items to the cart quickly.
	- Layout: Responsive grid of product cards (image, name, price, short description, "Add to cart" button, quantity selector optional).
	- Components: Header (logo, search, cart icon with count), product card, pagination or lazy load (optional), footer.
	- Interactions: Clicking product card or "View" opens Product Details. Clicking "Add to cart" adds item (default qty 1) and animates cart count.

- **Product Details**
	- Purpose: Show detailed information to support purchase decision.
	- Layout: Large product image, name, price, weight/unit, description, quantity selector, "Add to cart" button, "Back to listing" link.
	- Components: Breadcrumbs/back link, image carousel or single image, details block, related products carousel (optional).
	- Interactions: Quantity selector updates add-to-cart amount; add-to-cart confirms with microcopy and updates cart count.

- **Shopping Cart**
	- Purpose: Review chosen items, edit quantities, remove items, and view totals.
	- Layout: Table or stacked list of cart items (image, name, price, quantity input, subtotal), cart totals (subtotal, tax placeholder, shipping placeholder, total), CTA buttons: "Continue Shopping" and "Proceed to Checkout".
	- Components: Editable quantity (number input with +/-), remove button, cart totals section, promo code field (optional demo), clear cart button.
	- Interactions: Changing quantity updates line subtotal and totals instantly; removing item removes it from list and updates totals; cart state persists in `localStorage`.

- **Checkout**
	- Purpose: Collect shipping info and confirm order (demo mode).
	- Layout: Two-column responsive layout on desktop: left = form (name, email, address, city, state, zip, country), right = order summary and totals. On mobile, stacked layout.
	- Components: Form validation, order summary, confirmation modal or page, back-to-cart link.
	- Interactions: Validates required fields; submitting creates an order confirmation page showing a unique order reference (client-generated) and clears cart.

**Core Features & Interaction Flows**

- View products
	- Source: Sample in-memory JSON file or embedded array in JS.
	- Sort/filter: Simple sort by price/name, filter by category (citrus, berries, tropical) optional.

- Add to cart
	- From listing: click "Add" adds default quantity 1 (or chosen qty) to cart.
	- From details: add chosen quantity.
	- Feedback: brief toast or microcopy + update cart icon count; store cart in `localStorage`.

- Remove from cart
	- Click remove button on cart item; show optional undo toast for 5 seconds.

- Update quantity
	- Increment/decrement controls or numeric input in cart and on product details.
	- Minimum quantity = 1; maximum = 99 (configurable).

**Data Model**

- Product object (sample):

	{
		"id": "apple-gala",
		"name": "Gala Apple",
		"price": 1.29,
		"unit": "each",
		"weight": "~150g",
		"category": "pome",
		"image": "images/gala-apple.jpg",
		"shortDescription": "Sweet, crisp Gala apples.",
		"description": "Gala apples are crisp and aromatic — great for snacks and salads."
	}

- Cart item:
	- productId
	- name
	- price
	- quantity
	- unit
	- image

**Sample Product Catalog**
- Eight sample fruits (JSON included in Appendix):
	1. Gala Apple — $1.29 each
	2. Banana — $0.39 each
	3. Navel Orange — $0.79 each
	4. Strawberries (pint) — $3.99 per pint
	5. Blueberries (pint) — $4.49 per pint
	6. Pineapple — $2.99 each
	7. Kiwi — $0.79 each
	8. Mango — $1.49 each

**Persistence & Architecture**
- Implementation: Static HTML pages (or SPA), modular CSS (or SCSS), vanilla JS (ES6 modules) managing state client-side.
- Cart persistence: `localStorage` key `fruitshop_cart` storing cart JSON. On page load, initialize cart from storage.
- Optional enhancement: small JSON file or mocked REST endpoint (static JSON served) for product catalogue.

**Non-Functional Requirements**
- **Performance:** First meaningful paint < 1s on 3G simulated mobile for initial list with 8 products. Keep bundle small — use minimal JS.
- **Responsiveness:** App functions on mobile, tablet, and desktop. Breakpoints: mobile (< 640px), tablet (640–1024px), desktop (>1024px).
- **Accessibility:** Meet WCAG 2.1 AA basics: semantic HTML, keyboard operable, images with alt text, proper label association for form fields, focus states visible, color contrast >= 4.5:1 for body text.
- **Security & Privacy:** No sensitive data stored. Checkout will collect only name, email, and shipping address — store temporarily and clear after order confirmation. Do not store payment data.

**Analytics & Metrics**
- Track (demo) events: product_view, add_to_cart, remove_from_cart, update_quantity, checkout_submitted.
- Success metrics: Add-to-cart rate, cart abandonment rate, average order size (items), page load times.

**Testing & QA**
- Unit/manual tests:
	- Load product listing and verify all sample items render.
	- Add item from listing and details; verify cart count and localStorage updated.
	- Increase quantity in cart and confirm totals update.
	- Remove item and confirm localStorage change and UI update.
	- Proceed to checkout with valid data and verify cart cleared and confirmation shown.
	- Test keyboard navigation and screen reader friendly labels.

**Edge Cases & Error Handling**
- Adding the same product twice increments quantity instead of duplicating line items.
- Quantity set to zero => prompt to confirm removal or reset to 1.
- localStorage full/unavailable => fallback to in-memory cart for session only and show warning.

**Milestones & Deliverables**
- M1 (Day 1): Create product listing and sample data, header/footer, and cart icon update.
- M2 (Day 2): Implement product details and add-to-cart flows.
- M3 (Day 3): Implement cart page with update/remove actions and persistence.
- M4 (Day 4): Implement checkout flow, validation, and confirmation screen.
- M5 (Day 5): Accessibility pass, responsiveness tweaks, polish, and documentation.

**Acceptance Test Matrix (sample)**
- View products: load listing -> products visible (PASS/FAIL)
- Add to cart from listing: click add -> cart count increments and localStorage updated
- Add to cart from details: quantity respected and cart updates
- Update quantity in cart: subtotal and total update immediately
- Remove item: item removed and totals updated
- Checkout: with valid form, cart cleared and confirmation shown

**Deliverable Files & Structure (suggested)**
- `index.html` — Product Listing
- `product.html` — Product Details (or SPA route)
- `cart.html` — Shopping Cart
- `checkout.html` — Checkout
- `styles/` — CSS files
- `scripts/` — JS modules: `products.js`, `cart.js`, `ui.js`
- `data/products.json` — sample product data

**Appendix: Sample Products JSON**

[
	{"id":"gala-apple","name":"Gala Apple","price":1.29,"unit":"each","category":"pome","image":"images/gala-apple.jpg","shortDescription":"Sweet, crisp Gala apples.","description":"Gala apples are crisp and aromatic — great for snacks and salads."},
	{"id":"banana","name":"Banana","price":0.39,"unit":"each","category":"tropical","image":"images/banana.jpg","shortDescription":"Ripe bananas, perfect for smoothies.","description":"Sweet bananas ideal for snacks, baking, and smoothies."},
	{"id":"navel-orange","name":"Navel Orange","price":0.79,"unit":"each","category":"citrus","image":"images/navel-orange.jpg","shortDescription":"Juicy navel oranges.","description":"Seedless navel oranges, sweet and great for juicing."},
	{"id":"strawberries","name":"Strawberries (pint)","price":3.99,"unit":"pint","category":"berries","image":"images/strawberries.jpg","shortDescription":"Fresh strawberries.","description":"Bright red strawberries, sweet and juicy."},
	{"id":"blueberries","name":"Blueberries (pint)","price":4.49,"unit":"pint","category":"berries","image":"images/blueberries.jpg","shortDescription":"Organic blueberries.","description":"Plump blueberries — great for cereals and baking."},
	{"id":"pineapple","name":"Pineapple","price":2.99,"unit":"each","category":"tropical","image":"images/pineapple.jpg","shortDescription":"Tropical pineapple.","description":"Sweet, ripe pineapple — perfect for grilling and desserts."},
	{"id":"kiwi","name":"Kiwi","price":0.79,"unit":"each","category":"tropical","image":"images/kiwi.jpg","shortDescription":"Tangy kiwi fruits.","description":"Vitamin-rich kiwi with bright green flesh."},
	{"id":"mango","name":"Mango","price":1.49,"unit":"each","category":"tropical","image":"images/mango.jpg","shortDescription":"Juicy mango.","description":"Sweet mangoes, great for salsas and smoothies."}
]

**Next Steps / Handoff**
- Implement the front-end file structure listed above and use the sample JSON as the data source. Use `localStorage` key `fruitshop_cart` for persistence. Provide tiny UI states for add/remove/update and a simple confirmation page for checkout.

-- End of PRD --

