/**
 * Created in SAP Labs Israel.
 * Author: Vadim Tomnikov (i070970)
 * Date: 5/8/14
 * Time: 1:26 PM
 */
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.declare("sap.adminconsole.apps.roleeditor.Component");

sap.ui.core.UIComponent.extend("sap.adminconsole.apps.roleeditor.Component", {
    metadata : {
        version : "@version@",

        library : "sap.adminconsole.apps.roleeditor",
        includes : [],

        dependencies : {
            libs : [ "sap.m", "sap.ui.layout", "sap.ui.commons" ],
            components : []
        },
        routing : {
            config : {
                viewType : "JS",
                viewPath : "sap.adminconsole.apps.roleeditor.view",
                targetControl : "splitControl",
                clearTarget : false
            },
            routes : [
                {
                    pattern: "",
                    name: "empty",
                    viewPath: "sap.adminconsole.apps.roleeditor.view.master",
                    view: "Master",
                    targetAggregation: "masterPages"
                }, {
                    pattern: "roles/:id:",
                    name: "master",
                    viewPath: "sap.adminconsole.apps.roleeditor.view.master",
                    view: "Master",
                    targetAggregation: "masterPages",
                    subroutes: [
                        {
                            pattern: "roles/:id:",
                            name: "detail",
                            view: "Detail",
                            viewPath: "sap.adminconsole.apps.roleeditor.view.detail",
                            targetAggregation: "detailPages"
                        }, {
                            pattern: "roles/{id}/assignment",
                            name: "assignment",
                            view: "Assignment",
                            viewPath: "sap.adminconsole.apps.roleeditor.view.detail",
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
            id: "roleEditorApp",
            viewName: "sap.adminconsole.apps.roleeditor.view.App",
            type: "JS",
            viewData: { component: this }
        });
    }
});