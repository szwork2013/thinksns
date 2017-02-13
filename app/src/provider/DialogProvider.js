/**
 * DialogProvider
 */
import createStoreProvider from '../util/createStoreProvider';
import { createCustomDataStore } from '../store/CustomDataStore';
import DialogContainer from '../container/DialogContainer';

const defaultValue = {
  node: null,
  open: false,
};
export const DialogStore = createCustomDataStore(defaultValue);

const DialogProvider = createStoreProvider(DialogStore, DialogContainer);

export default DialogProvider;
