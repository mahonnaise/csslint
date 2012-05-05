(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "backslash-9-hack Rule Errors",

        "a value with a '\\9' at the very end should result in a warning": function(){
            var result = CSSLint.verify(".foo{color: #ccc\\9;}", {"backslash-9-hack": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Value with \\9 hack found.", result.messages[0].message);
        },

        "a value without a '\\9' at the very end should not result in a warning": function(){
            var result = CSSLint.verify(".foo{color: #ccc;}", {"backslash-9-hack": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();
