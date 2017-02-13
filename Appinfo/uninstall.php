<?php

defined('SITE_PATH') || exit('Forbidden');

$sqlFilePath = APPS_PATH.'/h5/Appinfo/uninstall.sql';
D()->executeSqlFile($sqlFilePath);
