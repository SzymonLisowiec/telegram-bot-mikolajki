const Command = require('./command');
const RegisterCommand = require('./register.command');

module.exports = class HelpCommand extends Command {
  static isListed = true;
  
  async execute () {
    this.context.reply(`Witaj na organizowanych pierwszych mikołajkach w naszej paczce!
    
Zasady:
1. Do ${process.env.REGISTRATION_TIME} należy zapisać się do zabawy poprzez komendę /${RegisterCommand.getName()}
2. Dnia ${process.env.RAND_TIME} wylosowane zostaną pary. Każda osoba dostanie wiadomość od bota z informacją komu robi paczkę i danymi potrzebnymi do jej nadania.
3. Do dnia ${process.env.SEND_TIME} należy zrobić paczkę do kwoty ${process.env.LIMIT} ${process.env.CURRENCY} i wysłać na adres nadawcy. Najlepiej na paczce napisać, żeby nie otwierać do 2021-12-06.
4. Paczki można otworzyć dnia ${process.env.OPEN_TIME}.
5. Przed ${process.env.OPEN_TIME} nie można zdradzać informacji na temat par.
6. W podaną kwotę (${process.env.LIMIT} ${process.env.CURRENCY}) wlicza się też wysyłka. Kwotę można przekroczyć.
7. Zachowajcie paragony w razie, gdyby doszło do jakiegoś nieporozumienia.

Niestosowanie się do zasad, to po prostu bycie chujem i skreślenie się z zabawy na przyszłość.

Możesz wrócić do tej wiadomości wpisujac /start lub /help. Dodatkowo możesz wyświetlić listę uczestników za pomocą /partipants`);
  }
}
