import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import useCart from "../hooks/useCart";
import formatCurrency from "../utils/formatCurrency";

// ─── Inline styles ─────────────────────────────────────────────────────────
const S = {
  page:            { fontFamily:"'DM Sans','Segoe UI',sans-serif", background:"#faf9f6", color:"#1a1a1a", minHeight:"100vh", },
  breadcrumb:      { padding:"14px 60px", fontSize:12, color:"#888", display:"flex", gap:6, alignItems:"center" },
  breadcrumbLink:  { color:"#888", textDecoration:"none" },
  productSection:  { display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, padding:"20px 60px 60px", maxWidth:1200, margin:"0 auto" },
  gallery:         { display:"flex", flexDirection:"column", gap:14 },
  mainImg:         { width:"100%", aspectRatio:"4/5", background:"#f0ece5", borderRadius:4, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" },
  mainImgEl:       { width:"100%", height:"100%", objectFit:"cover" },
  thumbs:          { display:"flex", gap:10 },
  thumb:           { width:80, height:90, borderRadius:3, overflow:"hidden", cursor:"pointer", border:"2px solid transparent", background:"#e8e2d9", flexShrink:0, transition:"border-color .2s" },
  thumbActive:     { borderColor:"#1a1a1a" },
  thumbImg:        { width:"100%", height:"100%", objectFit:"cover" },
  galleryNav:      { display:"flex", gap:10, marginTop:4 },
  navBtn:          { width:36, height:36, border:"1px solid #e8e4df", background:"#fff", borderRadius:"50%", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 },
  info:            { display:"flex", flexDirection:"column", gap:18, paddingTop:8 },
  tag:             { fontSize:11, letterSpacing:2, textTransform:"uppercase", color:"#c9a96e", fontWeight:500 },
  title:           { fontFamily:"'Playfair Display',Georgia,serif", fontSize:32, fontWeight:500, lineHeight:1.2, margin:0 },
  starsRow:        { display:"flex", alignItems:"center", gap:6 },
  star:            { color:"#c9a96e", fontSize:15 },
  reviewCount:     { fontSize:12, color:"#888", marginTop:-10 },
  priceRow:        { display:"flex", alignItems:"baseline", gap:12 },
  price:           { fontFamily:"'Playfair Display',Georgia,serif", fontSize:28, fontWeight:500 },
  priceOld:        { fontSize:16, color:"#888", textDecoration:"line-through" },
  saleBadge:       { background:"#e05252", color:"#fff", fontSize:10, padding:"3px 8px", borderRadius:2, letterSpacing:1, textTransform:"uppercase", fontWeight:500 },
  divider:         { height:1, background:"#e8e4df" },
  meta:            { display:"flex", gap:40 },
  metaLabel:       { fontSize:11, textTransform:"uppercase", letterSpacing:1, color:"#888", display:"block", marginBottom:4 },
  metaValue:       { fontSize:13, fontWeight:500 },
  description:     { fontSize:14, lineHeight:1.8, color:"#555", margin:0 },
  optionLabel:     { fontSize:11, textTransform:"uppercase", letterSpacing:1, color:"#888", marginBottom:10 },
  sizes:           { display:"flex", gap:8, flexWrap:"wrap" },
  sizeBtn:         { width:44, height:44, border:"1px solid #e8e4df", background:"#fff", borderRadius:3, cursor:"pointer", fontSize:13, fontWeight:500, fontFamily:"inherit" },
  sizeBtnActive:   { background:"#1a1a1a", color:"#fff", borderColor:"#1a1a1a" },
  colors:          { display:"flex", gap:10 },
  colorSwatch:     { width:26, height:26, borderRadius:"50%", cursor:"pointer", border:"3px solid transparent", transition:"border-color .2s" },
  colorSwatchActive:{ borderColor:"#1a1a1a" },
  qtyCart:         { display:"flex", gap:12, alignItems:"center" },
  qtyBox:          { display:"flex", alignItems:"center", border:"1px solid #e8e4df", borderRadius:3, overflow:"hidden", background:"#fff" },
  qtyBtn:          { width:40, height:50, border:"none", background:"none", cursor:"pointer", fontSize:18, color:"#1a1a1a", fontFamily:"inherit" },
  qtyInput:        { width:50, height:50, border:"none", textAlign:"center", fontSize:14, fontWeight:500, background:"none", fontFamily:"inherit" },
  addBtn:          { flex:1, height:50, background:"#1a1a1a", color:"#fff", border:"none", borderRadius:3, fontSize:12, letterSpacing:2, textTransform:"uppercase", fontWeight:500, cursor:"pointer", fontFamily:"inherit" },
  addBtnDisabled:  { background:"#ccc", cursor:"not-allowed" },
  wishlistBtn:     { height:50, width:50, border:"1px solid #e8e4df", background:"#fff", borderRadius:3, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" },
  stockOk:         { fontSize:12, color:"#6b8f71", marginTop:-8 },
  stockLow:        { fontSize:12, color:"#e05252", marginTop:-8 },
  shareRow:        { display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" },
  shareLabel:      { fontSize:12, color:"#888" },
  shareIcon:       { width:32, height:32, border:"1px solid #e8e4df", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", background:"#fff" },
  popularSection:  { background:"#f5f2ee", padding:"60px" },
  sectionHeader:   { textAlign:"center", marginBottom:40 },
  sectionTitle:    { fontFamily:"'Playfair Display',Georgia,serif", fontSize:30, fontWeight:500, marginBottom:10 },
  sectionSub:      { color:"#888", fontSize:13, maxWidth:480, margin:"0 auto", lineHeight:1.7 },
  productsGrid:    { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24, maxWidth:1200, margin:"0 auto" },
  productCard:     { background:"#fff", borderRadius:4, overflow:"hidden", cursor:"pointer", textDecoration:"none", color:"inherit", display:"block" },
  cardImg:         { aspectRatio:"3/4", background:"#e8e2d9", position:"relative", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" },
  cardImgEl:       { width:"100%", height:"100%", objectFit:"cover" },
  saleTag:         { position:"absolute", top:12, left:12, background:"#e05252", color:"#fff", fontSize:10, padding:"3px 8px", borderRadius:2, letterSpacing:1, textTransform:"uppercase", fontWeight:500 },
  cardBody:        { padding:14 },
  cardName:        { fontWeight:500, fontSize:14, marginBottom:4 },
  cardDesc:        { fontSize:12, color:"#888", marginBottom:8 },
  cardPrice:       { fontWeight:500, fontSize:15, fontFamily:"'Playfair Display',Georgia,serif" },
  cardPriceOld:    { fontSize:12, color:"#888", textDecoration:"line-through", marginRight:6 },
  centered:        { display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh", flexDirection:"column", gap:12, color:"#888" },
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function StarRating({ rating = 5 }) {
  return (
    <div style={S.starsRow}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ ...S.star, opacity: i <= rating ? 1 : 0.25 }}>★</span>
      ))}
    </div>
  );
}

function ImgPlaceholder() {
  return (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  );
}

function RelatedCard({ product }) {
  const pid = product._id || product.id;
  const onSale    = !!(product.oldPrice || product.original_price);
  const showPrice = product.price ?? product.sale_price ?? 0;
  const origPrice = product.oldPrice ?? product.original_price ?? null;
  return (
    <Link to={`/products/${pid}`} style={S.productCard}>
      <div style={S.cardImg}>
        {onSale && <span style={S.saleTag}>Sale</span>}
        {product.image || product.thumbnail
          ? <img src={product.image || product.thumbnail} alt={product.name} style={S.cardImgEl}/>
          : <ImgPlaceholder/>}
      </div>
      <div style={S.cardBody}>
        <div style={S.cardName}>{product.name}</div>
        <div style={S.cardDesc}>{product.category || "Clothing"}</div>
        <div>
          {onSale && origPrice && <span style={S.cardPriceOld}>{formatCurrency(origPrice)}</span>}
          <span style={{ ...S.cardPrice, ...(onSale ? { color:"#e05252" } : {}) }}>
            {formatCurrency(showPrice)}
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────

export default function ProductDetail() {
  const { id } = useParams();
  const { data: product, loading, error } = useFetch(`/products/${id}`);
  const { data: related } = useFetch(`/products?limit=5`);
  const { addToCart } = useCart();

  const [qty,          setQty]          = useState(1);
  const [activeImg,    setActiveImg]    = useState(0);
  const [activeSize,   setActiveSize]   = useState(null);
  const [activeColor,  setActiveColor]  = useState(0);

  // Loading
  if (loading) return (
    <div style={{ ...S.page, ...S.centered }}>
      <div style={{ fontSize:32 }}>⟳</div>
      <p>Loading product…</p>
    </div>
  );

  // Error / not found
  if (error || !product) return (
    <div style={{ ...S.page, ...S.centered }}>
      <p style={{ fontSize:18 }}>Product not found</p>
      <Link to="/" style={{ color:"#c9a96e", fontSize:14 }}>← Back to shop</Link>
    </div>
  );

  // Normalise fields — handles whatever shape your API returns
  const images       = product.images?.length ? product.images : product.image ? [product.image] : [];
  const sizes        = product.sizes  ?? ["XS","S","M","L","XL"];
  const colors       = product.colors ?? ["#2c2c2c","#4a6fa5","#8b6355","#c9a96e"];
  const isOnSale     = !!(product.oldPrice || product.original_price);
  const displayPrice = product.price ?? product.sale_price ?? 0;
  const origPrice    = product.oldPrice ?? product.original_price ?? null;
  const stockCount   = product.stock ?? product.stock_count ?? null;
  const outOfStock   = stockCount === 0;

  const handleQty = delta => {
    const next = Math.max(1, qty + delta);
    setQty(stockCount != null ? Math.min(next, stockCount) : next);
  };

  const relatedList = Array.isArray(related)
    ? related.filter(p => String(p._id || p.id) !== String(id)).slice(0, 4)
    : [];

  return (
    <div style={S.page}>

      {/* Breadcrumb */}
      <div style={S.breadcrumb}>
        <Link to="/"         style={S.breadcrumbLink}>Home</Link><span>/</span>
        <Link to="/products" style={S.breadcrumbLink}>Collection</Link><span>/</span>
        <span style={{ color:"#1a1a1a" }}>{product.name}</span>
      </div>

      {/* Product grid */}
      <div style={S.productSection}>

        {/* Gallery */}
        <div style={S.gallery}>
          <div style={S.mainImg}>
            {images.length > 0
              ? <img src={images[activeImg]} alt={product.name} style={S.mainImgEl}/>
              : <ImgPlaceholder/>}
          </div>

          {images.length > 1 && (
            <div style={S.thumbs}>
              {images.map((src,i) => (
                <div key={i} onClick={() => setActiveImg(i)}
                  style={{ ...S.thumb, ...(activeImg === i ? S.thumbActive : {}) }}>
                  <img src={src} alt={`view ${i+1}`} style={S.thumbImg}/>
                </div>
              ))}
            </div>
          )}

          <div style={S.galleryNav}>
            <button style={S.navBtn} onClick={() => setActiveImg(p => Math.max(0, p-1))}>←</button>
            <button style={S.navBtn} onClick={() => setActiveImg(p => Math.min(images.length-1, p+1))}>→</button>
          </div>
        </div>

        {/* Info */}
        <div style={S.info}>
          <div style={S.tag}>{product.tag ?? product.category ?? "Collection"}</div>
          <h1 style={S.title}>{product.name}</h1>

          <StarRating rating={product.rating ?? product.rating_average ?? 5}/>
          <p style={S.reviewCount}>
            ({product.reviewCount ?? product.review_count ?? 0} reviews)
          </p>

          <div style={S.priceRow}>
            {isOnSale && origPrice && <span style={S.priceOld}>{formatCurrency(origPrice)}</span>}
            <span style={{ ...S.price, ...(isOnSale ? { color:"#e05252" } : {}) }}>
              {formatCurrency(displayPrice)}
            </span>
            {isOnSale && <span style={S.saleBadge}>Sale</span>}
          </div>

          <div style={S.divider}/>

          <div style={S.meta}>
            {product.brand    && <div><span style={S.metaLabel}>Brand</span>   <span style={S.metaValue}>{product.brand}</span></div>}
            {product.category && <div><span style={S.metaLabel}>Category</span><span style={S.metaValue}>{product.category}</span></div>}
            {product.sku      && <div><span style={S.metaLabel}>SKU</span>     <span style={S.metaValue}>{product.sku}</span></div>}
          </div>

          {product.description && <p style={S.description}>{product.description}</p>}

          {/* Sizes */}
          {sizes.length > 0 && (
            <div>
              <div style={S.optionLabel}>Select Size</div>
              <div style={S.sizes}>
                {sizes.map(size => (
                  <button key={size} onClick={() => setActiveSize(size)}
                    style={{ ...S.sizeBtn, ...(activeSize === size ? S.sizeBtnActive : {}) }}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {colors.length > 0 && (
            <div>
              <div style={S.optionLabel}>Select Color</div>
              <div style={S.colors}>
                {colors.map((c,i) => (
                  <div key={i} onClick={() => setActiveColor(i)}
                    style={{ ...S.colorSwatch, background:c, ...(activeColor === i ? S.colorSwatchActive : {}) }}/>
                ))}
              </div>
            </div>
          )}

          {/* Qty + Add to Cart */}
          <div style={S.qtyCart}>
            <div style={S.qtyBox}>
              <button style={S.qtyBtn} onClick={() => handleQty(-1)}>−</button>
              <input type="number" min="1" value={qty}
                onChange={e => {
                  const v = Math.max(1, Number(e.target.value));
                  setQty(stockCount != null ? Math.min(v, stockCount) : v);
                }}
                style={S.qtyInput}/>
              <button style={S.qtyBtn} onClick={() => handleQty(1)}>+</button>
            </div>

            <button
              onClick={() => !outOfStock && addToCart(product, qty, {
                size: activeSize ?? null,
                color: colors[activeColor] ?? null,
              })}
              disabled={outOfStock}
              style={{ ...S.addBtn, ...(outOfStock ? S.addBtnDisabled : {}) }}>
              {outOfStock ? "Out of Stock" : "Add to Cart"}
            </button>

            <button style={S.wishlistBtn} title="Add to wishlist">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>

          {/* Stock */}
          {stockCount != null && (
            <p style={stockCount > 5 ? S.stockOk : S.stockLow}>
              {stockCount > 0 ? `${stockCount} in stock` : "Out of stock"}
            </p>
          )}

          {/* Share */}
          <div style={S.shareRow}>
            <span style={S.shareLabel}>Share this item with your friends</span>
            {/* Facebook */}
            <div style={S.shareIcon}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </div>
            {/* Twitter */}
            <div style={S.shareIcon}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
              </svg>
            </div>
            {/* Instagram */}
            <div style={S.shareIcon}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {relatedList.length > 0 && (
        <div style={S.popularSection}>
          <div style={S.sectionHeader}>
            <h2 style={S.sectionTitle}>Popular Products</h2>
            <p style={S.sectionSub}>You might also like these items from our collection.</p>
          </div>
          <div style={S.productsGrid}>
            {relatedList.map(p => <RelatedCard key={p._id || p.id} product={p}/>)}
          </div>
        </div>
      )}

    </div>
  );
}
