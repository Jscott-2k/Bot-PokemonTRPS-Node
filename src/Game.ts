import { MessageEmbed, TextBasedChannels, Client, ClientUser, ReactionCollector, User, Message, ReactionCollectorOptions, AwaitReactionsOptions, MessageReaction, CollectorFilter, Collection, ReactionEmoji } from "discord.js";
import { isJSDocNullableType } from "typescript";
import { PokemonTypeChart, PokemonTypeDataObject, PokemonTypeDataMap, PokemonTypeData } from "./Data";

type Player = User | ClientUser | null;

export default class Game {

    private cpuGame: boolean = false;
    private id: number = 0;
    private userA: Player;
    private userB: Player;
    private userAType: string;
    private userBType: string;
    private channel: TextBasedChannels;
    private gameMessage: Message = Message.prototype;
    private result: string;
    private status: string;
    private finished: boolean;
    private selectionMessage: string;
    private reactionTypeMap: Map<string, string> = new Map();
    private userASelected:boolean = false;
    private userBSelected:boolean = false;
    private userAReaction:string;
    private userBReaction:string;
    
    constructor(userA: Player, userB: Player, channel: TextBasedChannels, cpuGame: boolean = false) {
        this.id = Math.floor((Math.random() * 8999999) + 1000000);
        this.userA = userA;
        this.userB = userB;
        this.userAType = "missing";
        this.userBType = "missing";
        this.cpuGame = cpuGame;
        this.channel = channel;
        this.result = "undeclared";
        this.status = "initializing...";
        this.selectionMessage = "awaiting...";
        this.finished = false;
        this.userAReaction = "";
        this.userBReaction = "";
    }
    
    public getInfo(): string {
        return `Game id:${this.id} status: ${this.status} user 1: ${this.userA?.username} user 2: ${this.userB?.username} cpu: ${this.cpuGame}`
    }
    
    public isFinished(): boolean {
        return this.finished;
    }

    private startReactionCollection() {


        const filter = (reaction: MessageReaction, user: User) => {
            let r: boolean = user.id === this.userB?.id || (user.id === this.userA?.id && !this.cpuGame);
            console.log(`Applying Reaction Fiilter... ${reaction.toString()} ${r}`)
            return r;
        }
        
        this.userASelected = false;
        this.userBSelected = false;
        
        const collector = this.gameMessage.createReactionCollector({ filter, time: 60000, dispose: true, maxUsers: this.cpuGame ? 1 : 2 });
        this.setStatus("Collecting");
        collector.on("collect", (reaction: MessageReaction, user: User) => {

            if(user.id === this.userA?.id){
                this.userASelected = true;
                this.userAReaction = reaction.emoji.toString();
            }
            if(user.id === this.userB?.id){
                this.userBSelected = true;
                this.userBReaction = reaction.emoji.toString();
            }
            reaction.users.remove(user);

            if(this.userASelected && this.userBSelected){
                collector.stop("Both users selceted types!");   
            }
        });
        collector.on("end",this.onReactionCollectorEnd.bind(this)); 
    }

    private onReactionCollectorEnd(collected:Collection<any, MessageReaction>, reason:string){
        console.log(`Ended collection: ${reason}`);
        this.setStatus("Comparing");
        let bid: string = this.userB?.id as string;
        let aid: string = this.userA?.id as string;

        if(!this.cpuGame){
            this.userAType = this.getTypeByReaction(this.userAReaction);
        }

        this.userBType = this.getTypeByReaction(this.userBReaction);

        this.updateSelections();

        this.compareResponse(this.userAType, this.userBType);
        this.setStatus("Done");
        this.finished = true;
    }

    private getTypeByReaction(identifier: string): string {
        let result = this.reactionTypeMap.get(identifier);
        if (result === undefined) {
            return "missing";
        }
        return result as string;
    }

    private async pushReactions(array: string[], callback: (v: string, i: number, array: string[]) => void) {
        let types: string[] = array;
        for (let index = 0; index < types.length; index++) {
            await callback(types[index], index, types);
        }
    }

    private async applyEmbededMessageChanges() {
        const embeded = new MessageEmbed()
            .setTitle(`Game ${this.id}`)
            .setColor('#FF0000')
            .addField("Players", `${this.userA} ${this.userB}`)
            .addField("Game Status", this.status)
            .addField("Result", this.result)
            .addField("Selections", this.selectionMessage);
        await this.gameMessage.edit({ embeds: [embeded] });
    }

    private setResult(result: string) {
        this.result = result;
        this.applyEmbededMessageChanges();
    }
    
    private updateSelections() {
        this.selectionMessage = `${this.userA} --> ${Game.GetReaction(this.userAType)} ||| ${this.userB} --> ${Game.GetReaction(this.userBType)} `;
        this.applyEmbededMessageChanges();
    }
    
    private setStatus(status: string) {
        this.status = status;
        this.applyEmbededMessageChanges();
    }

    async start(client: Client) {
        const embeded = new MessageEmbed()
            .setTitle(`Game ${this.id}`)
            .setColor('#FF0000')
            .addField("Players", `${this.userA} ${this.userB}`)
            .addField("Game Status", this.status)
            .addField("Result", this.result)
            .addField("Selections", this.selectionMessage);
        if (this.cpuGame) {
            let gameTypes = Game.GetTypes();
            this.userAType = gameTypes[Math.floor(Math.random() * gameTypes.length)];
        }
        this.gameMessage = await this.channel.send({ embeds: [embeded] });
        await this.pushReactions(Game.GetTypes(), async (v, i, array) => {
            let reaction = Game.GetReaction(v);
            this.reactionTypeMap.set(reaction, v);
            await this.gameMessage.react(reaction);
        }).then(() => {
            this.startReactionCollection();
        });
    }
    
    private compareResponse(userAType: string, userBType: string): Player {
        console.log(`${this.userB} selected ${userBType} ! ${Game.GetReaction(userBType)}`);
        console.log(`${this.userA} selected ${userAType} ! ${Game.GetReaction(userAType)}`);

        let strengthA: Array<string> = Game.GetStrengths(this.userAType);
        let strengthB: Array<string> = Game.GetStrengths(this.userBType);

        if (strengthA.includes(userBType) && strengthB.includes(userAType)) {
            this.setResult("TIE!");
            return null;
        } else if (strengthA.includes(this.userBType)) {
            this.setResult(`${this.userA} WINS! ${userAType} beats ${userBType}`);
            return this.userA;
        } else if (strengthB.includes(this.userAType)) {
            this.setResult(`${this.userB} WINS! ${userBType} beats ${userAType}`);
            return this.userB;
        } else if (userBType === userAType) {
            this.setResult("TIE!");
            return null;
        } else {
            this.setResult("TIE");
            return null;
        }
    }

    public static GetPokemonTypes(): string {
        return Object.keys(PokemonTypeDataObject).join(" ");
    }
    
    public static GetPokemonTypeDataFromStr(type: string): PokemonTypeData {
        let result: PokemonTypeData | undefined = PokemonTypeDataMap.get(type);
        if (result === undefined) {
            return PokemonTypeDataObject.missing;
        }
        return result as PokemonTypeData;
    }

    public static GetTypeData(type: string, client: Client): string {
        let immune = this.GetPokemonTypeDataFromStr(type)["immunes"].join(" ");
        let weakness = this.GetPokemonTypeDataFromStr(type)["weaknesses"].join(" ");
        let strengths = this.GetPokemonTypeDataFromStr(type)["strengths"].join(" ");
        let reaction = this.GetPokemonTypeDataFromStr(type)["reaction"];
        return `Immune: ${immune}\nWeaknesses: ${weakness}\nStrengths: ${strengths} reaction: ${reaction}`;
    }

    public static GetStrengths(type: string): Array<string> {
        return this.GetPokemonTypeDataFromStr(type)["strengths"];
    }
    public  static GetReaction(type: string): string {
        return this.GetPokemonTypeDataFromStr(type)["reaction"];
    }
    public static GetTypes(): Array<string> {
        return Object.keys(PokemonTypeDataObject); 
    }
}