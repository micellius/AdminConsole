/**
 * Created in SAP Labs Israel.
 * Author: Vadim Tomnikov (i070970)
 * Date: 5/8/14
 * Time: 1:50 PM
 */
sap.ui.controller("tests.adminconsole.apps.RoleEditor.controller.App", {

    onInit : function () {
        var controller = this;
        this.router = sap.ui.core.UIComponent.getRouterFor(this);
        this.router.attachRouteMatched(function(oEvent) {
            controller.oRouteArguments = oEvent.getParameters().arguments;
        });
        this.oEventBus = new sap.ui.core.EventBus();
        this.getCsrfToken();
    },

    getCsrfToken: function(callback) {
        var controller = this;

        function executeCallback() {
            typeof callback === 'function' && callback(controller.csrfToken);
        }

        if(controller.csrfToken) {
            executeCallback();
        } else {
            if(!controller.csrfPromise) {
                controller.csrfPromise = $.ajax({
                    type: "HEAD",
                    url: "/sap/hana/ide/core/base/server/csrf.xsjs",
                    headers: {
                        "X-CSRF-Token": "Fetch"
                    }
                }).done(function (data, textStatus, jqXHR) {
                    controller.csrfToken = jqXHR.getResponseHeader('x-csrf-token');
                });
            }

            controller.csrfPromise.done(function () {
                executeCallback();
            });
        }
    }
});