const nets = require('nets');

document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
    let comment = document.querySelector('textarea').value;
    nets({
        url: 'addComment',
        method: 'POST',
        body: comment
    }, () => {location.reload()
    })
}, false);