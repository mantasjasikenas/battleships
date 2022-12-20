import { Player } from '../Player';

export class Message {
  public player: Player;
  public text: string;

  constructor(player: Player, text: string) {
    this.player = player;
    this.text = text;
  }
}
