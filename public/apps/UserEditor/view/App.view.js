/**
 * Created in SAP Labs Israel.
 * Author: Vadim Tomnikov (i070970)
 * Date: 5/8/14
 * Time: 1:42 PM
 */
sap.ui.jsview("tests.adminconsole.apps.UserEditor.view.App", {

    getControllerName: function() {
        return "tests.adminconsole.apps.UserEditor.controller.App";
    },

    createContent: function() {

        this.setDisplayBlock(true);

        this.oSplitApp = new sap.m.SplitApp("splitControl");

        return this.oSplitApp;
    }
});