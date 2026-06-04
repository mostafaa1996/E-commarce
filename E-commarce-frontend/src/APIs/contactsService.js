const URL = import.meta.env.VITE_API_URL;

export const getStoreInfo = async () => {
    const res = await fetch(`${URL}/contacts/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    const data = await res.json();
    console.log(data);
    return data;
};

export const createSupportTicket = async (form) => {
    const res = await fetch(`${URL}/contacts/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
        const error = new Error(data.message || "Request failed");
        error.data = data;
        throw error;
    }

    return data;
}
