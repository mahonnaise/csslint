/*
 * Rule: Don't use the fragile \9 hack.
 *
 */
/*global CSSLint*/
CSSLint.addRule({

    //rule information
    id: "backslash-9-hack",
    name: "Disallow values with a \\9 at the very end",
    desc: "Checks for the \\9 value hack (targets IE6/7/8 and sometimes 9)",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this,
			trailingBackslash9 = /\\9$/;

        //check if value ends with "\9"
        parser.addListener("property", function(event){
            if (trailingBackslash9.test(event.value.text)){
                reporter.report("Value with \\9 hack found.", event.property.line, event.property.col, rule);
            }
        });
    }
});