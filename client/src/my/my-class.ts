import { Categories, TableStatus } from './my-constants';
import { generateId } from './my-service';

export class Pho {
    id: string = '';
    combo?: string;
    meats: string[] = [];
    noodle: string = 'BC';
    preferences?: string[];
    note?: string;
    count: number = 1;
}

export class NonPho {
    id: string;
    code: string;
    note?: string;
    count: number;

    public constructor(code: string) {
        this.id = generateId();
        this.code = code;
        this.count = 1;
    }
}

export class CategoryItem {
    pho: Map<string, Pho> = new Map();
    nonPho: Map<string, NonPho> = new Map();
    action: string[] = [];
}

export class Table {
    id: string;
    status: TableStatus = TableStatus.AVAILABLE;
    orderTime: Date | null = null;
    timer: number = 0;
    bags: Map<number, Map<string, CategoryItem>> = new Map();

    public constructor(id: string) {
        this.id = id;
        this.func.newBag();
        this.func.newBag();
    }

    func = {
        newBag: () => this.bags.set(this.bags.size, new Map([
            [Categories.BEEF, new CategoryItem()],
            [Categories.CHICKEN, new CategoryItem()],
            [Categories.DRINKS, new CategoryItem()]
        ]))
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