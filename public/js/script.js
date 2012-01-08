jQuery(function($){
    var server = ace.edit('server-code');
    server.setTheme("ace/theme/twilight");
    var JavaScriptMode = require("ace/mode/javascript").Mode;
    server.getSession().setMode(new JavaScriptMode());
    
    var client = ace.edit('client-code');
    client.setTheme("ace/theme/twilight");
    var HtmlMode = require("ace/mode/html").Mode;
    client.getSession().setMode(new HtmlMode());
    
    var rn = {
        id: +$.cookie('rn.id') || +prompt('Please enter your ID, it\'s 2 digits only, and you can find it at handout.'),
        name: $.cookie('rn.name') || prompt('Please enter your name')
    };
    
    $.cookie('rn.id', rn.id);
    $.cookie('rn.name', rn.name);
    
    var $iframe = $('#run iframe');
    $iframe.attr('src', 'about:blank');
    
    $('#refresh').click(function(){
        $iframe.attr('src', 'http://' + location.hostname + ':' + (43100 + rn.id) + '/');
    });
    
    $('#header-id').text(rn.id);
    $('#header-name').text(rn.name);
    
    
    $.get('/code/' + rn.id + '/server', function(data, textStatus){
        server.getSession().setValue(data);
    }, 'text');
    
    $.get('/code/' + rn.id + '/client', function(data, textStatus){
        client.getSession().setValue(data);
    }, 'text');
    
    $('#server .save-container button').click(function(){
        var $button = $(this);
        $.post('/code/' + rn.id + '/server', {
            data: server.getSession().getValue()
        },  function(data, textStatus){
            $button.text($button.text() + ' - ' + data);
            setTimeout(function(){
                $button.text($button.data('default'));
            }, 1.5e3);
        }, 'text');
    });
    
    $('#client .save-container button').click(function(){
        var $button = $(this);
        $.post('/code/' + rn.id + '/client', {
            data: client.getSession().getValue()
        },  function(data, textStatus){
            $button.text($button.text() + ' - ' + data);
            setTimeout(function(){
                $button.text($button.data('default'));
            }, 1.5e3);
        }, 'text');
    });
    
    $('#change-id').click(function(){
        $.cookie('rn.id', null);
        $.cookie('rn.name', null);
        location.reload();
    });
    
    $('#restore').click(function(){
        if (confirm('This will DELETE ALL OF YOUR code, and restore to default code. Confirm?')) {
            $.get('/restore/' + rn.id, function(){
                location.reload();
            });
        }
    });
    
    var socket = io.connect('/');
    socket.on('console', function (params) {
        if (params && params.id == rn.id) {
            console.log(params.data);
        }
    });
    
});

