import axios from 'axios';
 
const instance = axios.create({
  timeout: 10000,
   
});
 
export default {
  
  getDetailImage (params){
  	return instance.get('/v2/createOrUpdateUser',params)
  }
};