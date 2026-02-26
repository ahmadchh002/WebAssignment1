// product data 
const products = [
    { id: 1, title: "MacBook Pro 16\" M3 Ultra", cat: "Electronics", price: 3499, old: 4299, desc: "Powerful laptop with M3 Ultra chip, 36GB RAM, and 512GB SSD. Perfect for professionals.", img: "💻" },
    { id: 2, title: "Clean Code Handbook", cat: "Books", price: 45, old: 65, desc: "A Handbook of Agile Software Craftsmanship by Robert C. Martin.", img: "📚" },
    { id: 3, title: "Premium Cotton T-Shirt", cat: "Fashion", price: 24, old: 39, desc: "100% Premium Cotton T-Shirt. High quality and breathable fabric.", img: "👕" },
    { id: 4, title: "Professional DSLR Camera", cat: "Electronics", price: 799, old: 999, desc: "48MP sensor with 4K recording capabilities and stabilized lens.", img: "📷" },
    { id: 5, title: "Stainless Steel Cookware", cat: "Home & Garden", price: 129, old: 199, desc: "Non-stick, durable stainless steel pan for professional cooking.", img: "🍳" },
    { id: 6, title: "Design Patterns", cat: "Books", price: 55, old: 75, desc: "Classic book on reusable object-oriented software design.", img: "📖" },
    { id: 7, title: "Ergonomic Office Chair", cat: "Home & Garden", price: 199, old: 299, desc: "Full back support with adjustable armrests and height.", img: "🪑" },
    { id: 8, title: "Mechanical Keyboard", cat: "Electronics", price: 89, old: 130, desc: "Tactile mechanical switches perfect for long coding or gaming sessions.", img: "⌨️" },
    { id: 9, title: "Cracking the Coding Interview", cat: "Books", price: 45, old: 60, desc: "Comprehensive guide with practice questions for software engineering interviews.", img: "📘" },
    { id: 10, title: "Smart Home Assistant", cat: "Electronics", price: 99, old: 149, desc: "AI-powered voice assistant to automate your daily tasks and routines.", img: "🔊" }
];

let cart = []; // intialize empty cart array


document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    initApp();
});

// render products in grid
function renderProducts(data) {
    const grid = document.getElementById('productGrid');
    if (data.length === 0) {
        grid.innerHTML = '<p style="padding: 20px;">No matching products found.</p>';
        return;
    }

    grid.innerHTML = data.map(p => `
        <div class="card" onclick="showDetail(${p.id})">
            <div class="card-img">${p.img}</div>
            <h4>${p.title}</h4>
            <p style="font-size: 13px; color: #565959;">
                <s>$${p.old}</s> <span style="color: #388e3c; font-weight: bold;">-${Math.round((1 - p.price/p.old)*100)}%</span>
            </p>
            <p style="font-size: 18px; font-weight: bold; color: #B12704;">$${p.price}</p>
            <button class="add-btn" onclick="addToCart(event, ${p.id})">Add to Cart</button>
        </div>
    `).join('');
}

// search bar 
function handleSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = products.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.desc.toLowerCase().includes(query)
    );
    renderProducts(filtered);
}

// detail view  
function showDetail(id) {
    const p = products.find(item => item.id === id);
    document.getElementById('productListing').style.display = 'none';
    document.getElementById('productDetail').style.display = 'block';

    document.getElementById('detailContent').innerHTML = `
        <div style="display:flex; gap:40px; background:white; padding:40px; border-radius:8px; flex-wrap: wrap;">
            <div style="font-size:140px; flex: 1; text-align: center;">${p.img}</div>
            <div style="flex: 2; min-width: 300px;">
                <h1>${p.title}</h1>
                <h2 style="color:#B12704; margin: 15px 0;">$${p.price}</h2>
                <hr>
                <p style="margin-top: 20px; font-size: 17px; line-height: 1.6;"><strong>Description:</strong><br>${p.desc}</p>
                <div style="display:flex; gap:15px; margin-top: 30px;">
                    <button class="add-btn" style="width:200px" onclick="addToCart(event, ${p.id})">Add to Cart</button>
                    <button class="add-btn" style="width:200px; background: #ffa41c; border-color: #ff8f00;">Buy Now</button>
                </div>
            </div>
        </div>
    `;
    window.scrollTo(0, 0);
}

// cart functions   
function addToCart(e, id) {
    e.stopPropagation();
    const p = products.find(i => i.id === id);
    const item = cart.find(i => i.id === id);

    if (item) {
        item.qty++;
    }
    else {
        cart.push({...p, qty: 1 });
    }

    updateCartUI();
    showToast("Added to Cart!");
}

function updateQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty < 1) {
            removeItem(id);
        }
    }
    updateCartUI();
}

function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    updateCartUI();
}

function updateCartUI() {
    const itemsDiv = document.getElementById('cartItems');
    const badge = document.getElementById('cartCount');

    if (cart.length === 0) {
        itemsDiv.innerHTML = '<p style="text-align:center; margin-top: 50px; color: #565959;">Your cart is empty.</p>';
        badge.innerText = "0";
        document.getElementById('subtotal').innerText = "$0.00";
        document.getElementById('total').innerText = "$0.00";
        return;
    }

    itemsDiv.innerHTML = cart.map(i => `
        <div class="cart-item">
            <div style="font-size:35px">${i.img}</div>
            <div style="flex:1">
                <p style="font-weight:bold; font-size:14px;">${i.title}</p>
                <p style="color:#B12704; font-weight:bold;">$${i.price}</p>
                <div style="display:flex; align-items:center; gap:10px; margin-top:8px;">
                    <button class="qty-btn" onclick="updateQty(${i.id}, -1)">-</button>
                    <span>${i.qty}</span>
                    <button class="qty-btn" onclick="updateQty(${i.id}, 1)">+</button>
                    <span style="color:#007185; font-size:12px; cursor:pointer; margin-left:10px" onclick="removeItem(${i.id})">Remove</span>
                </div>
            </div>
        </div>
    `).join('');

    const tax = sub * 0.10; 
    const total = sub + tax;

    document.getElementById('tax').innerText = `$${tax.toFixed(2)}`;
    document.getElementById('total').innerText = `$${total.toFixed(2)}`;
}

function initApp() {
    document.getElementById('searchBtn').onclick = handleSearch;
    document.getElementById('backBtn').onclick = () => {
        document.getElementById('productListing').style.display = 'block';
        document.getElementById('productDetail').style.display = 'none';
    };

    document.querySelectorAll('.category').forEach(btn => {
        btn.onclick = () => {
            const cat = btn.getAttribute('data-cat');
            const filtered = cat === 'All' ? products : products.filter(p => p.cat === cat);
            renderProducts(filtered);
            document.getElementById('productListing').style.display = 'block';
            document.getElementById('productDetail').style.display = 'none';
        };
    });

    //sidebar cart
    document.getElementById('openCart').onclick = () => {
        document.getElementById('cartSidebar').classList.add('active');
        document.getElementById('overlay').style.display = 'block';
    };
    document.getElementById('overlay').onclick = document.getElementById('closeCart').onclick = () => {
        document.getElementById('cartSidebar').classList.remove('active');
        document.getElementById('overlay').style.display = 'none';
    };
}

function showToast(msg) {
    const t = document.createElement('div');
    t.style.cssText = "position:fixed; bottom:20px; left:20px; background:#131921; color:#ff9900; padding:12px 25px; border-radius:4px; z-index:5000; font-weight:bold; box-shadow: 0 4px 8px rgba(0,0,0,0.3);";
    t.innerText = "✅ " + msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
}