/**
 * CustomDataReducer.
 */
import { SET_DATA, UPDATE_DATA } from '../action/CustomDataAction';

const CustomDataRenducer = (state = {}, {type, data}) => {
  switch (type) {
    case SET_DATA:
      return {...data};

    case UPDATE_DATA:
      return {
        ...state,
        ...data,
      };

    default:
      return state;
  }
};

export default CustomDataRenducer;
