const { Telegraf } = require('telegraf');
const { StartCommand, HelpCommand, ...Commands } = require('./command');
const Fs = require('fs');
const Path = require('path');

module.exports = class Main {
  constructor () {
    this.bot = new Telegraf(process.env.BOT_TOKEN);
    this.init();
  }
  
  async init () {
    this.initCommands();
    this.bot.launch();
    
    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
    
    setInterval(() => {
      const now = Date.now();
      if (new Date(`${process.env.RAND_TIME} 00:00:00`).getTime() < now) {
        this.generatePairs();
      } else if (new Date(process.env.SEND_TIME).getTime() - 86400000 < now) {
        // Send notification about last 24 hours to send gift
      } else if (new Date(`${process.env.OPEN_TIME} 00:00:00`).getTime() < now) {
        // Send notification "Możesz już otworzyć swoją mikołajkową paczkę!"
      }
    }, 60000);
  }

  initCommands () {
    const commandsList = {};

    Object.values(Commands).forEach((command) => {
      const commandName = command.getName();
      
      this.bot.command(commandName, command.execute.bind(command, this));

      if (!command.isListed) return;
      Object.keys(command.descriptions).forEach((language) => {
        if (!commandsList[language]) commandsList[language] = [];
        commandsList[language].push({
          command: commandName,
          description: command.descriptions[language],
        });
      });
    });
    
    Object.keys(commandsList).forEach((language) => {
      this.bot.telegram.setMyCommands(commandsList[language], {
        language_code: language,
      });
    });
    
    this.bot.start(StartCommand.execute.bind(StartCommand, this));
    this.bot.help(HelpCommand.execute.bind(HelpCommand, this));
  }
  
  getPartipants () {
    return Fs
      .readdirSync(Path.join(__dirname, '..', 'partipants'))
      .reduce((arr, partipant) => {
        if (/^[0-9]+$/.test(partipant)) {
          arr.push(partipant);
        }
        return arr;
      }, []);
  }
  
  generatePairs () { // TODO: Refactor XD
    const filePath = Path.join(__dirname, '..', 'pairs.json');
    if (Fs.existsSync(filePath)) {
      return;
    }
    
    const pairs = {};
    let partipants = this.getPartipants().sort(() => .5 - Math.random());
    const partipantsCount = partipants.length;
    if (partipantsCount < 1 || partipantsCount%2 !== 0) {
      return;
    }
    for (let i = 0; i < partipantsCount/2; ++i) {
      const accountId = partipants.shift();
      pairs[accountId] = partipants.splice(Math.floor(Math.random() * partipants.length), 1)[0];
    }
    Object.keys(pairs).forEach((key) => {
      pairs[pairs[key]] = key;
    });
    
    if (new Set(Object.values(pairs)).size !== partipantsCount || new Set(Object.keys(pairs)).size !== partipantsCount) {
      throw new Error('Wrong pairs');
    }
    
    Fs.writeFileSync(filePath, JSON.stringify(pairs));
    
    partipants = Object.keys(pairs);
    for (let i = 0; i < partipants.length; ++i) {
      const telegramAccountId = partipants[i];
      const pairInfo = JSON.parse(Fs.readFileSync(Path.join(__dirname, '..', 'partipants', pairs[telegramAccountId])));
      this.bot.telegram.sendMessage(telegramAccountId, `Hej, to już dziś! Możesz przygotować paczkę i wysłać do odbiorcy! Notatka ze szczegółami: ${pairInfo.note}`);
    }
  }
}
