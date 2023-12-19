
export function formatCurrency(price, promotion) {
    const formatter = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0
    });
    return formatter.format(price - price * (promotion / 100));
}