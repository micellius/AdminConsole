/**
 * Created in SAP Labs Israel.
 * Author: Vadim Tomnikov (i070970)
 * Date: 5/8/14
 * Time: 12:34 AM
 */

exports.index = function(req, res){
    res.render('index', { title: 'SAP Fiori Administration Console' });
};