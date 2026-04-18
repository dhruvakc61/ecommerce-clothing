import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import useCart from "../hooks/useCart";
import formatCurrency from "../utils/formatCurrency";

function StarRating({ rating = 5 }) {
  return (
    <div className="pd-stars">
      {[1, 2, 3, 4, 5].map((value) => (
        <span
          key={value}
          className="pd-star"
          style={{ opacity: value <= rating ? 1 : 0.24 }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function ImgPlaceholder() {
  return (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function RelatedCard({ product }) {
  const pid = product._id || product.id;
  const onSale = !!(product.oldPrice || product.original_price);
  const showPrice = product.price ?? product.sale_price ?? 0;
  const origPrice = product.oldPrice ?? product.original_price ?? null;

  return (
    <Link to={`/products/${pid}`} className="pd-related-card">
      <div className="pd-related-media">
        {onSale ? <span className="pd-related-badge">Sale</span> : null}
        {product.image || product.thumbnail ? (
          <img
            src={product.image || product.thumbnail}
            alt={product.name}
            className="pd-related-image"
          />
        ) : (
          <ImgPlaceholder />
        )}
      </div>
      <div className="pd-related-body">
        <div className="pd-related-name">{product.name}</div>
        <div className="pd-related-desc">{product.category || "Clothing"}</div>
        <div className="pd-related-price-row">
          {onSale && origPrice ? (
            <span className="pd-related-price-old">{formatCurrency(origPrice)}</span>
          ) : null}
          <span className={`pd-related-price${onSale ? " is-sale" : ""}`}>
            {formatCurrency(showPrice)}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const { data: product, loading, error } = useFetch(`/api/products/${id}`);
  const { data: related } = useFetch(`/api/products?limit=5`);
  const { addToCart } = useCart();

  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeSize, setActiveSize] = useState(null);
  const [activeColor, setActiveColor] = useState(0);

  if (loading) {
    return (
      <div className="pd-page pd-centered">
        <style>{styles}</style>
        <div style={{ fontSize: 32 }}>⟳</div>
        <p>Loading product…</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pd-page pd-centered">
        <style>{styles}</style>
        <p style={{ fontSize: 18 }}>Product not found</p>
        <Link to="/" className="pd-back-link">
          ← Back to shop
        </Link>
      </div>
    );
  }

  const images = product.images?.length
    ? product.images
    : product.image || product.thumbnail
      ? [product.image || product.thumbnail]
      : [];
  const sizes = product.sizes ?? ["XS", "S", "M", "L", "XL"];
  const colors = product.colors ?? ["#2c2c2c", "#4a6fa5", "#8b6355", "#c9a96e"];
  const isOnSale = !!(product.oldPrice || product.original_price);
  const displayPrice = product.price ?? product.sale_price ?? 0;
  const origPrice = product.oldPrice ?? product.original_price ?? null;
  const stockCount = product.stock ?? product.stock_count ?? null;
  const outOfStock = stockCount === 0;

  const handleQty = (delta) => {
    const next = Math.max(1, qty + delta);
    setQty(stockCount != null ? Math.min(next, stockCount) : next);
  };

  const relatedList = Array.isArray(related)
    ? related.filter((item) => String(item._id || item.id) !== String(id)).slice(0, 4)
    : [];

  const safeImageIndex = images.length ? Math.min(activeImg, images.length - 1) : 0;

  return (
    <div className="pd-page">
      <style>{styles}</style>

      <div className="pd-breadcrumb">
        <Link to="/" className="pd-breadcrumb-link">
          Home
        </Link>
        <span>/</span>
        <Link to="/products" className="pd-breadcrumb-link">
          Collection
        </Link>
        <span>/</span>
        <span className="pd-breadcrumb-current">{product.name}</span>
      </div>

      <section className="pd-shell">
        <div className="pd-gallery-col">
          <div className="pd-main-image">
            {images.length > 0 ? (
              <img
                src={images[safeImageIndex]}
                alt={product.name}
                className="pd-main-image-el"
              />
            ) : (
              <ImgPlaceholder />
            )}
          </div>

          {images.length > 1 ? (
            <div className="pd-thumbs" role="tablist" aria-label="Product images">
              {images.map((src, index) => (
                <button
                  key={src || index}
                  type="button"
                  className={`pd-thumb${safeImageIndex === index ? " is-active" : ""}`}
                  onClick={() => setActiveImg(index)}
                >
                  <img src={src} alt={`${product.name} view ${index + 1}`} className="pd-thumb-img" />
                </button>
              ))}
            </div>
          ) : null}

          {images.length > 1 ? (
            <div className="pd-gallery-nav">
              <button
                type="button"
                className="pd-nav-btn"
                onClick={() => setActiveImg((value) => Math.max(0, value - 1))}
              >
                ←
              </button>
              <button
                type="button"
                className="pd-nav-btn"
                onClick={() => setActiveImg((value) => Math.min(images.length - 1, value + 1))}
              >
                →
              </button>
            </div>
          ) : null}
        </div>

        <div className="pd-info">
          <div className="pd-tag">{product.tag ?? product.category ?? "Collection"}</div>
          <h1 className="pd-title">{product.name}</h1>

          <StarRating rating={product.rating ?? product.rating_average ?? 5} />
          <p className="pd-reviews">
            ({product.reviewCount ?? product.review_count ?? 0} reviews)
          </p>

          <div className="pd-price-row">
            {isOnSale && origPrice ? (
              <span className="pd-price-old">{formatCurrency(origPrice)}</span>
            ) : null}
            <span className={`pd-price${isOnSale ? " is-sale" : ""}`}>
              {formatCurrency(displayPrice)}
            </span>
            {isOnSale ? <span className="pd-sale-badge">Sale</span> : null}
          </div>

          <div className="pd-divider" />

          <div className="pd-meta">
            {product.brand ? (
              <div className="pd-meta-item">
                <span className="pd-meta-label">Brand</span>
                <span className="pd-meta-value">{product.brand}</span>
              </div>
            ) : null}
            {product.category ? (
              <div className="pd-meta-item">
                <span className="pd-meta-label">Category</span>
                <span className="pd-meta-value">{product.category}</span>
              </div>
            ) : null}
            {product.sku ? (
              <div className="pd-meta-item">
                <span className="pd-meta-label">SKU</span>
                <span className="pd-meta-value">{product.sku}</span>
              </div>
            ) : null}
          </div>

          {product.description ? <p className="pd-description">{product.description}</p> : null}

          {sizes.length > 0 ? (
            <div className="pd-option-group">
              <div className="pd-option-label">Select Size</div>
              <div className="pd-sizes">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`pd-size-btn${activeSize === size ? " is-active" : ""}`}
                    onClick={() => setActiveSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {colors.length > 0 ? (
            <div className="pd-option-group">
              <div className="pd-option-label">Select Color</div>
              <div className="pd-colors">
                {colors.map((color, index) => (
                  <button
                    key={`${color}-${index}`}
                    type="button"
                    className={`pd-color-swatch${activeColor === index ? " is-active" : ""}`}
                    onClick={() => setActiveColor(index)}
                    style={{ background: color }}
                    aria-label={`Choose color ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div className="pd-actions">
            <div className="pd-qty-box">
              <button type="button" className="pd-qty-btn" onClick={() => handleQty(-1)}>
                −
              </button>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(event) => {
                  const value = Math.max(1, Number(event.target.value || 1));
                  setQty(stockCount != null ? Math.min(value, stockCount) : value);
                }}
                className="pd-qty-input"
              />
              <button type="button" className="pd-qty-btn" onClick={() => handleQty(1)}>
                +
              </button>
            </div>

            <button
              type="button"
              className={`pd-add-btn${outOfStock ? " is-disabled" : ""}`}
              disabled={outOfStock}
              onClick={() =>
                !outOfStock &&
                addToCart(product, qty, {
                  size: activeSize ?? null,
                  color: colors[activeColor] ?? null,
                })
              }
            >
              {outOfStock ? "Out of Stock" : "Add to Cart"}
            </button>

            <button type="button" className="pd-wishlist-btn" title="Add to wishlist">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>

          {stockCount != null ? (
            <p className={`pd-stock${stockCount > 5 ? " is-ok" : " is-low"}`}>
              {stockCount > 0 ? `${stockCount} in stock` : "Out of stock"}
            </p>
          ) : null}

          <div className="pd-share-row">
            <span className="pd-share-label">Share this item with your friends</span>
            <div className="pd-share-icons">
              <div className="pd-share-icon">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </div>
              <div className="pd-share-icon">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </div>
              <div className="pd-share-icon">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedList.length > 0 ? (
        <section className="pd-related-section">
          <div className="pd-related-header">
            <h2 className="pd-related-title">Popular Products</h2>
            <p className="pd-related-copy">
              You might also like these items from our collection.
            </p>
          </div>
          <div className="pd-related-grid">
            {relatedList.map((item) => (
              <RelatedCard key={item._id || item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

const styles = `
  .pd-page {
    min-height: 100vh;
    background:
      radial-gradient(circle at top right, rgba(216, 177, 138, 0.16), transparent 26%),
      #faf9f6;
    color: var(--theme-ink);
    font-family: var(--font-body);
  }
  .pd-centered {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 12px;
    color: var(--theme-muted);
  }
  .pd-back-link {
    color: var(--theme-accent);
    text-decoration: none;
  }
  .pd-breadcrumb {
    max-width: 1240px;
    margin: 0 auto;
    padding: 22px 24px 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    font-size: 12px;
    color: var(--theme-muted);
  }
  .pd-breadcrumb-link {
    color: inherit;
    text-decoration: none;
  }
  .pd-breadcrumb-current {
    color: var(--theme-ink);
    overflow-wrap: anywhere;
  }
  .pd-shell {
    max-width: 1240px;
    margin: 0 auto;
    padding: 18px 24px 72px;
    display: grid;
    grid-template-columns: minmax(0, 1.02fr) minmax(0, 0.98fr);
    gap: clamp(28px, 4vw, 56px);
    align-items: start;
  }
  .pd-gallery-col,
  .pd-info {
    min-width: 0;
  }
  .pd-gallery-col {
    display: grid;
    gap: 14px;
  }
  .pd-main-image {
    width: 100%;
    aspect-ratio: 4 / 5;
    border-radius: 28px;
    overflow: hidden;
    background: linear-gradient(180deg, #f6efe6 0%, #eee3d5 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 30px 48px rgba(36, 28, 23, 0.08);
  }
  .pd-main-image-el,
  .pd-thumb-img,
  .pd-related-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .pd-thumbs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(82px, 1fr));
    gap: 10px;
  }
  .pd-thumb {
    padding: 0;
    border: 2px solid transparent;
    border-radius: 18px;
    overflow: hidden;
    cursor: pointer;
    background: #e8e2d9;
    aspect-ratio: 4 / 5;
    transition: border-color 0.2s ease, transform 0.2s ease;
  }
  .pd-thumb.is-active {
    border-color: var(--theme-accent);
    transform: translateY(-2px);
  }
  .pd-gallery-nav {
    display: flex;
    gap: 10px;
  }
  .pd-nav-btn,
  .pd-size-btn,
  .pd-color-swatch,
  .pd-qty-btn,
  .pd-add-btn,
  .pd-wishlist-btn {
    font: inherit;
  }
  .pd-nav-btn {
    width: 40px;
    height: 40px;
    border: 1px solid var(--theme-border);
    border-radius: 999px;
    background: var(--theme-surface);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .pd-info {
    display: grid;
    gap: 18px;
    padding-top: 10px;
  }
  .pd-tag,
  .pd-meta-label,
  .pd-option-label {
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--theme-accent);
    font-weight: 700;
  }
  .pd-title,
  .pd-price,
  .pd-related-title {
    margin: 0;
    font-family: var(--font-display);
    color: var(--theme-ink);
  }
  .pd-title {
    font-size: clamp(2.4rem, 5vw, 4.4rem);
    line-height: 0.95;
    max-width: 11ch;
  }
  .pd-stars {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--theme-accent);
  }
  .pd-star {
    font-size: 16px;
  }
  .pd-reviews {
    margin: -8px 0 0;
    font-size: 13px;
    color: var(--theme-muted);
  }
  .pd-price-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 14px;
    align-items: baseline;
  }
  .pd-price {
    font-size: clamp(2rem, 4vw, 3rem);
  }
  .pd-price.is-sale,
  .pd-related-price.is-sale {
    color: #d04f4f;
  }
  .pd-price-old,
  .pd-related-price-old {
    color: var(--theme-muted);
    text-decoration: line-through;
    font-size: 15px;
  }
  .pd-sale-badge,
  .pd-related-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: #d04f4f;
    color: #fff;
    padding: 5px 10px;
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-weight: 700;
  }
  .pd-divider {
    height: 1px;
    background: var(--theme-border);
  }
  .pd-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 18px;
  }
  .pd-meta-item {
    min-width: 110px;
    display: grid;
    gap: 6px;
  }
  .pd-meta-label {
    color: var(--theme-muted);
    letter-spacing: 0.18em;
  }
  .pd-meta-value {
    color: var(--theme-ink);
    font-size: 14px;
    font-weight: 600;
  }
  .pd-description {
    margin: 0;
    font-size: 15px;
    line-height: 1.9;
    color: var(--theme-text);
  }
  .pd-option-group {
    display: grid;
    gap: 10px;
  }
  .pd-sizes,
  .pd-colors {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .pd-size-btn {
    min-width: 48px;
    min-height: 48px;
    padding: 0 14px;
    border: 1px solid var(--theme-border);
    border-radius: 16px;
    background: var(--theme-surface);
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: var(--theme-ink);
  }
  .pd-size-btn.is-active {
    background: var(--theme-ink);
    border-color: var(--theme-ink);
    color: var(--theme-surface);
  }
  .pd-color-swatch {
    width: 30px;
    height: 30px;
    border-radius: 999px;
    border: 3px solid transparent;
    cursor: pointer;
    box-shadow: inset 0 0 0 1px rgba(36, 28, 23, 0.1);
  }
  .pd-color-swatch.is-active {
    border-color: var(--theme-ink);
  }
  .pd-actions {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 12px;
    align-items: stretch;
  }
  .pd-qty-box {
    display: inline-flex;
    align-items: center;
    border: 1px solid var(--theme-border);
    border-radius: 18px;
    overflow: hidden;
    background: var(--theme-surface);
  }
  .pd-qty-btn {
    width: 42px;
    height: 54px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 18px;
    color: var(--theme-ink);
  }
  .pd-qty-input {
    width: 58px;
    height: 54px;
    border: none;
    background: none;
    text-align: center;
    font-size: 15px;
    font-weight: 600;
    color: var(--theme-ink);
  }
  .pd-add-btn {
    min-height: 54px;
    border: none;
    border-radius: 18px;
    background: linear-gradient(135deg, var(--theme-ink) 0%, var(--theme-dark-soft) 100%);
    color: var(--theme-surface);
    cursor: pointer;
    font-size: 12px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-weight: 700;
    padding: 0 22px;
  }
  .pd-add-btn.is-disabled {
    background: #c7bfb6;
    cursor: not-allowed;
  }
  .pd-wishlist-btn {
    width: 54px;
    min-height: 54px;
    border: 1px solid var(--theme-border);
    border-radius: 18px;
    background: var(--theme-surface);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--theme-ink);
  }
  .pd-stock {
    margin: -4px 0 0;
    font-size: 13px;
    font-weight: 600;
  }
  .pd-stock.is-ok {
    color: #557a5a;
  }
  .pd-stock.is-low {
    color: #d04f4f;
  }
  .pd-share-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 16px;
    align-items: center;
  }
  .pd-share-label {
    font-size: 13px;
    color: var(--theme-muted);
  }
  .pd-share-icons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .pd-share-icon {
    width: 34px;
    height: 34px;
    border: 1px solid var(--theme-border);
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--theme-surface);
    color: var(--theme-text);
  }
  .pd-related-section {
    background: linear-gradient(180deg, rgba(255, 253, 249, 0.94) 0%, rgba(242, 233, 222, 0.92) 100%);
    padding: 68px 24px 80px;
  }
  .pd-related-header {
    max-width: 640px;
    margin: 0 auto 34px;
    text-align: center;
  }
  .pd-related-title {
    font-size: clamp(2rem, 4vw, 3.2rem);
    margin-bottom: 10px;
  }
  .pd-related-copy {
    margin: 0;
    color: var(--theme-muted);
    font-size: 14px;
    line-height: 1.8;
  }
  .pd-related-grid {
    max-width: 1240px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 22px;
  }
  .pd-related-card {
    display: block;
    text-decoration: none;
    color: inherit;
    border-radius: 24px;
    overflow: hidden;
    background: rgba(255, 253, 249, 0.92);
    border: 1px solid rgba(176, 122, 79, 0.14);
    box-shadow: 0 18px 32px rgba(36, 28, 23, 0.06);
  }
  .pd-related-media {
    position: relative;
    aspect-ratio: 3 / 4;
    overflow: hidden;
    background: #efe5d9;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .pd-related-badge {
    position: absolute;
    top: 14px;
    left: 14px;
  }
  .pd-related-body {
    padding: 16px;
  }
  .pd-related-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--theme-ink);
    margin-bottom: 6px;
  }
  .pd-related-desc {
    color: var(--theme-muted);
    font-size: 12px;
    margin-bottom: 10px;
  }
  .pd-related-price-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 10px;
    align-items: baseline;
  }
  .pd-related-price {
    font-family: var(--font-display);
    font-size: 1.25rem;
    color: var(--theme-ink);
  }
  @media (max-width: 1024px) {
    .pd-shell {
      grid-template-columns: 1fr;
    }
    .pd-title {
      max-width: none;
    }
    .pd-related-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 640px) {
    .pd-breadcrumb,
    .pd-shell,
    .pd-related-section {
      padding-left: 16px;
      padding-right: 16px;
    }
    .pd-shell {
      padding-bottom: 48px;
      gap: 24px;
    }
    .pd-main-image {
      border-radius: 22px;
    }
    .pd-thumbs {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    .pd-thumb {
      border-radius: 14px;
    }
    .pd-title {
      font-size: clamp(2rem, 10vw, 3rem);
    }
    .pd-meta {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .pd-actions {
      grid-template-columns: 1fr 1fr;
    }
    .pd-qty-box,
    .pd-add-btn {
      width: 100%;
    }
    .pd-wishlist-btn {
      grid-column: 1 / -1;
      width: 100%;
    }
    .pd-related-section {
      padding-top: 52px;
      padding-bottom: 56px;
    }
    .pd-related-grid {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 420px) {
    .pd-meta {
      grid-template-columns: 1fr;
    }
    .pd-actions {
      grid-template-columns: 1fr;
    }
  }
`;
