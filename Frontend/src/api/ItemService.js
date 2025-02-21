import axios from "axios";

const API_URL = 'http://localhost:8080/items';

export async function saveItem(item) {
  return await axios.post(API_URL, item);
}

export async function getItems(page = 0, size = 10) {
  return await axios.get(`${API_URL}?page=${page}&size=${size}`);
}

export async function getItem(id) {
  return await axios.get(`${API_URL}/${id}`);
}

export async function udpateItem(item) {
  // Remove id from request body for updates
  const { id, ...itemWithoutId } = item;
  return await axios.put(`${API_URL}/${id}`, itemWithoutId);
}

export async function udpateImage(formData) {
  return await axios.put(`${API_URL}/image`, formData);
}

export async function deleteItem(id) {
  return await axios.delete(`${API_URL}/${id}`);
}