const Command = require('./command');

module.exports = class PartipantsCommand extends Command {
  static descriptions = {
    'en': 'Partipants list',
    'pl': 'Lista uczestników',
  };
  static isListed = true;
  
  async execute () {
    const partipants = this.main.getPartipants();
    this.context.reply(`Lista uczestników \\(${partipants.length}\\):${partipants.reduce((str, id) => `${str}\n[${id}](tg://user?id=${id})`, '')}`, {
      parse_mode: 'MarkdownV2',
    });
  }
}
