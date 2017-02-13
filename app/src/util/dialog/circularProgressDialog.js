/**
 * circularProgressDialog
 */
import React from 'react';
import dialog from './index';
import CircularProgress from 'material-ui/CircularProgress';

/**
 * Circular Progress dialog.
 *
 * @param {String} options.text loading tips text.
 * @param {object} options.settings More optional settings.
 * @return {func} Close this dialog method.
 * @author Seven Du <shiweidu@outlook.com>
 * @homepage http://medz.cn
 */
const circularProgressDialog = ({text = '加载中...', ...settings} = {}) => dialog({
  open: true,
  node: (
    <div
      data-node-name="circularProgressDialog"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <CircularProgress
        data-node-name="circularProgressDialog,CircularProgress"
        style={{
          marginBottom: 12,
        }}
      />
      {text}
    </div>
  ),
  ...settings,
});

export default circularProgressDialog;
