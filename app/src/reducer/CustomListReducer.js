/**
 * CustomListReducer.
 */
import { APPEND, PREPEND, SET, FN } from '../action/CustomListAction';

const CustomListReducer = (state = [], action) => {
  switch (action.type) {
    case APPEND:
      return [...state, action.data];

    case PREPEND:
      return [
        action.data,
        ...state
      ];

    case SET:
      return [...action.data];

    case FN:
      return [...action.data(state)];

    default:
      return state;
  }
};

export default CustomListReducer;