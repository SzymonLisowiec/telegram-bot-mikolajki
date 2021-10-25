module.exports = class Command {
  static name = 'Command';
  static descriptions = {};
  static isListed = false;

  constructor (main, context) {
    this.main = main;
    this.context = context;
  }
  
  async execute () {

  }
  
  static async execute (main, context) {
    return (new this(main, context)).execute();
  }
  
  static getName () {
    return this.name
      .substr(0, this.name.length - 7)
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();
  }
}
