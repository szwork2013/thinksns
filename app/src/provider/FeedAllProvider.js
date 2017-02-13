/**
 * FeedAllProvider.
 */
import createStoreProvider from '../util/createStoreProvider';
import { createCustomListStore } from '../store/CustomListStore';
import FeedAllContainer from '../container/FeedAllContainer';

const defaultList = [];
const FeedAllStore = createCustomListStore(defaultList);

const FeedAllProvider = createStoreProvider(FeedAllStore, FeedAllContainer);

export {
  FeedAllStore
};
export default FeedAllProvider;
