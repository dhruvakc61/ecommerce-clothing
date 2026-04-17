const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function generateOrderReference() {
  let reference = "";

  for (let index = 0; index < 4; index += 1) {
    reference += LETTERS[Math.floor(Math.random() * LETTERS.length)];
  }

  for (let index = 0; index < 3; index += 1) {
    reference += Math.floor(Math.random() * 10);
  }

  return reference;
}

export async function assignOrderReference(OrderModel, order) {
  if (order.orderReference) return order.orderReference;

  for (let attempt = 0; attempt < 25; attempt += 1) {
    const candidate = generateOrderReference();
    const exists = await OrderModel.exists({
      orderReference: candidate,
      _id: { $ne: order._id },
    });

    if (!exists) {
      order.orderReference = candidate;
      return candidate;
    }
  }

  throw new Error("Unable to generate a unique order reference.");
}

export async function ensureOrderReferences(OrderModel, orders) {
  await Promise.all(
    orders
      .filter((order) => !order.orderReference)
      .map(async (order) => {
        await assignOrderReference(OrderModel, order);
        await order.save();
      })
  );

  return orders;
}
