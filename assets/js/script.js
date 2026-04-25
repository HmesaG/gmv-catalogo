/**
 * GMV Catálogo - Main Script
 * Basado en Onex Hydrolight v2.1
 * WhatsApp: +18299369811
 * Moneda: RD$ (Pesos Dominicanos)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. ESTADO GLOBAL ---
    let cartItems = [];
    const productsDataMap = {};

    // --- CONFIGURACIÓN GOOGLE SHEETS API ---
    // URL del Google Apps Script Web App (misma de admin.html)
    const API_URL = 'https://script.google.com/macros/s/AKfycbyLPPYHiX-neQzYs3h5_s_SnZHxslRNRAZ2jAZMCzA3Lb51Kft1i-FQml6OtgwVShG8sw/exec';

    // WhatsApp GMV
    const WHATSAPP_NUMBER = '18299369811';
    const WHATSAPP_GREETING = '¡Hola GMV! 🛒 Quisiera realizar un pedido:\n\n';

    // Clave carrito en localStorage
    const CART_KEY = 'gmv_cart_v1';

    // --- 2. SELECTORES ---
    const productsGrid = document.getElementById('products-grid');
    const searchInput = document.getElementById('search-input');
    const categoriesContainer = document.getElementById('categories-container');
    const cartBtn = document.querySelectorAll('#cart-btn, #cart-float');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const cartCountElements = document.querySelectorAll('#cart-count, .cart-float .cart-badge');
    const checkoutBtn = document.getElementById('checkout-whatsapp');
    const productModal = document.getElementById('product-modal');
    const closeProductModalBtn = document.getElementById('close-product-modal');
    const successModal = document.getElementById('success-modal');
    const closeSuccessBtn = document.getElementById('close-success-modal');

    // --- 3. LÓGICA DEL CARRITO ---

    function loadCart() {
        try {
            const saved = localStorage.getItem(CART_KEY);
            if (saved) cartItems = JSON.parse(saved);
            updateCartUI();
        } catch (e) {
            console.error('Error cargando carrito:', e);
        }
    }

    function saveCart() {
        localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    }

    /**
     * Formatea precio en Pesos Dominicanos
     */
    function formatRD(amount) {
        const num = parseFloat(amount) || 0;
        return 'RD$ ' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function updateCartUI() {
        let totalItems = 0;
        let totalPrice = 0;

        cartItems.forEach(item => {
            totalItems += item.qty;
            const cleanPrice = parseFloat(String(item.price).replace(/[^\d.]/g, '')) || 0;
            totalPrice += cleanPrice * item.qty;
        });

        cartCountElements.forEach(el => el.textContent = totalItems);

        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            if (cartItems.length === 0) {
                cartItemsContainer.innerHTML = '<p class="empty-msg">Tu carrito está vacío.</p>';
            } else {
                cartItems.forEach((item, index) => {
                    const el = document.createElement('div');
                    el.className = 'cart-item';
                    el.innerHTML = `
                        <div class="cart-item-info">
                            <h4>${item.title}</h4>
                            <p>${item.qty} x ${formatRD(item.price)}</p>
                        </div>
                        <button class="remove-item-btn" data-index="${index}" aria-label="Eliminar ${item.title}">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    `;
                    cartItemsContainer.appendChild(el);
                });
            }
        }

        if (cartTotalEl) {
            cartTotalEl.textContent = formatRD(totalPrice);
        }

        saveCart();
    }

    function addToCart(item) {
        const existing = cartItems.find(i => i.title === item.title);
        if (existing) {
            existing.qty++;
        } else {
            cartItems.push({ ...item, qty: 1 });
        }
        updateCartUI();
        showFeedback(item.btn);
    }

    function showFeedback(btn) {
        if (!btn) return;
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Agregado';
        btn.classList.add('added');
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.remove('added');
        }, 1500);
    }

    // Eventos del Carrito
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('.remove-item-btn');
            if (removeBtn) {
                const index = parseInt(removeBtn.getAttribute('data-index'));
                cartItems.splice(index, 1);
                updateCartUI();
            }
        });
    }

    cartBtn.forEach(btn => btn.addEventListener('click', (e) => {
        e.preventDefault();
        cartModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }));

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            cartModal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cartItems.length === 0) return alert('El carrito está vacío.');

            let total = 0;
            let message = WHATSAPP_GREETING;

            cartItems.forEach(item => {
                const cleanPrice = parseFloat(String(item.price).replace(/[^\d.]/g, '')) || 0;
                message += `🔹 ${item.qty}x ${item.title} (${formatRD(cleanPrice)})\n`;
                total += cleanPrice * item.qty;
            });

            message += `\n💰 *TOTAL: ${formatRD(total)}*\n\nFavor confirmar disponibilidad y forma de entrega.`;

            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');

            cartModal.style.display = 'none';
            if (successModal) successModal.style.display = 'flex';
            cartItems = [];
            updateCartUI();
        });
    }

    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', () => {
            successModal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }

    // --- 4. CARGA DE PRODUCTOS DESDE GOOGLE SHEETS ---

    if (productsGrid) {
        // Verificar si la URL de la API fue configurada
        if (!API_URL || API_URL.includes('TU_URL_DE_APPS_SCRIPT_AQUI')) {
            productsGrid.innerHTML = `
                <div style="grid-column:1/-1; text-align:center; padding:60px 20px; color:var(--text-muted);">
                    <i class="fa-solid fa-gear fa-3x" style="color:var(--primary); margin-bottom:20px;"></i>
                    <h3>Configura tu Google Script API</h3>
                    <p style="margin-top:10px;">Abre <code>assets/js/script.js</code> e introduce tu URL.</p>
                </div>`;
            return;
        }

        fetch(API_URL + '?action=get')
            .then(res => res.json())
            .then(data => {
                renderProducts(data);
                initDynamicCategories(data);
                updateLiveStats(data);
                initHeroSlider(data);
                if (window.onProductsLoaded) window.onProductsLoaded();
            })
            .catch(err => {
                console.error('Error cargando productos:', err);
                productsGrid.innerHTML = `
                    <div style="grid-column:1/-1; text-align:center; padding:60px 20px; color:var(--text-muted);">
                        <i class="fa-solid fa-triangle-exclamation fa-3x" style="color:#ef4444; margin-bottom:20px;"></i>
                        <h3>Error cargando productos</h3>
                        <p style="margin-top:10px;">Revisa la consola del navegador (F12) para más detalles.</p>
                    </div>`;
            });
    }

    function renderProducts(data) {
        productsGrid.innerHTML = '';

        const validProducts = data.filter(item => {
            const clean = normalizeKeys(item);
            return clean.Nombre && clean.Nombre.trim() !== '';
        });

        if (validProducts.length === 0) {
            productsGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);">No hay productos disponibles.</p>';
            return;
        }

        validProducts.forEach((item, index) => {
            const clean = normalizeKeys(item);
            const id = `prod_${index}`;

            // Precio: Soporta columna "Precio" con o sin RD$
            const rawPrice = clean.Precio || '0';
            const numericPrice = parseFloat(String(rawPrice).replace(/[^\d.]/g, '')) || 0;
            const displayPrice = formatRD(numericPrice);

            // Imagen: Soporta Google Drive y URLs directas
            const rawImg = clean.Imagen_URL || clean.imagen_url || clean.Imagen || '';
            const imgUrl = convertDriveLink(rawImg) || 'assets/img/placeholder.jpg';

            productsDataMap[id] = {
                title: clean.Nombre,
                price: rawPrice,
                brand: clean.Marca || clean.marca || 'GMV',
                img: imgUrl,
                desc: clean.Descripcion || clean.Descripion || clean.descripcion || ''
            };

            const card = document.createElement('div');
            card.className = 'product-card reveal';
            card.setAttribute('data-category', `${(clean.Tipo || '').toLowerCase()} ${(clean.Categoria || clean.categoria || '').toLowerCase()}`);
            card.innerHTML = `
                <div class="prod-img open-modal-trigger" data-id="${id}">
                    <img src="${imgUrl}" alt="${clean.Nombre}" loading="lazy" onerror="this.src='assets/img/placeholder.jpg'">
                    ${clean.Ofertas ? `<div class="prod-badge">${clean.Ofertas}</div>` : ''}
                    <div class="prod-overlay"><span>Ver más</span></div>
                </div>
                <div class="prod-info">
                    <span class="prod-brand">${productsDataMap[id].brand}</span>
                    <h4 class="prod-name open-modal-trigger" data-id="${id}">${clean.Nombre}</h4>
                    <div class="prod-price">${displayPrice}</div>
                    <div class="prod-actions">
                        <button class="btn-add" data-id="${id}" aria-label="Añadir ${clean.Nombre} al carrito">
                            <i class="fa-solid fa-cart-plus"></i> Añadir
                        </button>
                        <button class="btn-share" data-id="${id}" title="Compartir producto" aria-label="Compartir ${clean.Nombre}">
                            <i class="fa-solid fa-share-nodes"></i>
                        </button>
                    </div>
                </div>
            `;
            productsGrid.appendChild(card);
        });

        initReveal();
    }

    /**
     * Normaliza las claves del objeto (trim + capitalize first letter)
     */
    function normalizeKeys(obj) {
        const clean = {};
        Object.keys(obj).forEach(k => {
            const trimKey = k.trim();
            clean[trimKey] = obj[k];
        });
        return clean;
    }

    /**
     * Convierte enlace de Google Drive a enlace directo compatible con <img>
     * Input:  https://drive.google.com/file/d/FILE_ID/view?usp=sharing
     * Output: https://lh3.googleusercontent.com/d/FILE_ID
     */
    function convertDriveLink(url) {
        if (!url || url.trim() === '') return null;

        // Si ya es enlace directo de Google (lh3) o de otro host, devolverlo
        if (url.includes('lh3.googleusercontent.com') || !url.includes('drive.google.com')) {
            return url;
        }

        // Extraer FILE_ID del enlace de Drive
        const patterns = [
            /\/d\/([a-zA-Z0-9_-]{10,})/,
            /id=([a-zA-Z0-9_-]{10,})/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                return `https://lh3.googleusercontent.com/d/${match[1]}`;
            }
        }

        return url; // Fallback: devolver tal cual
    }

    function initDynamicCategories(data) {
        if (!categoriesContainer) return;

        const tipos = new Set();
        data.forEach(item => {
            const clean = normalizeKeys(item);
            const tipo = clean.Tipo || clean.tipo || clean.Categoria || clean.categoria;
            if (tipo && tipo.trim()) tipos.add(tipo.trim());
        });

        categoriesContainer.innerHTML = '<button class="ftab active" data-filter="all"><i class="fa-solid fa-border-all"></i> Todos</button>';

        // Mapa de iconos para categorías comunes
        const iconMap = {
            'alisado': 'fa-spray-can-sparkles',
            'brillo': 'fa-droplet',
            'color': 'fa-fill-drip',
            'lavado': 'fa-pump-soap',
            'shampoo': 'fa-pump-soap',
            'tratamiento': 'fa-flask',
            'serum': 'fa-droplet',
            'acondicionador': 'fa-bottle-water',
            'acabado': 'fa-sparkles',
            'protección': 'fa-shield',
            'cuidado': 'fa-heart',
            'styling': 'fa-wand-magic-sparkles',
        };

        Array.from(tipos).sort().forEach(tipo => {
            const btn = document.createElement('button');
            btn.className = 'ftab';
            btn.setAttribute('data-filter', tipo.toLowerCase());

            const iconKey = Object.keys(iconMap).find(k => tipo.toLowerCase().includes(k));
            const icon = iconKey ? iconMap[iconKey] : 'fa-tag';

            btn.innerHTML = `<i class="fa-solid ${icon}"></i> ${tipo}`;
            categoriesContainer.appendChild(btn);
        });

        categoriesContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.ftab');
            if (btn) {
                document.querySelectorAll('.ftab').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterProducts();
            }
        });
    }

    function filterProducts() {
        const activeTab = categoriesContainer ? categoriesContainer.querySelector('.ftab.active') : null;
        const filter = activeTab ? activeTab.getAttribute('data-filter') : 'all';
        const search = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const cards = document.querySelectorAll('.product-card');

        cards.forEach(card => {
            const title = card.querySelector('.prod-name')?.textContent.toLowerCase() || '';
            const category = card.getAttribute('data-category') || '';
            const matchSearch = title.includes(search);
            const matchFilter = filter === 'all' || category.includes(filter);

            card.style.display = (matchSearch && matchFilter) ? 'flex' : 'none';
        });
    }

    if (searchInput) searchInput.addEventListener('input', filterProducts);

    // Click en Grid (Delegación)
    if (productsGrid) {
        productsGrid.addEventListener('click', (e) => {
            const id = e.target.closest('[data-id]')?.getAttribute('data-id');
            if (!id) return;

            if (e.target.closest('.btn-add')) {
                addToCart({
                    title: productsDataMap[id].title,
                    price: productsDataMap[id].price,
                    btn: e.target.closest('.btn-add')
                });
            } else if (e.target.closest('.open-modal-trigger')) {
                openProductModal(id);
            } else if (e.target.closest('.btn-share')) {
                shareProduct(id);
            }
        });
    }

    // --- 5. MODAL DE PRODUCTO ---
    function openProductModal(id) {
        const item = productsDataMap[id];
        if (!item) return;

        document.getElementById('modal-product-image').src = item.img;
        document.getElementById('modal-product-title').textContent = item.title;
        document.getElementById('modal-product-title').setAttribute('data-active-id', id);
        document.getElementById('modal-product-brand').textContent = item.brand;
        document.getElementById('modal-product-price').textContent = formatRD(parseFloat(String(item.price).replace(/[^\d.]/g, '')) || 0);
        document.getElementById('modal-product-description').textContent = item.desc || 'Sin descripción disponible.';

        const modalAddBtn = document.getElementById('modal-add-to-cart');
        modalAddBtn.onclick = () => addToCart({ title: item.title, price: item.price, btn: modalAddBtn });

        const modalShareBtn = document.getElementById('modal-share');
        if (modalShareBtn) modalShareBtn.onclick = () => shareProduct(id);

        productModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    if (closeProductModalBtn) {
        closeProductModalBtn.addEventListener('click', () => {
            productModal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
            document.body.style.overflow = '';
        }
        if (e.target === productModal) {
            productModal.style.display = 'none';
            document.body.style.overflow = '';
        }
        if (e.target === successModal) {
            successModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // --- 6. HERO SLIDER ---
    function initHeroSlider(data) {
        const slider = document.getElementById('hero-slider');
        if (!slider) return;

        // Tomar hasta 5 productos con imagen para el carrusel
        const slidesData = data
            .filter(item => {
                const clean = normalizeKeys(item);
                const rawImg = clean.Imagen_URL || clean.imagen_url || clean.Imagen || '';
                return rawImg && rawImg.trim() !== '';
            })
            .slice(0, 5);

        if (slidesData.length === 0) {
            slider.innerHTML = `<div class="hero-slide active" style="background-image: url('https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1200&auto=format&fit=crop&q=80')"></div>`;
            return;
        }

        slider.innerHTML = slidesData.map((item, index) => {
            const clean = normalizeKeys(item);
            const rawImg = clean.Imagen_URL || clean.imagen_url || clean.Imagen || '';
            const imgUrl = convertDriveLink(rawImg);
            return `<div class="hero-slide ${index === 0 ? 'active' : ''}" style="background-image: url('${imgUrl}')"></div>`;
        }).join('');

        const slides = slider.querySelectorAll('.hero-slide');
        if (slides.length <= 1) return;

        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }

    // --- 7. ANIMACIONES Y UI ---
    function initReveal() {
        const revealElements = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.01, rootMargin: '0px 0px -40px 0px' });
        revealElements.forEach(el => observer.observe(el));
    }

    function updateLiveStats(data) {
        const totalProds = data.filter(item => item.Nombre).length;
        const totalBrands = new Set(data.map(item => item.Marca).filter(Boolean)).size;

        const prodCounter = document.querySelector('.stat-item:nth-child(1) .counter');
        const brandCounter = document.querySelector('.stat-item:nth-child(4) .counter');

        if (prodCounter) prodCounter.setAttribute('data-target', totalProds);
        if (brandCounter) brandCounter.setAttribute('data-target', totalBrands > 30 ? totalBrands : 30); // Mantener un mínimo decorativo si hay pocos
    }

    // Counters animados
    const statsSection = document.querySelector('.stats-band');
    if (statsSection) {
        const counterObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                document.querySelectorAll('.counter').forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    let count = 0;
                    const duration = 1500; // ms
                    const startTime = performance.now();

                    const update = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        // Easing function (easeOutExpo)
                        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                        const currentCount = Math.floor(easeProgress * target);
                        
                        counter.innerText = currentCount;

                        if (progress < 1) {
                            requestAnimationFrame(update);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    requestAnimationFrame(update);
                });
                counterObserver.disconnect();
            }
        }, { threshold: 0.2 });
        counterObserver.observe(statsSection);
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // Mobile nav toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });
    }

    // Newsletter
    const newsletterForm = document.querySelector('.nl-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = newsletterForm.querySelector('button');
            const orig = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '¡Suscrito!';
            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = orig;
                newsletterForm.reset();
            }, 3000);
        });
    }

    // --- 7. SERVICE WORKER ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('SW GMV Registrado', reg.scope))
                .catch(err => console.log('SW Error:', err));
        });
    }

    // --- 8. COMPARTIR PRODUCTO ---
    function shareProduct(id) {
        const item = productsDataMap[id];
        if (!item) return;

        const origin = window.location.origin;
        const path = window.location.pathname;
        const dir = path.substring(0, path.lastIndexOf('/') + 1);
        const shareUrl = `${origin}${dir}index.html?prodId=${id}`;

        const shareData = {
            title: `GMV - ${item.title}`,
            text: `¡Mira este producto de GMV: ${item.title}!`,
            url: shareUrl
        };

        if (navigator.share) {
            navigator.share(shareData).catch(err => {
                if (err.name !== 'AbortError') copyToClipboard(shareUrl, item.title);
            });
        } else {
            copyToClipboard(shareUrl, item.title);
        }
    }

    async function copyToClipboard(url, title) {
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(url);
            } else {
                const ta = document.createElement('textarea');
                ta.value = url;
                ta.style.cssText = 'position:fixed;left:-9999px;top:0';
                document.body.appendChild(ta);
                ta.focus(); ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            }
            showToast(`<i class="fa-solid fa-check"></i> ¡Enlace de "${title}" copiado!`);
        } catch {
            showToast('<i class="fa-solid fa-xmark"></i> No se pudo copiar el enlace');
        }
    }

    function showToast(message) {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = message;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    // Deep link: abrir producto si viene en URL ?prodId=xxx
    window.onProductsLoaded = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const prodId = urlParams.get('prodId');
        if (prodId && productsDataMap[prodId]) {
            setTimeout(() => {
                openProductModal(prodId);
                window.history.replaceState({}, document.title, window.location.pathname);
            }, 500);
        }
    };

    // --- INICIALIZAR ---
    loadCart();
    initReveal();
});
