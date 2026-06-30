import api from './api';

export const createCheckoutSession = async (req, res) => {
    const r = await api.post('/stripe/create-checkout-session');
    return r.data.url;
};
export const getCheckoutSession = async (sessionId) => {
    const res = await api.get(`/stripe/session/${sessionId}`);
    return res.data.url;
}