/**
 * snackbar.
 */
import { SnackbarStore } from '../provider/SnackbarProvider';
import { updateCustomData } from '../../action/CustomDataAction';

const { dispatch } = SnackbarStore;

/**
 * close snackbar func.
 *
 * @return {object} Current SnackbarStore object.
 * @author Seven Du <shiweidu@outlook.com>
 * @homepage http://medz.cn
 */
export const closeSnackbar = () => dispatch(updateCustomData({
  message: null,
  open: false,
}));

/**
 * Set snackbar configuration.
 *
 * @param {Boolean} options.open Whether display.
 * @param {node} options.message Snackbar display message.
 * @param {object} options.settings More optional settings.
 * @return {func} Close this snackbar method.
 * @author Seven Du <shiweidu@outlook.com>
 * @homepage http://medz.cn
 */
const snackbar =  ({ open = false, message = null, ...settings }) => {
  dispatch(updateCustomData({
    ...settings,
    open,
    message
  }));

  return closeSnackbar;
};

export default snackbar;
