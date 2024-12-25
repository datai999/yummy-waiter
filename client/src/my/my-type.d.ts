declare module 'myTypes' {
    type Pho = {
        id: string,
        combo?: string,
        meats: string[],
        noodle: string,
        preferences?: string[],
        note?: string,
        count: number,
    };

    type NonPhoCode = {
        id: string,
        key?: string,
        code: string,
        note?: string,
        count: number,
    }

    type SelectedItem = {
        beef: Map<string, Pho>,
        beefSide: Map<string, NonPhoCode>,
        beefUpdated: string[],

        chicken: Map<string, Pho>,
        chickenSide: Map<string, NonPhoCode>,
        chickenUpdated: string[],

        drink: Map<string, NonPhoCode>,
        dessert: Map<string, NonPhoCode>,
    };
}

declare module 'myTable' {
    type Table = {
        id: string;
        status: TableStatus;
        orderTime: Date | null;
        timer: number;
        bags: Map<number, SelectedItem>;
    }
}

module.exports = {
    Pho,
    NonPho,
    PhoCode,
    NonPhoCode,
    SelectedItem,

    Table
};