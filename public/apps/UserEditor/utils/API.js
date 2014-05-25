/**
 * Created in SAP Labs Israel.
 * Author: Vadim Tomnikov (i070970)
 * Date: 5/18/14
 * Time: 10:54 AM
 */
jQuery.sap.declare("tests.adminconsole.apps.UserEditor.utils.API");

tests.adminconsole.apps.UserEditor.utils.API = {
    csrfServiceUrl: '/sap/hana/xs/ide/editor/server/csrf.xsjs',
    netServiceUrl: '/sap/hana/ide/core/base/server/net.xsjs',
    packageName: location.hostname.indexOf('.emea.global.corp.sap') !== -1 ? 'sap.hana.ide.core.plugins.security.server.hana' : 'sap.hana.ide.core.base.server',
    getAbsoluteFunctionName: function(apiName) {
        return [tests.adminconsole.apps.UserEditor.utils.API.packageName, apiName].join('.');
    },
    normalizeRole: function(oRole) {
        return oRole.role || oRole;
    },
    normalizeUser: function(oUser) {
        return oUser.user || oUser;
    }
};