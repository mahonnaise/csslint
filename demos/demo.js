/*jslint plusplus: false, browser:true*/
/*global CSSLint:false */

(function () {
    var esc, ruleCheckboxes, getRuleSet, save, load, allCheckboxesChecked, actions;

    // escapes < and >
    esc = function (text) {
        if (!text) {
            return '';
        }
        return String(text).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };

    // saves the rule options
    save = function (data) {
        if (window.localStorage && window.JSON) {
            localStorage.setItem('CSSLintOptions', JSON.stringify(data));
        }
    };

    // loads the rule options
    load = function () {
        var data;
        if (window.localStorage && window.JSON) {
            data = localStorage.getItem('CSSLintOptions');
            if (data) {
                return JSON.parse(data);
            }
        }
        return {};
    };

    // create rule checkboxes
    (function () {
        var rules, rule, i, len, markup = '', set = load();
        rules = CSSLint.getRules();
        rules.sort(function (a, b) {
            if (a.id > b.id) {
                return 1;
            } else if (a.id < b.id) {
                return -1;
            }
            return 0;
        });
        for (i = 0, len = rules.length; i < len; i++) {
            rule = rules[i];
            // errors is hardcoded (2 = emit error messages), the UI won't serve any purpose
            if (rule.id !== 'errors') {
                markup += '<label title="' + esc(rule.desc) + '"><input type="checkbox" data-id="' + rule.id + '"' + (set[rule.id] ? ' checked="checked"' : '') + '/>' + rule.id + '</label>';
            }
        }
        document.getElementById('rules').innerHTML = markup;
    }());

    // create a ruleset from the state of the checkboxes
    getRuleSet = function () {
        var i, len, checkboxes, checkbox, set = {};
        checkboxes = document.getElementById('rules').getElementsByTagName('input');
        for (i = 0, len = checkboxes.length; i < len; i++) {
            checkbox = checkboxes[i];
            if (checkbox.checked) {
                set[checkbox.getAttribute('data-id')] = 1; // 1 = warning
            }
        }
        save(set);
        return set;
    };

    // sets the checked state of all checkboxes
    allCheckboxesChecked = function (state) {
        var i, len, checkboxes;
        checkboxes = document.getElementById('rules').getElementsByTagName('input');
        for (i = 0, len = checkboxes.length; i < len; i++) {
            checkboxes[i].checked = state;
        }
    };

    // all action handlers
    actions = {
        'lint-button': function () {
            var results, messages, message, i, len, table, ruleset;
            document.getElementById('output').innerHTML = '';
            results = CSSLint.verify(document.getElementById('input').value, getRuleSet());
            messages = results.messages;

            if (!messages.length) {
                document.getElementById('output').innerHTML = 'No issues found.';
                return;
            }

            table = '<table>' +
                '<tr><th>type</th><th>line</th><th>col</th><th>title</th><th>description</th><th>browsers</th></tr>';
            for (i = 0, len = messages.length; i < len; i++) {
                message = results.messages[i];

                table += '<tr class="' + esc(message.type) + '">';

                table += '<td>' + esc(message.type) + '</td>';
                table += '<td>' + esc(message.line) + '</td>';
                table += '<td>' + esc(message.col) + '</td>';
                table += '<td>' + esc(message.rule.name) + '</td>';
                table += '<td>' + esc(message.message) + '<br/><code>' + esc(message.evidence) + '</code></td>';
                table += '<td>' + esc(message.rule.browsers) + '</td>';

                table += '</tr>';
            }
            table += '</table>';
            document.getElementById('output').innerHTML = table;
        },
        'paste-button': function () {
            document.getElementById('input').value = document.getElementById('demo-css').innerHTML;
        },
        'check-all-button': function () {
            allCheckboxesChecked(true);
        },
        'uncheck-all-button': function () {
            allCheckboxesChecked(false);
        }
    };

    // handle click events
    document.body.onclick = function (event) {
        event = event || window.event;
        var target = event.target || event.srcElement;

        if (actions[target.id]) {
            actions[target.id]();
        }
    };
}());