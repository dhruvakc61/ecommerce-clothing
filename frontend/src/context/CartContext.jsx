// Placeholder for CartContext.jsx
// Full implementation will be added later.
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();
const LEGACY_CART_STORAGE_KEY = "cart_items";
const LEGACY_CART_PROMO_STORAGE_KEY = "cart_promo";
const LEGACY_CART_SELECTION_STORAGE_KEY = "cart_selection";
const DEFAULT_PROMO = { code: "", discount: 0 };

function getCartStorageKey(ownerKey) {
  return `cart_items:${ownerKey}`;
}

function getPromoStorageKey(ownerKey) {
  return `cart_promo:${ownerKey}`;
}

function getSelectionStorageKey(ownerKey) {
  return `cart_selection:${ownerKey}`;
}

function getCartOwnerKey(user) {
  return String(user?._id || "guest");
}

function buildCartItemId(item) {
  const productId = String(item?._id ?? item?.id ?? "");
  const sizePart = String(item?.size ?? "");
  const colorPart = String(item?.color ?? "");
  return `${productId}::${sizePart}::${colorPart}`;
}

function normalizeCartItem(item) {
  return {
    ...item,
    qty: item.qty ?? item.quantity ?? 1,
    cartItemId: item.cartItemId || buildCartItemId(item),
  };
}

function parseStoredCart(key) {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed.map(normalizeCartItem);
  } catch {
    return [];
  }
}

function parseStoredPromo(key) {
  if (typeof window === "undefined") {
    return DEFAULT_PROMO;
  }

  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) return DEFAULT_PROMO;

    const parsed = JSON.parse(stored);
    return {
      code: String(parsed?.code || ""),
      discount: Number(parsed?.discount || 0),
    };
  } catch {
    return DEFAULT_PROMO;
  }
}

function loadStoredCart(ownerKey) {
  if (typeof window === "undefined") return [];

  const scopedKey = getCartStorageKey(ownerKey);
  const hasScopedCart = window.localStorage.getItem(scopedKey) !== null;
  if (hasScopedCart) {
    return parseStoredCart(scopedKey);
  }

  const legacyCart = parseStoredCart(LEGACY_CART_STORAGE_KEY);
  if (legacyCart.length > 0) {
    window.localStorage.setItem(scopedKey, JSON.stringify(legacyCart));
    window.localStorage.removeItem(LEGACY_CART_STORAGE_KEY);
  }

  return legacyCart;
}

function loadStoredPromo(ownerKey) {
  if (typeof window === "undefined") {
    return DEFAULT_PROMO;
  }

  const scopedKey = getPromoStorageKey(ownerKey);
  const hasScopedPromo = window.localStorage.getItem(scopedKey) !== null;
  if (hasScopedPromo) {
    return parseStoredPromo(scopedKey);
  }

  const legacyPromo = parseStoredPromo(LEGACY_CART_PROMO_STORAGE_KEY);
  if (legacyPromo.code || legacyPromo.discount) {
    window.localStorage.setItem(scopedKey, JSON.stringify(legacyPromo));
    window.localStorage.removeItem(LEGACY_CART_PROMO_STORAGE_KEY);
  }

  return legacyPromo;
}

function parseStoredSelection(key) {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((value) => String(value));
  } catch {
    return [];
  }
}

function loadStoredSelection(ownerKey, cartItems) {
  if (typeof window === "undefined") {
    return cartItems.map((item) => item.cartItemId);
  }

  const scopedKey = getSelectionStorageKey(ownerKey);
  const hasScopedSelection = window.localStorage.getItem(scopedKey) !== null;
  const fallbackSelection = cartItems.map((item) => item.cartItemId);

  if (hasScopedSelection) {
    const storedSelection = parseStoredSelection(scopedKey);
    return storedSelection.length > 0 ? storedSelection : fallbackSelection;
  }

  const legacySelection = parseStoredSelection(LEGACY_CART_SELECTION_STORAGE_KEY);
  if (legacySelection.length > 0) {
    window.localStorage.setItem(scopedKey, JSON.stringify(legacySelection));
    window.localStorage.removeItem(LEGACY_CART_SELECTION_STORAGE_KEY);
    return legacySelection;
  }

  return fallbackSelection;
}

export function CartProvider({ children }) {
  const { user, loading } = useContext(AuthContext);
  const ownerKey = getCartOwnerKey(user);
  const [cartState, setCartState] = useState({
    ownerKey,
    cart: [],
    promo: DEFAULT_PROMO,
    selectedItemIds: [],
  });

  const cart = cartState.ownerKey === ownerKey ? cartState.cart : [];
  const promo = cartState.ownerKey === ownerKey ? cartState.promo : DEFAULT_PROMO;
  const selectedItemIds = cartState.ownerKey === ownerKey ? cartState.selectedItemIds : [];

  useEffect(() => {
    if (loading) return;

    const nextCart = loadStoredCart(ownerKey);
    setCartState({
      ownerKey,
      cart: nextCart,
      promo: loadStoredPromo(ownerKey),
      selectedItemIds: loadStoredSelection(ownerKey, nextCart),
    });
  }, [loading, ownerKey]);

  useEffect(() => {
    if (loading || cartState.ownerKey !== ownerKey) return;

    window.localStorage.setItem(getCartStorageKey(ownerKey), JSON.stringify(cartState.cart));
  }, [cartState.cart, cartState.ownerKey, loading, ownerKey]);

  useEffect(() => {
    if (loading || cartState.ownerKey !== ownerKey) return;

    window.localStorage.setItem(getPromoStorageKey(ownerKey), JSON.stringify(cartState.promo));
  }, [cartState.ownerKey, cartState.promo, loading, ownerKey]);

  useEffect(() => {
    if (loading || cartState.ownerKey !== ownerKey) return;

    window.localStorage.setItem(
      getSelectionStorageKey(ownerKey),
      JSON.stringify(cartState.selectedItemIds)
    );
  }, [cartState.ownerKey, cartState.selectedItemIds, loading, ownerKey]);

  useEffect(() => {
    if (loading || cartState.ownerKey !== ownerKey) return;

    const validIds = new Set(cartState.cart.map((item) => item.cartItemId));
    const currentSelection = cartState.selectedItemIds.filter((id) => validIds.has(id));
    const newIds = cartState.cart
      .map((item) => item.cartItemId)
      .filter((id) => !currentSelection.includes(id));
    const nextSelection = [...currentSelection, ...newIds];

    if (
      nextSelection.length !== cartState.selectedItemIds.length ||
      nextSelection.some((id, index) => id !== cartState.selectedItemIds[index])
    ) {
      setCartState((prev) => ({
        ...prev,
        selectedItemIds: nextSelection,
      }));
    }
  }, [cartState.cart, cartState.ownerKey, cartState.selectedItemIds, loading, ownerKey]);

  // Add a product or increase quantity if it already exists.
  const addToCart = (product, qty = 1, options = {}) => {
    setCartState((prev) => {
      const prevCart = prev.ownerKey === ownerKey ? prev.cart : [];
      const nextItem = normalizeCartItem({
        ...product,
        ...options,
        qty,
      });
      const exists = prevCart.find((item) => item.cartItemId === nextItem.cartItemId);
      if (exists) {
        return {
          ...prev,
          ownerKey,
          cart: prevCart.map((item) =>
            item.cartItemId === nextItem.cartItemId ? { ...item, qty: item.qty + qty } : item
          ),
          selectedItemIds: prev.selectedItemIds.includes(nextItem.cartItemId)
            ? prev.selectedItemIds
            : [...prev.selectedItemIds, nextItem.cartItemId],
        };
      }
      return {
        ...prev,
        ownerKey,
        cart: [...prevCart, nextItem],
        selectedItemIds: [...prev.selectedItemIds, nextItem.cartItemId],
      };
    });
  };

  // Remove a product completely from the cart.
  const removeFromCart = (id) => {
    setCartState((prev) => {
      const prevCart = prev.ownerKey === ownerKey ? prev.cart : [];
      return {
        ...prev,
        ownerKey,
        cart: prevCart.filter((item) => item.cartItemId !== id && item._id !== id),
        selectedItemIds: prev.selectedItemIds.filter((itemId) => itemId !== id),
      };
    });
  };

  // Update quantity for a product (minimum of 1).
  const updateQty = (id, qty) => {
    setCartState((prev) => {
      const prevCart = prev.ownerKey === ownerKey ? prev.cart : [];
      return {
        ...prev,
        ownerKey,
        cart: prevCart.map((item) =>
          item.cartItemId === id || item._id === id ? { ...item, qty: Math.max(1, qty) } : item
        ),
      };
    });
  };

  const clearCart = () =>
    setCartState((prev) => ({
      ...prev,
      ownerKey,
      cart: [],
      selectedItemIds: [],
    }));

  const toggleCartItemSelection = (id) => {
    setCartState((prev) => ({
      ...prev,
      ownerKey,
      selectedItemIds: prev.selectedItemIds.includes(id)
        ? prev.selectedItemIds.filter((itemId) => itemId !== id)
        : [...prev.selectedItemIds, id],
    }));
  };

  const selectAllCartItems = () => {
    setCartState((prev) => ({
      ...prev,
      ownerKey,
      selectedItemIds: prev.cart.map((item) => item.cartItemId),
    }));
  };

  const clearCartSelection = () => {
    setCartState((prev) => ({
      ...prev,
      ownerKey,
      selectedItemIds: [],
    }));
  };

  const removeSelectedItemsFromCart = (ids) => {
    const idSet = new Set(ids.map((value) => String(value)));
    setCartState((prev) => ({
      ...prev,
      ownerKey,
      cart: prev.cart.filter((item) => !idSet.has(item.cartItemId)),
      selectedItemIds: prev.selectedItemIds.filter((id) => !idSet.has(id)),
    }));
  };

  const selectedCart = cart.filter((item) => selectedItemIds.includes(item.cartItemId));

  const applyPromo = (code, discount) => {
    setCartState((prev) => ({
      ...prev,
      ownerKey,
      promo: {
        code: String(code || "").trim().toUpperCase(),
        discount: Math.max(0, Number(discount || 0)),
      },
    }));
  };

  const clearPromo = () =>
    setCartState((prev) => ({
      ...prev,
      ownerKey,
      promo: DEFAULT_PROMO,
    }));

  // Handy totals to use across the UI.
  const totals = useMemo(() => {
    const itemCount = cart.reduce((acc, item) => acc + item.qty, 0);
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    return {
      itemCount,
      subtotal,
      discount: promo.discount,
      discountedSubtotal: Math.max(0, subtotal - promo.discount),
    };
  }, [cart, promo.discount]);

  const selectedTotals = useMemo(() => {
    const itemCount = selectedCart.reduce((acc, item) => acc + item.qty, 0);
    const subtotal = selectedCart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const discount = Math.min(promo.discount, subtotal);
    return {
      itemCount,
      subtotal,
      discount,
      discountedSubtotal: Math.max(0, subtotal - discount),
    };
  }, [promo.discount, selectedCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        selectedCart,
        selectedItemIds,
        addToCart,
        removeFromCart,
        removeSelectedItemsFromCart,
        updateQty,
        clearCart,
        toggleCartItemSelection,
        selectAllCartItems,
        clearCartSelection,
        promo,
        applyPromo,
        clearPromo,
        totals,
        selectedTotals,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
