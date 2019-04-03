/*
* @Author: Rosen
* @Date:   2017-02-18 10:47:31
* @Last Modified by:   Rosen
* @Last Modified time: 2017-03-02 13:14:47
*/

'use strict';

import React        from 'react';
import ReactDOM     from 'react-dom';
//import Simditor     from 'simditor';
import E from 'wangeditor'
import MMUtile from 'util/mm.jsx';
const _mm = new MMUtile();

import './index.scss';


const RichEditor = React.createClass({
    getInitialState() {
        return {
            
        };
    },
	
	
	componentDidMount () {
		var editor = new E('#editor')
		editor.create()
	},

	
    render() {
        return (
             <div id="editor">
        		<p></p>
    		</div>
        )           
    }
});

export default RichEditor;