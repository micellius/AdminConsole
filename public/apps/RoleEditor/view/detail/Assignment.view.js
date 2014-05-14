/**
 * Created by vadimto on 10.05.14.
 */
jQuery.sap.require("tests.adminconsole.apps.RoleEditor.utils.Privileges");
sap.ui.jsview("tests.adminconsole.apps.RoleEditor.view.detail.Assignment", {

    getControllerName: function () {
        return "tests.adminconsole.apps.RoleEditor.controller.detail.Assignment";
    },

    createContent: function (oController) {

        // Workaround for UI5 bug - itemPress event never fired
        $(document).on('click', '.sapMListTbl.sapMListUl .sapMListTblCell', function(evt) {
            var isCheckBox = ($(evt.target).closest('.sapMCbMark').length > 0),
                oItem = sap.ui.getCore().byId($(this).closest('tr').attr('id')),
                oTable = sap.ui.getCore().byId($(this).closest('table').parent().attr('id'));

            if(!isCheckBox) {
                oTable._onItemPressed(oItem, {});
            }
        });

        var oView = this,
            Privileges = tests.adminconsole.apps.RoleEditor.utils.Privileges;

        function editModeBinding(bInvert) {
            return {
                path: '/editMode',
                formatter: function(bEditMode) {
                    return !bEditMode !== !bInvert; // XOR with conversion of undefined values to false
                }
            }
        }

        function createTable(sTitle, sPath) {

            var table = new sap.m.Table({
                headerToolbar: new sap.m.Toolbar({
                    content: [
                        new sap.m.Text({
                            text: sTitle
                        }),
                        new sap.m.Button({
                            visible: editModeBinding(),
                            icon: "sap-icon://action"
                        }),
                        new sap.m.Button({
                            visible: editModeBinding(),
                            icon: "sap-icon://add",
                            press: function() {
                                oController.openAddDialog();
                            }
                        }),
                        new sap.m.Button({
                            visible: editModeBinding(),
                            icon: "sap-icon://delete"
                        }),
                        new sap.m.ToolbarSpacer(),
                        new sap.m.SearchField({
                            width: '250px',
                            search: function(oEvent) {
                                oController.search(table, oEvent.getParameter('query'));
                            }
                        })
                    ]
                }),
                mode: sap.m.ListMode.SingleSelectMaster,
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
                })],
                itemPress: function() {
                    var oItem = oEvent.getParameter('listItem');
                    if(!table.getModel().getProperty('/editMode')) {
                        oController.openPopover(oItem);
                    }
                }
            });

            table.bindProperty("mode", {
                path: "/editMode",
                formatter: function(bMode) {
                    return bMode ? sap.m.ListMode.MultiSelect : sap.m.ListMode.SingleSelectMaster;
                }
            });

            table.bindAggregation("items", {
                path: sPath,
                factory: function(sId){
                    return new sap.m.ColumnListItem(sId, {
                        type: {
                            path: '/objectType',
                            formatter: function() {
                                var objectType = this.getBindingContext().getObject().objectType;
                                return Privileges.getDefaultPrivilegesByObjectType(objectType).length > 0 ?
                                    sap.m.ListType.Navigation : sap.m.ListType.Inactive;
                            }
                        },
                        cells: [new sap.m.Text({
                            text: '{objectName}'
                        }), new sap.m.Text({
                            text: '{objectType}'
                        }), new sap.m.Text({
                            text: '{objectId}'
                        }), new sap.m.Text({
                            text: '{grantor}'
                        })]
                    });
                }
            });

            return table;
        }

        // Header

        this.oObjectHeader = new sap.m.ObjectHeader({
            condensed: true,
            title: "{/headerTitle}",
            number: "{/headerNumber}",
            numberUnit: "{/headerUnit}",
            attributes: [new sap.m.ObjectAttribute({
                text: "{/headerDesctiption}"
            })]
        });

        // Popover

        this.oPopover = new sap.m.ResponsivePopover({
            title: "Object Priveleges",
            modal: true,
            offsetX: -300,
            content: [new sap.m.Table({
                headerToolbar: new sap.m.Toolbar({
                    content: [
                        new sap.m.Text({
                            text: "Catalog"
                        })
                    ]
                }),
                columns: [new sap.m.Column({
                    header: new sap.m.Text({
                        text: "Privilege"
                    }),
                    vAlign: sap.ui.core.VerticalAlign.Middle
                }), new sap.m.Column({
                    header: new sap.m.Text({
                        text: "Grantable to others"
                    }),
                    width: "150px"
                })],
                items: {
                    path: '/detailedPrivileges',
                    factory: function(sId) {
                        return new sap.m.ColumnListItem(sId, {
                            cells: [new sap.m.Text({
                                text: '{privilege}'
                            }), new sap.m.Select({
                                selectedKey: '{isGrantable}',
                                items: [new sap.ui.core.Item({
                                    key: "TRUE",
                                    text: "Yes"
                                }), new sap.ui.core.Item({
                                    key: "FALSE",
                                    text: "No"
                                })]
                            })]
                        });
                    }
                }
            })],
            beginButton: new sap.m.Button({
                text: "OK",
                press: function() {
                    oView.oPopover.close();
                }
            }),
            endButton: new sap.m.Button({
                text: "Cancel",
                press: function() {
                    oView.oPopover.close();
                }
            })
        });

        // Add Object

        this.oAddDialog = new sap.m.TableSelectDialog({
            title: "Select Objects",
            multiSelect: true,
            search: function(oEvent) {
                oController.addDialogSearch(oEvent.getParameter('value'));
            },
            confirm: oController.addObject,
            close: function() {
                oView.oAddDialog.close();
            },
            columns: [new sap.m.Column({
                header: new sap.m.Text({
                    text: "Object Name"
                })
            }), new sap.m.Column({
                header: new sap.m.Text({
                    text: "Type"
                }),
                width: "200px"
            })],
            items: {
                path: '/objects',
                factory: function(sId) {
                    return new sap.m.ColumnListItem(sId, {
                        cells: [new sap.m.Text({
                            text: '{objectName}'
                        }), new sap.m.Text({
                            text: '{type}'
                        })]
                    });
                }
            }
        });

        // Granted Roles

        this.oTableRoles = createTable("Granted Roles", "/roles");

        // System Privileges

        this.oTableSystem = createTable("System Privileges", "/privileges");

        // SQL Privileges

        this.oTableSql = createTable("SQL Privileges", "/privileges");

        // Package Privileges

        this.oTablePackage = createTable("Package Privileges", "/privileges");

        // Application Privileges

        this.oTableApplication = createTable("Application Privileges", "/privileges");

        // Tabs

        this.oIconTabBar = new sap.m.IconTabBar({
            items: [new sap.m.IconTabFilter({
                icon: "sap-icon://role",
                text: "Roles",
                content: [this.oTableRoles]
            }), new sap.m.IconTabFilter({
                icon: "sap-icon://it-system",
                text: "System",
                content: [this.oTableSystem]
            }), new sap.m.IconTabFilter({
                icon: "sap-icon://product",
                text: "SQL",
                content: [this.oTableSql]
            }), new sap.m.IconTabFilter({
                icon: "sap-icon://suitcase",
                text: "Package",
                content: [this.oTablePackage]
            }), new sap.m.IconTabFilter({
                icon: "sap-icon://header",
                text: "Application",
                content: [this.oTableApplication]
            })],
            select: function(oEvent) {
                var numberOfItems = oEvent.getParameter('selectedItem').getContent()[0].getItems().length;
                oView.getModel().setProperty('/headerNumber', numberOfItems);
                oView.getModel().setProperty('/headerUnit', numberOfItems === 1 ? "Object" : "Objects");
            }
        });

        // Toolbar Items

        this.oEditButton = new sap.m.Button({
            visible: editModeBinding(true),
            text: "Edit",
            press: function() {
                oController.toggleEditMode();
            }
        });

        this.oDeleteButton = new sap.m.Button({
            visible: editModeBinding(true),
            text: "Delete"
        });

        this.oApplyButton = new sap.m.Button({
            visible: editModeBinding(),
            text: "Apply"
        });

        this.oSaveButton = new sap.m.Button({
            visible: editModeBinding(),
            text: "Save",
            press: function() {
                oController.toggleEditMode();
            }
        });

        this.oCancelButton = new sap.m.Button({
            visible: editModeBinding(),
            text: "Cancel",
            press: function() {
                oController.toggleEditMode();
            }
        });

        // Page

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
            footer: new sap.m.Bar({
                contentRight: [
                    this.oEditButton,
                    this.oDeleteButton,
                    this.oApplyButton,
                    this.oSaveButton,
                    this.oCancelButton
                ]
            })
        });

        return this.page;
    }

});