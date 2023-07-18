import {useContext} from "react";
import {AuthsContext} from '@/context/AuthsContex';

export const useAuths = () => {
  return useContext(AuthsContext)
}
