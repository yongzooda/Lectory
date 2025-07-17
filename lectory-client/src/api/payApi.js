import axios from 'axios';

export function preparePayment() {
  return axios.get('/api/pay/ready', {
    headers: {
      "Content-Type": "application/json",
    }
  })
};
