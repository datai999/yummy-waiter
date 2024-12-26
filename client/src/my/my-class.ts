import { Pho } from "myTypes";
import { generateId } from "./my-service";
import { INIT_SELECTED_ITEM } from "./my-constants";

export class NonPho {
    id: string;
    key?: string;
    code: string;
    note?: string;
    count: number;

    public constructor(code: string) {
        this.id = generateId();
        this.code = code;
        this.count = 1;
    }
}

export class SelectedItem {
    beef: Map<string, Pho>;
    beefSide: Map<string, NonPho>;
    beefUpdated: string[];

    chicken: Map<string, Pho>;
    chickenSide: Map<string, NonPho>;
    chickenUpdated: string[];

    drink: Map<string, NonPho>;
    dessert: Map<string, NonPho>;

    public constructor() {
        this.beef = new Map();
        this.beefSide = new Map();
        this.beefUpdated = [];

        this.chicken = new Map();
        this.chickenSide = new Map();
        this.chickenUpdated = [];

        this.drink = new Map();
        this.dessert = new Map();
    }
};