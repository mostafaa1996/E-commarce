const DevelopmentURL = "https://localhost:3000";
export default function getShopProducts() {
    const response = fetch(`${DevelopmentURL}/shop/products?${query.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response;
}