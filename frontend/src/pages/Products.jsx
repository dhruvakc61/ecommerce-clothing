import { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import useCart from "../hooks/useCart";
import formatCurrency from "../utils/formatCurrency";

// ─── Constants ─────────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: "All Products", value: "" },
  { label: "Men", value: "men" },
  { label: "Women", value: "women" },
  { label: "Kids", value: "kids" },
  { label: "Accessories", value: "accessories" },
];

const COLORS = ["Black", "Blue", "Gold", "White", "Red", "Green"];

const TAGS = ["Hoodie","Jacket","Frocks","Crochet","Scarf","Shirts","Men","Women"];

const SORT_OPTIONS = [
  { value: "", label: "Default sorting" },
  { value: "low-high", label: "Price: Low to High" },
  { value: "high-low", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Top Rated" },
];

const PER_PAGE = 9;

const MOCK_PRODUCTS = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  name: ["Quibusdam ratione","Expedita excepturi","Facere molestias","Recusandae fugit","Rem voluptate","Cumque nulla","Aliquid vitae","Assumenda delectus","Lorem ipsum"][i],
  price: [46.91,50.91,80,60,90,46.91,45.91,75.91,55][i],
  oldPrice: [50.99,55.99,85,65,95,50.99,50.99,80.99,null][i],
  rating: [3.5,4,5,2.5,3,3.5,4,4,4][i],
  badge: ["SALE","BESTSELLER","HOT","SALE","HOT","SALE","BESTSELLER","HOT",null][i],
  image: null,
  category: ["men", "women", "kids", "accessories"][i % 4],
  colors: ["Black","Blue","Gold"][i % 3],
  tags: TAGS.slice(i % 4, (i % 4) + 2),
}));

const getPriceValue = (product) => Number(product.price ?? product.sale_price ?? 0);
const getRatingValue = (product) => Number(product.rating ?? product.rating_average ?? 0);
const getCreatedValue = (product) => {
  const raw = product.createdAt || product.updatedAt || product.dateAdded || product.date;
  const parsed = raw ? new Date(raw).getTime() : 0;
  return Number.isNaN(parsed) ? 0 : parsed;
};
const getCategoryValue = (product) => String(product.category || "").toLowerCase();

// ─── Helpers ───────────────────────────────────────────────────────────────

function Stars({ rating = 0 }) {
  return (
    <div style={{ display:"flex", gap:2 }}>
      {[1,2,3,4,5].map(i => {
        const full  = i <= Math.floor(rating);
        const half  = !full && i - 0.5 <= rating;
        return (
          <span key={i} style={{ fontSize:13, color: full||half ? "#e8b14f" : "#ddd" }}>
            {half ? "½" : "★"}
          </span>
        );
      })}
    </div>
  );
}

function Badge({ text }) {
  if (!text) return null;
  const bg = text === "SALE" || text === "-15%" ? "#e8b14f"
           : text === "BESTSELLER"              ? "#e8b14f"
           : text === "HOT"                     ? "#1a1a1a"
           : "#e8b14f";
  return (
    <span style={{
      position:"absolute", top:10, left:10, zIndex:2,
      background:bg, color:"#fff",
      fontSize:9, fontWeight:700, letterSpacing:1,
      padding:"3px 8px", textTransform:"uppercase",
      fontFamily:"'Josefin Sans',sans-serif",
      borderRadius: text === "HOT" ? 2 : 3,
    }}>{text}</span>
  );
}

// ─── Product Card ──────────────────────────────────────────────────────────

function ProductCard({ product, viewMode }) {
  const [hov, setHov] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const pid = product._id || product.id;
  const price    = product.price    ?? product.sale_price  ?? 0;
  const oldPrice = product.oldPrice ?? product.original_price ?? null;
  const isOnSale = !!(oldPrice && oldPrice > price);

  if (viewMode === "list") {
    return (
      <div style={{
        display:"flex", gap:20, background:"#fff",
        border:"1px solid #efefef", borderRadius:12,
        overflow:"hidden", transition:"box-shadow .2s",
        ...(hov ? { boxShadow:"0 6px 24px rgba(0,0,0,0.09)" } : {}),
      }}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
        <Link to={`/products/${pid}`} style={{
          width:160, flexShrink:0, background:"#f8f6f3",
          display:"flex", alignItems:"center", justifyContent:"center",
          position:"relative", overflow:"hidden",
        }}>
          <Badge text={product.badge}/>
          {product.image || product.thumbnail
            ? <img src={product.image||product.thumbnail} alt={product.name}
                style={{ width:"100%", height:160, objectFit:"cover" }}/>
            : <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          }
        </Link>
        <div style={{ flex:1, padding:"18px 18px 18px 0", display:"flex", flexDirection:"column", justifyContent:"center", gap:8 }}>
          <Link to={`/products/${pid}`} style={{ textDecoration:"none" }}>
            <p style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:15, fontWeight:600, color:"#1a1a1a", margin:0 }}>{product.name}</p>
          </Link>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:15, fontWeight:700, color:"#e8b14f" }}>
              {formatCurrency(price)}
            </span>
            {isOnSale && <span style={{ fontSize:12, color:"#bbb", textDecoration:"line-through" }}>{formatCurrency(oldPrice)}</span>}
          </div>
          <Stars rating={product.rating || product.rating_average || 0}/>
          {product.description && (
            <p style={{ fontSize:13, color:"#999", margin:0, lineHeight:1.6,
              overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
              {product.description}
            </p>
          )}
          <button onClick={() => addToCart(product, 1)} style={{
            marginTop:4, alignSelf:"flex-start",
            background:"#1a1a1a", color:"#fff", border:"none",
            padding:"9px 22px", fontSize:10,
            fontFamily:"'Josefin Sans',sans-serif", fontWeight:700,
            letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer",
            borderRadius:999,
          }}>Add to Cart</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background:"#fff", borderRadius:12,
      border:"1px solid #efefef", overflow:"hidden",
      transition:"box-shadow .25s, transform .25s", cursor:"pointer",
      ...(hov ? { boxShadow:"0 8px 28px rgba(0,0,0,0.1)", transform:"translateY(-3px)" } : {}),
    }}
      role="link"
      tabIndex={0}
      aria-label={`View details for ${product.name}`}
      onClick={() => navigate(`/products/${pid}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/products/${pid}`);
        }
      }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div style={{ position:"relative", overflow:"hidden", aspectRatio:"1/1", background:"#f8f6f3",
        display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Badge text={product.badge}/>
        {product.image || product.thumbnail
          ? <img src={product.image||product.thumbnail} alt={product.name}
              style={{ width:"100%", height:"100%", objectFit:"cover",
                transition:"transform .4s", transform: hov ? "scale(1.06)" : "scale(1)" }}/>
          : <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
        }
        {/* Hover actions */}
        <div style={{
          position:"absolute", right:10, top:10,
          display:"flex", flexDirection:"column", gap:6,
          opacity: hov ? 1 : 0, transition:"opacity .25s",
        }}>
          {[
            { title:"Quick view", icon:<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/> },
            { title:"Wishlist",   icon:<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/> },
            { title:"Compare",   icon:<><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></> },
            { title:"Add to cart", icon:<><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></> },
          ].map(({ title, icon }) => (
            <button key={title} title={title}
              onClick={(e) => {
                e.stopPropagation();
                if (title === "Add to cart") {
                  addToCart(product, 1);
                }
              }}
              style={{ width:32, height:32, borderRadius:"50%", background:"#fff",
                border:"1px solid #e8e4df", cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="13" height="13" fill="none" stroke="#333" strokeWidth="2" viewBox="0 0 24 24">{icon}</svg>
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:"14px 14px 16px" }}>
        <Link to={`/products/${pid}`} style={{ textDecoration:"none" }}>
          <p style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:13, fontWeight:600,
            color:"#1a1a1a", margin:"0 0 6px", letterSpacing:.3, lineHeight:1.3,
            whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
            {product.name}
          </p>
        </Link>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
          <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:14, fontWeight:700, color:"#e8b14f" }}>
            {formatCurrency(price)}
          </span>
          {isOnSale && (
            <span style={{ fontSize:11, color:"#bbb", textDecoration:"line-through" }}>
              {formatCurrency(oldPrice)}
            </span>
          )}
        </div>
        <Stars rating={product.rating || product.rating_average || 0}/>
      </div>
    </div>
  );
}

// ─── Sidebar Section ──────────────────────────────────────────────────────

function SideSection({ title, children }) {
  return (
    <div style={{ marginBottom:28 }}>
      <h3 style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:14, fontWeight:700,
        color:"#1a1a1a", letterSpacing:.5, textTransform:"uppercase",
        marginBottom:14, paddingBottom:10,
        borderBottom:"2px solid #1a1a1a" }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter state
  const [priceRange,      setPriceRange]      = useState([0, 200]);
  const [priceInput,      setPriceInput]      = useState([0, 200]);
  const [selectedCat,     setSelectedCat]     = useState(searchParams.get("category") || "");
  const [selectedColors,  setSelectedColors]  = useState([]);
  const [selectedTags,    setSelectedTags]    = useState([]);
  const [sortBy,          setSortBy]          = useState("");
  const [viewMode,        setViewMode]        = useState("grid"); // "grid" | "list"
  const [page,            setPage]            = useState(1);
  const [searchText,      setSearchText]      = useState(searchParams.get("search") || "");

  // Build query string
  const buildQuery = useCallback(() => {
    let q = "?";
    if (selectedCat)           q += `category=${encodeURIComponent(selectedCat)}&`;
    if (sortBy)                q += `sort=${sortBy}&`;
    if (priceRange[0] > 0)     q += `minPrice=${priceRange[0]}&`;
    if (priceRange[1] < 200)   q += `maxPrice=${priceRange[1]}&`;
    if (searchText)            q += `search=${encodeURIComponent(searchText)}&`;
    if (selectedColors.length) q += `colors=${selectedColors.join(",")}&`;
    if (selectedTags.length)   q += `tags=${selectedTags.join(",")}&`;
    q += `page=${page}&limit=${PER_PAGE}`;
    return q;
  }, [selectedCat, sortBy, priceRange, searchText, selectedColors, selectedTags, page]);

  const { data, loading, error } = useFetch(`/products${buildQuery()}`);

  // Normalise API response — handles { products, total } or plain array
  const products = Array.isArray(data) ? data : (data?.products || data?.data || []);
  const baseProducts = products.length ? products : MOCK_PRODUCTS;

  const filteredProducts = useMemo(() => {
    let list = [...baseProducts];

    if (selectedCat) {
      list = list.filter((product) => getCategoryValue(product) === selectedCat);
    }

    if (searchText) {
      const query = searchText.trim().toLowerCase();
      list = list.filter((product) =>
        product.name?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      );
    }

    list = list.filter((product) => {
      const price = getPriceValue(product);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    if (selectedColors.length) {
      list = list.filter((product) => {
        const productColors = Array.isArray(product.colors)
          ? product.colors.map((color) => String(color).toLowerCase())
          : [product.colors].filter(Boolean).map((color) => String(color).toLowerCase());
        return selectedColors.some((color) => productColors.includes(color.toLowerCase()));
      });
    }

    if (selectedTags.length) {
      list = list.filter((product) => {
        const productTags = Array.isArray(product.tags)
          ? product.tags.map((tag) => String(tag).toLowerCase())
          : [];
        return selectedTags.some((tag) => productTags.includes(tag.toLowerCase()));
      });
    }

    if (sortBy === "low-high") {
      list.sort((a, b) => getPriceValue(a) - getPriceValue(b));
    } else if (sortBy === "high-low") {
      list.sort((a, b) => getPriceValue(b) - getPriceValue(a));
    } else if (sortBy === "rating") {
      list.sort((a, b) => getRatingValue(b) - getRatingValue(a));
    } else if (sortBy === "newest") {
      list.sort((a, b) => getCreatedValue(b) - getCreatedValue(a));
    }

    return list;
  }, [baseProducts, selectedCat, searchText, priceRange, selectedColors, selectedTags, sortBy]);

  const total = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const display = filteredProducts.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  // Sync URL params → state
  useEffect(() => {
    const cat    = searchParams.get("category") || "";
    const search = searchParams.get("search")   || "";
    setSelectedCat(cat);
    setSearchText(search);
    setPage(1);
  }, [searchParams]);

  const applyPriceFilter = () => {
    setPriceRange([...priceInput]);
    setPage(1);
  };

  const toggleColor = (c) => {
    setSelectedColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
    setPage(1);
  };

  const toggleTag = (t) => {
    setSelectedTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
    setPage(1);
  };

  const handleSort = (val) => { setSortBy(val); setPage(1); };
  const handleCat  = (cat) => { setSelectedCat(prev => prev === cat ? "" : cat); setPage(1); };

  const startItem = total === 0 ? 0 : (currentPage - 1) * PER_PAGE + 1;
  const endItem   = Math.min(currentPage * PER_PAGE, total);

  // ── Recent posts (from same API) ──
  const { data: recentData } = useFetch("/api/products?limit=2&sort=newest");
  const recentPosts = Array.isArray(recentData) ? recentData.slice(0,2)
    : recentData?.products?.slice(0,2) || MOCK_PRODUCTS.slice(0,2);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;600;700&family=Lato:wght@300;400;700&display=swap');

        .ps-page { font-family:'Lato',sans-serif; background:#fff; color:#333; overflow-x:hidden;  }
        .ps-layout { display:grid; grid-template-columns:240px 1fr; gap:36px; max-width:1260px; margin:0 auto; padding:36px 24px; width:100%; max-width:1260px; }
        .ps-sidebar { min-width:0; }

        /* Price slider */
        .ps-slider { -webkit-appearance:none; appearance:none; width:100%; height:4px; border-radius:2px; background:linear-gradient(to right, #e8b14f var(--val,50%), #e0ddd8 var(--val,50%)); outline:none; cursor:pointer; }
        .ps-slider::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px; border-radius:50%; background:#e8b14f; cursor:pointer; border:2px solid #fff; box-shadow:0 1px 4px rgba(0,0,0,.2); }
        .ps-slider::-moz-range-thumb { width:16px; height:16px; border-radius:50%; background:#e8b14f; cursor:pointer; border:2px solid #fff; }

        /* Category list */
        .ps-cat-item { display:flex; justify-content:space-between; align-items:center; padding:7px 0; cursor:pointer; font-size:13px; color:#555; border-bottom:1px solid #f5f5f5; transition:color .2s; }
        .ps-cat-item:hover, .ps-cat-item.active { color:#e8b14f; }
        .ps-cat-item.active { font-weight:700; }
        .ps-cat-plus { width:18px; height:18px; border:1px solid #ddd; border-radius:3px; display:flex; align-items:center; justify-content:center; font-size:14px; color:#999; flex-shrink:0; }

        /* Color dots */
        .ps-color { width:20px; height:20px; border-radius:50%; cursor:pointer; border:2px solid transparent; transition:border-color .2s; flex-shrink:0; }
        .ps-color.active { border-color:#333; }

        /* Tag pills */
        .ps-tag { padding:5px 12px; border:1px solid #e0e0e0; border-radius:999px; font-size:11px; color:#666; cursor:pointer; transition:all .2s; font-family:'Josefin Sans',sans-serif; font-weight:600; letter-spacing:.5px; background:#fff; }
        .ps-tag:hover { border-color:#e8b14f; color:#e8b14f; }
        .ps-tag.active { background:#e8b14f; border-color:#e8b14f; color:#fff; }

        /* Toolbar */
        .ps-toolbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
        .ps-view-btn { width:34px; height:34px; border:1px solid #e0e0e0; border-radius:6px; background:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .2s; }
        .ps-view-btn.active { background:#1a1a1a; border-color:#1a1a1a; }
        .ps-sort-select { padding:8px 32px 8px 12px; border:1px solid #e0e0e0; border-radius:6px; font-size:13px; font-family:'Lato',sans-serif; color:#555; background:#fff; cursor:pointer; outline:none; appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 10px center; }

        /* Product grid */
        .ps-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
        .ps-list { display:flex; flex-direction:column; gap:16px; }

        /* Pagination */
        .ps-page-btn { width:36px; height:36px; border-radius:999px; border:1px solid #e0e0e0; background:#fff; cursor:pointer; font-size:13px; font-family:'Josefin Sans',sans-serif; font-weight:600; color:#555; transition:all .2s; display:flex; align-items:center; justify-content:center; }
        .ps-page-btn:hover { border-color:#e8b14f; color:#e8b14f; }
        .ps-page-btn.active { background:#e8b14f; border-color:#e8b14f; color:#fff; }
        .ps-page-btn.next { padding:0 16px; width:auto; }

        /* Recent post */
        .ps-recent { display:flex; gap:12px; align-items:center; padding:10px 0; border-bottom:1px solid #f5f5f5; cursor:pointer; }
        .ps-recent:last-child { border-bottom:none; }

        /* Skeleton shimmer */
        @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        .ps-skeleton { background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%); background-size:800px 100%; animation:shimmer 1.4s infinite; border-radius:8px; }

        @media(max-width:900px){
          .ps-layout { grid-template-columns:1fr; }
          .ps-sidebar { display:none; }
          .ps-grid { grid-template-columns:repeat(2,1fr); }
        }
        @media(max-width:500px){
          .ps-layout { padding:24px 16px; }
          .ps-grid { grid-template-columns:1fr; }
        }
      `}</style>

      <div className="ps-page">
        <div className="ps-layout">

          {/* ══ SIDEBAR ══ */}
          <aside className="ps-sidebar">

            {/* Price filter */}
            <SideSection title="Filter by price">
              <input type="range" min="0" max="200" value={priceInput[1]}
                className="ps-slider"
                style={{ "--val": `${(priceInput[1]/200)*100}%` }}
                onChange={e => setPriceInput([priceInput[0], Number(e.target.value)])}/>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:12 }}>
                <span style={{ fontSize:13, color:"#555" }}>
                  Price: <strong>${priceInput[0]}</strong> — <strong>${priceInput[1]}</strong>
                </span>
                <button onClick={applyPriceFilter} style={{
                  background:"#1a1a1a", color:"#fff", border:"none",
                  padding:"6px 16px", fontSize:11, fontFamily:"'Josefin Sans',sans-serif",
                  fontWeight:700, letterSpacing:1, textTransform:"uppercase",
                  cursor:"pointer", borderRadius:999,
                }}>Filter</button>
              </div>
            </SideSection>

            {/* Categories */}
            <SideSection title="Product Categories">
              {CATEGORIES.map(cat => (
                <div key={cat.value}
                  className={`ps-cat-item${selectedCat === cat.value ? " active" : ""}`}
                  onClick={() => handleCat(cat.value)}>
                  <span>{cat.label}</span>
                </div>
              ))}
            </SideSection>

            {/* Color */}
         

            {/* Recent Posts */}
            <SideSection title="Recent Post">
              {recentPosts.map(p => {
                const pid = p._id || p.id;
                return (
                  <Link key={pid} to={`/products/${pid}`} style={{ textDecoration:"none" }}>
                    <div className="ps-recent">
                      <div style={{ width:64, height:64, flexShrink:0, borderRadius:8, overflow:"hidden", background:"#f5f5f5", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        {p.image || p.thumbnail
                          ? <img src={p.image||p.thumbnail} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                          : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        }
                      </div>
                      <div style={{ minWidth:0 }}>
                        <p style={{ fontSize:11, color:"#aaa", marginBottom:3, fontFamily:"'Josefin Sans',sans-serif" }}>
                          {(p.tags || []).join(", ") || p.category || ""}
                        </p>
                        <p style={{ fontSize:12, fontWeight:600, color:"#333", fontFamily:"'Josefin Sans',sans-serif", marginBottom:4, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                          {p.name}
                        </p>
                        <div style={{ display:"flex", gap:8 }}>
                          <span style={{ fontSize:12, color:"#e8b14f", fontWeight:700, fontFamily:"'Josefin Sans',sans-serif" }}>
                            {formatCurrency(p.price || p.sale_price || 0)}
                          </span>
                          {(p.oldPrice || p.original_price) && (
                            <span style={{ fontSize:11, color:"#bbb", textDecoration:"line-through" }}>
                              {formatCurrency(p.oldPrice || p.original_price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </SideSection>

            {/* Tags */}
            <SideSection title="Product Tags">
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {TAGS.map(t => (
                  <button key={t} className={`ps-tag${selectedTags.includes(t) ? " active" : ""}`}
                    onClick={() => toggleTag(t)}>{t}</button>
                ))}
              </div>
            </SideSection>

          </aside>

          {/* ══ MAIN ══ */}
          <div>

            {/* Toolbar */}
            <div className="ps-toolbar">
              {/* View toggles */}
              <div style={{ display:"flex", gap:8 }}>
                <button className={`ps-view-btn${viewMode==="grid" ? " active" : ""}`}
                  onClick={() => setViewMode("grid")} title="Grid view">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill={viewMode==="grid"?"#fff":"#555"}>
                    <rect x="0" y="0" width="6" height="6"/><rect x="8" y="0" width="6" height="6"/>
                    <rect x="0" y="8" width="6" height="6"/><rect x="8" y="8" width="6" height="6"/>
                  </svg>
                </button>
                <button className={`ps-view-btn${viewMode==="list" ? " active" : ""}`}
                  onClick={() => setViewMode("list")} title="List view">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill={viewMode==="list"?"#fff":"#555"}>
                    <rect x="0" y="0" width="14" height="3"/><rect x="0" y="5.5" width="14" height="3"/>
                    <rect x="0" y="11" width="14" height="3"/>
                  </svg>
                </button>
              </div>

              {/* Result count */}
              <span style={{ fontSize:13, color:"#999", fontFamily:"'Josefin Sans',sans-serif" }}>
                {loading ? "Loading…" : `Showing ${startItem}–${endItem} of ${total} results`}
              </span>

              {/* Sort */}
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:13, color:"#999", fontFamily:"'Josefin Sans',sans-serif" }}>Sort By:</span>
                <select className="ps-sort-select" value={sortBy} onChange={e => handleSort(e.target.value)}>
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background:"#fff3f3", border:"1px solid #fdd", borderRadius:8,
                padding:"12px 16px", marginBottom:20, fontSize:13, color:"#c00" }}>
                {error}
              </div>
            )}

            {/* Grid / List */}
            {loading ? (
              <div className="ps-grid">
                {Array.from({length:9}).map((_,i) => (
                  <div key={i} style={{ borderRadius:12, overflow:"hidden" }}>
                    <div className="ps-skeleton" style={{ aspectRatio:"1/1", marginBottom:8 }}/>
                    <div className="ps-skeleton" style={{ height:14, marginBottom:6, width:"70%" }}/>
                    <div className="ps-skeleton" style={{ height:12, width:"40%" }}/>
                  </div>
                ))}
              </div>
            ) : (
              display.length > 0 ? (
                <div className={viewMode === "grid" ? "ps-grid" : "ps-list"}>
                  {display.map(p => (
                    <ProductCard key={p._id || p.id} product={p} viewMode={viewMode}/>
                  ))}
                </div>
              ) : (
                <div style={{
                  background:"#faf7f2",
                  border:"1px solid #eee3d1",
                  borderRadius:12,
                  padding:"24px 20px",
                  textAlign:"center",
                  color:"#7a6d5d",
                  fontFamily:"'Josefin Sans',sans-serif",
                }}>
                  No products match your current filters.
                </div>
              )
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:40, flexWrap:"wrap" }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button key={n} className={`ps-page-btn${currentPage===n?" active":""}`}
                    onClick={() => { setPage(n); window.scrollTo(0,0); }}>
                    {n}
                  </button>
                ))}
                {currentPage < totalPages && (
                  <button className="ps-page-btn next"
                    onClick={() => { setPage(p => p+1); window.scrollTo(0,0); }}>
                    Next →
                  </button>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
