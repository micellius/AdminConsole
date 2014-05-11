/**
 * Created in SAP Labs Israel.
 * Author: Vadim Tomnikov (i070970)
 * Date: 5/8/14
 * Time: 10:53 AM
 */
sap.ui.getCore().attachInit(function() {
    new sap.m.Shell({
        app: new sap.ui.core.ComponentContainer({
            height : "100%",
            name : "sap.adminconsole.apps.roleeditor"
        })
    }).placeAt("content");
});