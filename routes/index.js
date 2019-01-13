let express = require('express');
let path = require('path');
let router = express.Router();
let fs = require('fs');
const file = __dirname + '/../files/member.txt';

router.get('/', function(req, res){
   res.render('index');
});

router.get('/index', function(req, res){
    res.render('index');
});
/* GET home page. */
router.get('/member', function(req, res){
  let member = fs.readFileSync(file, 'utf8').split(';');

  res.render('member', {
    member: member
  });
});

router.post('/member', function(req, res){
  const {new_member} = req.body;

  let member = fs.readFileSync(file, 'utf8').split(';');
  member.push(new_member);
  member.sort();

  let data = "";
  for(let i = 0; i < member.length; i++){
      if(member[i]){
          data += member[i];
          if(i != member.length - 1){
              data += ';';
          }
      }
  }

  fs.writeFile(file, data, 'utf8', function(error){
  });
  res.end();
});

router.delete('/member/:delete_name', function(req, res){
    let delete_name = req.params.delete_name;
    let member = fs.readFileSync(file, 'utf8').split(';');
    let data = "";
    for(let i = 0; i < member.length; i++){
        if(!member[i]) continue;
        else if(member[i] != delete_name){
            data += member[i];
            data += ';';
        }
    }

    if(data[data.length - 1] == ';'){
        data = data.substr(0, data.length - 1);
    }

    fs.writeFile(file, data, 'utf8', function(error){
    });
    res.end();
});


function create_team(num, mercenary, member) {
    let team_arr = new Array(num);

    for(let i = 0; i < mercenary; i++){
        member.push("용병" + (i + 1));
    }

    let check = new Array(member.length);

    for(let i = 0; i < num; i++){
        team_arr[i] = new Array();
    }

    for(let i = 0; i < member.length; i++){
        check[i] = false;
    }

    let count = 0;

    while(count < member.length) {
        let flag = true;
        let team_number = count % num;

        while (flag) {
            var index = Math.floor(Math.random() * member.length);
            if (!check[index]) {
                check[index] = true;
                count++;
                flag = false;
                team_arr[team_number].push(member[index]);
            }
        }
    }

    return team_arr;
}

router.get('/create_team', function(req, res){
    let member = fs.readFileSync(file, 'utf8').split(';');

    res.render('create_team', {
        member: member
    });
});

router.post('/create_team', function(req, res) {
    let {team_num, mercenary_num, member} = req.body;
    if(!mercenary_num)
        mercenary_num = 0;

    let team_arr = create_team(team_num, mercenary_num, member);

    res.render('result_team', {
        team_arr: team_arr
    });
});

module.exports = router;
