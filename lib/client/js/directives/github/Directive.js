define(function (require) {
    'use strict';

    function Directive(){
        return {
            replace:true,
            scope:{
                repo:'@'
            },
            template:require('text!./template.html')
        };
    }

    return Directive;
});


