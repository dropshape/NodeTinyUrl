define(function (require) {
    'use strict';

    function Directive(){
        return {
            replace:true,
            template:require('text!./template.html')
        };
    }

    return Directive;
});


