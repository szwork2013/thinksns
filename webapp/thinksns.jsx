/**
 * TS-4 html5 web application core file
 *
 * @param {object} window 全局window对象
 * @param {object} $ jQuery对象
 * @param {undefined} undefined 未知元素
 * @return {void} 
 * @author Seven Du <lovevipdsw@outlook.com>
 * @datetime 2016-03-16T18:19:56+0800
 * @homepage http://medz.cn
 * console.log
 */

import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {grey900, lightBlue500} from 'material-ui/styles/colors';

window.muiTheme = getMuiTheme({
    palette: {
        textColor: grey900,
        primary1Color: lightBlue500,
    },
    appBar: {
        height: 50,
        textColor: '#0096e5',
    },
    tabs: {
        backgroundColor: '#fff',
        textColor: '#9e9e9e',
        selectedTextColor: '#40c4ff',
    }
});

;(function(window, $, undefined) {

    var loadTips = function loadTips(text)
    {   
        var loadHtml = $('<div></div>');
        var loadWrap = $('<div></div>');
        var rotate   = $('<div></div>');
        var textBox  = $('<div></div>');
        var stime    = new Date().getTime();
        var k        = 1000;

        loadHtml.css({
            position: 'fixed',
            width: '100%',
            height: '100%',
            zIndex: 999,
            background: 'transparent',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        });

        loadWrap.css({
            position: 'absolute',
            background: 'rgba(0, 0, 0, 0.6)',
            top: '50%',
            left: '50%',
            width: '7.5em',
            minHeight: '7.5em',
            marginTop: '-3.75em',
            marginLeft: '-3.75em',
            zIndex: 100,
            textAlign: 'center',
            color: '#fff',
            borderRadius: '3px',
        });

        rotate.css({
            display: 'inline-block',
            width: '45px',
            height: '45px',
            margin: '15px 0',
            background: 'transparent',
            border: '2px solid #fff',
            borderBottomColor: 'transparent',
            borderRadius: '100%',
            animationFillMode: 'both',
            animation: 'rotate 1s 0s linear infinite',
        });

        textBox.css({
            margin: '0 0 15px'
        });
        textBox.text(text ? text : '加载中...');

        rotate.appendTo(loadWrap);
        textBox.appendTo(loadWrap);
        loadWrap.appendTo(loadHtml);
        loadHtml.appendTo(document.body);

        return {
            hide: function() {
                var etime = new Date().getTime();
                if (etime - stime < k) {
                    setTimeout(function() {
                        loadHtml.hide().remove();
                    }, etime - stime);
                } else {
                    loadHtml.hide().remove();   
                }
            },
            changeText: function(text) {
                textBox.text(text);
            }
        };
    };
    window.loadTips = loadTips;

    var buildURL = function buildURL(controller, action, param)
    {
        var url = TS.BUILD_URL
            .replace(/\%controller\%/g, controller)
            .replace(/\%action\%/g, action)
        ;
        var arr  = url.split('?');
        var base = arr[0];

        if (typeof param != 'object') {
            param = {};
        }
        if (typeof arr[1] != 'undefined') {
            arr = arr[1].split('&');
            for (var i in arr) {
                arr[i] = arr[i].split('=');
                param[arr[i][0]] = arr[i][1];
            }
        }

        url = '';
        for (var i in param) {
            url += i + '=' + param[i] + '&';
        }

        url = base + '?' + url;

        base = i = arr = param = null;

        return url.slice(0, url.length - 1);
    };
    window.buildURL = buildURL;


/* 内容内容的提醒 */
var TipsEmpty = React.createClass({
    getDefaultProps: function() {
        return {
            message: '暂时没有内容'
        };
    },
    render: function() {
        return (
            <div style={this.styles.box}>{this.props.message}</div>
        );
    },
    styles: {
        box: {
            width: '100%',
            boxSizing: 'border-box',
            padding: '20px 10px',
            textAlign: 'center',
        }
    }
});
window.TipsEmpty = TipsEmpty;

// 应用开始
window.appNode = document.getElementById('app');

})(window, jQuery || $);
