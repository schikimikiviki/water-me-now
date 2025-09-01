import axios from 'axios';
import { pathToBackend } from '../helpers/constants';

export default axios.create({
  baseURL: pathToBackend,
});
