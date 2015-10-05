/**
 * Created by Helena on 04.09.2015.
 */



function chooseMetaIcon(metaDataName) {
    switch (metaDataName) {
        case "Bild":
            return "fui-photo";
        case "Film":
            return "fui-video";
        case "Text":
            return "fui-document";
        case "Navigation":
            return "fui-location";
        case "Test":
            return "fui-radio-unchecked";
        case "Audio":
            return "fui-volume";
    }
}
