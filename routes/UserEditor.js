/**
 * Created in SAP Labs Israel.
 * Author: Vadim Tomnikov (i070970)
 * Date: 5/16/14
 * Time: 10:51 AM
 */

exports.get = function(req, res){
    res.render('UserEditor', { title: 'User Editor' });
};
