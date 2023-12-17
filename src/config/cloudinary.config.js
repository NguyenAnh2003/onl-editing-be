import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv'

/** env variables config */
dotenv.config()

cloudinary.config({
  cloud_name: 'drijaswh2',
  api_key: '794448472826553',
  api_secret: 'KDI-CSosleBFViJ8t-DZ8dKXMl4',
});

export default cloudinary;
