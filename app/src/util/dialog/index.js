/**
 * index
 * 
 * util,dialog,index.
 */
import { DialogStore } from '../../provider/DialogProvider';
import { updateCustomData } from '../../action/CustomDataAction';

// more dialog type.
import circularProgressDialog from './circularProgressDialog';

const { dispatch } = DialogStore;

/**
 * close dialog func.
 *
 * @return {object} Current DialogStore object.
 * @author Seven Du <shiweidu@outlook.com>
 * @homepage http://medz.cn
 */
const closeDialog = () => dispatch(updateCustomData({
  node: null,
  open: false,
}));

/**
 * Set dialog configuration.
 *
 * @param {any} options.node Dialog display node.
 * @param {Boolean} options.open Whether display.
 * @param {object} options.settings More optional settings.
 * @return {func} Close this dialog method.
 * @author Seven Du <shiweidu@outlook.com>
 * @homepage http://medz.cn
 */
const dialog = ({node = null, open = false, ...settings}) => {
  dispatch(updateCustomData({
    ...settings,
    node,
    open,
  }));

  return closeDialog;
};

export {
  dialog,
  circularProgressDialog,
};

export default dialog;
