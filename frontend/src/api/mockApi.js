// Simple in-browser mock API for when the backend or database is unavailable.
// It stores data in localStorage so the app still works end-to-end.

const STORAGE_KEYS = {
  products: "mock_products",
  users: "mock_users",
  orders: "mock_orders",
  currentUser: "mock_current_user",
};

const ORDER_REFERENCE_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const seedProducts = [
  {
    _id: "p-1001",
    name: "Classic Linen Shirt",
    price: 46.91,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
    description: "Lightweight linen shirt with a relaxed fit.",
    category: "men",
    stock: 32,
  },
  {
    _id: "p-1002",
    name: "Wool Blend Coat",
    price: 80.0,
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80",
    description: "Warm coat with clean tailoring and a soft lining.",
    category: "women",
    stock: 12,
  },
  {
    _id: "p-1003",
    name: "Summer Dress",
    price: 75.91,
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    description: "Flowy summer dress for everyday comfort.",
    category: "women",
    stock: 18,
  },
  {
    _id: "p-1004",
    name: "Denim Jacket",
    price: 65.0,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
    description: "Classic denim jacket with a modern fit.",
    category: "men",
    stock: 26,
  },
  {
    _id: "p-1005",
    name: "Kids Hoodie",
    price: 34.0,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    description: "Soft hoodie for kids with a cozy lining.",
    category: "kids",
    stock: 40,
  },
  {
    _id: "p-1006",
    name: "Leather Belt",
    price: 28.5,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    description: "Genuine leather belt with a brushed buckle.",
    category: "accessories",
    stock: 50,
  },
];

const seedUsers = [
  {
    _id: "u-admin",
    name: "Admin User",
    email: "admin@shop.local",
    password: "admin123",
    isAdmin: true,
  },
  {
    _id: "u-guest",
    name: "Guest Shopper",
    email: "guest@shop.local",
    password: "guest123",
    isAdmin: false,
  },
];

const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const save = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const ensureSeed = () => {
  if (!localStorage.getItem(STORAGE_KEYS.products)) {
    save(STORAGE_KEYS.products, seedProducts);
  }
  if (!localStorage.getItem(STORAGE_KEYS.users)) {
    save(STORAGE_KEYS.users, seedUsers);
  }
  if (!localStorage.getItem(STORAGE_KEYS.orders)) {
    save(STORAGE_KEYS.orders, []);
  }
};

const makeResponse = (data) => Promise.resolve({ data });
const makeError = (status, message) =>
  Promise.reject({ response: { status, data: { message } } });

const parseUrl = (url) => {
  const [path, queryString = ""] = url.split("?");
  const parts = path.split("/").filter(Boolean);
  const params = new URLSearchParams(queryString);
  return { path, parts, params };
};

const getCurrentUser = () => load(STORAGE_KEYS.currentUser, null);
const setCurrentUser = (user) => save(STORAGE_KEYS.currentUser, user);

const generateOrderReference = (orders) => {
  let candidate = "";

  do {
    candidate = "";
    for (let index = 0; index < 4; index += 1) {
      candidate += ORDER_REFERENCE_LETTERS[Math.floor(Math.random() * ORDER_REFERENCE_LETTERS.length)];
    }
    for (let index = 0; index < 3; index += 1) {
      candidate += Math.floor(Math.random() * 10);
    }
  } while (orders.some((order) => order.orderReference === candidate));

  return candidate;
};

const mockApi = {
  async get(url) {
    ensureSeed();
    const { parts, params } = parseUrl(url);

    if (parts[0] === "products") {
      const products = load(STORAGE_KEYS.products, []);
      if (parts.length === 2) {
        const product = products.find((p) => p._id === parts[1]);
        if (!product) return makeError(404, "Product not found");
        return makeResponse(product);
      }

      let list = [...products];
      const category = params.get("category");
      const search = params.get("search");
      const minPrice = params.get("minPrice");
      const maxPrice = params.get("maxPrice");
      const sort = params.get("sort");

      if (category) list = list.filter((p) => p.category === category);
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q)
        );
      }
      if (minPrice) list = list.filter((p) => p.price >= Number(minPrice));
      if (maxPrice) list = list.filter((p) => p.price <= Number(maxPrice));
      if (sort === "low-high") list.sort((a, b) => a.price - b.price);
      if (sort === "high-low") list.sort((a, b) => b.price - a.price);

      return makeResponse(list);
    }

    if (parts[0] === "orders") {
      const orders = load(STORAGE_KEYS.orders, []);
      if (parts[1] === "my") {
        const user = getCurrentUser();
        if (!user) return makeError(401, "Not authorized");
        return makeResponse(orders.filter((o) => o.user?._id === user._id));
      }
      return makeResponse(orders);
    }

    if (parts[0] === "users" && parts[1] === "profile") {
      const user = getCurrentUser();
      if (!user) return makeError(401, "Not authorized");
      return makeResponse(user);
    }

    if (parts[0] === "users") {
      const users = load(STORAGE_KEYS.users, []);
      return makeResponse(users.map(({ password, ...rest }) => rest));
    }

    if (parts[0] === "admin" && parts[1] === "stats") {
      const products = load(STORAGE_KEYS.products, []);
      const users = load(STORAGE_KEYS.users, []);
      const orders = load(STORAGE_KEYS.orders, []);
      return makeResponse({
        users: users.length,
        products: products.length,
        orders: orders.length,
      });
    }

    return makeError(404, "Not found");
  },

  async post(url, body) {
    ensureSeed();
    const { parts } = parseUrl(url);

    if (parts[0] === "auth" && parts[1] === "register") {
      const users = load(STORAGE_KEYS.users, []);
      const exists = users.find((u) => u.email === body.email);
      if (exists) return makeError(400, "Email already in use");

      const newUser = {
        _id: `u-${Date.now()}`,
        name: body.name,
        email: body.email,
        password: body.password,
        isAdmin: body.email?.includes("admin"),
      };
      const updated = [...users, newUser];
      save(STORAGE_KEYS.users, updated);

      const { password, ...safeUser } = newUser;
      setCurrentUser(safeUser);
      return makeResponse({ user: safeUser, token: "mock-token" });
    }

    if (parts[0] === "auth" && parts[1] === "login") {
      const users = load(STORAGE_KEYS.users, []);
      const match = users.find(
        (u) => u.email === body.email && u.password === body.password
      );
      if (!match) return makeError(401, "Invalid credentials");
      const { password, ...safeUser } = match;
      setCurrentUser(safeUser);
      return makeResponse({ user: safeUser, token: "mock-token" });
    }

    if (parts[0] === "products") {
      const products = load(STORAGE_KEYS.products, []);
      const newProduct = {
        _id: `p-${Date.now()}`,
        name: body.name,
        price: Number(body.price || 0),
        image: body.image || "",
        description: body.description || "",
        category: body.category || "men",
        stock: Number(body.stock || 0),
      };
      const updated = [newProduct, ...products];
      save(STORAGE_KEYS.products, updated);
      return makeResponse(newProduct);
    }

    if (parts[0] === "orders") {
      const orders = load(STORAGE_KEYS.orders, []);
      const user = getCurrentUser();
      const order = {
        _id: `o-${Date.now()}`,
        orderReference: generateOrderReference(orders),
        items: body.items || [],
        subtotal: Number(body.subtotal || 0),
        shipping: Number(body.shipping || 0),
        discount: Number(body.discount || 0),
        promoCode: body.promoCode || "",
        total: Number(body.total || 0),
        status: "Pending",
        shippingAddress: body.shippingAddress || {},
        user: user || { _id: "guest", name: "Guest" },
        createdAt: new Date().toISOString(),
      };
      const updated = [order, ...orders];
      save(STORAGE_KEYS.orders, updated);
      return makeResponse(order);
    }

    return makeError(404, "Not found");
  },

  async put(url, body) {
    ensureSeed();
    const { parts } = parseUrl(url);

    if (parts[0] === "products" && parts[1]) {
      const products = load(STORAGE_KEYS.products, []);
      const updated = products.map((p) =>
        p._id === parts[1]
          ? {
              ...p,
              ...body,
              price: Number(body.price ?? p.price),
              stock: Number(body.stock ?? p.stock),
            }
          : p
      );
      save(STORAGE_KEYS.products, updated);
      return makeResponse(updated.find((p) => p._id === parts[1]));
    }

    if (parts[0] === "orders" && parts[1]) {
      const orders = load(STORAGE_KEYS.orders, []);
      const updated = orders.map((o) =>
        o._id === parts[1] ? { ...o, ...body } : o
      );
      save(STORAGE_KEYS.orders, updated);
      return makeResponse(updated.find((o) => o._id === parts[1]));
    }

    return makeError(404, "Not found");
  },

  async delete(url) {
    ensureSeed();
    const { parts } = parseUrl(url);

    if (parts[0] === "products" && parts[1]) {
      const products = load(STORAGE_KEYS.products, []);
      const updated = products.filter((p) => p._id !== parts[1]);
      save(STORAGE_KEYS.products, updated);
      return makeResponse({ message: "Product removed" });
    }

    return makeError(404, "Not found");
  },
};

export default mockApi;
