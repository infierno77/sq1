import * as Basic from 'pixel_combats/basic';
import * as API from 'pixel_combats/room';
import * as ColorsLib from './colorslib.js';
import * as JQUtils from './jqutils.js';
import { contextedProperties, Properties, Players } from 'pixel_combats/room';
import { Game, Players, Inventory, LeaderBoard, BuildBlocksSet, Teams, Damage, BreackGraph, 
        Ui, Properties, GameMode, Spawns, Timers, TeamsBalancer, Build, AreaPlayerTriggerService } from 'pixel_combats/room';


// Константы
const GRADIENT = API.GameMode.Parameters.GetBool("gradient"),APMIN = "FCB44B3BFF4A9878", ADMIN = "D411BD94CAE31F89", BANNED = "9D481006E2EC6AD", COLORS = [ColorsLib.ColorToHex(ColorsLib.Colors.Red), ColorsLib.ColorToHex(ColorsLib.Colors.Blue), ColorsLib.ColorToHex(ColorsLib.Colors.Lime), ColorsLib.ColorToHex(ColorsLib.Colors.Yellow), ColorsLib.ColorToHex(ColorsLib.Colors.Cyan), ColorsLib.ColorToHex(ColorsLib.Colors.Magenta), ColorsLib.ColorToHex(ColorsLib.Colors.Purple), ColorsLib.ColorToHex(ColorsLib.Colors.White)];
// Доступ к функциям и модулям из "терминала"
globalThis.API = API;
globalThis.Box = Box;
globalThis.Police = Police;
globalThis.License = License;
globalThis.FLicense = FLicense;
globalThis.Dice = Dice;
globalThis.Info = Info;
globalThis.Calculator = Calculator;
globalThis.Work = Work;
globalThis.Transfer = Transfer;
globalThis.Tes = Tes;
globalThis.Stat = Stat;
globalThis.Xarcha = Xarcha;
globalThis.Fly = Fly;
globalThis.Zek = Zek;
globalThis.Blue = Blue;
globalThis.Zombie = Zombie;
globalThis.Ban = Ban;
globalThis.Admin = Admin;
globalThis.JQUtils = JQUtils;
globalThis.ColorsLib = ColorsLib;
globalThis.ReTick = tickrate;
globalThis.Basic = Basic;
// Переменные
let Tasks = {}, indx = 0, clr = { r: 255, g: 0, b: 0 }, clr_state = 1, tick = 0;
// Настройки
API.BreackGraph.OnlyPlayerBlocksDmg = true;
API.BreackGraph.WeakBlocks = false;
API.BreackGraph.BreackAll = false;
API.Spawns.GetContext().RespawnTime.Value = 0;
API.Ui.GetContext().QuadsCount.Value = true;
API.Build.GetContext().BlocksSet.Value = API.BuildBlocksSet.AllClear;
API.Build.GetContext().CollapseChangeEnable.Value = true;
API.Build.GetContext().FlyEnable.Value = false;
// Создание команд
let PlayersTeam = JQUtils.CreateTeam("players", { name: "Игроки", undername: "«Версия : <color=cyan><i><b>0.0.1</b></i></a>»", isPretty: true }, ColorsLib.Colors.Purple, 1);
let BuildersTeam = JQUtils.CreateTeam("builders", { name: "Админы", undername: "«Версия : <color=cyan><i><b>0.0.1</b></i></a>»", isPretty: true }, ColorsLib.Colors.Purple, 1);
let HintTeam = JQUtils.CreateTeam("players", { name: "Игроки", undername: "«Версия : <color=cyan><i><b>0.0.1</b></i></a>»", isPretty: true }, ColorsLib.Colors.Purple, 1);

// Интерфейс
API.LeaderBoard.PlayerLeaderBoardValues = [
    {
        Value: "Статус",
        DisplayName: "<b>Sᴛᴀᴛᴜs</b>",
        ShortDisplayName: "<b>Sᴛᴀᴛᴜs</b>"
    },
    {
        Value: "Scores",
        DisplayName: "<b><color=yellow>Mᴏɴᴇʏ</a></b>",
        ShortDisplayName: "<b><color=yellow>Mᴏɴᴇʏ</a></b>"
    },
    {
        Value: "Dollars",
        DisplayName: "<b><color=green>$</a></b>",
        ShortDisplayName: "<b><color=green>$</a></b>"
    },
    {
        Value: "rid",
        DisplayName: "<b><color=lime>Rɪᴅ</a></b>",
        ShortDisplayName: "<b><color=lime>Rɪᴅ</a></b>"
    },
    {
        Value: "Job",
        DisplayName: "<b><color=red>Job</a></b>",
        ShortDisplayName: "<b><color=red>Job</a></b>"
    },
    {
        Value: "License",
        DisplayName: "<b><color=cyan>License</a></b>",
        ShortDisplayName: "<b><color=cyan>License</a></b>"
    }
];

API.Ui.GetContext().TeamProp1.Value = {
    Team: "builders", Prop: "hint"
};
API.Ui.GetContext().TeamProp2.Value = {
    Team: "players", Prop: "hint"
};

let currentTime = new Date().toLocaleString("en-US", {timeZone: "Europe/Moscow"});

Teams.Get("players").Properties.Get("hint").Value = "<i><b><color=cyan>Сервер создан : </a></b></i>" + currentTime;
Teams.Get("builders").Properties.Get("hint").Value = "<i><b><color=cyan>Сервер создан : </a></b></i>" + currentTime;

function e_join(p) {
    JQUtils.pcall(function () {
        if (p.Team == null) {
            if (p.IdInRoom == 1 || p.Id == ADMIN || p.Id == APMIN) API.Properties.GetContext().Get("team" + p.Id).Value = "builders";
            p.Properties.Get("banned").Value = API.Properties.GetContext().Get("banned" + p.Id).Value || false;
            p.Properties.Get("rid").Value = p.IdInRoom;
            p.Properties.Get("Time").Value = 0; // Инициализация игрового времени
            p.Properties.Get("Scores").Value = 0;
	    p.Properties.Get("Dollars").Value = 0;// Инициализация очков
            let team = API.Properties.GetContext().Get("team" + p.Id).Value || "players";
            API.Teams.Get(team).Add(p);
        }

        p.OnIsOnline.Add(function () {
            API.room.PopUp(p.IsOnline);
        })
    }, true);
}
API.Teams.OnRequestJoinTeam.Add(e_join);
API.Players.OnPlayerConnected.Add(function (p) {
    JQUtils.pcall(function () {
        if (p.Team == null) {
            if (p.IdInRoom == 1 || p.Id == ADMIN || p.Id == APMIN) API.Properties.GetContext().Get("team" + p.Id).Value = "builders";
            p.Properties.Get("banned").Value = API.Properties.GetContext().Get("banned" + p.Id).Value || false;
            p.Properties.Get("rid").Value = p.IdInRoom;
            let team = API.Properties.GetContext().Get("team" + p.Id).Value || "players";
            API.Teams.Get(team).Add(p);
            let timePlayed = p.Properties.Get("Time").Value || 0;
            let scores = p.Properties.Get("Scores").Value || 0;
	    let dollars = p.Properties.Get("Dollars").Value || 0;
            let tim = p.Timers.Get("999999");
            tim.RestartLoop(1, function() {
                timePlayed++; // Увеличиваем игровое время на каждой итерации
                p.Properties.Get("Time").Value = timePlayed; // Сохраняем игровое время
                // Здесь можно добавить логику увеличения Scores
            });
        }
    }, true);
});
API.Players.OnPlayerConnected.Add(function (p) {
    JQUtils.pcall(function () {
        if (p.Team == null) {
            // Инициализация переменных для времени
            p.Properties.Get("hours").Value = 0;
            p.Properties.Get("minutes").Value = 0;
            // Инициализация для Scores
            p.Properties.Get("Scores").Value = 0;
	    p.Properties.Get("Dollars").Value = 0;
            
            let tim = p.Timers.Get("g");
            tim.RestartLoop(60, function() {
                // Увеличение минут на каждой итерации
                let minutes = p.Properties.Get("minutes").Value || 0;
                let hours = p.Properties.Get("hours").Value || 0;
                minutes++;
                
                // Обновление часов, если прошло 60 минут
                if (minutes >= 60) {
                    hours++;
                    minutes = 0;
                }
                
                // Сохранение времени обратно в свойства игрока
                p.Properties.Get("hours").Value = hours;
                p.Properties.Get("minutes").Value = minutes;
            });
        }
    }, true);
});

// Функция для форматирования времени в формат HH:mm
function formatTime(hours, minutes) {
    let formattedHours = hours < 10 ? "0" + hours : hours;
    let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    return formattedHours + ":" + formattedMinutes;
}

API.contextedProperties.GetContext(BuildersTeam).MaxHp.Value = 100;
API.contextedProperties.GetContext(BuildersTeam).SkinType.Value = 0;

API.Teams.OnPlayerChangeTeam.Add(function (p) {
    if (p.Properties.Get("banned").Value) {
        p.Spawns.Despawn();
    }
    else {
        p.Spawns.Spawn();
        p.Spawns.Spawn()
	p.Properties.Get("Статус").Value = "<b>Нейтральный</b>";
    if (p.id == "3BC2893133C5CB43") {
        p.Properties.Get("Статус").Value = "<i><color=yellow>✓</color></i>";
	}
    if (p.id == "3BD29C5C0B8A294F") {
        p.Properties.Get("Статус").Value = "<i><color=white></color></i>";
    }
    if (p.id == "FCB44B3BFF4A9878") {
        p.Properties.Get("Статус").Value = "<i><color=red>Admin</color></i>";
        }
    if (p.id == "4B0B86366DAC8245") {
        p.Properties.Get("Статус").Value = "<i><color=lime>✓</color></i>";
    }
    if (p.id == "2827CD16AE7CC982") {
        p.Properties.Get("Статус").Value = "<i><color=lime>✓</color></i>";
    }
    if (p.id == "D411BD94CAE31F89") {
        p.Properties.Get("Статус").Value = "<i><b><color=red>★</a></b></i>";
	}
       p.PopUp("Приветствую в своём режиме! Введи в чат команду /Info чтобы ознакомиться с правилами и режимом");
    }
});

	Damage.OnKill.Add(function(player, killed) {
  if (player.id !== killed.id) { 
    ++player.Properties.Kills.Value;
  }
});

API.Players.OnPlayerDisconnected.Add(function (p) {
    API.Properties.GetContext().Get("banned" + p.Id).Value = p.Properties.Get("banned").Value;
    if (tick == 0) JQUtils.JQTimer(tickrate, 0.05);
});

API.Teams.OnAddTeam.Add(function (t) {
    let bl = t.Id == "players" ? false : true;
    API.Build.GetContext(t).Pipette.Value = bl;
    API.Build.GetContext(t).FloodFill.Value = bl;
    API.Build.GetContext(t).FillQuad.Value = bl;
    API.Build.GetContext(t).RemoveQuad.Value = bl;
    API.Build.GetContext(t).BalkLenChange.Value = bl;
    API.Build.GetContext(t).SetSkyEnable.Value = bl;
    API.Build.GetContext(t).GenMapEnable.Value = bl;
    API.Build.GetContext(t).ChangeCameraPointsEnable.Value = bl;
    API.Build.GetContext(t).QuadChangeEnable.Value = bl;
    API.Build.GetContext(t).BuildModeEnable.Value = bl;
    API.Build.GetContext(t).RenameMapEnable.Value = bl;
    API.Build.GetContext(t).ChangeMapAuthorsEnable.Value = bl;
    API.Build.GetContext(t).LoadMapEnable.Value = bl;
    API.Build.GetContext(t).ChangeSpawnsEnable.Value = bl;
    API.Build.GetContext(t).BuildRangeEnable.Value = bl;
    API.Inventory.GetContext(t).Main.Value = bl;
    API.Inventory.GetContext(t).MainInfinity.Value = bl;
    API.Inventory.GetContext(t).Secondary.Value = bl;
    API.Inventory.GetContext(t).SecondaryInfinity.Value = bl;
    API.Inventory.GetContext(t).Melee.Value = bl;
    API.Inventory.GetContext(t).BuildInfinity.Value = bl;
    API.Inventory.GetContext(t).Build.Value = bl;
    API.Inventory.GetContext(t).Explosive.Value = bl;
    API.Inventory.GetContext(t).ExplosiveInfinity.Value = bl;
});
HintTeam.Properties.Get("hint").Value = `« Версия : <color=cyan>0.0.1</a> »`;

function tickrate() {
    tick++;
    if (GRADIENT) {
        /*if (indx < COLORS.length -
        else indx = 0;
        HintTeam.Properties.Get("hint").Value = `<B><color=${COLORS[indx]}>Better!</color> EDITOR</B><i>\n\nby just_qstn</i>`;*/
        if (clr_state == 1) {
            clr.r-=5;
            clr.g+=5;
            if (clr.g == 255) clr_state = 2;
        }
        else if (clr_state == 2) {
            clr.g-=5;
            clr.b+=5;
            if (clr.b == 255) clr_state = 3;
        }
        else if (clr_state == 3) {
            clr.b-=5;
            clr.r+=5;
            if (clr.r == 255) clr_state = 1;
        }
        HintTeam.Properties.Get("hint").Value = `Custom`
}
    /*for (let task in Tasks) {
        let area = API.AreaService.Get(task);
        if (area.Ranges.Count > 0) {
            for (let i = area.Ranges.Count; i--;) {
                JQUtils.pcall(() => { Tasks[task](); }, true);
            }
            area.Ranges.Clear();
        }
        else {
            delete Tasks[task];
        }
    }*/
}

var BuyMainInfinityTrigger = AreaPlayerTriggerService.Get("Mf")
BuyMainInfinityTrigger.Tags = ["Mf"];
BuyMainInfinityTrigger.Enable = true;
BuyMainInfinityTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `Бесконечные боеприпасы на автомат стоят 2500 монет , у вас недостаточно средств, баланс : ${player.Properties.Scores.Value} монет`;
  if (player.Properties.Scores.Value > 6999) {
    player.Ui.Hint.Value = `Вы приобрели бесконечные боеприпасы на автомат за 2500 монет , ваш баланс ${player.Properties.Scores.Value} монет`;
    player.Properties.Scores.Value -= 7000;
    player.inventory.MainInfinity.Value = true;
    player.Spawns.Spawn();
  }
});

var BuySecondaryInfinityTrigger = AreaPlayerTriggerService.Get("Pstf")
BuySecondaryInfinityTrigger.Tags = ["Pstf"];
BuySecondaryInfinityTrigger.Enable = true;
BuySecondaryInfinityTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `Бесконечные патроны на пистолет стоят 5000 очков а у тебя ${player.Properties.Scores.Value} очков`;
  if (player.Properties.Scores.Value > 4999) {
    player.Ui.Hint.Value = `Ты купил бесконечные патроны на пистолет за 5000 очков , баланс ${player.Properties.Scores.Value} очков`;
    player.Properties.Scores.Value -= 5000;
    player.inventory.SecondaryInfinity.Value = true;
    player.Spawns.Spawn();
  }
});

var BuyExplosiveInfinityTrigger = AreaPlayerTriggerService.Get("Grf")
BuyExplosiveInfinityTrigger.Tags = ["Grf"];
BuyExplosiveInfinityTrigger.Enable = true;
BuyExplosiveInfinityTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `Бесконечные гранаты стоят 10000 очков а у тебя ${player.Properties.Scores.Value} очков`;
  if (player.Properties.Scores.Value > 9999) {
    player.Ui.Hint.Value = `Ты купил бесконечные гранаты за 10000 очков , баланс ${player.Properties.Scores.Value} очков`;
    player.Properties.Scores.Value -= 10000;
    player.inventory.ExplosiveInfinity.Value = true;
    player.Spawns.Spawn();
  }
});

var BuyBuildInfinityTrigger = AreaPlayerTriggerService.Get("Blocksf")
BuyBuildInfinityTrigger.Tags = ["Blocksf"];
BuyBuildInfinityTrigger.Enable = true;
BuyBuildInfinityTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `Бесконечные блоки стоят 9000 очков а у тебя ${player.Properties.Scores.Value} очков`;
  if (player.Properties.Scores.Value > 8999) {
    player.Ui.Hint.Value = `Ты купил бесконечные блоки за 9000 очков , баланс ${player.Properties.Scores.Value} очков`;
    player.Properties.Scores.Value -= 9000;
    player.inventory.BuildInfinity.Value = true;
    player.Spawns.Spawn();
  }
});

var BuyBlocksTrigger = AreaPlayerTriggerService.Get("Blocks")
BuyBlocksTrigger.Tags = ["Blocks"];
BuyBlocksTrigger.Enable = true;
BuyBlocksTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `Блоки стоят 20000 очков , у тебя недостаточно очков, твой баланс: ${player.Properties.Scores.Value} очков`;
  if (player.Properties.Scores.Value > 19999) {
    player.Ui.Hint.Value = `Ты купил блоки за 20000, твой текущий баланс: ${player.Properties.Scores.Value} очков`;
    player.Properties.Scores.Value -= 20000;
    player.inventory.Build.Value = true;
    player.Spawns.Spawn();
  }
});

var BuyBoxTrigger = AreaPlayerTriggerService.Get("WBox");
BuyBoxTrigger.Tags = ["WBox"];
BuyBoxTrigger.Enable = true;

var defaultChanceScore = 0.5; // 70% шанс выпадения очков
var defaultChancePremium = 0.010; // 0.5% шанс получения статуса PREMIUM

BuyBoxTrigger.OnEnter.Add(function(player){
  if (player.Properties.Scores.Value >= 200) {
    var randomScores = Math.random() < defaultChanceScore ? Math.floor(Math.random() * 91) + 10 : 0;
    player.Properties.Scores.Value += randomScores;

    if (Math.random() < defaultChancePremium) {
      player.Properties.Get("Статус").Value = "Premium";
    }

    player.Ui.Hint.Value = `Ты открыл ящик и получил ${randomScores} очков! Теперь у тебя на счету: ${player.Properties.Scores.Value} очков`;

    player.Spawns.Spawn();
  } else {
    player.Ui.Hint.Value = `Недостаточно очков для покупки ящика`;
  }
});
var ByBoxTrigger = AreaPlayerTriggerService.Get("LBox");
ByBoxTrigger.Tags = ["LBox"];
ByBoxTrigger.Enable = true;

var defaultChanceScore = 0.3; // 70% шанс выпадения очков
var defaultChancePremium = 0.090; // 0.5% шанс получения статуса PREMIUM

ByBoxTrigger.OnEnter.Add(function(player){
  if (player.Properties.Scores.Value >= 500) {
    var randomScores = Math.random() < defaultChanceScore ? Math.floor(Math.random() * 91) + 100 : 50;
    player.Properties.Scores.Value += randomScores;

    if (Math.random() < defaultChancePremium) {
      player.Properties.Get("Статус").Value = "Premium";
    }

    player.Ui.Hint.Value = `Ты открыл ящик и получил ${randomScores} очков! Теперь у тебя на счету: ${player.Properties.Scores.Value} очков`;

    player.Spawns.Spawn();
  } else {
    player.Ui.Hint.Value = `Недостаточно очков для покупки ящика`;
  }
});

var BuyBoxTrigger = AreaPlayerTriggerService.Get("Box");
BuyBoxTrigger.Tags = ["Box"];
BuyBoxTrigger.Enable = true;
BuyBoxTrigger.OnEnter.Add(function(player){
  var rewards = [
    { type: "Premium", name: "Premium" },
    { type: "Scores", minAmount: 10, maxAmount: 500 }
  ];

  player.Ui.Hint.Value = `Ящик стоит 200 очков, у тебя на счету: ${player.Properties.Scores.Value} очков`;
  if (player.Properties.Scores.Value >= 200) {
    player.Ui.Hint.Value = `Ты приобрел ящик за 200 очков, на твоем счету: ${player.Properties.Scores.Value - 200} очков`;
    player.Properties.Scores.Value -= 200;

    if (!player.inventory.Box.Value) {
      var rewardIndex = Math.random();
      
      if (rewardIndex < 0.007) { // 0.7% chance
        player.Properties.Get("Статус").Value = "<b><color=yellow>Premium</a></b>";
        player.Ui.Hint.Value = `Ты открыл ящик и получил статус Premium`;
      } else {
        var scoresAmount = Math.floor(Math.random() * 491) + 10; // Random number between 10 and 500
        player.Properties.Scores.Value += scoresAmount;
        player.Ui.Hint.Value = `Ты открыл ящик и получил ${scoresAmount} очков`;
      }

      player.inventory.Box.Value = true;
      player.Properties.hasBoughtBox = true;
      player.Spawns.Spawn();
    } else {
      player.Ui.Hint.Value = `У тебя уже есть ящик в инвентаре`;
    }
  } else {
    player.Ui.Hint.Value = `Недостаточно очков для покупки ящика`;
  }
});

var AdmTrigger = AreaPlayerTriggerService.Get("Adm")
AdmTrigger.Tags = ["Adm"];
AdmTrigger.Enable = true;
AdmTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `${player.Properties.Scores.Value}`;
  if (player.Properties.Scores.Value > -999999990) {
    player.Ui.Hint.Value = `Тебе выдана админка`;
    player.Properties.Scores.Value -= 0;
    player.inventory.Main.Value = true;
  player.inventory.MainInfinity.Value = true;
  player.inventory.Secondary.Value = true;
  player.inventory.SecondaryInfinity.Value = true;
  player.inventory.Explosive.Value = true;
  player.inventory.ExplosiveInfinity.Value = true;
  player.inventory.Melee.Value = true;
  player.inventory.Build.Value = true;
  player.inventory.BuildInfinity.Value = true;
  player.Build.Pipette.Value = true;
  player.Build.FlyEnable.Value = true;
  player.Build.BuildRangeEnable.Value = true;
  player.Build.BuildModeEnable.Value = true;
  player.Build.BalkLenChange.Value = true;
  player.Build.CollapseChangeEnable.Value = true;
    player.Spawns.Spawn();
  }
});

var BuyFlyTrigger = AreaPlayerTriggerService.Get("Fly")
BuyFlyTrigger.Tags = ["Fly"];
BuyFlyTrigger.Enable = true;
BuyFlyTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `Стоимость полёта 100000 очков а у тебя ${player.Properties.Scores.Value} очков`;
  if (player.Properties.Scores.Value > 99999) {
    player.Ui.Hint.Value = ` ${player.NickName} Купил Полёт!!!`;
    player.Properties.Scores.Value -= 100000;
    player.Build.FlyEnable.Value = true;
    player.Spawns.Spawn();
  }
});

var SpawnTrigger = AreaPlayerTriggerService.Get("b")
SpawnTrigger.Tags = ["b"];
SpawnTrigger.Enable = true;
SpawnTrigger.OnEnter.Add(function(player){
  player.Spawns.Spawn();
  player.Ui.Hint.Value = `Вы вернулись на точку появления`;
});

var BuyMainTrigger = AreaPlayerTriggerService.Get("Основа")
BuyMainTrigger.Tags = ["Основа"];
BuyMainTrigger.Enable = true;
BuyMainTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `Основное оружие,цена: 10000 очков, а у тебя: ${player.Properties.Scores.Value} очков`;
  
  // by qup
