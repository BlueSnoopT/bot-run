
// Runs a UI terminal that gives information
// about the YOU not the bots.

const { log, clear } = require("console");
const process = require('process');
const shell = require('shelljs');
var disk = require('diskusage');
const fs = require('fs');
const os = require('os');
const { clearScreenDown } = require("readline");

// Color Pallete for terminal
let RED = "\x1b[31m"
let BLUE = "\x1b[34m";
let GREEN = "\x1b[32m";
let YELLOW = "\x1b[33m";
let MEGENTA = "\x1b[35m";

// Simple function to change colors of items if
// There Value is below a number that is set
function IsNumbBelow(Request, Lowest)
{
    if (Request < Lowest)
        return RED + Request + BLUE;
    else
        return GREEN + Request + BLUE;
}

function MakeTerminalUI()
{   
    // System Info
    var Uptime_t = 0;
    var User_t = 0;
    var Host_t = 0;
    var Space_t = 0;
    var CPUUse_t = 0;
    var MemUse_t = 0;

    // Bot Info
    var Steams_t = 0;
    var Bots_t = 0;
    var Games_t = 0; // TODO
    var Menus_t = 0; // TODO

    Steams_t = shell.exec('pgrep -c steam');
    Bots_t = shell.exec('pgrep -c hl2_linux');

    // ===================== SYSTEM INFORMATION ===================== //
    Uptime_t = Math.round(process.uptime());
    User_t = os.userInfo().username;
    Host_t = os.hostname();
    disk.check('/', function(err, info) {
        Space_t = Math.round(info.free / (1000 * 1000 * 1000).toFixed(2)) + "/" + Math.round(info.total / (1000 * 1000 * 1000).toFixed(2)) + "GB";
    });
    CPUUse_t = Math.round(process.cpuUsage().system%(100) / 2) + "%";
    MemUse_t = Math.round(process.memoryUsage().heapUsed / (1000 / 1000 * 1000).toFixed(2)) + "/" + Math.round(process.memoryUsage().heapTotal / (1000 / 1000 * 1000).toFixed(2)) + "MB";
    // =========================================================== //

    // System Information
    var Uptime = MEGENTA + Uptime_t + BLUE; 
    var User = GREEN + User_t + BLUE;
    var Host = GREEN + Host_t + BLUE;
    var Space = YELLOW + Space_t + BLUE;
    var CPUUse = YELLOW + CPUUse_t + BLUE;
    var MemUse = YELLOW + MemUse_t + BLUE;

    // Bot Information
    var Steam = IsNumbBelow(Steams_t.slice(0, Steams_t.length -1), 1); // Steam Instances
    var Bots = IsNumbBelow(Bots_t.slice(0, Bots_t.length -1), 1); // Bots Online
    var BotGames = IsNumbBelow(Games_t, 1); // Bots in game
    var BotMenus = IsNumbBelow(Menus_t, 1); // Bots in menu

    clear();
    log("=======================================================");
    log("                  Bot Utilities Panels                 ");
    log("                Basic System Information:              ");
    log("                                                       ");
    log(` Uptime:                                   ${Uptime}   `);
    log(` User:                                     ${User}     `);
    log(` Host:                                     ${Host}     `);
    log(` Disk Space:                               ${Space}    `);
    log(` CPU Usage:                                ${CPUUse}   `);
    log(` Memory Usage:                             ${MemUse}   `);
    log("                                                       ");
    log("                    Bot Information:                   ");
    log("                                                       ");
    log(` Steam Instances:                          ${Steam}    `);
    log(` Bots Online:                              ${Bots}     `);
    //log(` Bots in game:                             ${BotGames} `);
    //log(` Bots on menu:                             ${BotMenus} `);
    log("=======================================================");
    clearScreenDown();
}

MakeTerminalUI();
setInterval(MakeTerminalUI, 100 * 2);