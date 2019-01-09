var express = require('express');
var path = require('path');
var router = express.Router();
var fs = require('fs');
/* GET home page. */
router.get('/user', function(req, res){
    //let path = require('path');
  let user_list = fs.readFileSync(__dirname + '/../files/users.txt', 'utf8').split(';');
  user_list.sort();

  var cur = path.resolve('.');
  res.render('index', {
    cur: cur,
    user_list:  user_list
  });
});

function create_team(num, user_list) {
    let team_arr = new Array(num);
    let check = new Array(user_list.length);

    for(var i = 0; i < num; i++){
        team_arr[i] = new Array();
    }

    for(var i = 0; i < user_list.length; i++){
        check[i] = false;
    }

    let count = 0;

    while(count < user_list.length) {
        let flag = true;
        let team_number = count % num;

        while (flag) {
            var index = Math.floor(Math.random() * user_list.length);
            if (!check[index]) {
                check[index] = true;
                count++;
                flag = false;
                team_arr[team_number].push(user_list[index]);
            }
        }
    }

    return team_arr;
}

router.post('/team', function(req, res) {
    const {num, user_list} = req.body;
    console.log(user_list);

    //let today = new Date().toISOString().substr(0, 10).replace('T', ' ');
    //let fs_today = fs.readFileSync(__dirname + '/../files/today.txt', 'utf8').split(';');

    let team_arr = create_team(num, user_list);
    console.log(team_arr);

    res.render('team', {
        team_arr: team_arr
    });
});

module.exports = router;
