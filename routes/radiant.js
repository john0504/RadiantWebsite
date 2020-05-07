var express = require('express'),
    router = express.Router();

var LocalSN = 0;

const VendorId = [0x11, 0x02];

const BASIC_BUFFER = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, VendorId[0], VendorId[1],
                      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
const BUFFER_SN          = 0x00;
const BUFFER_SOURCE_ADDR = 0x03;
const BUFFER_TARGET_ADDR = 0x05;
const BUFFER_CMD         = 0x07;
const BUFFER_VENDOR_ID   = 0x08;
const BUFFER_PAR         = 0x0A;

const CMD_REPORT_DATA       = 0xDC;
const CMD_ONOFF_RESET       = 0xD0;
const CMD_LUM_MUSIC         = 0xD2;
const CMD_CT_RGB            = 0xE2;
const CMD_CUSTOM1           = 0xEA;
const CMD_CUSTOM2           = 0xEB;
const CMD_CHANGE_ADDR       = 0xE0;
const CMD_CHANGE_ADDR_RES   = 0xE1;
const CMD_SET_TIME          = 0xE4;
const CMD_GET_TIME          = 0xE8;
const CMD_GET_TIME_RES      = 0xE9;
const CMD_GROUP             = 0xD7;
const CMD_GROUP_NO          = 0xDD;
const CMD_GROUP_RES         = 0xD4;
const CMD_SCENE             = 0xEE;
const CMD_SCENE_ONOFF       = 0xEF;
const CMD_SCENE_INFO        = 0xC0;
const CMD_SCENE_INFO_RES    = 0xC1;
const CMD_SCHE              = 0xE5;
const CMD_SCHE_INFO         = 0xE6;
const CMD_SCHE_INFO_RES     = 0xE7;
const CMD_GROUP_BINDING     = 0xEC;
const CMD_SOCKET_SCHE       = 0xF1;

const SUBCMD_OFF                  = 0x00;
const SUBCMD_ON                   = 0x01;
const SUBCMD_RESET                = 0x02;
const SUBCMD_CT                   = 0x05;
const SUBCMD_RGB                  = 0x04;
const SUBCMD_GET_MAC              = 0xB7;
const SUBCMD_GET_MAC2             = 0xAA;
const SUBCMD_MUSIC_ON             = 0xFE;
const SUBCMD_MUSIC_OFF            = 0xFF;

const SUBCMD_DEL_GROUP            = 0x00;
const SUBCMD_ADD_GROUP            = 0x01;
const SUBCMD_GET_ALL_GROUP        = 0x01;

const SUBCMD_DEL_SCENE            = 0x00;
const SUBCMD_DEL_SCENE_RES        = 0x0B;
const SUBCMD_ADD_SCENE            = 0x01;
const SUBCMD_ADD_SCENE_RES        = 0x0A;
const SUBCMD_ENABLE_SCENE         = 0x00;
const SUBCMD_DISABLE_SCENE        = 0x02;
const SUBCMD_PAGE1                = 0xFF;
const SUBCMD_PAGE2                = 0xFE;

const SUBCMD_DEL_SCHE             = 0x01;
const SUBCMD_ADD_SCHE             = 0x02;
const SUBCMD_ENABLE_SCHE          = 0x03;
const SUBCMD_DISABLE_SCHE         = 0x04;
const SUBCMD_SCHE_RES             = 0x0C;

const SUBCMD_PAIR                 = 0xA3;
const SUBCMD_GET_DATA             = 0xA5;
const SUBCMD_PAIR_STOP            = 0x00
const SUBCMD_PAIR_START           = 0x01;
const SUBCMD_UNPAIR_ALL_START     = 0x02;

const SUBCMD_WALL_SWITCH          = 0xA5;
const SUBCMD_COMBO_SWITCH         = 0xA5;

const SUBCMD_DISABLE_PIR          = 0xA0;
const SUBCMD_ENABLE_PIR           = 0xA1;
const SUBCMD_PIR                  = 0xA4;

const SUBCMD_HCL                  = 0xA6;
const SUBCMD_ENABLE               = 0xA7;
const SUBCMD_DISABLE              = 0xA8;

const SUBCMD_LIGHT_SENSOR         = 0xB4;
const SUBCMD_LIGHT_SENSOR_DATA    = 0xB2;
const SUBCMD_ENABLE_LIGHT_SENSOR  = 0xB1;
const SUBCMD_DISABLE_LIGHT_SENSOR = 0xB0;

const SUBCMD_DYNAMICSCENE         = 0xB6;
const SUBCMD_DYNAMICSCENE_DATA    = 0xA9;

const SUBCMD_DETECTOR             = 0xB9;

const SUBCMD_DISABLE_SOCKET       = 0x10;
const SUBCMD_ENABLE_SOCKET        = 0x11;

const SUBCMD_FAN_CONTROL           = 0xAA;
const SUBCMD_FAN_CONTROL_FAN       = 0x11;
const SUBCMD_FAN_CONTROL_UPLIGHT   = 0x22;
const SUBCMD_FAN_CONTROL_DOWNLIGHT = 0x33;
const SUBCMD_FAN_CONTROL_PAIR      = 0x44;
const SUBCMD_FAN_CONTROL_STUDY     = 0xBA;

const SUBCMD_DIMMER                = 0xAB;
const SUBCMD_DIMMER_DATA           = 0xBC;

function getBuffer(sourceAddr, targetAddr, cmd) {
    var buffer = BASIC_BUFFER;
    buffer[BUFFER_SN] = LocalSN & 0xFF;
    buffer[BUFFER_SN + 1] = (LocalSN >> 8) & 0xFF;
    buffer[BUFFER_SN + 2] = (LocalSN >> 16) & 0xFF;
    buffer[BUFFER_SOURCE_ADDR] = sourceAddr[0];
    buffer[BUFFER_SOURCE_ADDR + 1] = sourceAddr[1];
    buffer[BUFFER_TARGET_ADDR] = targetAddr[0];
    buffer[BUFFER_TARGET_ADDR + 1] = targetAddr[1];
    buffer[BUFFER_CMD] = cmd;
    buffer[BUFFER_VENDOR_ID] = VendorId[0];
    buffer[BUFFER_VENDOR_ID] = VendorId[1];
    LocalSN++;
    return buffer;
}

router.post('/response', function (req, res) {
    var mysqlQuery = req.mysqlQuery;
    console.log('response:' + JSON.stringify(req.body['rx']));
    var UserId = req.body['UserId'];
    var rx = JSON.parse(req.body['rx']);
    var sequenceNo = [rx[0], rx[1], rx[2]];
    var sourceAddr = [rx[3], rx[4]];
    var crc = [rx[5], rx[6]];
    var cmdNo = rx[7];
    var vendorId = [rx[8], rx[9]];
    switch(cmdNo) {
        case CMD_REPORT_DATA:
            var insertsql = {
                UserId: UserId,
                Address: rx[10],
                Info1: rx[11],
                Info2: rx[12],
                Info3: rx[13],
                TypeId: rx[14]
            };
            var sql = "INSERT INTO DeviceTbl SET ? ON DUPLICATE KEY UPDATE ? ";
            mysqlQuery(sql, [insertsql, insertsql], function (err, result) {
                if (err) {
                    console.log('[INSERT ERROR] - ', err.message);
                    return;
                }
            });
            if (rx[15] != 0x00) {
                var insertsql = {
                    UserId: req.session.UserId,
                    Address: rx[15],
                    Info1: rx[16],
                    Info2: rx[17],
                    Info3: rx[18],
                    TypeId: rx[19]
                };
                var sql = "INSERT INTO DeviceTbl SET ? ON DUPLICATE KEY UPDATE ? ";
                mysqlQuery(sql, [insertsql, insertsql], function (err, result) {
                    if (err) {
                        console.log('[INSERT ERROR] - ', err.message);
                        return;
                    }
                });
            }
            break;
        case CMD_CHANGE_ADDR_RES:
            var SourceAddrCheck = [rx[10], rx[11]];
            break;
        case CMD_GROUP_RES:
            var groupList = [rx[10], rx[11], rx[12], rx[13], rx[14], rx[15], rx[16], rx[17], rx[18], rx[19]];
            break;
        case CMD_SCENE_INFO_RES:
            var scenepage = rx[19];
            if (scenepage == SUBCMD_PAGE1 || scenepage == SUBCMD_PAGE2) {
                var sceneList =  [rx[10], rx[11], rx[12], rx[13], rx[14], rx[15], rx[16], rx[17]];
            } else {
                var sceneId =  rx[10];            
                var sceneInfo = [rx[11], rx[12], rx[13], rx[14], rx[15]];
            }     
            break;
        case CMD_SCHE_INFO_RES:
            var scenepage = rx[19];
            if (scenepage == SUBCMD_PAGE1 || scenepage == SUBCMD_PAGE2) {
                var scheList = [rx[10], rx[11], rx[12], rx[13], rx[14], rx[15], rx[16], rx[17]];
            } else {
                var scheflag = rx[10]
                var sceneId =  rx[11];            
                scheinfo = [rx[12], rx[13], rx[14], rx[15], rx[16], rx[17], rx[18]];
            }
            break;
        case CMD_GET_TIME_RES:
            var year = [rx[10], rx[11]];
            var month = rx[12];
            var day = rx[13];
            var hour = rx[14];
            var minute = rx[15];
            var second = rx[16];
            break;
        case CMD_CUSTOM1:
            var res = [rx[10], rx[11]];
            if (res[0] == 0x00 && res[1] == SUBCMD_ADD_SCENE_RES) {
                var sceneId =  rx[12];
                var sceneInfo = [rx[13], rx[14], rx[15], rx[16], rx[17]];            
            } else if (res[0] == 0x00 && res[1] == SUBCMD_DEL_SCENE_RES) {
                var sceneId =  rx[12];
            } else if (res[0] == 0x00 && res[1] == SUBCMD_SCHE_RES) {
                var scheflag = rx[12]; 
                var scheId = rx[13];
                switch(scheflag) {
                    case SUBCMD_ADD_SCHE:
                        var scheinfo = [rx[14], rx[15], rx[16], rx[17], rx[18], 0x00, rx[19]];
                        break;
                    case SUBCMD_DEL_SCHE:
                        break;
                    case SUBCMD_ENABLE_SCHE:
                        break;
                    case SUBCMD_DISABLE_SCHE:
                        break;
                }
            }
            break;
        case CMD_CUSTOM2:
            var flag1 = rx[10];
            switch(flag1) {
                case SUBCMD_GET_MAC:
                    if (rx[11] == SUBCMD_GET_MAC2) {
                        var mac = [rx[12], rx[13], rx[14], rx[15], rx[16], rx[17]];
                    }
                    break;
                case SUBCMD_PAIR:
                    var pairStatus = rx[11];
                    var pairInfo = [rx[12], rx[13], rx[14]];
                    break;
                case SUBCMD_GET_DATA:
                    if (rx[11] == SUBCMD_WALL_SWITCH) {
                        var groupNo = [rx[17], rx[16]];
                    } else {
                        var sceneList = [rx[11], rx[12], rx[13], rx[14], rx[15]];
                        var groupNo = [rx[17], rx[16]];
                        var controlType = rx[18];
                    }
                    break;
                case SUBCMD_PIR:
                    var lum = rx[11];
                    var delay = [rx[12], rx[13]];
                    var groupno = [rx[15], rx[14]];
                    var endlum = rx[16];
                    var phoneCellPir = [rx[17], rx[18]];
                    break;
                case SUBCMD_HCL:
                    var time = rx[11];
                    var enable = rx[12];
                    var changetime = rx[13];
                    var lum = rx[14];
                    var ct = rx[15];
                    var groupno = [rx[16], rx[17]];
                    var totaltime = rx[18];
                    break;
                case SUBCMD_LIGHT_SENSOR:
                    var exp = [rx[11], rx[12]];
                    var maxlum = [rx[13], rx[14]];
                    var groupNo = [rx[16], rx[15]];
                    var lum = rx[17];
                    break;
                case SUBCMD_DYNAMICSCENE:
                    var dsStatus = rx[11];  // bit0~bit3: speed 1~10, bit4~bit7: 1: breathe mode, 2: color mode
                    var dsColor = [rx[12], rx[18]]; // bit0~bit3: color, bit4~bit7: 0: close, 1: open
                    var groupNo = [rx[19], 0x80];
                    break;
                case SUBCMD_DETECTOR:
                    var power = [rx[11], rx[12]];  // [high byte, low byte]
                    var voltage = [rx[13], rx[14]]; // [high byte, low byte]
                    var current = [rx[15], rx[16]]; // [int, float]
                    break;
                case SUBCMD_FAN_CONTROL_STUDY:
                    var pairStatus = rx[11];  // 0: fail, 1: success
                    break;
                case SUBCMD_DIMMER_DATA:
                    var light = rx[11];  // 0x00 ~ 0x32
                    break;
            }
            break;
    }

    res.status(200).send({});
    return;
});

// Classic

router.get('/online-status', function (req, res) {
    var buffer = [0x01];
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/on-light', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var delay = [01, 00];

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_ONOFF_RESET);
    buffer[BUFFER_PAR]      = SUBCMD_ON;
    buffer[BUFFER_PAR + 1]  = delay[0];
    buffer[BUFFER_PAR + 2]  = delay[1];
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/off-light', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var delay = [01, 00];
    
    var buffer = getBuffer(sourceaddr, targetaddr, CMD_ONOFF_RESET);
    buffer[BUFFER_PAR]      = SUBCMD_OFF;
    buffer[BUFFER_PAR + 1]  = delay[0];
    buffer[BUFFER_PAR + 2]  = delay[1];
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/set-lum', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var lumvalue = 0x0A; //  0 ~ 100

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_LUM_MUSIC);
    buffer[BUFFER_PAR] = lumvalue;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/set-ct', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var ctvalue = 20; // 0 ~ 255

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_CT_RGB);
    buffer[BUFFER_PAR]     = SUBCMD_CT;
    buffer[BUFFER_PAR + 1] = ctvalue;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/set-rgb', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var valueR = 0x70;
    var valueG = 0x90;
    var valueB = 0xB0;

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_CT_RGB);
    buffer[BUFFER_PAR]     = SUBCMD_RGB;
    buffer[BUFFER_PAR + 1] = valueR;
    buffer[BUFFER_PAR + 2] = valueG;
    buffer[BUFFER_PAR + 3] = valueB;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/get-mac', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var cmdcount = 0x7F;
    
    var buffer = getBuffer(sourceaddr, targetaddr, CMD_CUSTOM1);
    buffer[BUFFER_PAR]     = cmdcount;
    buffer[BUFFER_PAR + 1] = SUBCMD_GET_MAC;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/change-addr', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var changeaddr = [0x09, 0x00];
    var mac = [0x20, 0x7D, 0xE1, 0x46];
    
    var buffer = getBuffer(sourceaddr, targetaddr, CMD_CHANGE_ADDR);
    buffer[BUFFER_PAR]     = changeaddr[0];
    buffer[BUFFER_PAR + 1] = changeaddr[1];
    buffer[BUFFER_PAR + 2] = mac[0];
    buffer[BUFFER_PAR + 3] = mac[1];
    buffer[BUFFER_PAR + 4] = mac[2];
    buffer[BUFFER_PAR + 5] = mac[3];
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/reset', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_ONOFF_RESET);
    buffer[BUFFER_PAR] = SUBCMD_RESET;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/music-start', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_LUM_MUSIC);
    buffer[BUFFER_PAR] = SUBCMD_MUSIC_ON;
    res.status(200).send(buffer);
    return;
});

router.get('/music-stop', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_LUM_MUSIC);
    buffer[BUFFER_PAR] = SUBCMD_MUSIC_OFF;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/set-time', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var date = new Date(Date.now());
    var year = [date.getFullYear() & 0xFF, date.getFullYear() >> 8];
    var month = (date.getMonth() + 1) & 0xFF;
    var day = date.getDate() & 0xFF;
    var hour = date.getHours() & 0xFF;
    var minute = date.getMinutes() & 0xFF;
    var second = date.getSeconds() & 0xFF;

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_SET_TIME);
    buffer[BUFFER_PAR]     = year[0];
    buffer[BUFFER_PAR + 1] = year[1];
    buffer[BUFFER_PAR + 2] = month;
    buffer[BUFFER_PAR + 3] = day;
    buffer[BUFFER_PAR + 4] = hour;
    buffer[BUFFER_PAR + 5] = minute;
    buffer[BUFFER_PAR + 6] = second;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

// Group

router.get('/add-group', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var groupno = [0x01, 0x80]; // low byte: 0x01 ~ 0x08, high byte: 0x80

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_GROUP);
    buffer[BUFFER_PAR]     = SUBCMD_ADD_GROUP;
    buffer[BUFFER_PAR + 1] = groupno[0];
    buffer[BUFFER_PAR + 2] = groupno[1];
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/del-group', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var groupno = [0x01, 0x80]; // low byte: 0x01 ~ 0x08, high byte: 0x80

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_GROUP);
    buffer[BUFFER_PAR]     = SUBCMD_DEL_GROUP;
    buffer[BUFFER_PAR + 1] = groupno[0];
    buffer[BUFFER_PAR + 2] = groupno[1];
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/get-group-no', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var cmdcount = 0x10;

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_GROUP_NO);
    buffer[BUFFER_PAR]     = cmdcount;
    buffer[BUFFER_PAR + 1] = SUBCMD_GET_ALL_GROUP;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

// Scene

router.get('/add-scene', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var sceneid = 0x01;
    var lum = 0x3C;
    var rgb = [0x1B, 0x43, 0xFB];
    var ct = 0x00;
    
    var buffer = getBuffer(sourceaddr, targetaddr, CMD_SCENE);
    buffer[BUFFER_PAR]     = SUBCMD_ADD_SCENE;
    buffer[BUFFER_PAR + 1] = sceneid;
    buffer[BUFFER_PAR + 2] = lum;
    buffer[BUFFER_PAR + 3] = rgb[0];
    buffer[BUFFER_PAR + 4] = rgb[1];
    buffer[BUFFER_PAR + 5] = rgb[2];
    buffer[BUFFER_PAR + 6] = ct;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/del-scene', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var sceneid = 0x01;

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_SCENE);
    buffer[BUFFER_PAR]     = SUBCMD_DEL_SCENE;
    buffer[BUFFER_PAR + 1] = sceneid;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/enable-scene', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var sceneid = 0x01;

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_SCENE_ONOFF);
    buffer[BUFFER_PAR]     = sceneid;
    buffer[BUFFER_PAR + 1] = SUBCMD_ENABLE_SCENE;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/disable-scene', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var sceneid = 0x01;

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_SCENE_ONOFF);
    buffer[BUFFER_PAR]     = sceneid;
    buffer[BUFFER_PAR + 1] = SUBCMD_DISABLE_SCENE;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/get-scene-size', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var cmdcount = 0x80;

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_SCENE_INFO);
    buffer[BUFFER_PAR]     = cmdcount;
    buffer[BUFFER_PAR + 1] = SUBCMD_PAGE1;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/get-scene-info', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var cmdcount = 0x80;
    var sceneid = 0x01;

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_SCENE_INFO);
    buffer[BUFFER_PAR]     = cmdcount;
    buffer[BUFFER_PAR + 1] = sceneid;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/set-scene-info', function (req, res) {    
    res.redirect('/radiant/add-scene');
    return;
});

// Schedule

router.get('/add-sche', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var scheid = 0x01;
    var schetype = 0x80; // bit7: enable, bit6~bit4: 0 = day,1 = week, bit3~bit0: 0 = off,1 = on,2 = scene
    var month = 0x08; // dont care if type is week
    var day = 0x16; // bit7: dont care, bit0~bit6: Sun , Mon,...,Sat if type is week 
    var hour = 0x14;
    var minute = 0x07;
    var second = 0x00;
    var sceneid = 0x00;

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_SCHE);
    buffer[BUFFER_PAR]     = SUBCMD_ADD_SCHE;
    buffer[BUFFER_PAR + 1] = scheid;
    buffer[BUFFER_PAR + 2] = schetype;
    buffer[BUFFER_PAR + 3] = month;
    buffer[BUFFER_PAR + 4] = day;
    buffer[BUFFER_PAR + 5] = hour;
    buffer[BUFFER_PAR + 6] = minute;
    buffer[BUFFER_PAR + 7] = second;
    buffer[BUFFER_PAR + 8] = sceneid;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/del-sche', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var scheid = 0x01;

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_SCHE);
    buffer[BUFFER_PAR]     = SUBCMD_DEL_SCHE;
    buffer[BUFFER_PAR + 1] = scheid;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/enable-sche', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var scheid = 0x01;

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_SCHE);
    buffer[BUFFER_PAR]     = SUBCMD_ENABLE_SCHE;
    buffer[BUFFER_PAR + 1] = scheid;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/disable-sche', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var scheid = 0x01;

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_SCHE);
    buffer[BUFFER_PAR]     = SUBCMD_DISABLE_SCHE;
    buffer[BUFFER_PAR + 1] = scheid;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/get-sche-size', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var cmdcount = 0x80;

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_SCHE_INFO);
    buffer[BUFFER_PAR]     = cmdcount;
    buffer[BUFFER_PAR + 1] = SUBCMD_PAGE1;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/get-sche-info', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var cmdcount = 0x10;
    var sceneid = 0x01;

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_SCHE_INFO);
    buffer[BUFFER_PAR]     = cmdcount;
    buffer[BUFFER_PAR + 1] = sceneid;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/set-sche-info', function (req, res) {    
    res.redirect('/radiant/add-sche');
    return;
});

// Wall Switch

router.get('/wallswitch-start-pair', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_GROUP);
    buffer[BUFFER_PAR]     = SUBCMD_PAIR;
    buffer[BUFFER_PAR + 1] = SUBCMD_PAIR_START;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/wallswitch-check-pair', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var cmdcount = 0x10;

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_CUSTOM1);
    buffer[BUFFER_PAR]     = cmdcount;
    buffer[BUFFER_PAR + 1] = SUBCMD_PAIR;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/wallswitch-stop-pair', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_GROUP);
    buffer[BUFFER_PAR]     = SUBCMD_PAIR;
    buffer[BUFFER_PAR + 1] = SUBCMD_PAIR_STOP;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/wallswitch-get-data', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var cmdcount = 0x10;

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_CUSTOM1);
    buffer[BUFFER_PAR]     = cmdcount;
    buffer[BUFFER_PAR + 1] = SUBCMD_GET_DATA;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/wallswitch-set-data-group', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var groupno = [0x02, 0x80];

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_GROUP_BINDING);
    buffer[BUFFER_PAR]     = groupno[0];
    buffer[BUFFER_PAR + 1] = groupno[1];
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

// Pir

router.get('/pir-enable', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_GROUP);
    buffer[BUFFER_PAR] = SUBCMD_ENABLE_PIR;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/pir-disable', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_GROUP);
    buffer[BUFFER_PAR] = SUBCMD_DISABLE_PIR;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/pir-get-data', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var cmdcount = 0x10;

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_CUSTOM1);
    buffer[BUFFER_PAR]     = cmdcount;
    buffer[BUFFER_PAR + 1] = SUBCMD_PIR;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/pir-set-data-info', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var delay = [0x00, 0x14];
    var lum = 0x3E;
    var endlum = 0x0D;

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_GROUP);
    buffer[BUFFER_PAR]     = SUBCMD_PIR;
    buffer[BUFFER_PAR + 1] = delay[0];
    buffer[BUFFER_PAR + 2] = delay[1];
    buffer[BUFFER_PAR + 3] = lum;
    buffer[BUFFER_PAR + 4] = endlum;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/pir-set-data-group', function (req, res) {
    res.redirect('/radiant/wallswitch-set-data-group');
    return;
});

// Combo Switch

router.get('/comboswitch-start-pair', function (req, res) {    
    res.redirect('/radiant/wallswitch-start-pair');
    return;
});

router.get('/comboswitch-check-pair', function (req, res) {    
    res.redirect('/radiant/wallswitch-check-pair');
    return;
});

router.get('/comboswitch-start-unpair', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_GROUP);
    buffer[BUFFER_PAR]     = SUBCMD_PAIR;
    buffer[BUFFER_PAR + 1] = SUBCMD_UNPAIR_START;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/comboswitch-stop-pair', function (req, res) {    
    res.redirect('/radiant/wallswitch-stop-pair');
    return;
});

router.get('/comboswitch-start-unpair-all', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_GROUP);
    buffer[BUFFER_PAR]     = SUBCMD_PAIR;
    buffer[BUFFER_PAR + 1] = SUBCMD_UNPAIR_ALL_START;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/comboswitch-get-data', function (req, res) {    
    res.redirect('/radiant/wallswitch-get-data');
    return;
});

router.get('/comboswitch-set-data-mode', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var controltype = 0x01; // 0x01: ct mode, 0x02: scene mode

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_GROUP_BINDING);
    buffer[BUFFER_PAR]     = SUBCMD_GET_DATA;
    buffer[BUFFER_PAR + 1] = SUBCMD_COMBO_SWITCH;
    buffer[BUFFER_PAR + 2] = controltype;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/comboswitch-set-data-scene', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var scenelist = [0x01, 0x02, 0x03, 0x04, 0x05];

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_GROUP);
    buffer[BUFFER_PAR]     = SUBCMD_COMBO_SWITCH;
    buffer[BUFFER_PAR + 2] = scenelist[0];
    buffer[BUFFER_PAR + 3] = scenelist[1];
    buffer[BUFFER_PAR + 4] = scenelist[2];
    buffer[BUFFER_PAR + 5] = scenelist[3];
    buffer[BUFFER_PAR + 6] = scenelist[4];
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/comboswitch-set-data-group', function (req, res) {
    res.redirect('/radiant/wallswitch-set-data-group');
    return;
});

// Scene Switch

router.get('/sceneswitch-start-pair', function (req, res) {    
    res.redirect('/radiant/wallswitch-start-pair');
    return;
});

router.get('/sceneswitch-check-pair', function (req, res) {    
    res.redirect('/radiant/wallswitch-check-pair');
    return;
});

router.get('/sceneswitch-stop-pair', function (req, res) {    
    res.redirect('/radiant/wallswitch-stop-pair');
    return;
});

router.get('/sceneswitch-get-data', function (req, res) {
    res.redirect('/radiant/wallswitch-get-data');
    return;
});

router.get('/sceneswitch-set-data-scene', function (req, res) {
    res.redirect('/radiant/comboswitch-set-data-scene');
    return;
});

router.get('/sceneswitch-set-data-group', function (req, res) {    
    res.redirect('/radiant/wallswitch-set-data-group');
    return;
});

// Hcl-12

router.get('/hcl-12-enable', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_GROUP);
    buffer[BUFFER_PAR] = SUBCMD_ENABLE;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/hcl-12-disable', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_GROUP);
    buffer[BUFFER_PAR] = SUBCMD_DISABLE;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/hcl-12-get-data', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var cmdcount = 0x10;
    var time = 0x01; // 0x01 ~ 0x0D

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_CUSTOM1);
    buffer[BUFFER_PAR]     = cmdcount;
    buffer[BUFFER_PAR + 1] = SUBCMD_HCL;
    buffer[BUFFER_PAR + 2] = time;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/hcl-12-set-data-info', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var time = 0x01;
    var enable = 0x00;
    var changetime = 0x05;
    var lum = 0x00;
    var ct = 0x00;
    var totaltime = 0x0D;

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_GROUP);
    buffer[BUFFER_PAR]     = SUBCMD_HCL;
    buffer[BUFFER_PAR + 1] = time;
    buffer[BUFFER_PAR + 2] = time - 1;
    buffer[BUFFER_PAR + 3] = enable;
    buffer[BUFFER_PAR + 4] = changetime;
    buffer[BUFFER_PAR + 5] = lum;
    buffer[BUFFER_PAR + 6] = ct;
    buffer[BUFFER_PAR + 7] = totaltime;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/hcl-12-set-data-group', function (req, res) {    
    res.redirect('/radiant/wallswitch-set-data-group');
    return;
});

// Light Sensor

router.get('/lightsensor-enable', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_GROUP);
    buffer[BUFFER_PAR] = SUBCMD_ENABLE_LIGHT_SENSOR;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/lightsensor-disable', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_GROUP);
    buffer[BUFFER_PAR] = SUBCMD_DISABLE_LIGHT_SENSOR;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/lightsensor-get-data', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var cmdcount = 0x10;

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_CUSTOM1);
    buffer[BUFFER_PAR]     = cmdcount;
    buffer[BUFFER_PAR + 1] = SUBCMD_LIGHT_SENSOR;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/lightsensor-set-data-info', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var exp = [0x00, 0x37];
    var maxlum = [0x00, 0x6F];
    var lum = 0x64;

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_GROUP);
    buffer[BUFFER_PAR]     = SUBCMD_LIGHT_SENSOR_DATA;
    buffer[BUFFER_PAR + 1] = exp[0];
    buffer[BUFFER_PAR + 2] = exp[1];
    buffer[BUFFER_PAR + 3] = maxlum[0];
    buffer[BUFFER_PAR + 4] = maxlum[1];
    buffer[BUFFER_PAR + 5] = lum;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/lightsensor-set-data-group', function (req, res) {    
    res.redirect('/radiant/wallswitch-set-data-group');
    return;
});

// Repeater

router.get('/repeater-enable', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_GROUP);
    buffer[BUFFER_PAR] = SUBCMD_ENABLE;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/repeater-disable', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_GROUP);
    buffer[BUFFER_PAR] = SUBCMD_DISABLE;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/repeater-get-data', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var cmdcount = 0x7F;

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_GET_TIME);
    buffer[BUFFER_PAR] = cmdcount;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/repeater-set-data', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var date = new Date(Date.now());
    var year = [date.getFullYear() & 0xFF, date.getFullYear() >> 8];
    var month = (date.getMonth() + 1) & 0xFF;
    var day = date.getDate() & 0xFF;
    var hour = date.getHours() & 0xFF;
    var minute = date.getMinutes() & 0xFF;
    var second = date.getSeconds() & 0xFF;

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_SET_TIME);
    buffer[BUFFER_PAR]     = year[0];
    buffer[BUFFER_PAR + 1] = year[1];
    buffer[BUFFER_PAR + 2] = month;
    buffer[BUFFER_PAR + 3] = day;
    buffer[BUFFER_PAR + 4] = hour;
    buffer[BUFFER_PAR + 5] = minute;
    buffer[BUFFER_PAR + 6] = second;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

// Dynamic Scene

router.get('/dynamicscene-enable', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_GROUP);
    buffer[BUFFER_PAR] = SUBCMD_ENABLE;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/dynamicscene-disable', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_GROUP);
    buffer[BUFFER_PAR] = SUBCMD_DISABLE;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/dynamicscene-get-data', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var cmdcount = 0x10;

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_CUSTOM1);
    buffer[BUFFER_PAR]     = cmdcount;
    buffer[BUFFER_PAR + 1] = SUBCMD_DYNAMICSCENE;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/dynamicscene-set-data-info', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var dsmode = 0x02;  // 1: breathe mode, 2: color mode
    var dsspeed = 0x0A; // 0x00 ~ 0x0A
    var dscolor = [0x02, 0x83, 0x84, 0x85, 0x06, 0x07, 0x01]; // bit0~bit3: color, bit4~bit7: 0: close, 1: open

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_GROUP);
    buffer[BUFFER_PAR]     = SUBCMD_DYNAMICSCENE_DATA;
    buffer[BUFFER_PAR + 1] = dsmode;
    buffer[BUFFER_PAR + 2] = dsspeed;
    buffer[BUFFER_PAR + 3] = dscolor[0];
    buffer[BUFFER_PAR + 4] = dscolor[1];
    buffer[BUFFER_PAR + 5] = dscolor[2];
    buffer[BUFFER_PAR + 6] = dscolor[3];
    buffer[BUFFER_PAR + 7] = dscolor[4];
    buffer[BUFFER_PAR + 8] = dscolor[5];
    buffer[BUFFER_PAR + 9] = dscolor[6];
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/dynamicscene-set-data-group', function (req, res) {    
    res.redirect('/radiant/wallswitch-set-data-group');
    return;
});

// Detector

router.get('/detector-get-data', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var cmdcount = 0x10;

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_CUSTOM1);
    buffer[BUFFER_PAR]     = cmdcount;
    buffer[BUFFER_PAR + 1] = SUBCMD_DETECTOR;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

// Socket

router.get('/socket-enable', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_ONOFF_RESET);
    buffer[BUFFER_PAR] = SUBCMD_ENABLE_SOCKET;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/socket-disable', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_ONOFF_RESET);
    buffer[BUFFER_PAR] = SUBCMD_DISABLE_SOCKET;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/socket-add-sche', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var scheid = 0x01;
    var schetype = 0x80; // bit7: enable, bit6~bit4: 0 = day,1 = week, bit3~bit0: 0 = off,1 = on,2 = scene
    var month = 0x08; // dont care if type is week
    var day = 0x16; // bit7: dont care, bit0~bit6: Sun , Mon,...,Sat if type is week 
    var hour = 0x14;
    var minute = 0x07;

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_SOCKET_SCHE);
    buffer[BUFFER_PAR]     = SUBCMD_ADD_SCHE;
    buffer[BUFFER_PAR + 1] = scheid;
    buffer[BUFFER_PAR + 2] = schetype;
    buffer[BUFFER_PAR + 3] = month;
    buffer[BUFFER_PAR + 4] = day;
    buffer[BUFFER_PAR + 5] = hour;
    buffer[BUFFER_PAR + 6] = minute;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/socket-del-sche', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var scheid = 0x01;

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_SOCKET_SCHE);
    buffer[BUFFER_PAR]     = SUBCMD_DEL_SCHE;
    buffer[BUFFER_PAR + 1] = scheid;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/socket-get-size', function (req, res) {
    res.redirect('/radiant/get-sche-size');
    return;
});

router.get('/socket-get-sche-info', function (req, res) {
    res.redirect('/radiant/get-sche-info');
    return;
});

router.get('/socket-set-data', function (req, res) {
    res.redirect('/radiant/get-add-sche');
    return;
});

// Fan Control

router.get('/fan-control-uplight-on', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_GROUP);
    buffer[BUFFER_PAR]      = SUBCMD_FAN_CONTROL;
    buffer[BUFFER_PAR + 1]  = SUBCMD_FAN_CONTROL_UPLIGHT;
    buffer[BUFFER_PAR + 2]  = SUBCMD_ON;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/fan-control-uplight-off', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_GROUP);
    buffer[BUFFER_PAR]      = SUBCMD_FAN_CONTROL;
    buffer[BUFFER_PAR + 1]  = SUBCMD_FAN_CONTROL_UPLIGHT;
    buffer[BUFFER_PAR + 2]  = SUBCMD_OFF;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/fan-control-set-downlight-mode', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var lightmode = 0x01; // 0x00: cold & warm, 0x01: cold, 0x02: warm
    var lum = 0x01; // 0x01~0x08

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_GROUP);
    buffer[BUFFER_PAR]      = SUBCMD_FAN_CONTROL;
    buffer[BUFFER_PAR + 1]  = SUBCMD_FAN_CONTROL_DOWNLIGHT;
    buffer[BUFFER_PAR + 2]  = SUBCMD_ON;
    buffer[BUFFER_PAR + 3]  = lightmode;
    buffer[BUFFER_PAR + 4]  = lum;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/fan-control-set-fan-speed', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var fanspeed = 0x02; // 0x00 ~ 0x06

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_GROUP);
    buffer[BUFFER_PAR]      = SUBCMD_FAN_CONTROL;
    buffer[BUFFER_PAR + 1]  = SUBCMD_FAN_CONTROL_FAN;
    buffer[BUFFER_PAR + 2]  = fanspeed;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/fan-control-start-study', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_GROUP);
    buffer[BUFFER_PAR]      = SUBCMD_FAN_CONTROL;
    buffer[BUFFER_PAR + 1]  = SUBCMD_FAN_CONTROL_PAIR;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/fan-control-check-study', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var cmdcount = 0x10;

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_CUSTOM1);
    buffer[BUFFER_PAR]      = cmdcount;
    buffer[BUFFER_PAR + 1]  = SUBCMD_FAN_CONTROL_STUDY;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

// Hcl-24

router.get('/hcl-24-enable', function (req, res) {
    res.redirect('/radiant/hcl-12-enable');
    return;
});

router.get('/hcl-24-disable', function (req, res) {
    res.redirect('/radiant/hcl-12-disable');
    return;
});

router.get('/hcl-24-get-data', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var cmdcount = 0x10;
    var time = 0x01; // 0x01 ~ 0x18

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_CUSTOM1);
    buffer[BUFFER_PAR]     = cmdcount;
    buffer[BUFFER_PAR + 1] = SUBCMD_HCL;
    buffer[BUFFER_PAR + 2] = time;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/hcl-24-set-data-info', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var time = 0x01; // 0x01 ~ 0x18
    var enable = 0x00;
    var changetime = 0x05;
    var lum = 0x00;
    var ct = 0x00;
    var totaltime = 0x18;

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_GROUP);
    buffer[BUFFER_PAR]     = SUBCMD_HCL;
    buffer[BUFFER_PAR + 1] = time;
    buffer[BUFFER_PAR + 2] = time - 1;
    buffer[BUFFER_PAR + 3] = enable;
    buffer[BUFFER_PAR + 4] = changetime;
    buffer[BUFFER_PAR + 5] = lum;
    buffer[BUFFER_PAR + 6] = ct;
    buffer[BUFFER_PAR + 7] = totaltime;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/hcl-24-set-data-group', function (req, res) {    
    res.redirect('/radiant/wallswitch-set-data-group');
    return;
});

// Phone Cell Pir

router.get('/phone-cell-pir-enable', function (req, res) {
    res.redirect('/radiant/pir-enable');
    return;
});

router.get('/phone-cell-pir-disable', function (req, res) {
    res.redirect('/radiant/pir-disable');
    return;
});

router.get('/phone-cell-pir-get-data', function (req, res) {
    res.redirect('/radiant/pir-get-data');
    return;
});

router.get('/phone-cell-pir-set-data-info', function (req, res) {
    res.redirect('/radiant/pir-set-data-info');
    return;
});

router.get('/phone-cell-pir-set-data-group', function (req, res) {
    res.redirect('/radiant/wallswitch-set-data-group');
    return;
});

// Switch Direct

router.get('/switch-direct-get-data', function (req, res) {    
    res.redirect('/radiant/wallswitch-get-data');
    return;
});

router.get('/switch-direct-set-data-scene', function (req, res) {
    res.redirect('/radiant/comboswitch-set-data-scene');
    return;
});

router.get('/switch-direct-set-data-group', function (req, res) {    
    res.redirect('/radiant/wallswitch-set-data-group');
    return;
});

// Repeater new

// Scene Socket

router.get('/scene-socket-enable', function (req, res) {
    res.redirect('/radiant/socket-enable');
    return;
});

router.get('/scene-socket-disable', function (req, res) {
    res.redirect('/radiant/socket-disable');
    return;
});

// Push Dim

router.get('/push-dim-get-data', function (req, res) {
    res.redirect('/radiant/wallswitch-get-data');
    return;
});

router.get('/push-dim-set-data-scene', function (req, res) {
    res.redirect('/radiant/comboswitch-set-data-scene');
    return;
});

router.get('/push-dim-set-data-group', function (req, res) {
    res.redirect('/radiant/wallswitch-set-data-group');
    return;
});

// Switch Direct 4-8

router.get('/switch-direct-4-8-get-data', function (req, res) {
    res.redirect('/radiant/wallswitch-get-data');
    return;
});

router.get('/switch-direct-4-8-set-data-scene', function (req, res) {
    res.redirect('/radiant/comboswitch-set-data-scene');
    return;
});

router.get('/switch-direct-4-8-set-data-group', function (req, res) {
    res.redirect('/radiant/wallswitch-set-data-group');
    return;
});

// Repeater New RTC

router.get('/repeater-new-rtc-enable', function (req, res) {
    res.redirect('/radiant/repeater-enable');
    return;
});

router.get('/repeater-new-rtc-disable', function (req, res) {
    res.redirect('/radiant/repeater-disable');
    return;
});

router.get('/repeater-new-rtc-get-data', function (req, res) {
    res.redirect('/radiant/repeater-get-data');
    return;
});

router.get('/repeater-new-rtc-set-data', function (req, res) {
    res.redirect('/radiant/repeater-set-data');
    return;
});

// Dimmer

router.get('/dimmer-set-data', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var light = 0x00; // 0x00 ~ 0x32

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_GROUP);
    buffer[BUFFER_PAR]     = SUBCMD_DIMMER;
    buffer[BUFFER_PAR + 1] = light;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

router.get('/dimmer-get-data', function (req, res) {
    var sourceaddr = [0x00, 0x00];
    var targetaddr = [0x00, 0x00];
    var cmdcount = 0x10;

    var buffer = getBuffer(sourceaddr, targetaddr, CMD_CUSTOM1);
    buffer[BUFFER_PAR]     = cmdcount;
    buffer[BUFFER_PAR + 1] = SUBCMD_DIMMER_DATA;
    res.status(200).send(buffer);
    console.log(JSON.stringify(buffer));
    return;
});

module.exports = router;