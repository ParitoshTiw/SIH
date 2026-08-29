const state = { products: [], cart: [], category: "All", language: "en", trend: null, map: null, markers: [], routeLayer: null };

const locales = {
  en: {
    navMarket: "Marketplace", navPrices: "Price intelligence", navLogistics: "Logistics", navImpact: "Impact", eyebrow: "DIRECT FARM NETWORK",
    heroTitle: "Good food travels fairly.", heroLede: "Buy directly from verified farmers and FPOs. Better earnings at the farm; fresher food at your door.",
    exploreProduce: "Explore produce →", listHarvest: "List your harvest ↗", farmersTogether: "farmers growing with us", lessFoodMiles: "fewer food miles", farmerEarns: "farmer earns",
    trustVerified: "Verified at source", trustVerifiedDesc: "Know who grows your food", trustPrices: "Transparent prices", trustPricesDesc: "See exactly where your money goes", trustDelivery: "Smarter delivery", trustDeliveryDesc: "Grouped routes, lower emissions",
    todaysHarvest: "TODAY'S HARVEST", pickedForYou: "Picked for you, not warehouses.", viewAll: "View all produce →", all: "All", vegetables: "Vegetables", fruits: "Fruits", grains: "Grains", pulses: "Pulses", searchProduce: "Search produce, farmer…",
    priceIntelligence: "PRICE INTELLIGENCE", knowBeforeYouBuy: "Know the price before you buy.", priceNote: "Live market context and direct-price savings, made easy to understand.", marketSignal: "MARKET SIGNAL", consumerPrice: "CONSUMER PRICE TRACKER", directVsRetail: "Direct vs retail price", directFarm: "Direct farm price", retailPrice: "Typical retail price", yourSaving: "Your potential saving today",
    smartLogistics: "SMART LOGISTICS", oneRouteMoreGood: "One route. More good.", logisticsNote: "Our delivery engine groups nearby orders and lets drivers choose the fastest OSM-based route.", routeLive: "Route planning live", todaysCluster: "TODAY'S CLUSTER", optimised: "Optimised", routeDistance: "ROUTE DISTANCE", arrivalTime: "ARRIVAL TIME", co2Saved: "CO₂ SAVED", optimiseRoute: "Optimise delivery route", routeHelper: "Groups 38 orders into one fresh delivery run.",
    sharedValue: "SHARED VALUE", fairerSystem: "A fairer food system starts with a shorter chain.", impactText: "KrishiSetu replaces opaque layers with clear prices, coordinated logistics, and decisions powered by agricultural market signals.", paidToFarmers: "paid directly to farmers", consumerSavings: "average consumer savings", co2Avoided: "CO₂ avoided by route clusters", footerText: "Built for a more connected Indian food economy."
  },
  hi: {
    navMarket: "बाज़ार", navPrices: "मूल्य जानकारी", navLogistics: "लॉजिस्टिक्स", navImpact: "प्रभाव", eyebrow: "सीधे खेत से नेटवर्क",
    heroTitle: "अच्छा भोजन, न्यायपूर्ण सफ़र।", heroLede: "सत्यापित किसानों और FPO से सीधे खरीदें। किसान को बेहतर आय, आपके घर तक ताज़ा भोजन।",
    exploreProduce: "उपज देखें →", listHarvest: "अपनी फसल सूचीबद्ध करें ↗", farmersTogether: "किसान हमारे साथ", lessFoodMiles: "कम खाद्य दूरी", farmerEarns: "किसान की अधिक कमाई",
    trustVerified: "स्रोत पर सत्यापित", trustVerifiedDesc: "जानें आपका भोजन कौन उगाता है", trustPrices: "पारदर्शी कीमतें", trustPricesDesc: "जानें आपका पैसा कहाँ जाता है", trustDelivery: "स्मार्ट डिलीवरी", trustDeliveryDesc: "समूह रूट, कम उत्सर्जन",
    todaysHarvest: "आज की ताज़ा उपज", pickedForYou: "आपके लिए चुना गया, गोदामों के लिए नहीं।", viewAll: "सारी उपज देखें →", all: "सभी", vegetables: "सब्ज़ियाँ", fruits: "फल", grains: "अनाज", pulses: "दालें", searchProduce: "उपज या किसान खोजें…",
    priceIntelligence: "मूल्य जानकारी", knowBeforeYouBuy: "खरीदने से पहले कीमत जानें।", priceNote: "लाइव बाज़ार संदर्भ और सीधी खरीद की बचत, आसानी से समझें।", marketSignal: "बाज़ार संकेत", consumerPrice: "उपभोक्ता मूल्य ट्रैकर", directVsRetail: "सीधा और खुदरा मूल्य", directFarm: "सीधा किसान मूल्य", retailPrice: "सामान्य खुदरा मूल्य", yourSaving: "आज आपकी संभावित बचत",
    smartLogistics: "स्मार्ट लॉजिस्टिक्स", oneRouteMoreGood: "एक रूट। ज़्यादा भलाई।", logisticsNote: "हमारा डिलीवरी इंजन पास के ऑर्डर को जोड़ता है और तेज़ OSM रूट चुनता है।", routeLive: "रूट प्लानिंग लाइव", todaysCluster: "आज का क्लस्टर", optimised: "अनुकूलित", routeDistance: "रूट दूरी", arrivalTime: "आने का समय", co2Saved: "CO₂ बचत", optimiseRoute: "डिलीवरी रूट अनुकूलित करें", routeHelper: "38 ऑर्डर को एक ताज़ा डिलीवरी रन में जोड़ता है।",
    sharedValue: "साझा मूल्य", fairerSystem: "न्यायपूर्ण खाद्य व्यवस्था, छोटी श्रृंखला से शुरू होती है।", impactText: "कृषिसेतु स्पष्ट कीमतों, समन्वित लॉजिस्टिक्स और कृषि बाज़ार संकेतों से फैसलों के साथ अपारदर्शी परतों को हटाता है।", paidToFarmers: "सीधे किसानों को भुगतान", consumerSavings: "औसत उपभोक्ता बचत", co2Avoided: "रूट क्लस्टर से CO₂ बचत", footerText: "अधिक जुड़ी भारतीय खाद्य अर्थव्यवस्था के लिए बनाया गया।"
  },
  mr: {
    navMarket: "बाजार", navPrices: "किंमत माहिती", navLogistics: "लॉजिस्टिक्स", navImpact: "परिणाम", eyebrow: "थेट शेतकरी नेटवर्क",
    heroTitle: "चांगले अन्न, योग्य प्रवास.", heroLede: "सत्यापित शेतकरी व FPO कडून थेट खरेदी करा. शेतकऱ्याला चांगला दर; घरापर्यंत ताजे अन्न.",
    exploreProduce: "उत्पादन पहा →", listHarvest: "पीक सूचीबद्ध करा ↗", farmersTogether: "शेतकरी आमच्यासोबत", lessFoodMiles: "कमी अन्न अंतर", farmerEarns: "शेतकऱ्याची कमाई",
    trustVerified: "स्रोतावर सत्यापित", trustVerifiedDesc: "तुमचे अन्न कोण पिकवते ते जाणून घ्या", trustPrices: "पारदर्शक दर", trustPricesDesc: "तुमचे पैसे कुठे जातात ते पहा", trustDelivery: "स्मार्ट वितरण", trustDeliveryDesc: "एकत्रित मार्ग, कमी उत्सर्जन",
    todaysHarvest: "आजचा ताजा माल", pickedForYou: "तुमच्यासाठी निवडलेले, गोदामांसाठी नाही.", viewAll: "सर्व उत्पादन पहा →", all: "सर्व", vegetables: "भाज्या", fruits: "फळे", grains: "धान्य", pulses: "डाळी", searchProduce: "उत्पादन किंवा शेतकरी शोधा…",
    priceIntelligence: "किंमत माहिती", knowBeforeYouBuy: "खरेदीपूर्वी किंमत जाणून घ्या.", priceNote: "थेट खरेदीची बचत आणि बाजार संदर्भ सहज समजून घ्या.", marketSignal: "बाजार संकेत", consumerPrice: "ग्राहक किंमत ट्रॅकर", directVsRetail: "थेट व किरकोळ दर", directFarm: "थेट शेतकरी दर", retailPrice: "सामान्य किरकोळ दर", yourSaving: "आजची संभाव्य बचत",
    smartLogistics: "स्मार्ट लॉजिस्टिक्स", oneRouteMoreGood: "एक मार्ग. अधिक चांगले.", logisticsNote: "आमचे इंजिन जवळच्या ऑर्डरचे गट करते आणि सर्वात जलद OSM मार्ग निवडते.", routeLive: "मार्ग नियोजन सुरू", todaysCluster: "आजचा क्लस्टर", optimised: "अनुकूलित", routeDistance: "मार्ग अंतर", arrivalTime: "पोहोचण्याची वेळ", co2Saved: "CO₂ बचत", optimiseRoute: "वितरण मार्ग अनुकूलित करा", routeHelper: "38 ऑर्डर एका ताज्या वितरण फेरीत एकत्र करतो.",
    sharedValue: "सामायिक मूल्य", fairerSystem: "न्याय्य अन्न व्यवस्था लहान साखळीने सुरू होते.", impactText: "कृषिसेतू स्पष्ट दर, समन्वित लॉजिस्टिक्स आणि कृषी बाजार संकेतांनी अपारदर्शक थर काढून टाकते.", paidToFarmers: "थेट शेतकऱ्यांना अदा", consumerSavings: "सरासरी ग्राहक बचत", co2Avoided: "मार्ग क्लस्टरने वाचवलेले CO₂", footerText: "अधिक जोडलेल्या भारतीय अन्न अर्थव्यवस्थेसाठी तयार केलेले."
  }
};

const cropHindi = { "Farm-fresh Tomatoes": "ताज़े टमाटर", "Crisp Green Capsicum": "हरी शिमला मिर्च", "Sharbati Wheat": "शरबती गेहूं", "Purple Brinjal": "बैंगनी बैंगन", "Sweet Bananas": "मीठे केले", "Desi Toor Dal": "देसी तूर दाल" };
const cropMarathi = { "Farm-fresh Tomatoes": "ताजे टोमॅटो", "Crisp Green Capsicum": "हिरवी ढोबळी मिरची", "Sharbati Wheat": "शरबती गहू", "Purple Brinjal": "जांभळे वांगे", "Sweet Bananas": "गोड केळी", "Desi Toor Dal": "देशी तूर डाळ" };

const $ = (selector) => document.querySelector(selector);
const escapeHTML = (value = "") => String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
const formatMoney = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value));

async function api(path, options = {}) {
  const response = await fetch(path, { headers: { "Content-Type": "application/json", ...(options.headers || {}) }, ...options });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 3200);
}

function productTitle(product) {
  if (state.language === "hi") return product.hindi_title || cropHindi[product.title] || product.title;
  if (state.language === "mr") return cropMarathi[product.title] || product.title;
  return product.title;
}

function productImage(product) { return product.image_data || product.image_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=85"; }

function renderProducts() {
  const grid = $("#productsGrid");
  if (!state.products.length) { grid.innerHTML = '<div class="loading-card">No fresh listings match this search yet.</div>'; return; }
  grid.innerHTML = state.products.map((product) => {
    const saving = Math.max(0, Math.round((1 - Number(product.price) / Number(product.market_price)) * 100));
    return `<article class="product-card">
      <div class="product-image"><img src="${escapeHTML(productImage(product))}" alt="${escapeHTML(productTitle(product))}" />${product.is_verified ? '<span class="verified-tag">✓ VERIFIED FARM</span>' : '<span class="verified-tag">NEW LISTING</span>'}${product.is_organic ? '<span class="organic-tag">ORGANIC</span>' : ''}</div>
      <div class="product-body"><div class="product-source"><span class="farmer-avatar">${escapeHTML(product.farmer_initials)}</span><span>${escapeHTML(product.farmer_name)} · ${escapeHTML(product.farm_location)}</span></div>
      <h3 class="product-title">${escapeHTML(productTitle(product))}</h3><p class="harvest-detail">Harvested ${escapeHTML(product.harvest_date)} · ${escapeHTML(product.inventory)} ${escapeHTML(product.unit)} available</p>
      <div class="price-row"><p><b>${formatMoney(product.price)}</b> <small>/ ${escapeHTML(product.unit)}</small></p><small class="savings">${saving}% less</small><button class="add-cart" aria-label="Add ${escapeHTML(product.title)} to basket" data-add-id="${product.id}">+</button></div></div>
    </article>`;
  }).join("");
  grid.querySelectorAll("[data-add-id]").forEach((button) => button.addEventListener("click", () => addToCart(Number(button.dataset.addId))));
}

async function loadProducts() {
  const search = $("#productSearch").value.trim();
  const result = await api(`/api/products?category=${encodeURIComponent(state.category)}&q=${encodeURIComponent(search)}`);
  state.products = result.products;
  renderProducts();
}

function addToCart(productId) {
  const product = state.products.find((item) => item.id === productId);
  if (!product) return;
  const existing = state.cart.find((item) => item.id === productId);
  if (existing) existing.quantity += 1;
  else state.cart.push({ ...product, quantity: 1 });
  renderCart();
  showToast(`${productTitle(product)} added to your basket.`);
}

function renderCart() {
  const itemContainer = $("#cartItems");
  const total = state.cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  $("#cartCount").textContent = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  $("#cartTotal").textContent = formatMoney(total);
  if (!state.cart.length) { itemContainer.innerHTML = '<p class="empty-cart">Your basket is waiting for good food.</p>'; return; }
  itemContainer.innerHTML = state.cart.map((item) => `<div class="cart-line"><img src="${escapeHTML(productImage(item))}" alt="" /><div><b>${escapeHTML(productTitle(item))}</b><small>${item.quantity} × ${formatMoney(item.price)} / ${escapeHTML(item.unit)}</small></div><b>${formatMoney(item.price * item.quantity)}</b><button type="button" data-remove-id="${item.id}" aria-label="Remove item">×</button></div>`).join("");
  itemContainer.querySelectorAll("[data-remove-id]").forEach((button) => button.addEventListener("click", () => { state.cart = state.cart.filter((item) => item.id !== Number(button.dataset.removeId)); renderCart(); }));
}

function setLanguage(nextLanguage) {
  state.language = nextLanguage;
  document.documentElement.lang = nextLanguage;
  $("#languageLabel").textContent = nextLanguage.toUpperCase();
  const dictionary = locales[nextLanguage];
  document.querySelectorAll("[data-i18n]").forEach((element) => { const text = dictionary[element.dataset.i18n]; if (text) element.textContent = text; });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => { const text = dictionary[element.dataset.i18nPlaceholder]; if (text) element.placeholder = text; });
  renderProducts();
  if (state.trend) renderTrend(state.trend);
}

function makeLine(values, x, y) { return values.map((value, index) => `${index ? "L" : "M"}${x(index).toFixed(1)},${y(value).toFixed(1)}`).join(" "); }

function renderTrend(data) {
  state.trend = data;
  const chart = $("#priceChart");
  const points = data.points || [];
  if (!points.length) { chart.innerHTML = ""; return; }
  const width = 640, height = 250, left = 36, right = 10, top = 14, bottom = 31;
  const allPrices = points.flatMap((point) => [Number(point.farm_price), Number(point.retail_price)]);
  const minimum = Math.floor((Math.min(...allPrices) - 5) / 5) * 5;
  const maximum = Math.ceil((Math.max(...allPrices) + 5) / 5) * 5;
  const x = (index) => left + (index / Math.max(1, points.length - 1)) * (width - left - right);
  const y = (value) => top + (1 - (value - minimum) / Math.max(1, maximum - minimum)) * (height - top - bottom);
  const farm = points.map((point) => Number(point.farm_price));
  const retail = points.map((point) => Number(point.retail_price));
  const grid = [0, .5, 1].map((ratio) => { const value = maximum - (maximum - minimum) * ratio; const pointY = y(value); return `<line class="chart-axis" x1="${left}" x2="${width - right}" y1="${pointY}" y2="${pointY}"/><text class="chart-label" x="2" y="${pointY + 3}">₹${Math.round(value)}</text>`; }).join("");
  const labels = points.map((point, index) => `<text class="chart-label" text-anchor="middle" x="${x(index)}" y="${height - 8}">${new Date(`${point.record_date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</text>`).join("");
  const farmLine = makeLine(farm, x, y), retailLine = makeLine(retail, x, y);
  const area = `${farmLine} L${x(farm.length - 1)},${height - bottom} L${x(0)},${height - bottom} Z`;
  const dots = points.map((_, index) => `<circle class="chart-dot-direct" cx="${x(index)}" cy="${y(farm[index])}" r="3.5"/><circle class="chart-dot-retail" cx="${x(index)}" cy="${y(retail[index])}" r="3.5"/>`).join("");
  chart.innerHTML = `<defs><linearGradient id="directGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d7652" stop-opacity=".18"/><stop offset="1" stop-color="#0d7652" stop-opacity="0"/></linearGradient></defs>${grid}<path class="direct-area" d="${area}"/><path class="retail-line" d="${retailLine}"/><path class="direct-line" d="${farmLine}"/>${dots}${labels}`;
  const finalFarm = farm.at(-1), finalRetail = retail.at(-1);
  $("#savingsValue").textContent = `${Math.round((1 - finalFarm / finalRetail) * 100)}% less`;
}

async function updateIntelligence(crop) {
  const [trend, market] = await Promise.all([api(`/api/price-trends?crop=${encodeURIComponent(crop)}`), api(`/api/upag/market-data?crop=${encodeURIComponent(crop)}`)]);
  renderTrend(trend);
  const selector = $("#cropSelector");
  if (!selector.options.length) selector.innerHTML = trend.crops.map((item) => `<option value="${escapeHTML(item)}">${escapeHTML(item)}</option>`).join("");
  selector.value = crop;
  $("#marketCropTitle").textContent = market.crop;
  $("#marketPrice").textContent = Number(market.market_price).toLocaleString("en-IN");
  $("#marketUnit").textContent = `/ ${market.unit.replace("₹/", "")}`;
  const direction = market.direction === "up" ? "up" : "down";
  const arrow = direction === "up" ? "↗" : "↘";
  const trendBox = $("#marketTrend");
  trendBox.className = `market-trend ${direction}`;
  trendBox.textContent = `${arrow} ${market.change}% ${direction === "up" ? "higher" : "lower"} than last week`;
  $("#marketInsight").textContent = market.insight;
  $("#upagBadge").textContent = market.mode === "live" ? "UPAg live feed" : "UPAg snapshot";
  $("#upagLink").href = market.source_url;
}

function setupMap() {
  if (!window.L) { $("#logisticsMap").textContent = "Map service could not load."; return; }
  state.map = L.map("logisticsMap", { zoomControl: false, scrollWheelZoom: false }).setView([18.78, 74.02], 8);
  L.control.zoom({ position: "bottomleft" }).addTo(state.map);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "" }).addTo(state.map);
  drawRoute({ ordered_stops: defaultStops(), geometry: { type: "LineString", coordinates: defaultStops().map((stop) => [stop.lng, stop.lat]) }, distance_km: 235, duration_min: 285, mode: "initial" });
}

function defaultStops() { return [ { name: "Nashik Harvest Hub", lat: 19.9975, lng: 73.7898 }, { name: "Pune Fresh Centre", lat: 18.5204, lng: 73.8567 }, { name: "Neighbourhood drops", lat: 18.5624, lng: 73.9167 } ]; }

function drawRoute(route) {
  if (!state.map || !window.L) return;
  state.markers.forEach((marker) => marker.remove()); state.markers = [];
  if (state.routeLayer) state.routeLayer.remove();
  const colors = ["#0d7652", "#e6a845", "#e77459"];
  route.ordered_stops.forEach((stop, index) => {
    const marker = L.circleMarker([stop.lat, stop.lng], { radius: 7, fillColor: colors[index] || "#0d7652", fillOpacity: 1, color: "#fff", weight: 3 }).bindTooltip(`${index + 1}. ${stop.name}`, { direction: "top" }).addTo(state.map);
    state.markers.push(marker);
  });
  const routeCoordinates = (route.geometry.coordinates || []).map(([lng, lat]) => [lat, lng]);
  state.routeLayer = L.polyline(routeCoordinates, { color: "#0d7652", weight: 4, opacity: .85, dashArray: route.mode === "fallback" ? "7 8" : null }).addTo(state.map);
  if (routeCoordinates.length) state.map.fitBounds(state.routeLayer.getBounds(), { padding: [35, 35], maxZoom: 10 });
  $("#routeDistance").textContent = `${route.distance_km} km`;
  $("#routeTime").textContent = `${Math.floor(route.duration_min / 60)}h ${route.duration_min % 60}m`;
  $("#co2Saved").textContent = `${Math.round(route.distance_km * .12)} kg`;
}

async function optimiseRoute() {
  const button = $("#optimiseRoute");
  button.disabled = true; button.innerHTML = '<span>Optimising route…</span>';
  try {
    const route = await api("/api/fulfilment/plan", { method: "POST", body: JSON.stringify({ stops: defaultStops(), units: 190, cold_chain: true }) });
    drawRoute(route);
    $("#routeHelper").textContent = `${route.fulfilment.orders_consolidated} orders consolidated • ${route.fulfilment.estimated_empty_km_saved} empty km avoided`;
    showToast(route.mode === "live" ? "OpenStreetMap route optimised for today’s cluster." : "A local efficient route was planned while OSM routing reconnects.");
  } catch (error) { showToast(error.message); }
  finally { button.disabled = false; button.innerHTML = `<span>${locales[state.language].optimiseRoute}</span> <span>→</span>`; }
}

async function submitListing(event) {
  event.preventDefault();
  const form = event.currentTarget, message = $("#listingMessage"), photo = $("#cropPhoto").files[0];
  const payload = Object.fromEntries(new FormData(form).entries());
  payload.is_organic = form.elements.is_organic.checked;
  payload.inventory = payload.quantity;
  if (photo) {
    if (photo.size > 5 * 1024 * 1024) { message.textContent = "Please choose a crop image below 5 MB."; return; }
    payload.image_data = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(photo); });
  }
  delete payload.crop_photo;
  try {
    const result = await api("/api/products", { method: "POST", body: JSON.stringify(payload) });
    message.className = "form-message success"; message.textContent = result.message;
    form.reset(); $("#photoHint").innerHTML = "Upload a clear crop photo <b>＋</b>";
    await loadProducts();
    window.setTimeout(() => $("#listingModal").close(), 900);
    showToast("Your crop listing is live for buyer discovery.");
  } catch (error) { message.className = "form-message"; message.textContent = error.message; }
}

async function checkout(event) {
  event.preventDefault();
  const message = $("#checkoutMessage");
  if (!state.cart.length) { message.textContent = "Add at least one fresh item before checkout."; return; }
  const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
  payload.items = state.cart.map((item) => ({ id: item.id, title: item.title, price: item.price, quantity: item.quantity, unit: item.unit }));
  try {
    const result = await api("/api/orders", { method: "POST", body: JSON.stringify(payload) });
    message.className = "form-message success";
    message.textContent = `Order ${result.order.order_code} created. ${payload.payment_method === "COD" ? "Pay at delivery." : "Connect your payment gateway credentials to collect live payments."}`;
    state.cart = []; renderCart(); event.currentTarget.reset(); showToast("Order reserved in today’s delivery cluster.");
  } catch (error) { message.className = "form-message"; message.textContent = error.message; }
}

function initialiseEvents() {
  $("#languageButton").addEventListener("click", () => setLanguage(state.language === "en" ? "hi" : state.language === "hi" ? "mr" : "en"));
  $("#cartButton").addEventListener("click", () => $("#cartModal").showModal());
  $("#openListing").addEventListener("click", () => $("#listingModal").showModal());
  $("#listingForm").addEventListener("submit", submitListing); $("#checkoutForm").addEventListener("submit", checkout);
  $("#cropPhoto").addEventListener("change", (event) => { const file = event.target.files[0]; if (file) $("#photoHint").innerHTML = `<span>✓ ${escapeHTML(file.name)}</span><b>⌁</b>`; });
  $("#categoryPills").addEventListener("click", (event) => { const button = event.target.closest("button[data-category]"); if (!button) return; state.category = button.dataset.category; document.querySelectorAll("#categoryPills button").forEach((item) => item.classList.toggle("active", item === button)); loadProducts().catch((error) => showToast(error.message)); });
  let searchTimer; $("#productSearch").addEventListener("input", () => { window.clearTimeout(searchTimer); searchTimer = window.setTimeout(() => loadProducts().catch((error) => showToast(error.message)), 250); });
  $("#cropSelector").addEventListener("change", (event) => updateIntelligence(event.target.value).catch((error) => showToast(error.message)));
  $("#optimiseRoute").addEventListener("click", optimiseRoute);
  $(".all-produce").addEventListener("click", () => { state.category = "All"; document.querySelector('#categoryPills button[data-category="All"]').click(); document.querySelector("#marketplace").scrollIntoView({ behavior: "smooth" }); });
  document.querySelectorAll("dialog").forEach((dialog) => dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); }));
}

async function start() {
  $("#listingForm").elements.harvest_date.value = new Date().toISOString().slice(0, 10);
  initialiseEvents(); setupMap();
  try { await Promise.all([loadProducts(), updateIntelligence("Tomato")]); }
  catch (error) { showToast(`Could not load marketplace data: ${error.message}`); }
}
document.addEventListener("DOMContentLoaded", start);
