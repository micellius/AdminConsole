/**
 * Created in SAP Labs Israel.
 * Author: Vadim Tomnikov (i070970)
 * Date: 5/20/14
 * Time: 11:01 PM
 */
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("tests.adminconsole.apps.UserEditor.utils.API");
jQuery.sap.declare("tests.adminconsole.apps.UserEditor.Component");

sap.ui.core.UIComponent.extend("tests.adminconsole.apps.UserEditor.Component", {
    metadata : {
        version : "@version@",
        library : "tests.adminconsole.apps.UserEditor",
        includes : [ "styles/style.css" ],
        dependencies : {
            libs : [ "sap.m", "sap.ui.layout", "sap.ui.commons" ],
            components : []
        },
        config: {
            fullWidth: true
        },
        routing : {
            config : {
                viewType : "JS",
                viewPath : "tests.adminconsole.apps.UserEditor.view",
                targetControl : "splitControl",
                clearTarget : false
            },
            routes : [
                {
                    pattern: "",
                    name: "empty",
                    viewPath: "tests.adminconsole.apps.UserEditor.view.master",
                    view: "Master",
                    targetAggregation: "masterPages",
                    subroutes: [{
                        pattern: "",
                        view: "Empty",
                        viewPath: "tests.adminconsole.apps.UserEditor.view.detail",
                        targetAggregation: "detailPages"
                    }]
                }, {
                    pattern: "users/:id:",
                    name: "master",
                    viewPath: "tests.adminconsole.apps.UserEditor.view.master",
                    view: "Master",
                    targetAggregation: "masterPages",
                    subroutes: [
                        {
                            pattern: "users/:id:",
                            name: "detail",
                            view: "Detail",
                            viewPath: "tests.adminconsole.apps.UserEditor.view.detail",
                            targetAggregation: "detailPages"
                        }, {
                            pattern: "users/{id}/assignment/:tab:",
                            name: "assignment",
                            view: "Assignment",
                            viewPath: "tests.adminconsole.apps.UserEditor.view.detail",
                            targetAggregation: "detailPages"
                        }
                    ]
                }
            ]
        }
    },
    init : function () {
        jQuery.sap.require("sap.m.routing.RouteMatchedHandler");

        sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
        var oRouter = this.getRouter();
        new sap.m.routing.RouteMatchedHandler(oRouter);
        oRouter.register("router");
        oRouter.initialize();
    },
    createContent : function () {
        return sap.ui.view({
            id: "userEditorApp",
            viewName: "tests.adminconsole.apps.UserEditor.view.App",
            type: "JS",
            viewData: { component: this }
        });
    }
});