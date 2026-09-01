const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request(endpoint, options = {}) {
    try {
        const token = sessionStorage.getItem("token");

        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                ...options,
                headers: {
                    "Content-Type": "application/json",

                    ...(token
                        ? {
                            Authorization: `Bearer ${token}`
                        }
                        : {}),

                    ...options.headers
                }
            }
        );

        let data = null;

        if (response.status !== 204) {
            try {
                data = await response.json();
            } catch {
                data = null;
            }
        }

        if (response.status === 401) {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");

            window.location.href = "/login";

            return null;
        }

        if (!response.ok) {
            const error = new Error(
                data?.message || "İşlem gerçekleştirilemedi."
            );

            error.status = response.status;
            error.data = data;

            throw error;
        }

        return data;
    } catch (error) {
        if (error.status) {
            throw error;
        }

        const connectionError = new Error(
            "Sunucuya bağlanılamadı."
        );

        connectionError.status = 0;

        throw connectionError;
    }
}

export const api = {
    get(endpoint) {
        return request(endpoint);
    },

    post(endpoint, body) {
        return request(endpoint, {
            method: "POST",
            body: JSON.stringify(body)
        });
    },

    put(endpoint, body) {
        return request(endpoint, {
            method: "PUT",
            body: JSON.stringify(body)
        });
    },

    delete(endpoint) {
        return request(endpoint, {
            method: "DELETE"
        });
    }
};