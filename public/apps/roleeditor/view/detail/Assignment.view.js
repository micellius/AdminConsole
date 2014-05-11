/**
 * Created by vadimto on 10.05.14.
 */
sap.ui.jsview("sap.adminconsole.apps.roleeditor.view.detail.Assignment", {

    getControllerName: function () {
        return "sap.adminconsole.apps.roleeditor.controller.detail.Assignment";
    },

    createContent: function (oController) {
        this.page = new sap.m.Page({
            title: "Role Assignment",
            content: []
        });

        return this.page;
    }

});