import { generateId } from './my-service';

export class Pho {
    id: string;
    combo?: string;
    meats: string[];
    noodle: string;
    preferences?: string[];
    note?: string;
    count: number;

    public constructor() {
        this.id = '';
        this.meats = [];
        this.noodle = 'BC';
        this.preferences = [];
        this.note = '';
        this.count = 1;
    }

    func = {
        complete: () => {
            this.id = this.id || generateId();
            if (this.meats.length === 0) this.meats = ["BPN"];
            else this.meats = this.meats.filter(meat => meat !== "BPN");
        }
    }
}

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