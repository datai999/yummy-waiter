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

    type SelectedItem = {
        beef: Map<string, Pho>,
        beefSide: Map<string, string>,
        beefUpdated: string[],

        chicken: Map<string, Pho>,
        chickenSide: Map<string, string>,
        chickenUpdated: string[],

        drink: Map<string, string>,
        dessert: Map<string, string>,
    };
}

module.exports = {
    Pho,
    NonPho,
    PhoCode,
    SelectedItem,
};