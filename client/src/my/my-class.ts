import { MENU, TableStatus } from './my-constants';
import { generateId } from './my-service';

export class Pho {
    id: string = '';
    combo?: string;
    meats: string[] = [];
    noodle: string = 'BC';
    preferences?: string[];
    note?: string;
    qty: number = 1;
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

export class TrackedItem<T> {
    time?: Date;
    staff: string;
    items: Map<string, T> = new Map();

    public constructor(staff: any) {
        this.staff = staff.code + '_' + staff.name;
    }
}

export class CategoryItem {
    pho: TrackedItem<Pho>[] = [];
    nonPho: TrackedItem<NonPho>[] = [];
    action: string[] = [];

    public lastPhos(): Map<string, Pho> {
        return this.pho.length === 0 ? new Map() : this.pho[this.pho.length - 1].items;
    }

    public lastNonPhos(): Map<string, NonPho> {
        return this.nonPho.length === 0 ? new Map() : this.nonPho[this.nonPho.length - 1].items;
    }
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
        newBag: () => this.bags.set(
            this.bags.size,
            new Map(Object.keys(MENU).map(category => [category, new CategoryItem()])))
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