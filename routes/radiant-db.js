var LocalSN = 0;
var mysqlQuery;

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

function updateDevice(userId, buffer) {
    var insertsql = {
        UserId: userId,
        Address: buffer[0],
        Info1: buffer[1],
        Info2: buffer[2],
        Info3: buffer[3],
        TypeId: buffer[4]
    };
    var updatesql = {
        Info1: buffer[1],
        Info2: buffer[2],
        Info3: buffer[3],
        TypeId: buffer[4]
    };
    var sql = "INSERT INTO DeviceTbl SET ? ON DUPLICATE KEY UPDATE ? ";
    mysqlQuery(sql, [insertsql, updatesql], function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);           
        }
    });
    return;
}

function updateDeviceHistory(userId, sourceAddr, buffer) {
    var insertsql = {
        UserId: userId,
        Address: buffer[0],
        Info1: buffer[1],
        Info2: buffer[2],
        Info3: buffer[3],
        TypeId: buffer[4],
        SourceAddress: sourceAddr,
        UpdateDate: Date.now() / 1000
    };
    sql = "INSERT INTO DeviceHistoryTbl SET ?";
    mysqlQuery(sql, insertsql, function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);           
        }
    });
    return;
}

function updateGroup(userId, groupId, deviceAddr) {
    var insertsql = {
        UserId: userId,
        Address: deviceAddr,
        GroupId: groupId
    };
    var sql = "INSERT INTO GroupTbl SET ?";
    mysqlQuery(sql, [insertsql], function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }
    });
    return;
}

function changeGroup(userId, groupList, deviceAddr) {
    mysqlQuery('DELETE FROM GroupTbl WHERE UserId = ? AND Address = ?', 
    [userId, deviceAddr], function (err, result) {
        if (err) {
            console.log('[DELETE ERROR] - ', err.message);
            return;
        }
        groupList.forEach(groupId => {
            if (groupId != 0xFF) {
                updateGroup(userId, groupId, deviceAddr);
            }
        });
    });
    return; 
}

function updateScene(userId, sceneId, deviceAddr, scenePage) {
    var insertsql = {
        UserId: userId,
        Address: deviceAddr,
        SceneId: sceneId,
        ScenePage: scenePage
    };
    var updatesql = {
        ScenePage: scenePage
    };
    var sql = "INSERT INTO SceneTbl SET ? ON DUPLICATE KEY UPDATE ? ";
    mysqlQuery(sql, [insertsql, updatesql], function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }
    });
    return;
}

function changeScene(userId, sceneList, deviceAddr, scenePage) {
    mysqlQuery('DELETE FROM SceneTbl WHERE UserId = ? AND Address = ? AND ScenePage = ?',
    [userId, deviceAddr, scenePage], function (err, result) {
        if (err) {
            console.log('[DELETE ERROR] - ', err.message);
            return;
        }
        sceneList.forEach(sceneId => {
            if (sceneId != 0x00) {
                updateScene(userId, sceneId, deviceAddr, scenePage);
            }
        });
    });
    return; 
}

function updateSceneInfo(userId, sceneId, deviceAddr, sceneInfo) {
    var insertsql = {
        UserId: userId,
        Address: deviceAddr,
        SceneId: sceneId,
        Lum: sceneInfo[0],
        RgbR: sceneInfo[1],
        RgbG: sceneInfo[2],
        RgbB: sceneInfo[3],
        Ct: sceneInfo[4]
    };
    var updatesql = {
        Lum: sceneInfo[0],
        RgbR: sceneInfo[1],
        RgbG: sceneInfo[2],
        RgbB: sceneInfo[3],
        Ct: sceneInfo[4]
    };
    var sql = "INSERT INTO SceneTbl SET ? ON DUPLICATE KEY UPDATE ? ";
    mysqlQuery(sql, [insertsql, updatesql], function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }
    });
    return;
}

function deleteScene(userId, sceneId, deviceAddr) {
    mysqlQuery('DELETE FROM SceneTbl WHERE UserId = ? AND Address = ? AND SceneId = ?', 
    [userId, deviceAddr, sceneId], function (err, result) {
        if (err) {
            console.log('[DELETE ERROR] - ', err.message);
            return;
        }
    });
    return; 
}

function updateSchedule(userId, scheId, deviceAddr, scheinfo) {
    var insertsql = {
        UserId: userId,
        Address: deviceAddr,
        ScheduleId: scheId,
        ScheType: scheinfo[0],
        Month: scheinfo[1],
        Day: scheinfo[2],
        Hour: scheinfo[3],
        Minute: scheinfo[4],
        Second: scheinfo[5],
        SceneId: scheinfo[6]
    };
    var updatesql = {
        ScheType: scheinfo[0],
        Month: scheinfo[1],
        Day: scheinfo[2],
        Hour: scheinfo[3],
        Minute: scheinfo[4],
        Second: scheinfo[5],
        SceneId: scheinfo[6]
    };
    var sql = "INSERT INTO ScheduleTbl SET ? ON DUPLICATE KEY UPDATE ? ";
    mysqlQuery(sql, [insertsql, updatesql], function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }
    });
    return;
}

function updateSchedulePage(userId, scheId, deviceAddr, schepage) {
    var insertsql = {
        UserId: userId,
        Address: deviceAddr,
        ScheduleId: scheId,
        SchedulePage: schepage
    };
    var updatesql = {
        SchedulePage: schepage
    };
    var sql = "INSERT INTO ScheduleTbl SET ? ON DUPLICATE KEY UPDATE ? ";
    mysqlQuery(sql, [insertsql, updatesql], function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }
    });
    return;
}

function deleteSchedule(userId, scheId, deviceAddr) {
    mysqlQuery('DELETE FROM ScheduleTbl WHERE UserId = ? AND Address = ? AND ScheduleId = ?', 
    [userId, deviceAddr, scheId], function (err, result) {
        if (err) {
            console.log('[DELETE ERROR] - ', err.message);
            return;
        }
    });
    return; 
}

function enableSchedule(userId, scheId, deviceAddr, enable) {
    var insertsql = {
        UserId: userId,
        Address: deviceAddr,
        ScheduleId: scheId,
        Enable: enable
    };
    var updatesql = {        
        Enable: enable
    };
    var sql = "INSERT INTO ScheduleTbl SET ? ON DUPLICATE KEY UPDATE ? ";
    mysqlQuery(sql, [insertsql, updatesql], function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }
    });
    return;
}

function changeSchedule(userId, scheList, deviceAddr, schepage) {
    mysqlQuery('DELETE FROM SceneTbl WHERE UserId = ? AND Address = ? AND SchedulePage = ?', 
    [userId, deviceAddr, schepage], function (err, result) {
        if (err) {
            console.log('[DELETE ERROR] - ', err.message);
            return;
        }
        scheList.forEach(sceneId => {
            if (scheId != 0x00) {
                updateSchedulePage(userId, sceneId, deviceAddr, schepage);
            }
        });
    });
    return; 
}

function response(sqlService, userId, rx) {
    mysqlQuery = sqlService;
    var sequenceNo = [rx[0], rx[1], rx[2]];
    var sourceAddr = [rx[3], rx[4]];
    var crc = [rx[5], rx[6]];
    var cmdNo = rx[7];
    var vendorId = [rx[8], rx[9]];
    switch(cmdNo) {
        case CMD_REPORT_DATA:
            updateDevice(userId, [rx[10], rx[11], rx[12], rx[13], rx[14]]);
            updateDeviceHistory(userId, sourceAddr[0], [rx[10], rx[11], rx[12], rx[13], rx[14]]);
            if (rx[15] != 0x00) {
                updateDevice(userId, [rx[15], rx[16], rx[17], rx[18], rx[19]]);
                updateDeviceHistory(userId, sourceAddr[0], [rx[15], rx[16], rx[17], rx[18], rx[19]]);
            }
            break;
        case CMD_CHANGE_ADDR_RES:
            var SourceAddrCheck = [rx[10], rx[11]];
            break;
        case CMD_GROUP_RES:
            var groupList = [rx[10], rx[11], rx[12], rx[13], rx[14], rx[15], rx[16], rx[17], rx[18], rx[19]];
            changeGroup(userId, groupList, sourceAddr[0]);                     
            break;
        case CMD_SCENE_INFO_RES:
            var scenepage = rx[19];
            if (scenepage == SUBCMD_PAGE1 || scenepage == SUBCMD_PAGE2) {
                var sceneList =  [rx[10], rx[11], rx[12], rx[13], rx[14], rx[15], rx[16], rx[17]];
                changeScene(userId, sceneList, sourceAddr[0], scenepage);
            } else {
                var sceneId =  rx[10];            
                var sceneInfo = [rx[11], rx[12], rx[13], rx[14], rx[15]];
                updateSceneInfo(userId, sceneId, sourceAddr[0], sceneInfo);
            }     
            break;
        case CMD_SCHE_INFO_RES:
            var schepage = rx[19];
            if (schepage == SUBCMD_PAGE1 || schepage == SUBCMD_PAGE2) {
                var scheList = [rx[10], rx[11], rx[12], rx[13], rx[14], rx[15], rx[16], rx[17]];
                changeSchedule(userId, scheList, sourceAddr[0], schepage);
            } else {
                var scheflag = rx[10]
                var scheId =  rx[11];            
                var scheinfo = [rx[12], rx[13], rx[14], rx[15], rx[16], rx[17], rx[18]];
                updateSchedule(userId, scheId, sourceAddr[0], scheinfo);
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
            var flag = [rx[10], rx[11]];
            if (flag[0] == 0x00 && flag[1] == SUBCMD_ADD_SCENE_RES) {
                var sceneId =  rx[12];
                var sceneInfo = [rx[13], rx[14], rx[15], rx[16], rx[17]];
                updateSceneInfo(userId, sceneId, sourceAddr[0], sceneInfo);
            } else if (flag[0] == 0x00 && flag[1] == SUBCMD_DEL_SCENE_RES) {
                var sceneId =  rx[12];
                deleteScene(userId, sceneId, sourceAddr[0]);
            } else if (flag[0] == 0x00 && flag[1] == SUBCMD_SCHE_RES) {
                var scheflag = rx[12]; 
                var scheId = rx[13];
                switch(scheflag) {
                    case SUBCMD_ADD_SCHE:
                        var scheinfo = [rx[14], rx[15], rx[16], rx[17], rx[18], 0x00, rx[19]];
                        updateSchedule(userId, scheId, sourceAddr[0], scheinfo);
                        break;
                    case SUBCMD_DEL_SCHE:
                        deleteSchedule(userId, scheId, sourceAddr[0]);
                        break;
                    case SUBCMD_ENABLE_SCHE:
                        enableSchedule(userId, scheId, sourceAddr[0], 0x01);
                        break;
                    case SUBCMD_DISABLE_SCHE:
                        enableSchedule(userId, scheId, sourceAddr[0], 0x00);
                        break;
                }
            }
            break;
        case CMD_CUSTOM2:
            var flag = rx[10];
            switch(flag) {
                case SUBCMD_GET_MAC:
                    if (rx[11] == SUBCMD_GET_MAC2) {
                        var mac = [rx[12], rx[13], rx[14], rx[15], rx[16], rx[17]];
                    }
                    break;
                case SUBCMD_PAIR:
                    var pairStatus = rx[11]; // 0: fail, 1: success
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
}

module.exports = response;