/**
 * Created by Helena on 13.02.2016.
 */


// main defines jQuery reference
// (see: http://stackoverflow.com/questions/23023167/requirejs-backbone-1-1-2-local-jquery-interfering-with-global-jquery?rq=1)
define('jquery', [], function () {
    return jQuery;
});