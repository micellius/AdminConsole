/**
 * Created in SAP Labs Israel.
 * Author: Vadim Tomnikov (i070970)
 * Date: 5/8/14
 * Time: 1:42 PM
 */
sap.ui.jsview("sap.adminconsole.apps.roleeditor.view.App", {

    getControllerName: function() {
        return "sap.adminconsole.apps.roleeditor.controller.App";
    },

    createContent: function(oController) {
        this.setDisplayBlock(true);

        this.oSplitApp = new sap.m.SplitApp("splitControl");

        this.oSettingsButton = new sap.m.Button({
            icon: "sap-icon://settings"
        });

        this.oFilterButton = new sap.m.Button({
            icon: "sap-icon://filter"
        });

        this.oSortButton = new sap.m.Button({
            icon: "sap-icon://sort"
        });

        this.oAddButton = new sap.m.Button({
            icon: "sap-icon://add"
        });

        this.oAssignButton = new sap.m.Button({
            text: "Assignment",
            icon: "sap-icon://navigation-right-arrow",
            iconFirst: false
        });

        this.oEditButton = new sap.m.Button({
            text: "Edit"
        });

        this.oDeleteButton = new sap.m.Button({
            text: "Delete"
        });

        this.oActionButton = new sap.m.Button({
            icon: "sap-icon://action"
        });

        this.oBar = new sap.m.Bar({
            contentLeft: [
                this.oSettingsButton,
                this.oFilterButton,
                this.oSortButton,
                this.oAddButton,
                this.oAssignButton
            ],
            contentRight: [
                this.oEditButton,
                this.oDeleteButton,
                this.oActionButton,
            ]
        });

        this.oPage = new sap.m.Page({
            showHeader: false,
            content: [this.oSplitApp],
            footer: this.oBar
        });

        return this.oPage;
    }
});