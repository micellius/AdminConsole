/**
 * Created in SAP Labs Israel.
 * Author: Vadim Tomnikov (i070970)
 * Date: 5/8/14
 * Time: 12:34 AM
 */

exports.get = function(req, res){
    res.render('index', { title: 'SAP Fiori Administration Console' });
};