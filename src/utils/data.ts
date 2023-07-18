import {API} from '@/config';

async function handleRequestSuccess(res: any) {
  return {
    status: true,
    docs: await res.json()
  }
}
function handleRequestError(err: any) {
  console.warn('Request error: ', err)
  return {
    status: false,
    docs: null
  }
}
export async function get(endpoint: string) {
  return await fetch(API + endpoint)
    .then(handleRequestSuccess)
    .catch(handleRequestError)
}
export async function post(endpoint: string, data: any) {
  return await fetch(API + endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(handleRequestSuccess)
    .catch(handleRequestError)
}
