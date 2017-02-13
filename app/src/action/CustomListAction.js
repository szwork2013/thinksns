/**
 * CustomListAction.
 */
const creactAtion = (type, data) => ({ type, data });

export const APPEND = 'APPEND';
export const PREPEND = 'PREPEND';
export const FN = 'FN';
export const SET = 'SET';

export const appendDataToList = (data) => creactAtion(APPEND, data);
export const prependDataToList = (data) => creactAtion(PREPEND, data);
export const setList = (data) => creactAtion(SET, data);
export const ListFn = (fn) => creactAtion(FN, fn);
