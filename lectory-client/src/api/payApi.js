import axios from 'axios';

export function preparePayment() {
  const token = localStorage.getItem('accessToken');

  return axios.get('/api/pay/ready', {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
}
