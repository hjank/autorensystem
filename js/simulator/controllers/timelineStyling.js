/**
 * Created by Helena on 12.01.2016.
 */

/**
 * Just like getColor() in formatSelections.js, but returns a lighter shade of each color (90% brightness).
 * @param contextInfo
 * @returns {*}
 */
function getBackgroundColorForContextColumn(contextInfo) {
    var firstClass = contextInfo.getClasses()[0];

    switch (firstClass) {
        case "CC_SCENARIO":
            return "#d6e8f5";
        case "CC_PERSONAL":
            return "#eed8f3";
        case "CC_SITUATIONAL":
            return "#e6fdce";
        case "CC_TECHNICAL":
            return "#e6e6e6";
        case "CC_PHYSICAL":
            return "#fef6cd";
        case "CC_LOCATION":
            return "#fbd2d0";
    }
}

