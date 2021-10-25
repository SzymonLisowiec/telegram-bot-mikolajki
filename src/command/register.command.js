const Command = require('./command');
const Fs = require('fs');
const Path = require('path');

module.exports = class RegisterCommand extends Command {
  static descriptions = {
    'en': 'Registration for fun',
    'pl': 'Rejestracja do zabawy',
  };
  static isListed = true;
  
  async execute () {
    const telegramAccountId = this.context.message.from.id;
    const parts = this.context.update.message.text.split(' ');
    parts.splice(0, 1);
    const secret = parts.splice(0, 1)[0] || null;
    const note = parts.join(' ');
    
    if (secret !== process.env.REGISTRATION_SECRET || !note.trim()) {
      this.context.reply(`Aby zapisać się, musisz użyć tej komendy w ten sposób:

/register KOD_DOSTĘPU NOTATKA

KOD_DOSTĘPU - tajny kod wymagany do uczestniczenia w zabawie
NOTATKA - Notatka powinna zawierać: imię i nazwisko, paczkomat, numer telefonu, dodatkowo możesz uwzględnić tu czego nie lubisz, na co masz uczulenie itp. aby zminimalizować ryzko otrzymania słabej paczki
`);
      return;
    }

    const limit = new Date(process.env.REGISTRATION_TIME);
    if (limit.getTime() < Date.now()) {
      this.context.reply(`Niestety czas na zapisanie się do zabawy minął :(`);
      return;
    }
    
    const filePath = Path.join(__dirname, '..', '..', 'partipants', telegramAccountId.toString());
    Fs.writeFileSync(filePath, JSON.stringify({
      id: telegramAccountId,
      note,
    }, null, 2));
    this.context.reply(`Zapisane! Teraz czekamy do ${process.env.RAND_TIME}!`);
  }
}
