import "reflect-metadata";
import { Exclude, plainToClass, Transform, Type } from 'class-transformer';
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
    count: number;

    public constructor(code: string) {
        this.id = generateId();
        this.code = code;
        this.count = 1;
    }
}

export class TrackedItem {
    @Type(() => Date)
    time?: Date;
    staff: string;

    public constructor(staff: any) {
        if (staff)
            this.staff = staff.name;
        else this.staff = '?';
    }
}

export class TrackedPho extends TrackedItem {
    @Transform(value => new Map(Object.entries(value.value).map(([key, item]) => [key, plainToClass(Pho, item)])
    ), { toClassOnly: true })
    items: Map<string, Pho> = new Map();
}

export class TrackedNonPho extends TrackedItem {
    @Transform(value => new Map(Object.entries(value.value).map(([key, item]) => [key, plainToClass(NonPho, item)])
    ), { toClassOnly: true })
    items: Map<string, NonPho> = new Map();
}

export class CategoryItem {

    @Type(() => TrackedPho)
    pho: TrackedPho[] = [];

    @Type(() => TrackedNonPho)
    nonPho: TrackedNonPho[] = [];

    @Type(() => String)
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
    @Type(() => Date)
    orderTime: Date | null = null;
    timer: number = 0;

    @Transform(value => {
        let resut = new Map<number, Map<string, CategoryItem>>();
        for (let entry of Object.entries(value.value)) {
            const categoryItems = new Map(Object.entries(entry[1] as Object).map(categoryItems => {
                return [categoryItems[0], plainToClass(CategoryItem, categoryItems[1])];
            }));
            resut.set(Number(entry[0]), categoryItems);
        }
        return resut;
    }, { toClassOnly: true })
    bags: Map<number, Map<string, CategoryItem>> = new Map();

    public constructor(id: string) {
        this.id = id;
        this.newBag();
        this.newBag();
    }

    public newBag() {
        this.bags.set(
            this.bags.size,
            new Map(Object.keys(MENU).map(category => [category, new CategoryItem()])))
    }
}