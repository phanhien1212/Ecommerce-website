import axios from "axios";
const httpAxios = axios.create({
    baseURL: 'http://localhost:8080/api/',
    headers: { 'X-Custom-Header':'foobar' }
});
 
export default httpAxios;