document.getElementById("copy-button").onclick = copyToClipboard;

document.getElementById("style-select").addEventListener('change', checkStyle, false);
document.getElementById("insert-select").addEventListener('change', checkInsert, false);
document.getElementById("fixed-width").addEventListener('change', checkWidth, false);

document.getElementById("style-select").addEventListener('change', generateComment, false);
document.getElementById("insert-select").addEventListener('change', generateComment, false);

document.getElementById("fixed-width").addEventListener('change', generateComment, false);
document.getElementById("break-words").addEventListener('change', generateComment, false);
document.getElementById("empty-lines").addEventListener('change', generateComment, false);

document.getElementById("custom-insert-text").addEventListener('keyup', generateComment, false);
document.getElementById("width-text").addEventListener('change', generateComment, false);
document.getElementById("comment-text").addEventListener('keyup', generateComment, false);
document.getElementById("comment-text").addEventListener('change', generateComment, false);

document.getElementById("custom-style-topleft").addEventListener('keyup', generateComment, false);
document.getElementById("custom-style-top").addEventListener('keyup', generateComment, false);
document.getElementById("custom-style-topright").addEventListener('keyup', generateComment, false);
document.getElementById("custom-style-left").addEventListener('keyup', generateComment, false);
document.getElementById("custom-style-right").addEventListener('keyup', generateComment, false);
document.getElementById("custom-style-bottomleft").addEventListener('keyup', generateComment, false);
document.getElementById("custom-style-bottom").addEventListener('keyup', generateComment, false);
document.getElementById("custom-style-bottomright").addEventListener('keyup', generateComment, false);

checkStyle();
checkInsert();
checkWidth();
checkCopyButton();
generateComment();

function checkStyle() {
    if (document.getElementById("style-select").value == "style-custom") {
        document.getElementById("div-custom-style").style.display = 'block';
    } else {
        document.getElementById("div-custom-style").style.display = 'none';
    }
}

function checkInsert() {
    if (document.getElementById("insert-select").value == "insert-custom") {
        document.getElementById("div-custom-insert").style.display = 'block';
    } else {
        document.getElementById("div-custom-insert").style.display = 'none';
    }
}

function checkWidth() {
    if (document.getElementById("fixed-width").checked) {
        document.getElementById("div-custom-width").style.display = 'block';
    } else {
        document.getElementById("div-custom-width").style.display = 'none';
    }
}

function checkCopyButton() {
    if (document.getElementById("result-area").innerHTML === "") {
        document.getElementById("copy-button").style.display = 'none';
    } else {
        document.getElementById("copy-button").style.display = 'block';
    }
}

function generateComment() {
    var style = getStyleArr();
    var insert = getInsertStr();
    var comment = document.getElementById("comment-text").value.trim();
    var fixedWidth = document.getElementById("fixed-width").checked;
    if (fixedWidth) {
        var width = document.getElementById("width-text").value;
    } else {
        var allLines = comment.split('\n');
        var width = 5;
        for (i = 0; i < allLines.length; i++) {
            width = Math.max(width, allLines[i].length + 4);
        }
    }
    var breakWords = document.getElementById("break-words").checked;
    var emptyLines = document.getElementById("empty-lines").checked;
    
    if (width < 5) {
        return;
    }
    
    var result = "";
    result += style[0];
    result += style[1].repeat(width - 2);
    result += style[2] + "\n";
    
    var textWidth = width - 4;
    if (!breakWords) {
        comment = wordwrap(comment, textWidth, "\n", false);
        var lines = comment.split('\n');
    } else {
        var lines = comment.split('\n');
        for (i = 0; i < lines.length; i++) {
            if (lines[i].length > textWidth) {
                var remaining = lines[i].substring(textWidth);
                lines[i] = lines[i].substring(0, textWidth);
                lines.splice(i+1, 0, remaining);
            }
        }
    }
    
    for (i = 0; i < lines.length; i++) {
        lines[i] = lines[i].trim();
    }
    
    if (emptyLines) {
        result += style[3];
        result += " ".repeat(width - 2);
        result += style[4] + "\n";
    }
    
    for (i = 0; i < lines.length; i++) {
        result += style[3] + " ";
        result += lines[i];
        if (lines[i].length < textWidth) {
            result += " ".repeat(textWidth - lines[i].length);
        }
        result += " " + style[4] + "\n";
    }
    
    if (emptyLines) {
        result += style[3];
        result += " ".repeat(width - 2);
        result += style[4] + "\n";
    }
    
    result += style[5];
    result += style[6].repeat(width - 2);
    result += style[7];
    
    if (!(insert === "")) {
        result = insertToLines(result, insert);
    }
    
    document.getElementById("result-area").innerHTML = "<xmp>" + result + "</xmp>";
    checkCopyButton();
}

function insertToLines(longStr, insertStr) {
    var lines = longStr.split('\n');
    var resultStr = "";
    for (i = 0; i < lines.length; i++) {
        resultStr += insertStr + " " + lines[i] + "\n";
    }
    return resultStr;
}

function getInsertStr() {
    selection = document.getElementById("insert-select").value;
    if (selection == "insert-slashes") {
        return "//";
    } else if (selection == "insert-squares") {
        return "#";
    } else if (selection == "insert-nothing") {
        return "";
    } else {
        return document.getElementById("custom-insert-text").value;
    }
}

function getStyleArr() {
    selection = document.getElementById("style-select").value;
    styleArr = []
    if (selection == "style-stars") {
        styleArr[0] = "/";
        styleArr[1] = "*";
        styleArr[2] = "\\";
        styleArr[3] = "*";
        styleArr[4] = "*";
        styleArr[5] = "\\";
        styleArr[6] = "*";
        styleArr[7] = "/";
    } else if (selection == "style-lines") {
        styleArr[0] = "+";
        styleArr[1] = "-";
        styleArr[2] = "+";
        styleArr[3] = "|";
        styleArr[4] = "|";
        styleArr[5] = "+";
        styleArr[6] = "-";
        styleArr[7] = "+";
    } else if (selection == "style-squares") {
        styleArr[0] = "#";
        styleArr[1] = "#";
        styleArr[2] = "#";
        styleArr[3] = "#";
        styleArr[4] = "#";
        styleArr[5] = "#";
        styleArr[6] = "#";
        styleArr[7] = "#";
    } else {
        styleArr[0] = document.getElementById("custom-style-topleft").value;
        styleArr[1] = document.getElementById("custom-style-top").value;
        styleArr[2] = document.getElementById("custom-style-topright").value;
        styleArr[3] = document.getElementById("custom-style-left").value;
        styleArr[4] = document.getElementById("custom-style-right").value;
        styleArr[5] = document.getElementById("custom-style-bottomleft").value;
        styleArr[6] = document.getElementById("custom-style-bottom").value;
        styleArr[7] = document.getElementById("custom-style-bottomright").value;
    }
    return styleArr;
}

function selectText() {
    if (document.selection) {
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementById("result-area"));
        range.select();
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(document.getElementById("result-area"));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }
}

function copyToClipboard() {
    selectText();
    document.execCommand("Copy");
}

function wordwrap(str, width, brk, cut) {
    if (!str) {
        return str;
    }
    var regex = '.{1,' +width+ '}(\\s|$)' + (cut ? '|.{' +width+ '}|.+$' : '|\\S+?(\\s|$)');
    return str.match(RegExp(regex, 'g')).join(brk);
}
