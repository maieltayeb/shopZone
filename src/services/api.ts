import axios from 'axios'

const api = axios.create({
  baseURL: 'https://fakestoreapi.com'
})

//products
export const getAllProducts = async () => {

    const response = await api.get('/products')
   return response.data

}
export const getProductById=async(id:string)=>{

   const response=await api.get(`/products/${id}`)
  
   
  return response.data

 
}

