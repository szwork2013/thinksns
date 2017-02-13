/**
 * SnackbarProvider.
 */
import createStoreProvider from '../util/createStoreProvider';
import { createCustomDataStore } from '../store/CustomDataStore';
import SnackbarContainer from '../container/SnackbarContainer';

const defaultValue = {
  open: false,
  message: null,
  autoHideDuration: 3000,
};
export const SnackbarStore = createCustomDataStore(defaultValue);

const SnackbarProvider = createStoreProvider(SnackbarStore, SnackbarContainer);

export default SnackbarProvider;
