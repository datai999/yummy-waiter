declare module 'myTypes' {
    type Pho = {
        id: string,
        meats: string[],
        noodle: string,
        preferences?: string[],
        note?: string,
    };

    type NonPho = {
        beefSide: string[],
        beefMeatSide: string[],
        chickenSide: string[],
        drink: string[],
        dessert: string[],
    }

    type PhoCode = {
        id: string,
        meats: string,
        noodle: string,
        preferences?: string,
        note?: string,
    };

    type SideItem = {
        id: string,
        code?: string,
        name: string,
        count: number,
    }

    type SelectedItem = {
        beef: Map<string, Pho>,
        beefSide: Map<string, string>,
        beefUpdated: string[],

        chicken: Map<string, Pho>,
        chickenSide: Map<string, string>,
        chickenUpdated: string[],

        drink: Map<string, SideItem>,
        dessert: Map<string, SideItem>,
    };
}

module.exports = {
    Pho,
    NonPho,
    PhoCode,
    SideItem,
    SelectedItem,
};