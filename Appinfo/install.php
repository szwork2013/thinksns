<?php


defined('SITE_PATH') || exit('Forbidden');
header('Content-Type:text/html;charset=urf-8');

$sqlFilePath = APPS_PATH.'/h5/Appinfo/install.sql';
$result = D()->executeSqlFile($sqlFilePath);

if (!empty($result)) {
    echo $result['error_code'],
         '<br>',
         $result['error_sql'];

    /* # 导入清除数据的操作 */
    include APPS_PATH.'/h5/Appinfo/uninstall.php';
    exit;
}

A('Tool', 'Admin')->cleancache();
ob_end_clean();
