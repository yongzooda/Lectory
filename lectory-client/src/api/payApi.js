import axios from 'axios';

export function preparePayment() {
  return axios.get('/pay/ready', {
    headers: {
      "Content-Type": "application/json",
    }
  })
};
