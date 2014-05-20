/**
 * Created in SAP Labs Israel.
 * Author: Vadim Tomnikov (i070970)
 * Date: 5/20/14
 * Time: 11:03 AM
 */
sap.ui.getCore().attachInit(function() {
    new sap.m.Shell({
        app: new sap.ui.core.ComponentContainer({
            height : "100%",
            name : "tests.adminconsole.apps.UserEditor"
        })
    }).placeAt("content");
});