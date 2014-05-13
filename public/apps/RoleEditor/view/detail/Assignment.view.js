/**
 * Created by vadimto on 10.05.14.
 */
sap.ui.jsview("tests.adminconsole.apps.RoleEditor.view.detail.Assignment", {

    getControllerName: function () {
        return "tests.adminconsole.apps.RoleEditor.controller.detail.Assignment";
    },

    createContent: function () {

        this.oObjectHeader = new sap.m.ObjectHeader({
            condensed: true,
            title: "{/headerTitle}",
            number: "{/headerNumber}",
            numberUnit: "{/headerUnit}",
            attributes: [new sap.m.ObjectAttribute({
                text: "{/headerDesctiption}"
            })]
        });

        this.oTable0 = new sap.m.Table({
            headerToolbar: new sap.m.Toolbar({
                content: [new sap.m.Text({
                    text: "Roles"
                }), new sap.m.Button({
                    icon: "sap-icon://action"
                }), new sap.m.Button({
                    icon: "sap-icon://add"
                }), new sap.m.Button({
                    icon: "sap-icon://delete"
                }), new sap.m.ToolbarSpacer(),
                    new sap.m.SearchField({
                        width: '250px'
                    })
                ]
            }),
            mode: sap.m.ListMode.MultiSelect,
            columns: [new sap.m.Column({
                header: new sap.m.Text({
                    text: "Name"
                })
            }), new sap.m.Column({
                header: new sap.m.Text({
                    text: "Type"
                })
            }), new sap.m.Column({
                header: new sap.m.Text({
                    text: "ID"
                })
            }), new sap.m.Column({
                header: new sap.m.Text({
                    text: "Grantor"
                })
            }), new sap.m.Column({
                header: new sap.m.Text({
                    text: "Assign Date"
                })
            }), new sap.m.Column({
                header: new sap.m.Text({
                    text: "Privileges"
                })
            })]
        });

        this.oTable0.bindAggregation("items", {
            path: "/roles",
            factory: function(sId){
                return new sap.m.ColumnListItem(sId, {
                    cells: [new sap.m.Text({
                        text: '{objectName}'
                    }), new sap.m.Text({
                        text: '{objectType}'
                    }), new sap.m.Text({
                        text: '{objectId}'
                    }), new sap.m.Text({
                        text: '{grantor}'
                    }), new sap.m.Text({
                        text: '???'
                    }), new sap.m.Text({
                        text: '???'
                    })]
                });
            }
        });

        this.oIconTabBar = new sap.m.IconTabBar({
            items: [new sap.m.IconTabFilter({
                icon: "sap-icon://grid",
                content: [this.oTable0]
            }), new sap.m.IconTabFilter({
                icon: "sap-icon://dimension",
                content: []
            }), new sap.m.IconTabFilter({
                icon: "sap-icon://documents",
                content: []
            }), new sap.m.IconTabFilter({
                icon: "sap-icon://person-placeholder",
                content: []
            })]
        });

        this.page = new sap.m.Page({
            title: "Role Assignment",
            showNavButton: true,
            navButtonPress: function() {
                history.back();
            },
            content: [
                this.oObjectHeader,
                this.oIconTabBar
            ],
            footer: new sap.m.Bar({})
        });

        return this.page;
    }

});